/**
 * Binance exchange adapter (stub implementation)
 * TODO: Implement actual Binance API integration
 */

import { BaseAdapter } from './base-adapter';
import type { Candle, Ticker, OrderBook, Symbol, Timeframe } from '@/core/types';
import { DataNotAvailableError } from '@/core/errors';

/**
 * Binance exchange datafeed adapter
 *
 * This is a stub implementation. To use Binance:
 * 1. Install binance API client: bun add binance-api-node
 * 2. Implement REST API calls for market data
 * 3. Implement WebSocket subscriptions for real-time data
 * 4. Add rate limiting and error handling
 *
 * @see https://binance-docs.github.io/apidocs/spot/en/
 */
export class BinanceAdapter extends BaseAdapter {
  readonly type = 'binance' as const;
  readonly name = 'BinanceAdapter';

  private apiKey?: string;
  private apiSecret?: string;
  private sandbox: boolean;

  constructor(config?: { apiKey?: string; apiSecret?: string; sandbox?: boolean }) {
    super();
    this.apiKey = config?.apiKey;
    this.apiSecret = config?.apiSecret;
    this.sandbox = config?.sandbox || false;
  }

  async connect(): Promise<void> {
    this.logger.warn('BinanceAdapter is a stub implementation');
    throw new DataNotAvailableError(
      'Binance adapter not yet implemented. Use MockAdapter or CSVAdapter for now.'
    );
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async getCandles(
    symbol: string,
    timeframe: Timeframe,
    limit?: number
  ): Promise<Candle[]> {
    throw new DataNotAvailableError('Binance adapter not yet implemented');
  }

  async getCandlesRange(
    symbol: string,
    timeframe: Timeframe,
    start: number,
    end: number
  ): Promise<Candle[]> {
    throw new DataNotAvailableError('Binance adapter not yet implemented');
  }

  async getTicker(symbol: string): Promise<Ticker> {
    throw new DataNotAvailableError('Binance adapter not yet implemented');
  }

  async getOrderBook(symbol: string, depth?: number): Promise<OrderBook> {
    throw new DataNotAvailableError('Binance adapter not yet implemented');
  }

  async getSymbols(): Promise<Symbol[]> {
    throw new DataNotAvailableError('Binance adapter not yet implemented');
  }
}

/**
 * TODO: Implementation guide for Binance adapter
 *
 * Example implementation structure:
 *
 * ```typescript
 * import Binance from 'binance-api-node';
 *
 * export class BinanceAdapter extends BaseAdapter {
 *   private client: ReturnType<typeof Binance>;
 *
 *   async connect() {
 *     this.client = Binance({
 *       apiKey: this.apiKey,
 *       apiSecret: this.apiSecret,
 *       httpBase: this.sandbox ? 'https://testnet.binance.vision' : undefined,
 *     });
 *     await this.client.ping(); // Test connection
 *     this.connected = true;
 *   }
 *
 *   async getCandles(symbol, timeframe, limit = 100) {
 *     const candles = await this.client.candles({
 *       symbol: symbol.replace('/', ''),
 *       interval: timeframe,
 *       limit,
 *     });
 *     return candles.map(c => ({
 *       timestamp: c.openTime,
 *       open: parseFloat(c.open),
 *       high: parseFloat(c.high),
 *       low: parseFloat(c.low),
 *       close: parseFloat(c.close),
 *       volume: parseFloat(c.volume),
 *       symbol,
 *       timeframe,
 *     }));
 *   }
 * }
 * ```
 */
