/**
 * Adapter registry for managing datafeed adapters
 * Allows runtime registration and lookup of adapters
 */

import type { IDatafeedAdapter, AdapterType } from '@/core/types';
import { createLogger } from '@/utils';

/**
 * Adapter constructor type
 */
type AdapterConstructor = new (...args: any[]) => IDatafeedAdapter;

/**
 * Adapter registry singleton
 * Manages registration and retrieval of datafeed adapters
 */
export class AdapterRegistry {
  private static instance: AdapterRegistry;
  private adapters: Map<AdapterType, AdapterConstructor>;
  private logger = createLogger('AdapterRegistry');

  private constructor() {
    this.adapters = new Map();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }

  /**
   * Register an adapter
   * @param type - Adapter type identifier
   * @param constructor - Adapter class constructor
   */
  register(type: AdapterType, constructor: AdapterConstructor): void {
    if (this.adapters.has(type)) {
      this.logger.warn(`Overwriting existing adapter: ${type}`);
    }

    this.adapters.set(type, constructor);
    this.logger.debug(`Registered adapter: ${type}`);
  }

  /**
   * Get adapter constructor
   * @param type - Adapter type
   * @returns Adapter constructor
   */
  get(type: AdapterType): AdapterConstructor | undefined {
    return this.adapters.get(type);
  }

  /**
   * Check if adapter is registered
   * @param type - Adapter type
   * @returns True if registered
   */
  has(type: AdapterType): boolean {
    return this.adapters.has(type);
  }

  /**
   * Get all registered adapter types
   * @returns Array of adapter types
   */
  getTypes(): AdapterType[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Unregister an adapter
   * @param type - Adapter type
   */
  unregister(type: AdapterType): void {
    this.adapters.delete(type);
    this.logger.debug(`Unregistered adapter: ${type}`);
  }

  /**
   * Clear all registered adapters
   */
  clear(): void {
    this.adapters.clear();
    this.logger.debug('Cleared all adapters');
  }
}

/**
 * Get the adapter registry instance
 */
export function getAdapterRegistry(): AdapterRegistry {
  return AdapterRegistry.getInstance();
}
