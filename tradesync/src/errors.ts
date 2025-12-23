/**
 * TradeSync SDK Error Classes
 *
 * Error hierarchy:
 * - TradeSyncError (base)
 *   - TransientError (retryable)
 *   - PermanentError (non-retryable)
 */

/**
 * Base error class for all TradeSync SDK errors
 */
export class TradeSyncError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean,
    public readonly statusCode?: number,
    public readonly originalError?: Error,
    public readonly retriesExhausted: boolean = false
  ) {
    super(message);
    this.name = 'TradeSyncError';
    // Maintains proper stack trace for where error was thrown (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TradeSyncError);
    }
  }

  /**
   * Create error from HTTP response
   */
  static fromResponse(
    statusCode: number,
    message: string,
    originalError?: Error
  ): TradeSyncError {
    const retryable = isRetryableStatusCode(statusCode);
    const code = getErrorCodeFromStatus(statusCode);

    if (retryable) {
      return new TransientError(message, code, statusCode, originalError);
    }
    return new PermanentError(message, code, statusCode, originalError);
  }
}

/**
 * Transient (retryable) errors - network issues, rate limits, server errors
 */
export class TransientError extends TradeSyncError {
  constructor(
    message: string,
    code: string = 'TRANSIENT_ERROR',
    statusCode?: number,
    originalError?: Error
  ) {
    super(message, code, true, statusCode, originalError);
    this.name = 'TransientError';
  }
}

/**
 * Permanent (non-retryable) errors - bad requests, auth failures, not found
 */
export class PermanentError extends TradeSyncError {
  constructor(
    message: string,
    code: string = 'PERMANENT_ERROR',
    statusCode?: number,
    originalError?: Error
  ) {
    super(message, code, false, statusCode, originalError);
    this.name = 'PermanentError';
  }
}

/**
 * Authentication error - API key invalid or missing
 */
export class AuthenticationError extends PermanentError {
  constructor(message: string = 'Authentication failed', originalError?: Error) {
    super(message, 'AUTH_ERROR', 401, originalError);
    this.name = 'AuthenticationError';
  }
}

/**
 * Rate limit error - too many requests
 */
export class RateLimitError extends TransientError {
  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfterMs?: number,
    public readonly remaining?: number,
    public readonly resetAt?: Date,
    originalError?: Error
  ) {
    super(message, 'RATE_LIMIT_ERROR', 429, originalError);
    this.name = 'RateLimitError';
  }

  /**
   * Create RateLimitError from response headers
   */
  static fromHeaders(
    headers: Headers,
    message: string = 'Rate limit exceeded'
  ): RateLimitError {
    let retryAfterMs: number | undefined;
    let remaining: number | undefined;
    let resetAt: Date | undefined;

    // Parse Retry-After header (seconds or HTTP-date)
    const retryAfter = headers.get('retry-after');
    if (retryAfter !== null) {
      const seconds = parseInt(retryAfter, 10);
      if (!isNaN(seconds)) {
        retryAfterMs = seconds * 1000;
      }
    }

    // Parse X-RateLimit-Remaining
    const remainingHeader = headers.get('x-ratelimit-remaining');
    if (remainingHeader !== null) {
      remaining = parseInt(remainingHeader, 10);
    }

    // Parse X-RateLimit-Reset (Unix timestamp)
    const resetHeader = headers.get('x-ratelimit-reset');
    if (resetHeader !== null) {
      const resetTimestamp = parseInt(resetHeader, 10);
      if (!isNaN(resetTimestamp)) {
        // Could be seconds or milliseconds
        if (resetTimestamp > 1e12) {
          resetAt = new Date(resetTimestamp);
        } else {
          resetAt = new Date(resetTimestamp * 1000);
        }
      }
    }

    return new RateLimitError(message, retryAfterMs, remaining, resetAt);
  }
}

/**
 * Validation error - request payload invalid
 */
export class ValidationError extends PermanentError {
  constructor(
    message: string,
    public readonly validationErrors?: Record<string, string[]>,
    originalError?: Error
  ) {
    super(message, 'VALIDATION_ERROR', 400, originalError);
    this.name = 'ValidationError';
  }
}

/**
 * Not found error - resource doesn't exist
 */
export class NotFoundError extends PermanentError {
  constructor(
    message: string = 'Resource not found',
    public readonly resourceType?: string,
    public readonly resourceId?: string,
    originalError?: Error
  ) {
    super(message, 'NOT_FOUND_ERROR', 404, originalError);
    this.name = 'NotFoundError';
  }
}

/**
 * Timeout error - request took too long
 */
