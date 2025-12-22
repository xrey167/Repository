/**
 * Mock datafeed adapter for testing
 * Generates synthetic market data
 */

import { BaseAdapter } from './base-adapter';
import type { Candle, Ticker, OrderBook, Symbol, Timeframe } from '@/core/types';
import { DateUtils } from '@/utils';

/**
 * Mock adapter that generates synthetic data for testing
 * Useful for strategy development and backtesting without real data
 */
export class MockAdapter extends BaseAdapter {
  readonly type = 'mock' as const;
  readonly name = 'MockAdapter';

  private basePrice: number = 50000;
  private priceVolatility: number = 0.02; // 2% volatility

  /**
   * Connect to mock data source (instant)
   */
  async connect(): Promise<void> {
    this.logger.info('Connecting to mock datafeed');
    this.connected = true;
    this.logger.info('Connected to mock datafeed');
  }

  /**
   * Disconnect from mock data source
   */
  async disconnect(): Promise<void> {
    this.logger.info('Disconnecting from mock datafeed');
    this.connected = false;
    this.logger.info('Disconnected from mock datafeed');
  }

  /**
   * Generate random price movement
   */
  private generatePriceChange(): number {
    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * this.priceVolatility;
    return change;
  }

  /**
   * Generate a single candle
   */
  private generateCandle(symbol: string, timestamp: number, timeframe: Timeframe): Candle {
    const change = this.generatePriceChange();
    const open = this.basePrice;
    const close = open * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = 1000 + Math.random() * 9000; // Random volume 1000-10000

    // Update base price for next candle
    this.basePrice = close;

    return {
      timestamp,
      open,
      high,
      low,
      close,
      volume,
      symbol,
      timeframe,
    };
  }

  /**
   * Get historical candles
   */
  async getCandles(
    symbol: string,
    timeframe: Timeframe,
    limit: number = 100
  ): Promise<Candle[]> {
    this.ensureConnected();

    const candles: Candle[] = [];
    const timeframeMs = DateUtils.timeframeToMs(timeframe);
    let timestamp = Date.now();

    // Generate candles backwards in time
    for (let i = 0; i < limit; i++) {
      timestamp -= timeframeMs;
      candles.unshift(this.generateCandle(symbol, timestamp, timeframe));
    }

    this.logger.debug(`Generated ${candles.length} mock candles for ${symbol} ${timeframe}`);
    return candles;
  }

  /**
   * Get candles for date range
   */
  async getCandlesRange(
    symbol: string,
    timeframe: Timeframe,
    start: number,
    end: number
  ): Promise<Candle[]> {
    this.ensureConnected();

    const candles: Candle[] = [];
    const timeframeMs = DateUtils.timeframeToMs(timeframe);
    let timestamp = start;

    // Generate candles from start to end
    while (timestamp <= end) {
      candles.push(this.generateCandle(symbol, timestamp, timeframe));
      timestamp += timeframeMs;
    }

    this.logger.debug(
      `Generated ${candles.length} mock candles for ${symbol} ${timeframe} (${new Date(start).toISOString()} to ${new Date(end).toISOString()})`
    );
    return candles;
  }

  /**
   * Get current ticker
   */
  async getTicker(symbol: string): Promise<Ticker> {
    this.ensureConnected();

    const last = this.basePrice;
    const spread = last * 0.001; // 0.1% spread
    const bid = last - spread / 2;
    const ask = last + spread / 2;

    return {
      symbol,
      bid,
      ask,
      last,
      timestamp: Date.now(),
      volume24h: 1000000 + Math.random() * 9000000,
      change24h: -5 + Math.random() * 10, // -5% to +5%
    };
  }

  /**
   * Get order book
   */
  async getOrderBook(symbol: string, depth: number = 10): Promise<OrderBook> {
    this.ensureConnected();

    const midPrice = this.basePrice;
    const bids: [number, number][] = [];
    const asks: [number, number][] = [];

    // Generate bid levels (below mid price)
    for (let i = 0; i < depth; i++) {
      const priceOffset = (i + 1) * 0.001; // 0.1% increments
      const price = midPrice * (1 - priceOffset);
      const quantity = 1 + Math.random() * 10;
      bids.push([price, quantity]);
    }

    // Generate ask levels (above mid price)
    for (let i = 0; i < depth; i++) {
      const priceOffset = (i + 1) * 0.001;
      const price = midPrice * (1 + priceOffset);
      const quantity = 1 + Math.random() * 10;
      asks.push([price, quantity]);
    }

    return {
      symbol,
      bids,
      asks,
      timestamp: Date.now(),
    };
  }

  /**
   * Get available symbols
   */
  async getSymbols(): Promise<Symbol[]> {
    this.ensureConnected();

    return [
      {
        symbol: 'BTCUSD',
        base: 'BTC',
        quote: 'USD',
        active: true,
        minTradeSize: 0.001,
        maxTradeSize: 100,
        pricePrecision: 2,
        quantityPrecision: 8,
        tickSize: 0.01,
        lotSize: 0.001,
      },
      {
        symbol: 'ETHUSD',
        base: 'ETH',
        quote: 'USD',
        active: true,
        minTradeSize: 0.01,
        maxTradeSize: 1000,
        pricePrecision: 2,
        quantityPrecision: 8,
        tickSize: 0.01,
        lotSize: 0.01,
      },
      {
        symbol: 'SOLUSD',
        base: 'SOL',
        quote: 'USD',
        active: true,
        minTradeSize: 0.1,
        maxTradeSize: 10000,
        pricePrecision: 2,
        quantityPrecision: 4,
        tickSize: 0.01,
        lotSize: 0.1,
      },
    ];
  }
}
