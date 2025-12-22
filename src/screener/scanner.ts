/**
 * Market scanner
 * Scans multiple symbols in parallel for screening
 */

import type { IDatafeedAdapter, Symbol, Candle, Ticker, Timeframe } from '@/core/types';
import type { ScreeningContext } from './criteria/criteria.interface';
import { ScreenerEngine, type ScreenerOptions } from './screener-engine';
import { createLogger } from '@/utils';

/**
 * Scanner configuration
 */
export interface ScannerConfig {
  /**
   * Datafeed adapter
   */
  adapter: IDatafeedAdapter;

  /**
   * Timeframe for candle data
   */
  timeframe: Timeframe;

  /**
   * Number of candles to fetch
   */
  candleLimit: number;

  /**
   * Batch size for parallel fetching
   */
  batchSize: number;
}

/**
 * Market scanner
 * Fetches data and runs screening in batches
 */
export class Scanner {
  private config: ScannerConfig;
  private screener: ScreenerEngine;
  private logger = createLogger('Scanner');

  constructor(config: ScannerConfig, screener: ScreenerEngine) {
    this.config = {
      timeframe: '1h',
      candleLimit: 100,
      batchSize: 10,
      ...config,
    };
    this.screener = screener;
  }

  /**
   * Scan list of symbols
   */
  async scan(symbols: string[], options?: ScreenerOptions) {
    this.logger.info(`Starting scan of ${symbols.length} symbols`);

    // Fetch symbol information
    const symbolInfos = await this.fetchSymbols(symbols);

    // Process in batches to avoid overwhelming the API
    const contexts: ScreeningContext[] = [];

    for (let i = 0; i < symbolInfos.length; i += this.config.batchSize) {
      const batch = symbolInfos.slice(i, i + this.config.batchSize);

      this.logger.debug(
        `Fetching batch ${Math.floor(i / this.config.batchSize) + 1}/${Math.ceil(symbolInfos.length / this.config.batchSize)}`
      );

      const batchContexts = await this.fetchBatchData(batch);
      contexts.push(...batchContexts);
    }

    // Run screening
    this.logger.info(`Screening ${contexts.length} symbols`);
    const results = await this.screener.screenMany(contexts, options);

    this.logger.info(`Scan complete: ${results.length} matches found`);

    return results;
  }

  /**
   * Scan all available symbols
   */
  async scanAll(options?: ScreenerOptions) {
    this.logger.info('Fetching all available symbols');

    const symbols = await this.config.adapter.getSymbols();
    const symbolNames = symbols.map((s) => s.symbol);

    return this.scan(symbolNames, options);
  }

  /**
   * Fetch symbol information
   */
  private async fetchSymbols(symbols: string[]): Promise<Symbol[]> {
    const symbolInfos: Symbol[] = [];

    for (const symbol of symbols) {
      try {
        const info = await this.config.adapter.getSymbol(symbol);
        symbolInfos.push(info);
      } catch (error) {
        this.logger.warn(`Failed to fetch symbol ${symbol}`, error);
      }
    }

    return symbolInfos;
  }

  /**
   * Fetch data for a batch of symbols
   */
  private async fetchBatchData(symbols: Symbol[]): Promise<ScreeningContext[]> {
    const promises = symbols.map(async (symbol) => {
      try {
        // Fetch ticker data
        const ticker = await this.config.adapter.getTicker(symbol.symbol);

        // Fetch candles
        const candles = await this.config.adapter.getCandles(
          symbol.symbol,
          this.config.timeframe,
          this.config.candleLimit
        );

        return {
          symbol,
          ticker,
          candles,
        };
      } catch (error) {
        this.logger.error(`Failed to fetch data for ${symbol.symbol}`, error);
        return {
          symbol,
        };
      }
    });

    return Promise.all(promises);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ScannerConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger.debug('Scanner configuration updated');
  }

  /**
   * Get configuration
   */
  getConfig(): ScannerConfig {
    return { ...this.config };
  }
}
