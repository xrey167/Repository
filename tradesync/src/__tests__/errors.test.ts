/**
 * Tests for TradeSync SDK Error Classes
 */

import { describe, test, expect } from 'bun:test';
import {
  TradeSyncError,
  TransientError,
  PermanentError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  TimeoutError,
  NetworkError,
  isRetryableError,
  isRetryableStatusCode,
  wrapError,
} from '../errors.js';

describe('TradeSyncError', () => {
  test('creates error with all properties', () => {
    const originalError = new Error('Original error');
    const error = new TradeSyncError(
      'Test error',
      'TEST_CODE',
      true,
      500,
      originalError,
      false
    );

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.retryable).toBe(true);
    expect(error.statusCode).toBe(500);
    expect(error.originalError).toBe(originalError);
    expect(error.retriesExhausted).toBe(false);
    expect(error.name).toBe('TradeSyncError');
    expect(error instanceof Error).toBe(true);
  });

  test('fromResponse creates TransientError for 429', () => {
    const error = TradeSyncError.fromResponse(429, 'Rate limit');

    expect(error).toBeInstanceOf(TransientError);
    expect(error.retryable).toBe(true);
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMIT');
  });

  test('fromResponse creates TransientError for 500', () => {
    const error = TradeSyncError.fromResponse(500, 'Server error');

    expect(error).toBeInstanceOf(TransientError);
    expect(error.retryable).toBe(true);
    expect(error.statusCode).toBe(500);
  });

  test('fromResponse creates TransientError for 502', () => {
    const error = TradeSyncError.fromResponse(502, 'Bad gateway');

    expect(error).toBeInstanceOf(TransientError);
    expect(error.code).toBe('BAD_GATEWAY');
  });

  test('fromResponse creates TransientError for 503', () => {
    const error = TradeSyncError.fromResponse(503, 'Service unavailable');

    expect(error).toBeInstanceOf(TransientError);
    expect(error.code).toBe('SERVICE_UNAVAILABLE');
  });

  test('fromResponse creates TransientError for 504', () => {
    const error = TradeSyncError.fromResponse(504, 'Gateway timeout');

    expect(error).toBeInstanceOf(TransientError);
    expect(error.code).toBe('GATEWAY_TIMEOUT');
  });

  test('fromResponse creates PermanentError for 400', () => {
    const error = TradeSyncError.fromResponse(400, 'Bad request');

    expect(error).toBeInstanceOf(PermanentError);
    expect(error.retryable).toBe(false);
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
  });

  test('fromResponse creates PermanentError for 401', () => {
    const error = TradeSyncError.fromResponse(401, 'Unauthorized');

    expect(error).toBeInstanceOf(PermanentError);
    expect(error.code).toBe('UNAUTHORIZED');
  });

  test('fromResponse creates PermanentError for 403', () => {
    const error = TradeSyncError.fromResponse(403, 'Forbidden');

    expect(error).toBeInstanceOf(PermanentError);
    expect(error.code).toBe('FORBIDDEN');
  });

  test('fromResponse creates PermanentError for 404', () => {
    const error = TradeSyncError.fromResponse(404, 'Not found');

    expect(error).toBeInstanceOf(PermanentError);
    expect(error.code).toBe('NOT_FOUND');
  });
});

describe('TransientError', () => {
  test('is always retryable', () => {
    const error = new TransientError('Test');

    expect(error.retryable).toBe(true);
    expect(error.name).toBe('TransientError');
    expect(error).toBeInstanceOf(TradeSyncError);
  });

  test('accepts custom code and status', () => {
    const error = new TransientError('Test', 'CUSTOM_CODE', 503);

    expect(error.code).toBe('CUSTOM_CODE');
    expect(error.statusCode).toBe(503);
  });
});

describe('PermanentError', () => {
  test('is never retryable', () => {
    const error = new PermanentError('Test');

    expect(error.retryable).toBe(false);
    expect(error.name).toBe('PermanentError');
    expect(error).toBeInstanceOf(TradeSyncError);
  });
});

describe('AuthenticationError', () => {
  test('has correct defaults', () => {
    const error = new AuthenticationError();

    expect(error.message).toBe('Authentication failed');
    expect(error.code).toBe('AUTH_ERROR');
    expect(error.statusCode).toBe(401);
    expect(error.retryable).toBe(false);
    expect(error.name).toBe('AuthenticationError');
  });

  test('accepts custom message', () => {
    const error = new AuthenticationError('Invalid API key');

    expect(error.message).toBe('Invalid API key');
  });
});

describe('RateLimitError', () => {
  test('is retryable with retry after', () => {
    const error = new RateLimitError('Rate limit exceeded', 5000);

    expect(error.retryable).toBe(true);
    expect(error.retryAfterMs).toBe(5000);
    expect(error.statusCode).toBe(429);
    expect(error.name).toBe('RateLimitError');
  });
});

describe('ValidationError', () => {
  test('includes validation errors', () => {
    const validationErrors = {
      email: ['Invalid email format'],
      name: ['Name is required'],
    };
    const error = new ValidationError('Validation failed', validationErrors);

    expect(error.validationErrors).toEqual(validationErrors);
    expect(error.statusCode).toBe(400);
    expect(error.retryable).toBe(false);
    expect(error.name).toBe('ValidationError');
  });
});

