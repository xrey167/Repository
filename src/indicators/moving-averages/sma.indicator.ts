/**
 * Simple Moving Average (SMA) indicator
 * Calculates the arithmetic mean of prices over a specified period
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';
import type { PriceSource } from '../base';

/**
 * Simple Moving Average indicator
 *
 * @example
 * ```typescript
 * const sma = new SMAIndicator(20); // 20-period SMA
 * const value = sma.calculate(candles);
 * ```
 */
export class SMAIndicator extends IndicatorBase<number> {
  readonly name = 'SMA';
  readonly requiredCandles: number;

  private period: number;

  constructor(period: number = 20, source: PriceSource = 'close') {
    super(source);
    this.period = period;
    this.requiredCandles = period;
  }

  /**
   * Calculate SMA for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns SMA value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): number | null {
    const idx = index ?? candles.length - 1;

    // Need at least 'period' candles
    if (idx < this.period - 1) {
      return null;
    }

    const prices = this.getPrices(candles.slice(idx - this.period + 1, idx + 1));
    const sum = prices.reduce((acc, price) => acc + price, 0);

    return sum / this.period;
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      source: this.source,
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
    this.reset();
  }
}