export class TimeoutError extends TransientError {
  constructor(
    message: string = 'Request timed out',
    public readonly timeoutMs?: number,
    originalError?: Error
  ) {
    super(message, 'TIMEOUT_ERROR', undefined, originalError);
    this.name = 'TimeoutError';
  }
}

/**
 * Network error - connection issues
 */
export class NetworkError extends TransientError {
  constructor(message: string = 'Network error', originalError?: Error) {
    super(message, 'NETWORK_ERROR', undefined, originalError);
    this.name = 'NetworkError';
  }
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  // Check TradeSyncError instances
  if (error instanceof TradeSyncError) {
    // If retries exhausted, don't retry
    if (error.retriesExhausted) {
      return false;
    }
    return error.retryable;
  }

  // Check native Error instances
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const statusCode = (error as { status?: number }).status;

    // Check status code first
    if (statusCode !== undefined) {
      return isRetryableStatusCode(statusCode);
    }

    // Check message patterns for network/transient errors
    return (
      message.includes('econnrefused') ||
      message.includes('econnreset') ||
      message.includes('enotfound') ||
      message.includes('etimedout') ||
      message.includes('timeout') ||
      message.includes('socket hang up') ||
      message.includes('network') ||
      message.includes('429') ||
      message.includes('rate limit') ||
      message.includes('500') ||
      message.includes('502') ||
      message.includes('503') ||
      message.includes('504') ||
      message.includes('server error')
    );
  }

  return false;
}

/**
 * Check if an HTTP status code is retryable
 */
export function isRetryableStatusCode(statusCode: number): boolean {
  return (
    statusCode === 429 || // Rate limit
    statusCode === 500 || // Internal server error
    statusCode === 502 || // Bad gateway
    statusCode === 503 || // Service unavailable
    statusCode === 504    // Gateway timeout
  );
}

/**
 * Get error code from HTTP status
 */
function getErrorCodeFromStatus(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'UNPROCESSABLE_ENTITY';
    case 429:
      return 'RATE_LIMIT';
    case 500:
      return 'INTERNAL_SERVER_ERROR';
    case 502:
      return 'BAD_GATEWAY';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    case 504:
      return 'GATEWAY_TIMEOUT';
    default:
      return `HTTP_${statusCode}`;
  }
}

/**
 * Wrap an unknown error as a TradeSyncError
 */
export function wrapError(error: unknown, message?: string): TradeSyncError {
  if (error instanceof TradeSyncError) {
    return error;
  }

  const originalError = error instanceof Error ? error : new Error(String(error));
  const errorMessage = message || originalError.message;
  const retryable = isRetryableError(error);

  if (retryable) {
    return new TransientError(errorMessage, 'WRAPPED_ERROR', undefined, originalError);
  }
  return new PermanentError(errorMessage, 'WRAPPED_ERROR', undefined, originalError);
}

// ============================================================================
// MetaTrader Error Codes
// ============================================================================

/**
 * MetaTrader 4 Error Codes
 *
 * Standard error codes returned by MT4 trading operations.
 * These codes help identify specific failures in trade execution.
 */
export const MT4_ERROR_CODES = {
  ERR_NO_ERROR: 0,
  ERR_NO_RESULT: 1,
  ERR_COMMON_ERROR: 2,
  ERR_INVALID_TRADE_PARAMETERS: 3,
  ERR_SERVER_BUSY: 4,
  ERR_OLD_VERSION: 5,
  ERR_NO_CONNECTION: 6,
  ERR_NOT_ENOUGH_RIGHTS: 7,
  ERR_TOO_FREQUENT_REQUESTS: 8,
  ERR_MALFUNCTIONAL_TRADE: 9,
  ERR_ACCOUNT_DISABLED: 64,
  ERR_INVALID_ACCOUNT: 65,
  ERR_TRADE_TIMEOUT: 128,
  ERR_INVALID_PRICE: 129,
  ERR_INVALID_STOPS: 130,
  ERR_INVALID_TRADE_VOLUME: 131,
  ERR_MARKET_CLOSED: 132,
  ERR_TRADE_DISABLED: 133,
  ERR_NOT_ENOUGH_MONEY: 134,
  ERR_PRICE_CHANGED: 135,
  ERR_OFF_QUOTES: 136,
  ERR_BROKER_BUSY: 137,
  ERR_REQUOTE: 138,
  ERR_ORDER_LOCKED: 139,
  ERR_LONG_POSITIONS_ONLY_ALLOWED: 140,
  ERR_TOO_MANY_REQUESTS: 141,
  ERR_TRADE_MODIFY_DENIED: 145,
  ERR_TRADE_CONTEXT_BUSY: 146,
  ERR_TRADE_EXPIRATION_DENIED: 147,
  ERR_TRADE_TOO_MANY_ORDERS: 148,
} as const;

