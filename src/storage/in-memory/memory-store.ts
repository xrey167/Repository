/**
 * In-memory key-value store
 * Simple and fast storage for runtime data
 */

import { createLogger } from '@/utils';

/**
 * In-memory key-value store
 * Thread-safe singleton implementation
 */
export class MemoryStore {
  private static instance: MemoryStore;
  private store: Map<string, any>;
  private logger = createLogger('MemoryStore');

  private constructor() {
    this.store = new Map();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  /**
   * Set value
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T>(key: string, value: T): void {
    this.store.set(key, value);
    this.logger.debug(`Set key: ${key}`);
  }

  /**
   * Get value
   * @param key - Storage key
   * @returns Value or undefined if not found
   */
  get<T>(key: string): T | undefined {
    return this.store.get(key);
  }

  /**
   * Check if key exists
   * @param key - Storage key
   */
  has(key: string): boolean {
    return this.store.has(key);
  }

  /**
   * Delete value
   * @param key - Storage key
   */
  delete(key: string): void {
    this.store.delete(key);
    this.logger.debug(`Deleted key: ${key}`);
  }

  /**
   * Clear all values
   */
  clear(): void {
    this.store.clear();
    this.logger.debug('Store cleared');
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.store.keys());
  }

  /**
   * Get all values
   */
  values<T>(): T[] {
    return Array.from(this.store.values());
  }

  /**
   * Get all entries
   */
  entries<T>(): [string, T][] {
    return Array.from(this.store.entries());
  }

  /**
   * Get store size
   */
  size(): number {
    return this.store.size;
  }

  /**
   * Set multiple values
   * @param entries - Key-value pairs
   */
  setMany<T>(entries: Record<string, T>): void {
    for (const [key, value] of Object.entries(entries)) {
      this.store.set(key, value);
    }
    this.logger.debug(`Set ${Object.keys(entries).length} keys`);
  }

  /**
   * Get multiple values
   * @param keys - Keys to retrieve
   */
  getMany<T>(keys: string[]): Record<string, T> {
    const result: Record<string, T> = {};
    for (const key of keys) {
      const value = this.store.get(key);
      if (value !== undefined) {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Get values by prefix
   * @param prefix - Key prefix
   */
  getByPrefix<T>(prefix: string): Record<string, T> {
    const result: Record<string, T> = {};
    for (const [key, value] of this.store.entries()) {
      if (key.startsWith(prefix)) {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Delete values by prefix
   * @param prefix - Key prefix
   */
  deleteByPrefix(prefix: string): number {
    let count = 0;
    const keysToDelete: string[] = [];

    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.store.delete(key);
      count++;
    }

    this.logger.debug(`Deleted ${count} keys with prefix: ${prefix}`);
    return count;
  }
}

/**
 * Get memory store instance
 */
export function getMemoryStore(): MemoryStore {
  return MemoryStore.getInstance();
}
