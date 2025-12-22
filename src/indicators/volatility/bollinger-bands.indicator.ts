/**
 * Bollinger Bands indicator
 * Volatility bands placed above and below a moving average
 * Shows potential overbought/oversold conditions and volatility
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';
import { SMAIndicator } from '../moving-averages/sma.indicator';
import type { PriceSource } from '../base';

/**
 * Bollinger Bands result interface
 */
export interface BollingerBandsValue {
  /**
   * Upper band (SMA + stdDev * multiplier)
   */
  upper: number;

  /**
   * Middle band (SMA)
   */
  middle: number;

  /**
   * Lower band (SMA - stdDev * multiplier)
   */
  lower: number;

  /**
   * Bandwidth (upper - lower)
   */
  bandwidth: number;

  /**
   * %B indicator ((price - lower) / (upper - lower))
   * Shows where price is relative to bands
   */
  percentB: number;
}

/**
 * Bollinger Bands indicator
 *
 * Formula:
 * - Middle Band = SMA(period)
 * - Upper Band = Middle Band + (stdDev * multiplier)
 * - Lower Band = Middle Band - (stdDev * multiplier)
 *
 * @example
 * ```typescript
 * const bb = new BollingerBandsIndicator(20, 2); // 20-period, 2 std dev
 * const value = bb.calculate(candles);
 * if (value.percentB > 1) console.log('Above upper band');
 * if (value.percentB < 0) console.log('Below lower band');
 * ```
 */
export class BollingerBandsIndicator extends IndicatorBase<BollingerBandsValue> {
  readonly name = 'BollingerBands';
  readonly requiredCandles: number;

  private period: number;
  private stdDevMultiplier: number;
  private sma: SMAIndicator;

  constructor(period: number = 20, stdDevMultiplier: number = 2, source: PriceSource = 'close') {
    super(source);
    this.period = period;
    this.stdDevMultiplier = stdDevMultiplier;
    this.requiredCandles = period;
    this.sma = new SMAIndicator(period, source);
  }

  /**
   * Calculate Bollinger Bands for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns Bollinger Bands value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): BollingerBandsValue | null {
    const idx = index ?? candles.length - 1;

    // Need at least 'period' candles
    if (idx < this.period - 1) {
      return null;
    }

    // Calculate middle band (SMA)
    const middle = this.sma.calculate(candles, idx);
    if (middle === null) {
      return null;
    }

    // Get prices for std dev calculation
    const prices = this.getPrices(candles.slice(idx - this.period + 1, idx + 1));

    // Calculate standard deviation
    const squaredDiffs = prices.map((price) => Math.pow(price - middle, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / this.period;
    const stdDev = Math.sqrt(variance);

    // Calculate upper and lower bands
    const upper = middle + stdDev * this.stdDevMultiplier;
    const lower = middle - stdDev * this.stdDevMultiplier;

    // Calculate bandwidth
    const bandwidth = upper - lower;

    // Calculate %B
    const currentPrice = this.getPrice(candles[idx]);
    const percentB = bandwidth === 0 ? 0.5 : (currentPrice - lower) / bandwidth;

    return {
      upper,
      middle,
      lower,
      bandwidth,
      percentB,
    };
  }

  /**
   * Reset indicator state
   */
  reset(): void {
    super.reset();
    this.sma.reset();
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      stdDevMultiplier: this.stdDevMultiplier,
      source: this.source,
    };
  }

  /**
   * Check if price is above upper band
   */
  isAboveUpperBand(): boolean {
    const value = this.getValue();
    return value !== null && value.percentB > 1;
  }

  /**
   * Check if price is below lower band
   */
  isBelowLowerBand(): boolean {
    const value = this.getValue();
    return value !== null && value.percentB < 0;
  }

  /**
   * Check if bands are squeezing (low volatility)
   * @param threshold - Bandwidth threshold for squeeze detection
   */
  isSqueezing(threshold?: number): boolean {
    const current = this.getValue();
    const previous = this.getValueAt(1);

    if (!current || !previous) {
      return false;
    }

    // Bands are squeezing if bandwidth is decreasing
    const isDecreasing = current.bandwidth < previous.bandwidth;

    if (threshold !== undefined) {
      return isDecreasing && current.bandwidth < threshold;
    }

    return isDecreasing;
  }

  /**
   * Check if bands are expanding (high volatility)
   */
  isExpanding(): boolean {
    const current = this.getValue();
    const previous = this.getValueAt(1);

    if (!current || !previous) {
      return false;
    }

    return current.bandwidth > previous.bandwidth;
  }
}
