/**
 * Datafeed configuration
 * Settings for data source adapters and caching
 */

import { env } from './env';
import type { DatafeedConfig } from '@/core/types';

/**
 * Datafeed configurations for different adapters
 */
export const datafeedConfigs: Record<string, DatafeedConfig> = {
  // Mock adapter for testing
  mock: {
    type: 'mock',
    name: 'MockAdapter',
    cacheEnabled: false,
  },

  // CSV adapter for backtesting
  csv: {
    type: 'csv',
    name: 'CSVAdapter',
    filePath: env.CSV_DATA_PATH || './data/historical',
    cacheEnabled: true,
    cacheTTL: 3600, // 1 hour
  },

  // Binance exchange
  binance: {
    type: 'binance',
    name: 'BinanceAdapter',
    apiKey: env.BINANCE_API_KEY,
    apiSecret: env.BINANCE_API_SECRET,
    sandbox: env.BINANCE_SANDBOX === 'true',
    baseUrl: env.BINANCE_API_URL,
    wsUrl: env.BINANCE_WS_URL,
    rateLimit: 10, // 10 requests per second
    cacheEnabled: true,
    cacheTTL: 60, // 1 minute
  },

  // Coinbase exchange
  coinbase: {
    type: 'coinbase',
    name: 'CoinbaseAdapter',
    apiKey: env.COINBASE_API_KEY,
    apiSecret: env.COINBASE_API_SECRET,
    sandbox: env.COINBASE_SANDBOX === 'true',
    baseUrl: env.COINBASE_API_URL,
    wsUrl: env.COINBASE_WS_URL,
    rateLimit: 5, // 5 requests per second
    cacheEnabled: true,
    cacheTTL: 60,
  },
};

/**
 * Get datafeed configuration for a specific adapter
 * @param adapterName - Name of the adapter
 * @returns Datafeed configuration
 */
export function getDatafeedConfig(adapterName: string): DatafeedConfig {
  const config = datafeedConfigs[adapterName];
  if (!config) {
    throw new Error(`Unknown datafeed adapter: ${adapterName}`);
  }
  return config;
}

/**
 * Register a custom datafeed configuration
 * @param name - Configuration name
 * @param config - Datafeed configuration
 */
export function registerDatafeedConfig(name: string, config: DatafeedConfig): void {
  datafeedConfigs[name] = config;
}
