/**
 * Datafeed types for adapter pattern implementation
 * Defines interfaces for fetching market data from various sources
 */

import type { Candle, Ticker, OrderBook, Symbol, Timeframe } from './market.types';
import type { Order, Position, Balance } from './trading.types';

/**
 * Available datafeed adapter types
 */
export type AdapterType = 'binance' | 'coinbase' | 'csv' | 'mock' | 'custom';

/**
 * Datafeed configuration
 */
export interface DatafeedConfig {
  /** Adapter type identifier */
  type: AdapterType;
  /** API key (for exchange adapters) */
  apiKey?: string;
  /** API secret (for exchange adapters) */
  apiSecret?: string;
  /** Use sandbox/testnet environment */
  sandbox?: boolean;
  /** Rate limit (requests per second) */
  rateLimit?: number;
  /** Enable caching */
  cacheEnabled?: boolean;
  /** Cache TTL in seconds */
  cacheTTL?: number;
  /** Custom adapter name */
  name?: string;
  /** Base URL for API (optional override) */
  baseUrl?: string;
  /** WebSocket URL (optional override) */
  wsUrl?: string;
  /** File path (for CSV adapter) */
  filePath?: string;
  /** Additional custom options */
  options?: Record<string, unknown>;
}

/**
 * Base datafeed adapter interface
 * All data source adapters must implement this interface
 *
 * @example
 * ```typescript
 * class MyAdapter implements IDatafeedAdapter {
 *   readonly type = 'custom';
 *   readonly name = 'MyAdapter';
 *
 *   async connect() { ... }
 *   async disconnect() { ... }
 *   isConnected() { return this.connected; }
 *   async getCandles(symbol, timeframe, limit) { ... }
 *   // ... implement other methods
 * }
 * ```
 */
export interface IDatafeedAdapter {
  /** Adapter type */
  readonly type: AdapterType;
  /** Adapter name */
  readonly name: string;

  /**
   * Connect to the data source
   */
  connect(): Promise<void>;

  /**
   * Disconnect from the data source
   */
  disconnect(): Promise<void>;

  /**
   * Check if connected
   */
  isConnected(): boolean;

  /**
   * Get historical candles
   * @param symbol - Trading symbol
   * @param timeframe - Candle timeframe
   * @param limit - Maximum number of candles to fetch
   * @returns Array of candles (newest first)
   */
  getCandles(symbol: string, timeframe: Timeframe, limit?: number): Promise<Candle[]>;

  /**
   * Get candles for a specific date range
   * @param symbol - Trading symbol
   * @param timeframe - Candle timeframe
   * @param start - Start timestamp in milliseconds
   * @param end - End timestamp in milliseconds
   * @returns Array of candles in the range
   */
  getCandlesRange(
    symbol: string,
    timeframe: Timeframe,
    start: number,
    end: number
  ): Promise<Candle[]>;

  /**
   * Get current ticker (bid/ask/last price)
   * @param symbol - Trading symbol
   * @returns Current ticker data
   */
  getTicker(symbol: string): Promise<Ticker>;

  /**
   * Get order book depth
   * @param symbol - Trading symbol
   * @param depth - Number of levels to fetch (optional)
   * @returns Order book data
   */
  getOrderBook(symbol: string, depth?: number): Promise<OrderBook>;

  /**
   * Get all available symbols
   * @returns Array of tradable symbols
   */
  getSymbols(): Promise<Symbol[]>;

  /**
   * Get information about a specific symbol
   * @param symbol - Trading symbol
   * @returns Symbol information
   */
  getSymbol(symbol: string): Promise<Symbol>;

  /**
   * Subscribe to real-time candle updates (optional)
   * @param symbol - Trading symbol
   * @param timeframe - Candle timeframe
   * @param callback - Function to call on each candle update
   */
  subscribeCandles?(
    symbol: string,
    timeframe: Timeframe,
    callback: (candle: Candle) => void
  ): void;

  /**
   * Subscribe to real-time ticker updates (optional)
   * @param symbol - Trading symbol
   * @param callback - Function to call on each ticker update
   */
  subscribeTicker?(symbol: string, callback: (ticker: Ticker) => void): void;

  /**
   * Unsubscribe from real-time updates (optional)
   * @param symbol - Trading symbol
   */
  unsubscribe?(symbol: string): void;

  /**
   * Unsubscribe from all updates (optional)
   */
  unsubscribeAll?(): void;
}

/**
 * Extended adapter interface for live trading (execution capabilities)
 * Adds order execution and account management on top of datafeed
 */
export interface ITradingAdapter extends IDatafeedAdapter {
  /**
   * Create a new order
   * @param order - Order parameters (without id, status, filled data)
   * @returns Created order with assigned ID
   */
  createOrder(
    order: Omit<Order, 'id' | 'status' | 'filledQuantity' | 'averagePrice' | 'timestamp'>
  ): Promise<Order>;

  /**
   * Cancel an existing order
   * @param orderId - Order ID to cancel
   */
  cancelOrder(orderId: string): Promise<void>;

  /**
   * Get order status
   * @param orderId - Order ID
   * @returns Current order state
   */
  getOrder(orderId: string): Promise<Order>;

  /**
   * Get all open orders
   * @param symbol - Filter by symbol (optional)
   * @returns Array of open orders
   */
  getOpenOrders(symbol?: string): Promise<Order[]>;

  /**
   * Get account balances
   * @returns Array of asset balances
   */
  getBalance(): Promise<Balance[]>;

  /**
   * Get current positions
   * @returns Array of open positions
   */
  getPositions(): Promise<Position[]>;
}

/**
 * Datafeed cache entry
 */
export interface CacheEntry<T> {
  /** Cached data */
  data: T;
  /** Cache timestamp */
  timestamp: number;
  /** Time to live in seconds */
  ttl: number;
}

/**
 * Datafeed cache interface
 */
export interface IDatafeedCache {
  /**
   * Get cached data
   * @param key - Cache key
   * @returns Cached data or undefined if not found/expired
   */
  get<T>(key: string): T | undefined;

  /**
   * Set cached data
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in seconds
   */
  set<T>(key: string, data: T, ttl: number): void;

  /**
   * Check if key exists and is not expired
   * @param key - Cache key
   * @returns True if cached and valid
   */
  has(key: string): boolean;

  /**
   * Delete cached entry
   * @param key - Cache key
   */
  delete(key: string): void;

  /**
   * Clear all cache
   */
  clear(): void;
}
