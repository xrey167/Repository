/**
 * Base adapter abstract class
 * Provides common functionality for all datafeed adapters
 */

import type {
  IDatafeedAdapter,
  AdapterType,
  Candle,
  Ticker,
  OrderBook,
  Symbol,
  Timeframe,
} from '@/core/types';
import { createLogger, type Logger } from '@/utils';
import { ConnectionError, DataNotAvailableError } from '@/core/errors';

/**
 * Abstract base class for datafeed adapters
 * Implements common connection state management and logging
 */
export abstract class BaseAdapter implements IDatafeedAdapter {
  protected connected: boolean = false;
  protected logger: Logger;

  abstract readonly type: AdapterType;
  abstract readonly name: string;

  constructor() {
    this.logger = createLogger(`DataFeed:${this.constructor.name}`);
  }

  /**
   * Check if adapter is connected
   */
  public isConnected(): boolean {
    return this.connected;
  }

  /**
   * Ensure adapter is connected before operations
   * @throws ConnectionError if not connected
   */
  protected ensureConnected(): void {
    if (!this.connected) {
      throw new ConnectionError(`${this.name} is not connected`);
    }
  }

  /**
   * Connect to data source
   * Override this in derived classes
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnect from data source
   * Override this in derived classes
   */
  abstract disconnect(): Promise<void>;

  /**
   * Get historical candles
   * Override this in derived classes
   */
  abstract getCandles(
    symbol: string,
    timeframe: Timeframe,
    limit?: number
  ): Promise<Candle[]>;

  /**
   * Get candles for a specific date range
   * Override this in derived classes
   */
  abstract getCandlesRange(
    symbol: string,
    timeframe: Timeframe,
    start: number,
    end: number
  ): Promise<Candle[]>;

  /**
   * Get current ticker
   * Override this in derived classes
   */
  abstract getTicker(symbol: string): Promise<Ticker>;

  /**
   * Get order book depth
   * Override this in derived classes
   */
  abstract getOrderBook(symbol: string, depth?: number): Promise<OrderBook>;

  /**
   * Get all available symbols
   * Override this in derived classes
   */
  abstract getSymbols(): Promise<Symbol[]>;

  /**
   * Get specific symbol information
   * Default implementation uses getSymbols()
   */
  async getSymbol(symbol: string): Promise<Symbol> {
    const symbols = await this.getSymbols();
    const found = symbols.find((s) => s.symbol === symbol);
    if (!found) {
      throw new DataNotAvailableError(`Symbol not found: ${symbol}`);
    }
    return found;
  }

  /**
   * Optional: Subscribe to real-time candle updates
   * Override in derived classes if supported
   */
  subscribeCandles?(
    symbol: string,
    timeframe: Timeframe,
    callback: (candle: Candle) => void
  ): void;

  /**
   * Optional: Subscribe to real-time ticker updates
   * Override in derived classes if supported
   */
  subscribeTicker?(symbol: string, callback: (ticker: Ticker) => void): void;

  /**
   * Optional: Unsubscribe from updates
   * Override in derived classes if supported
   */
  unsubscribe?(symbol: string): void;

  /**
   * Optional: Unsubscribe from all updates
   * Override in derived classes if supported
   */
  unsubscribeAll?(): void;
}
