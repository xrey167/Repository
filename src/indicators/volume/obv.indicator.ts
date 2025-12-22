/**
 * On-Balance Volume (OBV) indicator
 * Cumulative volume indicator that shows buying and selling pressure
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';

/**
 * OBV indicator
 *
 * Formula:
 * - If close > prevClose: OBV = prevOBV + volume
 * - If close < prevClose: OBV = prevOBV - volume
 * - If close = prevClose: OBV = prevOBV
 *
 * @example
 * ```typescript
 * const obv = new OBVIndicator();
 * const value = obv.calculate(candles);
 * console.log('Buying pressure:', value);
 * ```
 */
export class OBVIndicator extends IndicatorBase<number> {
  readonly name = 'OBV';
  readonly requiredCandles = 2; // Need at least 2 candles

  private previousOBV: number | null = null;

  constructor() {
    super('close');
  }

  /**
   * Calculate OBV for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns OBV value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): number | null {
    const idx = index ?? candles.length - 1;

    // Need at least 2 candles
    if (idx < 1) {
      return null;
    }

    // For the first OBV value, start with volume
    if (idx === 1) {
      const obv = candles[0].close < candles[1].close ? candles[1].volume : -candles[1].volume;
      this.previousOBV = obv;
      return obv;
    }

    // Get previous OBV
    let prevOBV: number;
    if (this.previousOBV !== null && idx === candles.length - 1) {
      // Use stored value for real-time calculation
      prevOBV = this.previousOBV;
    } else {
      // Recalculate from scratch for historical values
      const prev = this.calculate(candles, idx - 1);
      if (prev === null) {
        return null;
      }
      prevOBV = prev;
    }

    // Calculate current OBV
    const currentClose = candles[idx].close;
    const previousClose = candles[idx - 1].close;
    const currentVolume = candles[idx].volume;

    let obv: number;
    if (currentClose > previousClose) {
      obv = prevOBV + currentVolume;
    } else if (currentClose < previousClose) {
      obv = prevOBV - currentVolume;
    } else {
      obv = prevOBV;
    }

    // Store for next calculation
    if (idx === candles.length - 1) {
      this.previousOBV = obv;
    }

    return obv;
  }

  /**
   * Reset indicator state
   */
  reset(): void {
    super.reset();
    this.previousOBV = null;
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
    };
  }

  /**
   * Check if OBV is trending up (bullish volume)
   * @param lookback - Number of periods to check (default: 3)
   */
  isTrendingUp(lookback: number = 3): boolean {
    if (this.values.length < lookback) {
      return false;
    }

    const recent = this.values.slice(-lookback);
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] === null || recent[i - 1] === null) {
        return false;
      }
      if (recent[i]! <= recent[i - 1]!) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if OBV is trending down (bearish volume)
   * @param lookback - Number of periods to check (default: 3)
   */
  isTrendingDown(lookback: number = 3): boolean {
    if (this.values.length < lookback) {
      return false;
    }

    const recent = this.values.slice(-lookback);
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] === null || recent[i - 1] === null) {
        return false;
      }
      if (recent[i]! >= recent[i - 1]!) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check for divergence with price
   * @param candles - Historical candles
   * @param lookback - Number of periods to check
   */
  hasBullishDivergence(candles: Candle[], lookback: number = 10): boolean {
    if (candles.length < lookback || this.values.length < lookback) {
      return false;
    }

    const recentCandles = candles.slice(-lookback);
    const recentOBV = this.values.slice(-lookback);

    // Price making lower lows
    const firstLow = recentCandles[0].low;
    const lastLow = recentCandles[recentCandles.length - 1].low;
    const priceLowerLow = lastLow < firstLow;

    // OBV making higher lows
    const firstOBV = recentOBV[0];
    const lastOBV = recentOBV[recentOBV.length - 1];
    const obvHigherLow = firstOBV !== null && lastOBV !== null && lastOBV > firstOBV;

    return priceLowerLow && obvHigherLow;
  }

  /**
   * Check for bearish divergence with price
   * @param candles - Historical candles
   * @param lookback - Number of periods to check
   */
  hasBearishDivergence(candles: Candle[], lookback: number = 10): boolean {
    if (candles.length < lookback || this.values.length < lookback) {
      return false;
    }

    const recentCandles = candles.slice(-lookback);
    const recentOBV = this.values.slice(-lookback);

    // Price making higher highs
    const firstHigh = recentCandles[0].high;
    const lastHigh = recentCandles[recentCandles.length - 1].high;
    const priceHigherHigh = lastHigh > firstHigh;

    // OBV making lower highs
    const firstOBV = recentOBV[0];
    const lastOBV = recentOBV[recentOBV.length - 1];
    const obvLowerHigh = firstOBV !== null && lastOBV !== null && lastOBV < firstOBV;

    return priceHigherHigh && obvLowerHigh;
  }
}
