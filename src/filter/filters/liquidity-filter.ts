/**
 * Liquidity filter
 * Filters symbols by volume and liquidity
 */

import type { IFilter, FilterContext, FilterResult } from './filter.interface';
import { createLogger } from '@/utils';

/**
 * Liquidity filter options
 */
export interface LiquidityFilterOptions {
  /**
   * Minimum 24h volume
   */
  minVolume?: number;

  /**
   * Minimum average volume (from candles)
   */
  minAvgVolume?: number;

  /**
   * Volume lookback period (for average)
   */
  volumePeriod?: number;

  /**
   * Minimum volume spike (current/average)
   */
  minVolumeSpike?: number;

  /**
   * Minimum bid-ask spread percentage
   */
  maxSpreadPercent?: number;
}

/**
 * Liquidity filter
 * Ensures sufficient liquidity for trading
 */
export class LiquidityFilter implements IFilter {
  readonly name = 'LiquidityFilter';
  readonly description = 'Filter by volume and liquidity';

  private options: LiquidityFilterOptions;
  private logger = createLogger('LiquidityFilter');

  constructor(options: LiquidityFilterOptions) {
    this.options = options;
    this.options.volumePeriod = options.volumePeriod ?? 20;
  }

  /**
   * Apply liquidity filter
   */
  apply(context: FilterContext): FilterResult {
    const { ticker, candles } = context;

    if (!ticker) {
      return {
        passed: false,
        reason: 'No ticker data available',
        score: 0,
      };
    }

    // Check 24h volume
    if (this.options.minVolume !== undefined) {
      const volume = ticker.volume24h ?? ticker.quoteVolume ?? 0;

      if (volume < this.options.minVolume) {
        return {
          passed: false,
          reason: `Volume ${volume} below minimum ${this.options.minVolume}`,
          score: 0,
        };
      }
    }

    // Check average volume (if candles available)
    if (this.options.minAvgVolume !== undefined && candles && candles.length > 0) {
      const recentCandles = candles.slice(-this.options.volumePeriod!);
      const avgVolume =
        recentCandles.reduce((sum, c) => sum + c.volume, 0) / recentCandles.length;

      if (avgVolume < this.options.minAvgVolume) {
        return {
          passed: false,
          reason: `Average volume ${avgVolume.toFixed(0)} below minimum ${this.options.minAvgVolume}`,
          score: 0,
        };
      }
    }

    // Check volume spike
    if (this.options.minVolumeSpike !== undefined && candles && candles.length > 0) {
      const recentCandles = candles.slice(-this.options.volumePeriod!);
      const avgVolume =
        recentCandles.reduce((sum, c) => sum + c.volume, 0) / recentCandles.length;

      const currentVolume = candles[candles.length - 1].volume;
      const volumeSpike = currentVolume / avgVolume;

      if (volumeSpike < this.options.minVolumeSpike) {
        return {
          passed: false,
          reason: `Volume spike ${volumeSpike.toFixed(2)}x below minimum ${this.options.minVolumeSpike}x`,
          score: 0,
        };
      }
    }

    // Check bid-ask spread
    if (this.options.maxSpreadPercent !== undefined && ticker.bid && ticker.ask) {
      const spread = ticker.ask - ticker.bid;
      const spreadPercent = (spread / ticker.last) * 100;

      if (spreadPercent > this.options.maxSpreadPercent) {
        return {
          passed: false,
          reason: `Spread ${spreadPercent.toFixed(2)}% above maximum ${this.options.maxSpreadPercent}%`,
          score: 0,
        };
      }
    }

    // Calculate score based on volume
    const volume = ticker.volume24h ?? ticker.quoteVolume ?? 0;
    const minVol = this.options.minVolume ?? 0;
    const score = minVol > 0 ? Math.min(1, volume / (minVol * 2)) : 1;

    this.logger.debug(
      `${context.symbol.symbol} passed liquidity filter (score: ${score.toFixed(2)})`
    );

    return {
      passed: true,
      score,
    };
  }

  /**
   * Get filter configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      ...this.options,
    };
  }
}
