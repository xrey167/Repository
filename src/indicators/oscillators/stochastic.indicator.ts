/**
 * Stochastic Oscillator indicator
 * Momentum indicator comparing closing price to price range over time
 * Range: 0-100, typically overbought > 80, oversold < 20
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';
import { SMAIndicator } from '../moving-averages/sma.indicator';

/**
 * Stochastic result interface
 */
export interface StochasticValue {
  /**
   * %K line (fast stochastic)
   */
  k: number | null;

  /**
   * %D line (slow stochastic, SMA of %K)
   */
  d: number | null;

  /**
   * Index signature for IndicatorValue compatibility
   */
  [key: string]: number | number[] | null;
}

/**
 * Stochastic Oscillator indicator
 *
 * Formula:
 * %K = 100 * (Close - LowestLow) / (HighestHigh - LowestLow)
 * %D = SMA(%K, smoothPeriod)
 *
 * @example
 * ```typescript
 * const stoch = new StochasticIndicator(14, 3); // 14-period %K, 3-period %D
 * const value = stoch.calculate(candles);
 * if (value.k < 20) console.log('Oversold');
 * if (value.k > 80) console.log('Overbought');
 * ```
 */
export class StochasticIndicator extends IndicatorBase<StochasticValue> {
  readonly name = 'Stochastic';
  readonly requiredCandles: number;

  private kPeriod: number;
  private dPeriod: number;
  private smoothK: number;

  private kSMA: SMAIndicator;
  private dSMA: SMAIndicator;

  constructor(kPeriod: number = 14, dPeriod: number = 3, smoothK: number = 3) {
    super('close');
    this.kPeriod = kPeriod;
    this.dPeriod = dPeriod;
    this.smoothK = smoothK;
    this.requiredCandles = kPeriod + smoothK + dPeriod - 2;

    this.kSMA = new SMAIndicator(smoothK, 'close');
    this.dSMA = new SMAIndicator(dPeriod, 'close');
  }

  /**
   * Calculate Stochastic for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns Stochastic value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): StochasticValue | null {
    const idx = index ?? candles.length - 1;

    // Need at least kPeriod candles
    if (idx < this.kPeriod - 1) {
      return null;
    }

    // Get period slice
    const periodCandles = candles.slice(idx - this.kPeriod + 1, idx + 1);

    // Find highest high and lowest low
    let highestHigh = -Infinity;
    let lowestLow = Infinity;

    for (const candle of periodCandles) {
      if (candle.high > highestHigh) {
        highestHigh = candle.high;
      }
      if (candle.low < lowestLow) {
        lowestLow = candle.low;
      }
    }

    // Calculate raw %K
    const currentClose = candles[idx].close;
    const range = highestHigh - lowestLow;

    if (range === 0) {
      return { k: 50, d: 50 }; // Neutral when no price movement
    }

    const rawK = 100 * ((currentClose - lowestLow) / range);

    // For smoothed %K, we need to calculate raw %K values and smooth them
    if (this.smoothK > 1 && idx >= this.kPeriod + this.smoothK - 2) {
      // Build raw %K candles for smoothing
      const rawKCandles: Candle[] = [];
      for (let i = idx - this.smoothK + 1; i <= idx; i++) {
        const slice = candles.slice(i - this.kPeriod + 1, i + 1);
        let high = -Infinity;
        let low = Infinity;

        for (const c of slice) {
          if (c.high > high) high = c.high;
          if (c.low < low) low = c.low;
        }

        const rng = high - low;
        const rK = rng === 0 ? 50 : 100 * ((candles[i].close - low) / rng);

        rawKCandles.push({
          ...candles[i],
          close: rK,
          open: rK,
          high: rK,
          low: rK,
        });
      }

      const smoothedK = this.kSMA.calculate(rawKCandles);
      if (smoothedK === null) {
        return { k: rawK, d: rawK };
      }

      // Calculate %D (SMA of %K)
      if (idx >= this.kPeriod + this.smoothK + this.dPeriod - 3) {
        const kCandles: Candle[] = [];
        for (let i = idx - this.dPeriod + 1; i <= idx; i++) {
          const kValue = this.calculate(candles, i);
          if (kValue !== null && kValue.k !== null) {
            kCandles.push({
              ...candles[i],
              close: kValue.k,
              open: kValue.k,
              high: kValue.k,
              low: kValue.k,
            });
          }
        }

        const d = this.dSMA.calculate(kCandles);
        return { k: smoothedK, d: d ?? smoothedK };
      }

      return { k: smoothedK, d: smoothedK };
    }

    // No smoothing
    return { k: rawK, d: rawK };
  }

  /**
   * Reset indicator state
   */
  reset(): void {
    super.reset();
    this.kSMA.reset();
    this.dSMA.reset();
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      kPeriod: this.kPeriod,
      dPeriod: this.dPeriod,
      smoothK: this.smoothK,
    };
  }

  /**
   * Check if stochastic indicates oversold condition
   * @param threshold - Oversold threshold (default: 20)
   */
  isOversold(threshold: number = 20): boolean {
    const value = this.getValue();
    return value !== null && value.k !== null && value.k < threshold;
  }

  /**
   * Check if stochastic indicates overbought condition
   * @param threshold - Overbought threshold (default: 80)
   */
  isOverbought(threshold: number = 80): boolean {
    const value = this.getValue();
    return value !== null && value.k !== null && value.k > threshold;
  }

  /**
   * Check for bullish crossover (%K crosses above %D)
   */
  isBullishCrossover(): boolean {
    const current = this.getValue();
    const previous = this.getValueAt(1);

    if (!current || !previous ||
        current.k === null || current.d === null ||
        previous.k === null || previous.d === null) {
      return false;
    }

    return previous.k <= previous.d && current.k > current.d;
  }

  /**
   * Check for bearish crossover (%K crosses below %D)
   */
  isBearishCrossover(): boolean {
    const current = this.getValue();
    const previous = this.getValueAt(1);

    if (!current || !previous ||
        current.k === null || current.d === null ||
        previous.k === null || previous.d === null) {
      return false;
    }

    return previous.k >= previous.d && current.k < current.d;
  }
}