/**
 * MT4 Error Code type
 */
export type MT4ErrorCode = (typeof MT4_ERROR_CODES)[keyof typeof MT4_ERROR_CODES];

/**
 * MT4 error code descriptions
 */
const MT4_ERROR_MESSAGES: Record<number, string> = {
  [MT4_ERROR_CODES.ERR_NO_ERROR]: 'No error',
  [MT4_ERROR_CODES.ERR_NO_RESULT]: 'No result',
  [MT4_ERROR_CODES.ERR_COMMON_ERROR]: 'Common error',
  [MT4_ERROR_CODES.ERR_INVALID_TRADE_PARAMETERS]: 'Invalid trade parameters',
  [MT4_ERROR_CODES.ERR_SERVER_BUSY]: 'Trade server is busy',
  [MT4_ERROR_CODES.ERR_OLD_VERSION]: 'Old version of client terminal',
  [MT4_ERROR_CODES.ERR_NO_CONNECTION]: 'No connection with trade server',
  [MT4_ERROR_CODES.ERR_NOT_ENOUGH_RIGHTS]: 'Not enough rights',
  [MT4_ERROR_CODES.ERR_TOO_FREQUENT_REQUESTS]: 'Too frequent requests',
  [MT4_ERROR_CODES.ERR_MALFUNCTIONAL_TRADE]: 'Malfunctional trade operation',
  [MT4_ERROR_CODES.ERR_ACCOUNT_DISABLED]: 'Account disabled',
  [MT4_ERROR_CODES.ERR_INVALID_ACCOUNT]: 'Invalid account',
  [MT4_ERROR_CODES.ERR_TRADE_TIMEOUT]: 'Trade timeout',
  [MT4_ERROR_CODES.ERR_INVALID_PRICE]: 'Invalid price',
  [MT4_ERROR_CODES.ERR_INVALID_STOPS]: 'Invalid stops',
  [MT4_ERROR_CODES.ERR_INVALID_TRADE_VOLUME]: 'Invalid trade volume',
  [MT4_ERROR_CODES.ERR_MARKET_CLOSED]: 'Market is closed',
  [MT4_ERROR_CODES.ERR_TRADE_DISABLED]: 'Trade is disabled',
  [MT4_ERROR_CODES.ERR_NOT_ENOUGH_MONEY]: 'Not enough money',
  [MT4_ERROR_CODES.ERR_PRICE_CHANGED]: 'Price changed',
  [MT4_ERROR_CODES.ERR_OFF_QUOTES]: 'Off quotes',
  [MT4_ERROR_CODES.ERR_BROKER_BUSY]: 'Broker is busy',
  [MT4_ERROR_CODES.ERR_REQUOTE]: 'Requote',
  [MT4_ERROR_CODES.ERR_ORDER_LOCKED]: 'Order is locked',
  [MT4_ERROR_CODES.ERR_LONG_POSITIONS_ONLY_ALLOWED]: 'Long positions only allowed',
  [MT4_ERROR_CODES.ERR_TOO_MANY_REQUESTS]: 'Too many requests',
  [MT4_ERROR_CODES.ERR_TRADE_MODIFY_DENIED]: 'Modification denied because order is too close to market',
  [MT4_ERROR_CODES.ERR_TRADE_CONTEXT_BUSY]: 'Trade context is busy',
  [MT4_ERROR_CODES.ERR_TRADE_EXPIRATION_DENIED]: 'Expirations are denied by broker',
  [MT4_ERROR_CODES.ERR_TRADE_TOO_MANY_ORDERS]: 'Amount of open and pending orders has reached the limit',
};

/**
 * MetaTrader 5 Error Codes (Trade Return Codes)
 *
 * Standard return codes from MT5 trade server operations.
 * These codes indicate the result of trade requests.
 */
