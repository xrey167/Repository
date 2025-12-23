/**
 * Rate Limiter
 *
 * Client-side rate limiting for TradeSync API requests.
 * Supports both client-side throttling and server-enforced limits.
 */

import type { RateLimitInfo, RateLimiterConfig } from './types.js';

/**
 * Default rate limiter configuration
 */
const DEFAULT_CONFIG: Required<RateLimiterConfig> = {
  requestsPerSecond: 10,
  respectServerLimits: true,
  maxQueueSize: 100,
};

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Rate Limiter
 *
 * Provides client-side rate limiting with sliding window algorithm.
 * Also respects server-provided rate limit headers.
 */
export class RateLimiter {
  private readonly config: Required<RateLimiterConfig>;
  private requestTimestamps: number[] = [];
  private serverRetryAfterMs: number | null = null;
  private serverRetryAfterSetAt: number | null = null;
  private pendingRequests = 0;

  // Rate limit info from server headers
  private remaining: number | null = null;
  private limit: number | null = null;
  private resetAt: Date | null = null;

  /**
   * Create a new RateLimiter
   *
   * @param config - Rate limiter configuration
   */
  constructor(config: RateLimiterConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Acquire permission to make a request
   * Waits if rate limit would be exceeded
   *
   * @throws Error if queue is full
   */
  async acquire(): Promise<void> {
    // Check queue size
    if (this.pendingRequests >= this.config.maxQueueSize) {
      throw new Error(
        `Rate limiter queue full (${this.config.maxQueueSize} pending requests)`
      );
    }

    this.pendingRequests++;

    try {
      // Check if server requested a retry-after delay
      if (this.serverRetryAfterMs !== null && this.serverRetryAfterSetAt !== null) {
        const elapsed = Date.now() - this.serverRetryAfterSetAt;
        const remainingDelay = this.serverRetryAfterMs - elapsed;

        if (remainingDelay > 0) {
          await sleep(remainingDelay);
        }

        // Clear server retry-after after waiting
        this.serverRetryAfterMs = null;
        this.serverRetryAfterSetAt = null;
      }

      // Client-side rate limiting with sliding window
      await this.waitForSlot();
    } finally {
      this.pendingRequests--;
    }
  }

  /**
   * Wait for a slot in the rate limit window
   */
  private async waitForSlot(): Promise<void> {
    const now = Date.now();
    const windowMs = 1000; // 1 second window

    // Clean up old timestamps
    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => now - ts < windowMs
    );

    // Check if we're at the limit
    if (this.requestTimestamps.length >= this.config.requestsPerSecond) {
      // Calculate how long to wait
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = windowMs - (now - oldestTimestamp);

      if (waitTime > 0) {
        await sleep(waitTime);
        // Clean up again after waiting
        const newNow = Date.now();
        this.requestTimestamps = this.requestTimestamps.filter(
          (ts) => newNow - ts < windowMs
        );
      }
    }

    // Record this request
    this.requestTimestamps.push(Date.now());
  }

  /**
   * Record a rate limit response from the server
   *
   * @param retryAfterMs - The Retry-After value in milliseconds
   */
  recordRateLimitResponse(retryAfterMs: number): void {
    if (this.config.respectServerLimits) {
      this.serverRetryAfterMs = retryAfterMs;
      this.serverRetryAfterSetAt = Date.now();
    }
  }

  /**
   * Update rate limit info from response headers
   *
   * @param headers - Response headers
   */
  updateFromHeaders(headers: Headers): void {
    // Parse X-RateLimit-Remaining
    const remaining = headers.get('x-ratelimit-remaining');
    if (remaining !== null) {
      this.remaining = parseInt(remaining, 10);
    }

    // Parse X-RateLimit-Limit
    const limit = headers.get('x-ratelimit-limit');
    if (limit !== null) {
      this.limit = parseInt(limit, 10);
    }

    // Parse X-RateLimit-Reset (Unix timestamp)
    const reset = headers.get('x-ratelimit-reset');
    if (reset !== null) {
      const resetTimestamp = parseInt(reset, 10);
      // Could be seconds or milliseconds, check if it's realistic
      if (resetTimestamp > 1e12) {
        // Already in milliseconds
        this.resetAt = new Date(resetTimestamp);
      } else {
        // In seconds, convert to milliseconds
        this.resetAt = new Date(resetTimestamp * 1000);
      }
    }

    // Parse Retry-After (could be seconds or date)
    const retryAfter = headers.get('retry-after');
    if (retryAfter !== null) {
      const seconds = parseInt(retryAfter, 10);
      if (!isNaN(seconds)) {
        this.recordRateLimitResponse(seconds * 1000);
      }
    }
  }

  /**
   * Get current rate limit info
   */
  getInfo(): RateLimitInfo {
    return {
      remaining: this.remaining,
      limit: this.limit,
      resetAt: this.resetAt,
      retryAfterMs: this.serverRetryAfterMs,
    };
  }

  /**
   * Get the number of pending requests in the queue
   */
  getPendingCount(): number {
    return this.pendingRequests;
  }

  /**
   * Get current requests per second usage
   */
  getCurrentRate(): number {
    const now = Date.now();
    const windowMs = 1000;
    return this.requestTimestamps.filter((ts) => now - ts < windowMs).length;
  }

  /**
   * Check if currently rate limited by server
   */
  isServerRateLimited(): boolean {
    if (this.serverRetryAfterMs === null || this.serverRetryAfterSetAt === null) {
      return false;
    }
    const elapsed = Date.now() - this.serverRetryAfterSetAt;
    return elapsed < this.serverRetryAfterMs;
  }

  /**
   * Reset the rate limiter state
   */
  reset(): void {
    this.requestTimestamps = [];
    this.serverRetryAfterMs = null;
    this.serverRetryAfterSetAt = null;
    this.remaining = null;
    this.limit = null;
    this.resetAt = null;
  }
}
