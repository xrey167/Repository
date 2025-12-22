/**
 * Datafeed factory for creating adapter instances
 * Implements factory pattern for easy adapter swapping
 */

import type { IDatafeedAdapter, DatafeedConfig } from '@/core/types';
import { AdapterRegistry } from './adapter-registry';
import { MockAdapter, CSVAdapter, BinanceAdapter, CoinbaseAdapter } from '../adapters';
import { createLogger } from '@/utils';

const logger = createLogger('DatafeedFactory');

/**
 * Datafeed factory class
 * Creates datafeed adapters based on configuration
 *
 * @example
 * ```typescript
 * // Create a mock adapter
 * const adapter = DatafeedFactory.create({
 *   type: 'mock'
 * });
 *
 * // Create a CSV adapter
 * const csvAdapter = DatafeedFactory.create({
 *   type: 'csv',
 *   filePath: './data/historical'
 * });
 *
 * // Create a Binance adapter
 * const binanceAdapter = DatafeedFactory.create({
 *   type: 'binance',
 *   apiKey: 'your-key',
 *   apiSecret: 'your-secret'
 * });
 * ```
 */
export class DatafeedFactory {
  private static registry = AdapterRegistry.getInstance();
  private static initialized = false;

  /**
   * Initialize the factory (register default adapters)
   */
  private static initialize(): void {
    if (this.initialized) {
      return;
    }

    // Register built-in adapters
    this.registry.register('mock', MockAdapter);
    this.registry.register('csv', CSVAdapter);
    this.registry.register('binance', BinanceAdapter);
    this.registry.register('coinbase', CoinbaseAdapter);

    this.initialized = true;
    logger.debug('DatafeedFactory initialized with built-in adapters');
  }

  /**
   * Create a datafeed adapter
   * @param config - Adapter configuration
   * @returns Datafeed adapter instance
   *
   * @example
   * ```typescript
   * const adapter = DatafeedFactory.create({ type: 'mock' });
   * await adapter.connect();
   * const candles = await adapter.getCandles('BTCUSD', '1h', 100);
   * ```
   */
  static create(config: DatafeedConfig): IDatafeedAdapter {
    this.initialize();

    const AdapterClass = this.registry.get(config.type);

    if (!AdapterClass) {
      const available = this.registry.getTypes().join(', ');
      throw new Error(
        `Unknown adapter type: ${config.type}. Available types: ${available}`
      );
    }

    logger.info(`Creating ${config.type} adapter`);

    // Create adapter instance with config
    let adapter: IDatafeedAdapter;

    switch (config.type) {
      case 'mock':
        adapter = new AdapterClass();
        break;

      case 'csv':
        adapter = new AdapterClass(config.filePath || './data/historical');
        break;

      case 'binance':
      case 'coinbase':
        adapter = new AdapterClass({
          apiKey: config.apiKey,
          apiSecret: config.apiSecret,
          sandbox: config.sandbox,
        });
        break;

      default:
        // For custom adapters
        adapter = new AdapterClass(config);
        break;
    }

    logger.info(`Created ${config.type} adapter: ${adapter.name}`);
    return adapter;
  }

  /**
   * Register a custom adapter
   * @param type - Adapter type identifier
   * @param adapterClass - Adapter class constructor
   *
   * @example
   * ```typescript
   * class MyCustomAdapter extends BaseAdapter {
   *   // ... implementation
   * }
   *
   * DatafeedFactory.register('custom' as AdapterType, MyCustomAdapter);
   * const adapter = DatafeedFactory.create({ type: 'custom' as AdapterType });
   * ```
   */
  static register(
    type: string,
    adapterClass: new (...args: any[]) => IDatafeedAdapter
  ): void {
    this.initialize();
    this.registry.register(type as any, adapterClass);
    logger.info(`Registered custom adapter: ${type}`);
  }

  /**
   * Get all available adapter types
   * @returns Array of adapter type names
   */
  static getAvailableTypes(): string[] {
    this.initialize();
    return this.registry.getTypes();
  }

  /**
   * Check if an adapter type is available
   * @param type - Adapter type to check
   * @returns True if available
   */
  static hasAdapter(type: string): boolean {
    this.initialize();
    return this.registry.has(type as any);
  }
}
