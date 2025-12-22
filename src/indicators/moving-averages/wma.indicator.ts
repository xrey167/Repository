/**
 * Weighted Moving Average (WMA) indicator
 * Assigns linearly increasing weights to recent prices
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';
import type { PriceSource } from '../base';

/**
 * Weighted Moving Average indicator
 *
 * More recent prices are given higher weights linearly
 * Weight(i) = i, where i is the position from oldest to newest
 *
 * @example
 * ```typescript
 * const wma = new WMAIndicator(20); // 20-period WMA
 * const value = wma.calculate(candles);
 * ```
 */
export class WMAIndicator extends IndicatorBase<number> {
  readonly name = 'WMA';
  readonly requiredCandles: number;

  private period: number;
  private weightSum: number;

  constructor(period: number = 20, source: PriceSource = 'close') {
    super(source);
    this.period = period;
    this.requiredCandles = period;
    // Sum of weights: 1 + 2 + 3 + ... + n = n * (n + 1) / 2
    this.weightSum = (period * (period + 1)) / 2;
  }

  /**
   * Calculate WMA for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns WMA value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): number | null {
    const idx = index ?? candles.length - 1;

    // Need at least 'period' candles
    if (idx < this.period - 1) {
      return null;
    }

    const prices = this.getPrices(candles.slice(idx - this.period + 1, idx + 1));

    // Calculate weighted sum
    let weightedSum = 0;
    for (let i = 0; i < prices.length; i++) {
      const weight = i + 1; // Weights: 1, 2, 3, ..., period
      weightedSum += prices[i] * weight;
    }

    return weightedSum / this.weightSum;
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      source: this.source,
      weightSum: this.weightSum,
    };
  }

  /**
   * Get period
   */
  getPeriod(): number {
    return this.period;
  }

  /**
   * Set period (resets indicator)
   */
  setPeriod(period: number): void {
    this.period = period;
    this.requiredCandles = period;
    this.weightSum = (period * (period + 1)) / 2;
    this.reset();
  }
}
