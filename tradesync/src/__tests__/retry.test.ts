/**
 * Tests for TradeSync SDK Retry Logic
 */

import { describe, test, expect, beforeEach, afterEach, spyOn } from 'bun:test';
import {
  withRetry,
  withRetryResult,
  calculateDelay,
  calculateTotalMaxDelay,
  createRetryWrapper,
  DEFAULT_RETRY_CONFIG,
  type RetryConfig,
} from '../retry.js';
import { TradeSyncError, TransientError, PermanentError } from '../errors.js';

describe('DEFAULT_RETRY_CONFIG', () => {
  test('has expected default values', () => {
    expect(DEFAULT_RETRY_CONFIG.maxRetries).toBe(3);
    expect(DEFAULT_RETRY_CONFIG.initialDelayMs).toBe(1000);
    expect(DEFAULT_RETRY_CONFIG.maxDelayMs).toBe(10000);
    expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBe(2);
    expect(DEFAULT_RETRY_CONFIG.jitterFactor).toBe(0.1);
  });
});

describe('withRetry', () => {
  let consoleSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    consoleSpy = spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('succeeds on first attempt', async () => {
    const fn = async () => 'success';

    const result = await withRetry(fn, { maxRetries: 3 });

    expect(result).toBe('success');
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('retries on transient error and succeeds', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) {
        throw new TransientError('Temporary failure');
      }
      return 'success';
    };

    const result = await withRetry(fn, { maxRetries: 3, initialDelayMs: 10 });

    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  test('throws immediately on permanent error', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      throw new PermanentError('Bad request');
    };

    await expect(withRetry(fn, { maxRetries: 3 })).rejects.toThrow(TradeSyncError);
    expect(attempts).toBe(1);
  });

  test('throws after max retries exhausted', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      throw new TransientError('Always fails');
    };

    const promise = withRetry(fn, { maxRetries: 2, initialDelayMs: 10 });

    await expect(promise).rejects.toThrow(TradeSyncError);
    expect(attempts).toBe(3); // Initial + 2 retries
  });

  test('sets retriesExhausted flag when max retries reached', async () => {
    const fn = async () => {
      throw new TransientError('Always fails');
    };

    try {
      await withRetry(fn, { maxRetries: 1, initialDelayMs: 10 });
    } catch (error) {
      expect(error).toBeInstanceOf(TradeSyncError);
      expect((error as TradeSyncError).retriesExhausted).toBe(true);
      expect((error as TradeSyncError).retryable).toBe(false);
    }
  });

  test('applies exponential backoff', async () => {
    const delays: number[] = [];
    let attempts = 0;

    const fn = async () => {
      attempts++;
      if (attempts < 4) {
        throw new TransientError('Fail');
      }
      return 'success';
    };

    const originalSetTimeout = global.setTimeout;
    // @ts-expect-error - mocking setTimeout
    global.setTimeout = (callback: () => void, delay: number) => {
      delays.push(delay);
      return originalSetTimeout(callback, 1);
    };

    try {
      await withRetry(fn, {
        maxRetries: 3,
        initialDelayMs: 100,
        backoffMultiplier: 2,
        maxDelayMs: 10000,
        jitterFactor: 0,
      });

      // First retry: 100ms, second: 200ms, third: 400ms
      expect(delays.length).toBe(3);
      expect(delays[0]).toBe(100);
      expect(delays[1]).toBe(200);
      expect(delays[2]).toBe(400);
    } finally {
      global.setTimeout = originalSetTimeout;
    }
  });

  test('respects maxDelayMs', async () => {
    const delays: number[] = [];
    let attempts = 0;

    const fn = async () => {
      attempts++;
      if (attempts < 4) {
        throw new TransientError('Fail');
      }
      return 'success';
    };

    const originalSetTimeout = global.setTimeout;
    // @ts-expect-error - mocking setTimeout
    global.setTimeout = (callback: () => void, delay: number) => {
      delays.push(delay);
      return originalSetTimeout(callback, 1);
    };

    try {
      await withRetry(fn, {
        maxRetries: 3,
        initialDelayMs: 100,
        backoffMultiplier: 100, // Very aggressive
        maxDelayMs: 500,
        jitterFactor: 0,
      });

      // All delays should be capped at maxDelayMs
      expect(delays.every(d => d <= 500)).toBe(true);
    } finally {
      global.setTimeout = originalSetTimeout;
    }
  });

  test('uses custom operation name in error message', async () => {
    const fn = async () => {
      throw new PermanentError('Failed');
    };

    try {
      await withRetry(fn, { maxRetries: 0 }, 'custom_operation');
    } catch (error) {
      expect((error as TradeSyncError).message).toContain('custom_operation');
    }
  });

  test('handles non-Error throws', async () => {
    const fn = async () => {
      throw 'string error';
    };

    await expect(withRetry(fn, { maxRetries: 0 })).rejects.toThrow();
  });
});