describe('NotFoundError', () => {
  test('includes resource information', () => {
    const error = new NotFoundError('Account not found', 'account', '123');

    expect(error.resourceType).toBe('account');
    expect(error.resourceId).toBe('123');
    expect(error.statusCode).toBe(404);
    expect(error.name).toBe('NotFoundError');
  });
});

describe('TimeoutError', () => {
  test('is retryable with timeout info', () => {
    const error = new TimeoutError('Request timed out', 30000);

    expect(error.timeoutMs).toBe(30000);
    expect(error.retryable).toBe(true);
    expect(error.name).toBe('TimeoutError');
  });
});

describe('NetworkError', () => {
  test('is retryable', () => {
    const error = new NetworkError('Connection refused');

    expect(error.retryable).toBe(true);
    expect(error.name).toBe('NetworkError');
  });
});

describe('isRetryableError', () => {
  test('returns true for TransientError', () => {
    expect(isRetryableError(new TransientError('Test'))).toBe(true);
  });

  test('returns false for PermanentError', () => {
    expect(isRetryableError(new PermanentError('Test'))).toBe(false);
  });

  test('returns false for exhausted TradeSyncError', () => {
    const error = new TradeSyncError('Test', 'CODE', true, undefined, undefined, true);
    expect(isRetryableError(error)).toBe(false);
  });

  test('returns true for network errors', () => {
    expect(isRetryableError(new Error('ECONNREFUSED'))).toBe(true);
    expect(isRetryableError(new Error('ECONNRESET'))).toBe(true);
    expect(isRetryableError(new Error('ENOTFOUND'))).toBe(true);
    expect(isRetryableError(new Error('ETIMEDOUT'))).toBe(true);
  });

  test('returns true for timeout errors', () => {
    expect(isRetryableError(new Error('Request timeout'))).toBe(true);
    expect(isRetryableError(new Error('Socket hang up'))).toBe(true);
  });

  test('returns true for rate limit errors', () => {
    expect(isRetryableError(new Error('429 Too Many Requests'))).toBe(true);
    expect(isRetryableError(new Error('Rate limit exceeded'))).toBe(true);
  });

  test('returns true for server errors', () => {
    expect(isRetryableError(new Error('500 Internal Server Error'))).toBe(true);
    expect(isRetryableError(new Error('502 Bad Gateway'))).toBe(true);
    expect(isRetryableError(new Error('503 Service Unavailable'))).toBe(true);
    expect(isRetryableError(new Error('504 Gateway Timeout'))).toBe(true);
  });

  test('returns false for client errors', () => {
    expect(isRetryableError(new Error('400 Bad Request'))).toBe(false);
    expect(isRetryableError(new Error('401 Unauthorized'))).toBe(false);
    expect(isRetryableError(new Error('404 Not Found'))).toBe(false);
  });

  test('returns true for error with retryable status code', () => {
    const error: Error & { status?: number } = new Error('Test');
    error.status = 503;
    expect(isRetryableError(error)).toBe(true);
  });

  test('returns false for error with non-retryable status code', () => {
    const error: Error & { status?: number } = new Error('Test');
    error.status = 400;
    expect(isRetryableError(error)).toBe(false);
  });

  test('returns false for non-Error values', () => {
    expect(isRetryableError('string error')).toBe(false);
    expect(isRetryableError(123)).toBe(false);
    expect(isRetryableError(null)).toBe(false);
    expect(isRetryableError(undefined)).toBe(false);
  });
});

describe('isRetryableStatusCode', () => {
  test('returns true for 429', () => {
    expect(isRetryableStatusCode(429)).toBe(true);
  });

  test('returns true for 5xx errors', () => {
    expect(isRetryableStatusCode(500)).toBe(true);
    expect(isRetryableStatusCode(502)).toBe(true);
    expect(isRetryableStatusCode(503)).toBe(true);
    expect(isRetryableStatusCode(504)).toBe(true);
  });

  test('returns false for 4xx errors (except 429)', () => {
    expect(isRetryableStatusCode(400)).toBe(false);
    expect(isRetryableStatusCode(401)).toBe(false);
    expect(isRetryableStatusCode(403)).toBe(false);
    expect(isRetryableStatusCode(404)).toBe(false);
  });

  test('returns false for success codes', () => {
    expect(isRetryableStatusCode(200)).toBe(false);
    expect(isRetryableStatusCode(201)).toBe(false);
    expect(isRetryableStatusCode(204)).toBe(false);
  });
});

describe('wrapError', () => {
  test('returns TradeSyncError as-is', () => {
    const error = new TradeSyncError('Test', 'CODE', true);
    expect(wrapError(error)).toBe(error);
  });

  test('wraps retryable Error as TransientError', () => {
    const error = new Error('Connection refused: ECONNREFUSED');
    const wrapped = wrapError(error);

    expect(wrapped).toBeInstanceOf(TransientError);
    expect(wrapped.originalError).toBe(error);
  });

  test('wraps non-retryable Error as PermanentError', () => {
    const error = new Error('Bad request');
    const wrapped = wrapError(error);

    expect(wrapped).toBeInstanceOf(PermanentError);
    expect(wrapped.originalError).toBe(error);
  });

  test('wraps non-Error as PermanentError', () => {
    const wrapped = wrapError('string error');

    expect(wrapped).toBeInstanceOf(PermanentError);
    expect(wrapped.message).toBe('string error');
  });

  test('uses custom message if provided', () => {
    const error = new Error('Original message');
    const wrapped = wrapError(error, 'Custom message');

    expect(wrapped.message).toBe('Custom message');
  });
});
