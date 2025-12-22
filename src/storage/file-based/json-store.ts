/**
 * JSON file-based storage
 * Persists data to JSON files
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { createLogger } from '@/utils';

/**
 * JSON store options
 */
export interface JSONStoreOptions {
  /**
   * File path for JSON storage
   */
  filePath: string;

  /**
   * Pretty print JSON (default: true)
   */
  pretty?: boolean;

  /**
   * Auto-save on every set (default: false)
   */
  autoSave?: boolean;
}

/**
 * JSON file-based store
 * Persists key-value data to JSON files
 */
export class JSONStore {
  private filePath: string;
  private pretty: boolean;
  private autoSave: boolean;
  private data: Record<string, any> = {};
  private logger = createLogger('JSONStore');

  constructor(options: JSONStoreOptions) {
    this.filePath = options.filePath;
    this.pretty = options.pretty ?? true;
    this.autoSave = options.autoSave ?? false;

    this.load();
  }

  /**
   * Load data from file
   */
  load(): void {
    try {
      if (existsSync(this.filePath)) {
        const content = readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(content);
        this.logger.debug(`Loaded data from ${this.filePath}`);
      } else {
        this.data = {};
        this.logger.debug(`No existing file at ${this.filePath}, starting fresh`);
      }
    } catch (error) {
      this.logger.error(`Failed to load from ${this.filePath}`, error);
      this.data = {};
    }
  }

  /**
   * Save data to file
   */
  save(): void {
    try {
      // Ensure directory exists
      const dir = dirname(this.filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const content = this.pretty
        ? JSON.stringify(this.data, null, 2)
        : JSON.stringify(this.data);

      writeFileSync(this.filePath, content, 'utf-8');
      this.logger.debug(`Saved data to ${this.filePath}`);
    } catch (error) {
      this.logger.error(`Failed to save to ${this.filePath}`, error);
      throw error;
    }
  }

  /**
   * Set value
   */
  set<T>(key: string, value: T): void {
    this.data[key] = value;
    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Get value
   */
  get<T>(key: string): T | undefined {
    return this.data[key];
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return key in this.data;
  }

  /**
   * Delete key
   */
  delete(key: string): void {
    delete this.data[key];
    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.data = {};
    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Object.keys(this.data);
  }

  /**
   * Get all values
   */
  values<T>(): T[] {
    return Object.values(this.data);
  }

  /**
   * Get all data
   */
  getAll(): Record<string, any> {
    return { ...this.data };
  }

  /**
   * Set multiple values
   */
  setMany<T>(entries: Record<string, T>): void {
    Object.assign(this.data, entries);
    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Get file path
   */
  getFilePath(): string {
    return this.filePath;
  }
}
