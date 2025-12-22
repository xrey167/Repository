/**
 * Datafeed-specific error classes
 */

/**
 * Base datafeed error
 */
export class DatafeedError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'DatafeedError';
    Object.setPrototypeOf(this, DatafeedError.prototype);
  }
}

/**
 * Connection error - thrown when unable to connect to data source
 */
export class ConnectionError extends DatafeedError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONNECTION_ERROR', details);
    this.name = 'ConnectionError';
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}

/**
 * Authentication error - thrown when API credentials are invalid
 */
export class AuthenticationError extends DatafeedError {
  constructor(message: string, details?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', details);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Rate limit error - thrown when API rate limit is exceeded
 */
export class RateLimitError extends DatafeedError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    details?: unknown
  ) {
    super(message, 'RATE_LIMIT_ERROR', details);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Invalid symbol error - thrown when symbol is not found or invalid
 */
export class InvalidSymbolError extends DatafeedError {
  constructor(
    public readonly symbol: string,
    details?: unknown
  ) {
    super(`Invalid or unknown symbol: ${symbol}`, 'INVALID_SYMBOL', details);
    this.name = 'InvalidSymbolError';
    Object.setPrototypeOf(this, InvalidSymbolError.prototype);
  }
}

/**
 * Data not available error - thrown when requested data is not available
 */
export class DataNotAvailableError extends DatafeedError {
  constructor(message: string, details?: unknown) {
    super(message, 'DATA_NOT_AVAILABLE', details);
    this.name = 'DataNotAvailableError';
    Object.setPrototypeOf(this, DataNotAvailableError.prototype);
  }
}

/**
 * Timeout error - thrown when request times out
 */
export class TimeoutError extends DatafeedError {
  constructor(
    message: string,
    public readonly timeoutMs: number,
    details?: unknown
  ) {
    super(message, 'TIMEOUT_ERROR', details);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Network error - thrown when network request fails
 */
export class NetworkError extends DatafeedError {
  constructor(message: string, details?: unknown) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Parse error - thrown when response data cannot be parsed
 */
export class ParseError extends DatafeedError {
  constructor(message: string, details?: unknown) {
    super(message, 'PARSE_ERROR', details);
    this.name = 'ParseError';
    Object.setPrototypeOf(this, ParseError.prototype);
  }
}
