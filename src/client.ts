/**
 * TradeSync HTTP Client
 *
 * Implements the HTTP layer with Basic Authentication, request/response handling,
 * retry integration, and error mapping.
 */

import { TradeSyncError, wrapError } from './errors.js';
import { withRetry, type RetryConfig, DEFAULT_RETRY_CONFIG } from './retry.js';
import { tradeSyncConfig, type TradeSyncConfig } from './config.js';
import { ConnectionStatusManager } from './connection-status.js';
import { RateLimiter } from './rate-limiter.js';
import type {
  HttpMethod,
  ApiResponse,
  RequestOptions,
  PaginationParams,
  HealthCheckResult,
  ConnectionStatus,
  RateLimitInfo,
} from './types.js';

/**
 * Create Basic Auth header value from API key and secret
 */
export function createBasicAuthHeader(apiKey: string, apiSecret: string): string {
  const credentials = `${apiKey}:${apiSecret}`;
  const encoded = Buffer.from(credentials).toString('base64');
  return `Basic ${encoded}`;
}

/**
 * Build URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(path, baseUrl);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Build pagination query parameters
 */
export function buildPaginationParams(pagination?: PaginationParams): Record<string, string | number | undefined> {
  if (!pagination) return {};

  return {
    limit: pagination.limit,
    order: pagination.order,
    last_id: pagination.last_id,
  };
}

/**
 * Client configuration options
 */
export interface TradeSyncClientOptions {
  /** API key (defaults to env TRADESYNC_API_KEY) */
  apiKey?: string;
  /** API secret (defaults to env TRADESYNC_API_SECRET) */
  apiSecret?: string;
  /** Base URL (defaults to env or https://api.tradesync.com) */
  baseUrl?: string;
  /** Request timeout in ms (defaults to 30000) */
  timeout?: number;
  /** API version (defaults to v1) */
  version?: string;
  /** Retry configuration */
  retry?: Partial<RetryConfig>;
  /** Rate limiter instance (optional, for client-side throttling) */
  rateLimiter?: RateLimiter;
  /** Enable connection status tracking (default: true) */
  trackConnectionStatus?: boolean;
}

/**
 * TradeSync API Client
 *
 * Provides HTTP methods for interacting with the TradeSync API.
 * Handles authentication, retries, and error mapping.
 */
export class TradeSyncClient {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly version: string;
  private readonly retryConfig: RetryConfig;
  private readonly rateLimiter: RateLimiter | null;
  private readonly connectionStatus: ConnectionStatusManager | null;

