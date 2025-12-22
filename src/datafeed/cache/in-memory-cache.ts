/**
 * In-memory cache implementation for datafeed data
 * Simple TTL-based caching with automatic expiry
 */

import type { IDatafeedCache, CacheEntry } from '@/core/types';
import { createLogger } from '@/utils';

/**
 * In-memory cache for datafeed data
 * Implements time-to-live (TTL) based expiry
 */
export class InMemoryCache implements IDatafeedCache {
  private cache: Map<string, CacheEntry<any>>;
  private logger = createLogger('InMemoryCache');
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(cleanupIntervalMs: number = 60000) {
    this.cache = new Map();

    // Start automatic cleanup of expired entries
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, cleanupIntervalMs);
  }

  /**
   * Get cached data
   * @param key - Cache key
   * @returns Cached data or undefined if not found/expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.logger.debug(`Cache expired: ${key}`);
      return undefined;
    }

    this.logger.debug(`Cache hit: ${key}`);
    return entry.data as T;
  }

  /**
   * Set cached data
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in seconds
   */
  set<T>(key: string, data: T, ttl: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(key, entry);
    this.logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
  }

  /**
   * Check if key exists and is not expired
   * @param key - Cache key
   * @returns True if cached and valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete cached entry
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
    this.logger.debug(`Cache deleted: ${key}`);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.logger.debug('Cache cleared');
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    const age = Date.now() - entry.timestamp;
    const maxAge = entry.ttl * 1000; // Convert seconds to milliseconds
    return age > maxAge;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.debug(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  getStats(): {
    size: number;
    keys: string[];
    oldest: number | null;
    newest: number | null;
  } {
    let oldest: number | null = null;
    let newest: number | null = null;

    for (const entry of this.cache.values()) {
      if (oldest === null || entry.timestamp < oldest) {
        oldest = entry.timestamp;
      }
      if (newest === null || entry.timestamp > newest) {
        newest = entry.timestamp;
      }
    }

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      oldest,
      newest,
    };
  }

  /**
   * Stop automatic cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
    this.logger.debug('Cache destroyed');
  }
}
