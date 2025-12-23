/**
 * TradeSync SDK Retry Logic
 *
 * Implements exponential backoff with configurable parameters.
 */

import {
  TradeSyncError,
  TransientError,
  RateLimitError,
  isRetryableError,
} from './errors.js';

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries: number;
  /** Initial delay in milliseconds before first retry (default: 1000) */
  initialDelayMs: number;
  /** Maximum delay in milliseconds between retries (default: 10000) */
  maxDelayMs: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier: number;
  /** Optional jitter factor (0-1) to add randomness to delays */
  jitterFactor?: number;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
};

/**
 * Result of a retry operation
 */
export interface RetryResult<T> {
  success: boolean;
  result?: T;
  error?: TradeSyncError;
  attempts: number;
  totalDelayMs: number;
}

/**
 * Execute a function with exponential backoff retry
 *
 * @param fn - Async function to execute
 * @param config - Retry configuration
 * @param operationName - Name of the operation (for logging)
 * @returns Result of the function
 * @throws TradeSyncError if all retries exhausted or non-retryable error
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  operationName: string = 'operation'
): Promise<T> {
  const fullConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | undefined;
  let delay = fullConfig.initialDelayMs;
  let totalDelayMs = 0;

  for (let attempt = 0; attempt <= fullConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      const isRetryable = isRetryableError(error);
      const hasRetriesLeft = attempt < fullConfig.maxRetries;

      if (!isRetryable || !hasRetriesLeft) {
        const exhausted = !hasRetriesLeft && isRetryable;

        // Create appropriate error
        const tradeSyncError = error instanceof TradeSyncError
          ? new TradeSyncError(
              `${operationName} failed after ${attempt + 1} attempts: ${lastError.message}`,
              error.code,
              false, // Not retryable anymore
              error.statusCode,
              lastError,
              exhausted
            )
          : new TradeSyncError(
              `${operationName} failed: ${lastError.message}`,
              'OPERATION_FAILED',
              false,
              undefined,
              lastError,
              exhausted
            );

        throw tradeSyncError;
      }

      // Check for server-provided retry delay (rate limit)
      let actualDelay: number;
      if (error instanceof RateLimitError && error.retryAfterMs !== undefined) {
        // Use server-provided delay for rate limits
        actualDelay = error.retryAfterMs;
        console.warn(
          `[TradeSync SDK] ${operationName} rate limited (attempt ${attempt + 1}/${fullConfig.maxRetries + 1}), retrying in ${actualDelay}ms (server requested)...`
        );
      } else {
        // Calculate delay with optional jitter for other errors
        const jitter = fullConfig.jitterFactor
          ? (Math.random() - 0.5) * 2 * fullConfig.jitterFactor * delay
          : 0;
        actualDelay = Math.round(Math.max(0, delay + jitter));
        console.warn(
          `[TradeSync SDK] ${operationName} failed (attempt ${attempt + 1}/${fullConfig.maxRetries + 1}), retrying in ${actualDelay}ms...`,
          lastError.message
        );
      }

      // Wait before retry
      await sleep(actualDelay);
      totalDelayMs += actualDelay;

      // Calculate next delay with exponential backoff (only for non-rate-limit errors)
      if (!(error instanceof RateLimitError)) {
        delay = Math.min(delay * fullConfig.backoffMultiplier, fullConfig.maxDelayMs);
      }
    }
  }

  // Should not reach here, but just in case
  throw lastError || new Error('Unknown error in retry logic');
}

/**
 * Execute a function with retry and return detailed result
 *
 * Unlike withRetry, this doesn't throw but returns a result object
 */
export async function withRetryResult<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
  operationName: string = 'operation'
): Promise<RetryResult<T>> {
  const fullConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let delay = fullConfig.initialDelayMs;
  let totalDelayMs = 0;

  for (let attempt = 0; attempt <= fullConfig.maxRetries; attempt++) {
    try {
      const result = await fn();
      return {
        success: true,
        result,
        attempts: attempt + 1,
        totalDelayMs,
      };
    } catch (error) {
      const isRetryable = isRetryableError(error);
      const hasRetriesLeft = attempt < fullConfig.maxRetries;

      if (!isRetryable || !hasRetriesLeft) {
        const originalError = error instanceof Error ? error : new Error(String(error));
        const exhausted = !hasRetriesLeft && isRetryable;

        return {
          success: false,
          error: new TradeSyncError(
            `${operationName} failed after ${attempt + 1} attempts: ${originalError.message}`,
            'OPERATION_FAILED',
            false,
            undefined,
            originalError,
            exhausted
          ),
          attempts: attempt + 1,
          totalDelayMs,
        };
      }

      // Calculate delay with jitter
      const jitter = fullConfig.jitterFactor
        ? (Math.random() - 0.5) * 2 * fullConfig.jitterFactor * delay
        : 0;
      const actualDelay = Math.round(Math.max(0, delay + jitter));

      await sleep(actualDelay);
      totalDelayMs += actualDelay;

      delay = Math.min(delay * fullConfig.backoffMultiplier, fullConfig.maxDelayMs);
    }
  }

  return {
    success: false,
    error: new TransientError('Unknown error in retry logic'),
    attempts: fullConfig.maxRetries + 1,
    totalDelayMs,
  };
}

/**
 * Calculate the delay for a specific retry attempt
 */
export function calculateDelay(
  attempt: number,
  config: Partial<RetryConfig> = {}
): number {
  const fullConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

  if (attempt === 0) {
    return 0;
  }

  const baseDelay = fullConfig.initialDelayMs * Math.pow(fullConfig.backoffMultiplier, attempt - 1);
  return Math.min(baseDelay, fullConfig.maxDelayMs);
}

/**
 * Calculate total maximum delay for all retries
 */
export function calculateTotalMaxDelay(config: Partial<RetryConfig> = {}): number {
  const fullConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let total = 0;

  for (let i = 1; i <= fullConfig.maxRetries; i++) {
    total += calculateDelay(i, fullConfig);
  }

  return total;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a retry wrapper for a specific operation
 */
export function createRetryWrapper<T>(
  config: Partial<RetryConfig> = {},
  operationName: string = 'operation'
): (fn: () => Promise<T>) => Promise<T> {
  return (fn) => withRetry(fn, config, operationName);
}
