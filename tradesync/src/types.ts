/**
 * TradeSync SDK Common Types
 *
 * Contains shared types and interfaces used across the SDK.
 * Matches actual TradeSync API response structure.
 */

/**
 * HTTP methods supported by the API
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * TradeSync API pagination parameters
 */
export interface PaginationParams {
  /** Maximum number of items to return (default: 1000) */
  limit?: number;
  /** Sort order ('asc' or 'desc') */
  order?: 'asc' | 'desc';
  /** ID to start after (for cursor-based pagination) */
  last_id?: number;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
  /** Skip retry logic */
  skipRetry?: boolean;
}

/**
 * TradeSync API standard list response wrapper
 */
export interface ApiListResponse<T> {
  result: 'success' | 'error';
  status: number;
  meta: {
    count: number;
    limit: number;
    order: 'asc' | 'desc';
    last_id: number;
  };
  data: T[];
}

/**
 * TradeSync API standard single item response wrapper
 */
export interface ApiSingleResponse<T> {
  result: 'success' | 'error';
  status: number;
  data: T;
}

/**
 * TradeSync API error response
 */
export interface ApiErrorResponse {
  result: 'error';
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * TradeSync API success codes
 */
export type SuccessCode = 'SUCCESS';

/**
 * TradeSync API fail codes (client errors)
 */
export type FailCode =
  | 'AUTHORISATION_FAILED'
  | 'NOT_AUTHORISED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'INVALID_CONTENT_TYPE'
  | 'VALIDATION_FAIL'
  | 'REQUIRED_DATA_MISSING'
  | 'TOO_MANY_REQUESTS';

/**
 * TradeSync API error codes (server errors)
 */
export type ErrorCode = 'ERROR' | 'MAINTENANCE_MODE';

/**
 * All TradeSync API response codes
 */
export type ResponseCode = SuccessCode | FailCode | ErrorCode;

/**
 * Timestamp type (ISO 8601 string)
 */
export type Timestamp = string;

/**
 * Result type for operations that may fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * Generic API response (used internally by client)
 */
export interface ApiResponse<T> {
  result: 'success' | 'error';
  status: number;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    count: number;
    limit: number;
    order: 'asc' | 'desc';
    last_id: number;
  };
  data?: T;
}

// ============================================================================
// Connection & Health Types
// ============================================================================

/**
 * Result of a health check / ping operation
 */
export interface HealthCheckResult {
  /** Whether the health check succeeded */
  success: boolean;
  /** Response time in milliseconds */
  responseTimeMs: number;
  /** ISO timestamp of the check */
  timestamp: string;
  /** Error message if check failed */
  error?: string;
}

/**
 * Connection status tracking
 */
export interface ConnectionStatus {
  /** Whether the client is currently connected (had recent successful request) */
  isConnected: boolean;
  /** Timestamp of last successful request */
  lastSuccessfulRequest: Date | null;
  /** Timestamp of last failed request */
  lastFailedRequest: Date | null;
  /** Number of consecutive failures */
  consecutiveFailures: number;
  /** Number of consecutive timeouts */
  consecutiveTimeouts: number;
  /** Last error message */
  lastError: string | null;
}

/**
 * Rate limit information from API headers
 */
export interface RateLimitInfo {
  /** Remaining requests in current window */
  remaining: number | null;
  /** Total limit for current window */
  limit: number | null;
  /** When the rate limit resets */
  resetAt: Date | null;
  /** Retry-After value in milliseconds (from 429 response) */
  retryAfterMs: number | null;
}

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
  /** Maximum requests per second (client-side throttling) */
  requestsPerSecond?: number;
  /** Whether to respect server-provided Retry-After headers */
  respectServerLimits?: boolean;
  /** Maximum queue size for pending requests */
  maxQueueSize?: number;
}