export const MT5_ERROR_CODES = {
  TRADE_RETCODE_REQUOTE: 10004,
  TRADE_RETCODE_REJECT: 10006,
  TRADE_RETCODE_CANCEL: 10007,
  TRADE_RETCODE_PLACED: 10008,
  TRADE_RETCODE_DONE: 10009,
  TRADE_RETCODE_DONE_PARTIAL: 10010,
  TRADE_RETCODE_ERROR: 10011,
  TRADE_RETCODE_TIMEOUT: 10012,
  TRADE_RETCODE_INVALID: 10013,
  TRADE_RETCODE_INVALID_VOLUME: 10014,
  TRADE_RETCODE_INVALID_PRICE: 10015,
  TRADE_RETCODE_INVALID_STOPS: 10016,
  TRADE_RETCODE_TRADE_DISABLED: 10017,
  TRADE_RETCODE_MARKET_CLOSED: 10018,
  TRADE_RETCODE_NO_MONEY: 10019,
  TRADE_RETCODE_PRICE_CHANGED: 10020,
  TRADE_RETCODE_PRICE_OFF: 10021,
  TRADE_RETCODE_INVALID_EXPIRATION: 10022,
  TRADE_RETCODE_ORDER_CHANGED: 10023,
  TRADE_RETCODE_TOO_MANY_REQUESTS: 10024,
  TRADE_RETCODE_NO_CHANGES: 10025,
  TRADE_RETCODE_SERVER_DISABLES_AT: 10026,
  TRADE_RETCODE_CLIENT_DISABLES_AT: 10027,
  TRADE_RETCODE_LOCKED: 10028,
  TRADE_RETCODE_FROZEN: 10029,
  TRADE_RETCODE_INVALID_FILL: 10030,
  TRADE_RETCODE_CONNECTION: 10031,
  TRADE_RETCODE_ONLY_REAL: 10032,
  TRADE_RETCODE_LIMIT_ORDERS: 10033,
  TRADE_RETCODE_LIMIT_VOLUME: 10034,
  TRADE_RETCODE_INVALID_ORDER: 10035,
  TRADE_RETCODE_POSITION_CLOSED: 10036,
} as const;

/**
 * MT5 Error Code type
 */
export type MT5ErrorCode = (typeof MT5_ERROR_CODES)[keyof typeof MT5_ERROR_CODES];

/**
 * MT5 error code descriptions
 */
const MT5_ERROR_MESSAGES: Record<number, string> = {
  [MT5_ERROR_CODES.TRADE_RETCODE_REQUOTE]: 'Requote',
  [MT5_ERROR_CODES.TRADE_RETCODE_REJECT]: 'Request rejected',
  [MT5_ERROR_CODES.TRADE_RETCODE_CANCEL]: 'Request canceled by trader',
  [MT5_ERROR_CODES.TRADE_RETCODE_PLACED]: 'Order placed',
  [MT5_ERROR_CODES.TRADE_RETCODE_DONE]: 'Request completed',
  [MT5_ERROR_CODES.TRADE_RETCODE_DONE_PARTIAL]: 'Only part of the request was completed',
  [MT5_ERROR_CODES.TRADE_RETCODE_ERROR]: 'Request processing error',
  [MT5_ERROR_CODES.TRADE_RETCODE_TIMEOUT]: 'Request canceled by timeout',
  [MT5_ERROR_CODES.TRADE_RETCODE_INVALID]: 'Invalid request',
  [MT5_ERROR_CODES.TRADE_RETCODE_INVALID_VOLUME]: 'Invalid volume in the request',
  [MT5_ERROR_CODES.TRADE_RETCODE_INVALID_PRICE]: 'Invalid price in the request',
  [MT5_ERROR_CODES.TRADE_RETCODE_INVALID_STOPS]: 'Invalid stops in the request',
  [MT5_ERROR_CODES.TRADE_RETCODE_TRADE_DISABLED]: 'Trade is disabled',
  [MT5_ERROR_CODES.TRADE_RETCODE_MARKET_CLOSED]: 'Market is closed',
  [MT5_ERROR_CODES.TRADE_RETCODE_NO_MONEY]: 'There is not enough money to complete the request',
  [MT5_ERROR_CODES.TRADE_RETCODE_PRICE_CHANGED]: 'Prices changed',
  [MT5_ERROR_CODES.TRADE_RETCODE_PRICE_OFF]: 'There are no quotes to process the request',
  [MT5_ERROR_CODES.TRADE_RETCODE_INVALID_EXPIRATION]: 'Invalid order expiration date in the request',
  [MT5_ERROR_CODES.TRADE_RETCODE_ORDER_CHANGED]: 'Order state changed',
  [MT5_ERROR_CODES.TRADE_RETCODE_TOO_MANY_REQUESTS]: 'Too frequent requests',
  [MT5_ERROR_CODES.TRADE_RETCODE_NO_CHANGES]: 'No changes in request',
  [MT5_ERROR_CODES.TRADE_RETCODE_SERVER_DISABLES_AT]: 'Autotrading disabled by server',
  [MT5_ERROR_CODES.TRADE_RETCODE_CLIENT_DISABLES_AT]: 'Autotrading disabled by client terminal',
  [MT5_ERROR_CODES.TRADE_RETCODE_LOCKED]: 'Request locked for processing',
  [MT5_ERROR_CODES.TRADE_RETCODE_FROZEN]: 'Order or position frozen',
  [MT5_ERROR_CODES.TRADE_RETCODE_INVALID_FILL]: 'Invalid order filling type',
  [MT5_ERROR_CODES.TRADE_RETCODE_CONNECTION]: 'No connection with the trade server',
  [MT5_ERROR_CODES.TRADE_RETCODE_ONLY_REAL]: 'Operation is allowed only for live accounts',
  [MT5_ERROR_CODES.TRADE_RETCODE_LIMIT_ORDERS]: 'The number of pending orders has reached the limit',
  [MT5_ERROR_CODES.TRADE_RETCODE_LIMIT_VOLUME]: 'The volume of orders and positions for the symbol has reached the limit',
  [MT5_ERROR_CODES.TRADE_RETCODE_INVALID_ORDER]: 'Incorrect or prohibited order type',
  [MT5_ERROR_CODES.TRADE_RETCODE_POSITION_CLOSED]: 'Position with the specified identifier has already been closed',
};