  /**
   * Create a new TradeSync client
   *
   * @param options - Client configuration options
   */
  constructor(options: TradeSyncClientOptions = {}) {
    this.apiKey = options.apiKey || tradeSyncConfig.apiKey;
    this.apiSecret = options.apiSecret || tradeSyncConfig.apiSecret;
    this.baseUrl = options.baseUrl || tradeSyncConfig.baseUrl;
    this.timeout = options.timeout || tradeSyncConfig.timeout;
    this.version = options.version || tradeSyncConfig.version;
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...options.retry };
    this.rateLimiter = options.rateLimiter || null;
    this.connectionStatus = options.trackConnectionStatus !== false
      ? new ConnectionStatusManager()
      : null;
  }

  /**
   * Get the authorization header
   */
  private getAuthHeader(): string {
    return createBasicAuthHeader(this.apiKey, this.apiSecret);
  }

  /**
   * Get the full API URL for a path
   */
  private getApiUrl(path: string): string {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Only add version prefix if version is set
    if (!this.version) {
      return `${this.baseUrl}${normalizedPath}`;
    }

    const versionedPath = normalizedPath.startsWith(`/${this.version}`)
      ? normalizedPath
      : `/${this.version}${normalizedPath}`;

    return `${this.baseUrl}${versionedPath}`;
  }

  /**
   * Parse API response and handle errors
   */
  private async parseResponse<T>(response: Response, operationName: string): Promise<T> {
    let body: ApiResponse<T>;

    try {
      body = await response.json() as ApiResponse<T>;
    } catch {
      throw new TradeSyncError(
        `Invalid JSON response from ${operationName}`,
        'INVALID_RESPONSE',
        false,
        response.status
      );
    }

    // Check for error response
    if (body.result === 'error' || !response.ok) {
      // Build error message with validation errors if present
      let errorMessage = body.message || `Request failed: ${operationName}`;
      if (body.errors) {
        const validationErrors = Object.entries(body.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; ');
        errorMessage = `${errorMessage} - ${validationErrors}`;
      }
      const error = TradeSyncError.fromResponse(response.status, errorMessage);
      throw error;
    }

    // Return full response body (services expect the wrapper with data, meta, etc.)
    return body as T;
  }

  /**
   * Execute an HTTP request with retry logic
   */
  private async request<T>(
    method: HttpMethod,
    path: string,
    options: {
      body?: unknown;
      params?: Record<string, string | number | boolean | undefined>;
      requestOptions?: RequestOptions;
    } = {}
  ): Promise<T> {
    const { body, params, requestOptions } = options;
    const skipRetry = requestOptions?.skipRetry ?? false;

    // Apply rate limiting if configured
    if (this.rateLimiter) {
      await this.rateLimiter.acquire();
    }

    const url = buildUrl(this.getApiUrl(path), '', params);

    const headers: Record<string, string> = {
      'Authorization': this.getAuthHeader(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Connection': 'keep-alive',
      ...requestOptions?.headers,
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: requestOptions?.signal,
    };

    if (body !== undefined && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const timeout = requestOptions?.timeout ?? this.timeout;
    const operationName = `${method} ${path}`;

    const executeRequest = async (): Promise<T> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: requestOptions?.signal ?? controller.signal,
        });

        // Update rate limiter with response headers
        if (this.rateLimiter) {
          this.rateLimiter.updateFromHeaders(response.headers);
        }

        const result = await this.parseResponse<T>(response, operationName);

        // Record success for connection status
        if (this.connectionStatus) {
          this.connectionStatus.recordSuccess();
        }

        return result;
      } catch (error) {
        // Record failure for connection status
        if (this.connectionStatus) {
          if (error instanceof Error && error.name === 'AbortError') {
            this.connectionStatus.recordTimeout();
          } else if (error instanceof Error) {
            this.connectionStatus.recordFailure(error);
          }
        }

        if (error instanceof TradeSyncError) {
          throw error;
        }

        // Handle abort/timeout
        if (error instanceof Error && error.name === 'AbortError') {
          throw new TradeSyncError(
            `Request timed out: ${operationName}`,
            'TIMEOUT',
            true,
            undefined,
            error
          );
        }

        // Wrap unknown errors
        throw wrapError(error, `Request failed: ${operationName}`);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    if (skipRetry) {
      return executeRequest();
    }

    return withRetry(executeRequest, this.retryConfig, operationName);
  }

  /**
   * Make a GET request
   *
   * @param path - API path
   * @param params - Query parameters
   * @param options - Request options
   */
  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>('GET', path, { params, requestOptions: options });
  }

  /**
   * Make a POST request
   *
   * @param path - API path
   * @param body - Request body
   * @param options - Request options
   */
  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, { body, requestOptions: options });
  }

  /**
   * Make a PUT request
   *
   * @param path - API path
   * @param body - Request body
   * @param options - Request options
   */
  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, { body, requestOptions: options });
  }

  /**
   * Make a PATCH request
   *
   * @param path - API path
   * @param body - Request body
   * @param options - Request options
   */
  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, { body, requestOptions: options });
  }

  /**
   * Make a DELETE request
   *
   * @param path - API path
   * @param options - Request options
   */
  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, { requestOptions: options });
  }

  /**
   * Make a paginated GET request
   *
   * @param path - API path
   * @param pagination - Pagination parameters
   * @param additionalParams - Additional query parameters
   * @param options - Request options
   */
  async getPaginated<T>(
    path: string,
    pagination?: PaginationParams,
    additionalParams?: Record<string, string | number | boolean | undefined>,
    options?: RequestOptions
  ): Promise<T> {
    const params = {
      ...buildPaginationParams(pagination),
      ...additionalParams,
    };
    return this.get<T>(path, params, options);
  }

  /**
   * Ping the API to check connectivity and authentication
   *
   * Makes a lightweight request to verify the API is reachable.
   * Uses /brokers endpoint which is available to all authenticated users.
   * Does not retry on failure.
   *
   * @param options - Request options (timeout defaults to 5000ms)
   * @returns Health check result
   */
  async ping(options?: RequestOptions): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const pingTimeout = options?.timeout ?? 5000;

    try {
      // Use /brokers endpoint - available to all authenticated users
      await this.get('/brokers', { limit: 1 }, {
        ...options,
        skipRetry: true,
        timeout: pingTimeout,
      });

      return {
        success: true,
        responseTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        responseTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get current connection status
   *
   * @returns Connection status or null if tracking is disabled
   */
  getConnectionStatus(): ConnectionStatus | null {
    return this.connectionStatus?.getStatus() ?? null;
  }

  /**
   * Check if the client is currently connected
   *
   * @returns true if connected, false otherwise
   */
  isConnected(): boolean {
    return this.connectionStatus?.isConnected() ?? true;
  }

  /**
   * Get rate limit information
   *
   * @returns Rate limit info or null if rate limiting is disabled
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimiter?.getInfo() ?? null;
  }

  /**
   * Get the current configuration
   */
  getConfig(): TradeSyncConfig {
    return {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      version: this.version,
    };
  }
}

/**
 * Create a new TradeSync client instance
 */
export function createClient(options?: TradeSyncClientOptions): TradeSyncClient {
  return new TradeSyncClient(options);
}
