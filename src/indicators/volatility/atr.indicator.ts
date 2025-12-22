/**
 * Average True Range (ATR) indicator
 * Measures market volatility by calculating average of true ranges
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';

/**
 * ATR indicator
 *
 * True Range = max(high - low, |high - prevClose|, |low - prevClose|)
 * ATR = Average of True Ranges over period
 *
 * @example
 * ```typescript
 * const atr = new ATRIndicator(14); // 14-period ATR
 * const value = atr.calculate(candles);
 * console.log('Volatility:', value);
 * ```
 */
export class ATRIndicator extends IndicatorBase<number> {
  readonly name = 'ATR';
  readonly requiredCandles: number;

  private period: number;
  private previousATR: number | null = null;

  constructor(period: number = 14) {
    super('close');
    this.period = period;
    this.requiredCandles = period + 1; // Need period + 1 for true range calculation
  }

  /**
   * Calculate true range for a candle
   * @param current - Current candle
   * @param previous - Previous candle
   * @returns True range value
   */
  private calculateTrueRange(current: Candle, previous: Candle): number {
    const highLow = current.high - current.low;
    const highClose = Math.abs(current.high - previous.close);
    const lowClose = Math.abs(current.low - previous.close);

    return Math.max(highLow, highClose, lowClose);
  }

  /**
   * Calculate ATR for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns ATR value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): number | null {
    const idx = index ?? candles.length - 1;

    // Need at least period + 1 candles
    if (idx < this.period) {
      return null;
    }

    // For the first ATR, calculate simple average of true ranges
    if (idx === this.period) {
      let sum = 0;
      for (let i = 1; i <= this.period; i++) {
        const tr = this.calculateTrueRange(candles[i], candles[i - 1]);
        sum += tr;
      }

      const atr = sum / this.period;
      this.previousATR = atr;
      return atr;
    }

    // For subsequent ATRs, use Wilder's smoothing
    // ATR = ((Previous ATR * (period - 1)) + Current TR) / period
    const currentTR = this.calculateTrueRange(candles[idx], candles[idx - 1]);

    let atr: number;
    if (this.previousATR !== null && idx === candles.length - 1) {
      // Use stored value for real-time calculation
      atr = (this.previousATR * (this.period - 1) + currentTR) / this.period;
    } else {
      // Recalculate from scratch for historical values
      const prevATR = this.calculate(candles, idx - 1);
      if (prevATR === null) {
        return null;
      }
      atr = (prevATR * (this.period - 1) + currentTR) / this.period;
    }

    // Store for next calculation
    if (idx === candles.length - 1) {
      this.previousATR = atr;
    }

    return atr;
  }

  /**
   * Reset indicator state
   */
  reset(): void {
    super.reset();
    this.previousATR = null;
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
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
    this.requiredCandles = period + 1;
    this.reset();
  }

  /**
   * Check if volatility is increasing
   */
  isVolatilityIncreasing(): boolean {
    const current = this.getValue();
    const previous = this.getValueAt(1);

    if (current === null || previous === null) {
      return false;
    }

    return current > previous;
  }

  /**
   * Check if volatility is decreasing
   */
  isVolatilityDecreasing(): boolean {
    const current = this.getValue();
    const previous = this.getValueAt(1);

    if (current === null || previous === null) {
      return false;
    }

    return current < previous;
  }

  /**
   * Calculate ATR as percentage of price
   * @param candles - Historical candles
   * @returns ATR as percentage or null
   */
  calculatePercentage(candles: Candle[]): number | null {
    const atr = this.calculate(candles);
    if (atr === null) {
      return null;
    }

    const currentPrice = candles[candles.length - 1].close;
    return (atr / currentPrice) * 100;
  }
}