/**
 * Get human-readable error message for MT4 error code
 *
 * @param code - MT4 error code
 * @returns Human-readable error description
 *
 * @example
 * getMT4ErrorMessage(134) // "Not enough money"
 * getMT4ErrorMessage(999) // "Unknown MT4 error: 999"
 */
export function getMT4ErrorMessage(code: number): string {
  return MT4_ERROR_MESSAGES[code] || `Unknown MT4 error: ${code}`;
}

/**
 * Get human-readable error message for MT5 error code
 *
 * @param code - MT5 error code (return code)
 * @returns Human-readable error description
 *
 * @example
 * getMT5ErrorMessage(10019) // "There is not enough money to complete the request"
 * getMT5ErrorMessage(99999) // "Unknown MT5 error: 99999"
 */
export function getMT5ErrorMessage(code: number): string {
  return MT5_ERROR_MESSAGES[code] || `Unknown MT5 error: ${code}`;
}

/**
 * Set of retryable MT4 error codes for O(1) lookup
 */
const RETRYABLE_MT4_ERROR_CODES = new Set<number>([
  MT4_ERROR_CODES.ERR_SERVER_BUSY,
  MT4_ERROR_CODES.ERR_NO_CONNECTION,
  MT4_ERROR_CODES.ERR_TOO_FREQUENT_REQUESTS,
  MT4_ERROR_CODES.ERR_TRADE_TIMEOUT,
  MT4_ERROR_CODES.ERR_PRICE_CHANGED,
  MT4_ERROR_CODES.ERR_BROKER_BUSY,
  MT4_ERROR_CODES.ERR_REQUOTE,
  MT4_ERROR_CODES.ERR_OFF_QUOTES,
  MT4_ERROR_CODES.ERR_TRADE_CONTEXT_BUSY,
  MT4_ERROR_CODES.ERR_TOO_MANY_REQUESTS,
]);

/**
 * Set of retryable MT5 error codes for O(1) lookup
 */
const RETRYABLE_MT5_ERROR_CODES = new Set<number>([
  MT5_ERROR_CODES.TRADE_RETCODE_REQUOTE,
  MT5_ERROR_CODES.TRADE_RETCODE_TIMEOUT,
  MT5_ERROR_CODES.TRADE_RETCODE_PRICE_CHANGED,
  MT5_ERROR_CODES.TRADE_RETCODE_PRICE_OFF,
  MT5_ERROR_CODES.TRADE_RETCODE_TOO_MANY_REQUESTS,
  MT5_ERROR_CODES.TRADE_RETCODE_LOCKED,
  MT5_ERROR_CODES.TRADE_RETCODE_CONNECTION,
]);

/**
 * Check if MT4 error code is retryable
 *
 * Retryable errors include:
 * - Server busy
 * - No connection
 * - Too frequent requests
 * - Trade timeout
 * - Price changed
 * - Broker busy
 * - Requote
 * - Off quotes
 * - Trade context busy
 *
 * @param code - MT4 error code
 * @returns True if error is retryable
 */
export function isMT4ErrorRetryable(code: number): boolean {
  return RETRYABLE_MT4_ERROR_CODES.has(code);
}

/**
 * Check if MT5 error code is retryable
 *
 * Retryable errors include:
 * - Requote
 * - Timeout
 * - Price changed
 * - Price off (no quotes)
 * - Too many requests
 * - Locked
 * - Connection issues
 *
 * @param code - MT5 error code (return code)
 * @returns True if error is retryable
 */
export function isMT5ErrorRetryable(code: number): boolean {
  return RETRYABLE_MT5_ERROR_CODES.has(code);
}
