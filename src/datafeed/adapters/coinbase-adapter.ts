/**
 * Coinbase exchange adapter (stub implementation)
 * TODO: Implement actual Coinbase API integration
 */

import { BaseAdapter } from './base-adapter';
import type { Candle, Ticker, OrderBook, Symbol, Timeframe } from '@/core/types';
import { DataNotAvailableError } from '@/core/errors';

/**
 * Coinbase exchange datafeed adapter
 *
 * This is a stub implementation. To use Coinbase:
 * 1. Install coinbase SDK: bun add coinbase-pro
 * 2. Implement REST API calls for market data
 * 3. Implement WebSocket subscriptions for real-time data
 * 4. Handle Coinbase-specific timeframe formats
 *
 * @see https://docs.cloud.coinbase.com/exchange/docs
 */
export class CoinbaseAdapter extends BaseAdapter {
  readonly type = 'coinbase' as const;
  readonly name = 'CoinbaseAdapter';

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
    this.logger.warn('CoinbaseAdapter is a stub implementation');
    throw new DataNotAvailableError(
      'Coinbase adapter not yet implemented. Use MockAdapter or CSVAdapter for now.'
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
    throw new DataNotAvailableError('Coinbase adapter not yet implemented');
  }

  async getCandlesRange(
    symbol: string,
    timeframe: Timeframe,
    start: number,
    end: number
  ): Promise<Candle[]> {
    throw new DataNotAvailableError('Coinbase adapter not yet implemented');
  }

  async getTicker(symbol: string): Promise<Ticker> {
    throw new DataNotAvailableError('Coinbase adapter not yet implemented');
  }

  async getOrderBook(symbol: string, depth?: number): Promise<OrderBook> {
    throw new DataNotAvailableError('Coinbase adapter not yet implemented');
  }

  async getSymbols(): Promise<Symbol[]> {
    throw new DataNotAvailableError('Coinbase adapter not yet implemented');
  }
}

/**
 * TODO: Implementation guide for Coinbase adapter
 *
 * Example implementation structure:
 *
 * ```typescript
 * import { CoinbasePro } from 'coinbase-pro';
 *
 * export class CoinbaseAdapter extends BaseAdapter {
 *   private client: CoinbasePro;
 *
 *   async connect() {
 *     this.client = new CoinbasePro({
 *       apiKey: this.apiKey,
 *       apiSecret: this.apiSecret,
 *       passphrase: this.passphrase,
 *       sandbox: this.sandbox,
 *     });
 *     await this.client.getTime(); // Test connection
 *     this.connected = true;
 *   }
 *
 *   async getCandles(symbol, timeframe, limit = 100) {
 *     const granularity = this.timeframeToGranularity(timeframe);
 *     const candles = await this.client.getProductHistoricRates(symbol, {
 *       granularity,
 *       limit,
 *     });
 *     return candles.map(c => ({
 *       timestamp: c[0] * 1000,
 *       low: c[1],
 *       high: c[2],
 *       open: c[3],
 *       close: c[4],
 *       volume: c[5],
 *       symbol,
 *       timeframe,
 *     }));
 *   }
 * }
 * ```
 */