describe('withRetryResult', () => {
  test('returns success result on first attempt', async () => {
    const fn = async () => 'success';

    const result = await withRetryResult(fn);

    expect(result.success).toBe(true);
    expect(result.result).toBe('success');
    expect(result.attempts).toBe(1);
    expect(result.totalDelayMs).toBe(0);
  });

  test('returns success after retries', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 2) {
        throw new TransientError('Fail');
      }
      return 'success';
    };

    const result = await withRetryResult(fn, { maxRetries: 3, initialDelayMs: 10 });

    expect(result.success).toBe(true);
    expect(result.result).toBe('success');
    expect(result.attempts).toBe(2);
    expect(result.totalDelayMs).toBeGreaterThan(0);
  });

  test('returns failure result on permanent error', async () => {
    const fn = async () => {
      throw new PermanentError('Bad request');
    };

    const result = await withRetryResult(fn);

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(TradeSyncError);
    expect(result.attempts).toBe(1);
  });

  test('returns failure result after max retries', async () => {
    const fn = async () => {
      throw new TransientError('Always fails');
    };

    const result = await withRetryResult(fn, { maxRetries: 2, initialDelayMs: 10 });

    expect(result.success).toBe(false);
    expect(result.error?.retriesExhausted).toBe(true);
    expect(result.attempts).toBe(3);
  });
});

describe('calculateDelay', () => {
  test('returns 0 for attempt 0', () => {
    expect(calculateDelay(0)).toBe(0);
  });

  test('returns initialDelayMs for attempt 1', () => {
    expect(calculateDelay(1, { initialDelayMs: 1000 })).toBe(1000);
  });

  test('applies exponential backoff', () => {
    const config: Partial<RetryConfig> = {
      initialDelayMs: 100,
      backoffMultiplier: 2,
      maxDelayMs: 10000,
    };

    expect(calculateDelay(1, config)).toBe(100);
    expect(calculateDelay(2, config)).toBe(200);
    expect(calculateDelay(3, config)).toBe(400);
    expect(calculateDelay(4, config)).toBe(800);
  });

  test('caps at maxDelayMs', () => {
    const config: Partial<RetryConfig> = {
      initialDelayMs: 1000,
      backoffMultiplier: 10,
      maxDelayMs: 5000,
    };

    expect(calculateDelay(3, config)).toBe(5000);
  });
});

describe('calculateTotalMaxDelay', () => {
  test('calculates total delay for default config', () => {
    // Default: 1000 + 2000 + 4000 = 7000 (3 retries)
    const total = calculateTotalMaxDelay();

    expect(total).toBe(7000);
  });

  test('calculates total delay for custom config', () => {
    // 100 + 200 + 400 = 700
    const total = calculateTotalMaxDelay({
      maxRetries: 3,
      initialDelayMs: 100,
      backoffMultiplier: 2,
      maxDelayMs: 10000,
    });

    expect(total).toBe(700);
  });

  test('respects maxDelayMs cap', () => {
    // 100 + 500 + 500 = 1100 (capped at 500)
    const total = calculateTotalMaxDelay({
      maxRetries: 3,
      initialDelayMs: 100,
      backoffMultiplier: 10,
      maxDelayMs: 500,
    });

    expect(total).toBe(1100);
  });
});

describe('createRetryWrapper', () => {
  test('creates a reusable retry wrapper', async () => {
    const wrapper = createRetryWrapper<string>({ maxRetries: 2, initialDelayMs: 10 });

    const result = await wrapper(async () => 'success');

    expect(result).toBe('success');
  });

  test('wrapper uses provided config', async () => {
    let attempts = 0;
    const wrapper = createRetryWrapper<string>({ maxRetries: 1, initialDelayMs: 10 });

    try {
      await wrapper(async () => {
        attempts++;
        throw new TransientError('Fail');
      });
    } catch {
      // Expected
    }

    expect(attempts).toBe(2); // Initial + 1 retry
  });
});
