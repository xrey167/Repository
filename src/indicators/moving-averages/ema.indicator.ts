/**
 * Exponential Moving Average (EMA) indicator
 * Gives more weight to recent prices using exponential smoothing
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';
import type { PriceSource } from '../base';

/**
 * Exponential Moving Average indicator
 *
 * Formula: EMA = Price(t) * k + EMA(y) * (1 - k)
 * where k = 2 / (period + 1)
 *
 * @example
 * ```typescript
 * const ema = new EMAIndicator(20); // 20-period EMA
 * const value = ema.calculate(candles);
 * ```
 */
export class EMAIndicator extends IndicatorBase<number> {
  readonly name = 'EMA';
  requiredCandles: number;

  private period: number;
  private multiplier: number;
  private previousEMA: number | null = null;

  constructor(period: number = 20, source: PriceSource = 'close') {
    super(source);
    this.period = period;
    this.requiredCandles = period;
    this.multiplier = 2 / (period + 1);
  }

  /**
   * Calculate EMA for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns EMA value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): number | null {
    const idx = index ?? candles.length - 1;

    // Need at least 'period' candles
    if (idx < this.period - 1) {
      return null;
    }

    // For the first EMA value, use SMA
    if (idx === this.period - 1) {
      const prices = this.getPrices(candles.slice(0, this.period));
      const sma = prices.reduce((acc, price) => acc + price, 0) / this.period;
      this.previousEMA = sma;
      return sma;
    }

    // Get previous EMA
    let prevEMA: number;
    if (this.previousEMA !== null && idx === candles.length - 1) {
      prevEMA = this.previousEMA;
    } else {
      // Recalculate from scratch for historical values
      const prevValue = this.calculate(candles, idx - 1);
      if (prevValue === null) {
        return null;
      }
      prevEMA = prevValue;
    }

    // Calculate current EMA
    const currentPrice = this.getPrice(candles[idx]);
    const ema = currentPrice * this.multiplier + prevEMA * (1 - this.multiplier);

    // Store for next calculation
    if (idx === candles.length - 1) {
      this.previousEMA = ema;
    }

    return ema;
  }

  /**
   * Reset indicator state
   */
  reset(): void {
    super.reset();
    this.previousEMA = null;
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      source: this.source,
      multiplier: this.multiplier,
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
    this.multiplier = 2 / (period + 1);
    this.reset();
  }
}
