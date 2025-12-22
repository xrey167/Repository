/**
 * CSV datafeed adapter for backtesting
 * Loads historical market data from CSV files
 */

import { BaseAdapter } from './base-adapter';
import type { Candle, Ticker, OrderBook, Symbol, Timeframe } from '@/core/types';
import { DataNotAvailableError, ParseError } from '@/core/errors';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

/**
 * CSV file format interface
 * Expected columns: timestamp, open, high, low, close, volume
 */
interface CSVRow {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * CSV adapter for loading historical candle data from files
 * File naming convention: {SYMBOL}_{TIMEFRAME}.csv
 * Example: BTCUSD_1h.csv, ETHUSD_1d.csv
 */
export class CSVAdapter extends BaseAdapter {
  readonly type = 'csv' as const;
  readonly name = 'CSVAdapter';

  private dataPath: string;
  private cache: Map<string, Candle[]> = new Map();

  constructor(dataPath: string = './data/historical') {
    super();
    this.dataPath = dataPath;
  }

  /**
   * Connect (verify data path exists)
   */
  async connect(): Promise<void> {
    this.logger.info(`Connecting to CSV datafeed at ${this.dataPath}`);

    if (!existsSync(this.dataPath)) {
      throw new DataNotAvailableError(
        `Data path does not exist: ${this.dataPath}`
      );
    }

    this.connected = true;
    this.logger.info('Connected to CSV datafeed');
  }

  /**
   * Disconnect (clear cache)
   */
  async disconnect(): Promise<void> {
    this.logger.info('Disconnecting from CSV datafeed');
    this.cache.clear();
    this.connected = false;
    this.logger.info('Disconnected from CSV datafeed');
  }

  /**
   * Get CSV file path for symbol and timeframe
   */
  private getFilePath(symbol: string, timeframe: Timeframe): string {
    return join(this.dataPath, `${symbol}_${timeframe}.csv`);
  }

  /**
   * Parse CSV row
   */
  private parseRow(row: string, symbol: string, timeframe: Timeframe): CSVRow | null {
    const parts = row.trim().split(',');
    if (parts.length < 6) {
      return null;
    }

    try {
      return {
        timestamp: parseInt(parts[0]),
        open: parseFloat(parts[1]),
        high: parseFloat(parts[2]),
        low: parseFloat(parts[3]),
        close: parseFloat(parts[4]),
        volume: parseFloat(parts[5]),
      };
    } catch (error) {
      this.logger.warn(`Failed to parse CSV row: ${row}`, error);
      return null;
    }
  }

  /**
   * Load candles from CSV file
   */
  private loadFromFile(symbol: string, timeframe: Timeframe): Candle[] {
    const cacheKey = `${symbol}_${timeframe}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const filePath = this.getFilePath(symbol, timeframe);

    if (!existsSync(filePath)) {
      throw new DataNotAvailableError(
        `CSV file not found: ${filePath}. Expected format: ${symbol}_${timeframe}.csv`
      );
    }

    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      // Skip header row if present
      const startIndex = lines[0].toLowerCase().includes('timestamp') ? 1 : 0;

      const candles: Candle[] = [];

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const row = this.parseRow(line, symbol, timeframe);
        if (!row) continue;

        candles.push({
          ...row,
          symbol,
          timeframe,
        });
      }

      if (candles.length === 0) {
        throw new ParseError(`No valid candles found in ${filePath}`);
      }

      // Sort by timestamp (oldest first)
      candles.sort((a, b) => a.timestamp - b.timestamp);

      // Cache the loaded data
      this.cache.set(cacheKey, candles);

      this.logger.info(
        `Loaded ${candles.length} candles from ${filePath}`
      );

      return candles;
    } catch (error) {
      if (error instanceof DataNotAvailableError || error instanceof ParseError) {
        throw error;
      }
      throw new ParseError(`Failed to read CSV file: ${filePath}`, error);
    }
  }

  /**
   * Get historical candles
   */
  async getCandles(
    symbol: string,
    timeframe: Timeframe,
    limit?: number
  ): Promise<Candle[]> {
    this.ensureConnected();

    const allCandles = this.loadFromFile(symbol, timeframe);

    // Return last N candles if limit specified
    if (limit && limit < allCandles.length) {
      return allCandles.slice(-limit);
    }

    return allCandles;
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

    const allCandles = this.loadFromFile(symbol, timeframe);

    // Filter by date range
    return allCandles.filter(
      (candle) => candle.timestamp >= start && candle.timestamp <= end
    );
  }

  /**
   * Get ticker (use last candle)
   */
  async getTicker(symbol: string): Promise<Ticker> {
    this.ensureConnected();

    // Try to find any CSV file for this symbol
    const files = readdirSync(this.dataPath);
    const symbolFiles = files.filter((f) => f.startsWith(`${symbol}_`));

    if (symbolFiles.length === 0) {
      throw new DataNotAvailableError(
        `No CSV files found for symbol: ${symbol}`
      );
    }

    // Use first available timeframe
    const filename = symbolFiles[0];
    const timeframe = filename
      .replace(`${symbol}_`, '')
      .replace('.csv', '') as Timeframe;

    const candles = this.loadFromFile(symbol, timeframe);
    const lastCandle = candles[candles.length - 1];

    return {
      symbol,
      bid: lastCandle.close * 0.999,
      ask: lastCandle.close * 1.001,
      last: lastCandle.close,
      timestamp: lastCandle.timestamp,
      volume24h: lastCandle.volume,
    };
  }

  /**
   * Get order book (not supported for CSV)
   */
  async getOrderBook(symbol: string, depth?: number): Promise<OrderBook> {
    throw new DataNotAvailableError(
      'Order book data not available from CSV files'
    );
  }

  /**
   * Get available symbols (scan CSV files)
   */
  async getSymbols(): Promise<Symbol[]> {
    this.ensureConnected();

    const files = readdirSync(this.dataPath);
    const csvFiles = files.filter((f) => f.endsWith('.csv'));

    const symbols = new Set<string>();

    // Extract unique symbols from filenames
    for (const file of csvFiles) {
      const parts = file.replace('.csv', '').split('_');
      if (parts.length >= 2) {
        symbols.add(parts[0]);
      }
    }

    // Create symbol objects
    return Array.from(symbols).map((symbol) => ({
      symbol,
      base: symbol.slice(0, -3), // Rough guess (BTC from BTCUSD)
      quote: symbol.slice(-3), // Rough guess (USD from BTCUSD)
      active: true,
      minTradeSize: 0.001,
      maxTradeSize: 1000,
      pricePrecision: 2,
      quantityPrecision: 8,
      tickSize: 0.01,
      lotSize: 0.001,
    }));
  }
}
