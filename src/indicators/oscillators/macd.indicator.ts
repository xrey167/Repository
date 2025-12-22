/**
 * Moving Average Convergence Divergence (MACD) indicator
 * Trend-following momentum indicator showing the relationship between two EMAs
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';
import { EMAIndicator } from '../moving-averages/ema.indicator';
import type { PriceSource } from '../base';

/**
 * MACD result interface
 */
export interface MACDValue {
  /**
   * MACD line (fast EMA - slow EMA)
   */
  macd: number | null;

  /**
   * Signal line (EMA of MACD)
   */
  signal: number | null;

  /**
   * Histogram (MACD - Signal)
   */
  histogram: number | null;
}

/**
 * MACD indicator
 *
 * Components:
 * - MACD Line: Fast EMA - Slow EMA
 * - Signal Line: EMA of MACD Line
 * - Histogram: MACD Line - Signal Line
 *
 * @example
 * ```typescript
 * const macd = new MACDIndicator(12, 26, 9);
 * const value = macd.calculate(candles);
 * if (value.histogram > 0) console.log('Bullish');
 * if (value.macd > value.signal) console.log('Crossover');
 * ```
 */
export class MACDIndicator extends IndicatorBase<MACDValue> {
  readonly name = 'MACD';
  readonly requiredCandles: number;

  private fastPeriod: number;
  private slowPeriod: number;
  private signalPeriod: number;

  private fastEMA: EMAIndicator;
  private slowEMA: EMAIndicator;
  private signalEMA: EMAIndicator;

  constructor(
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
    source: PriceSource = 'close'
  ) {
    super(source);
    this.fastPeriod = fastPeriod;
    this.slowPeriod = slowPeriod;
    this.signalPeriod = signalPeriod;
    this.requiredCandles = slowPeriod + signalPeriod - 1;

    this.fastEMA = new EMAIndicator(fastPeriod, source);
    this.slowEMA = new EMAIndicator(slowPeriod, source);
    this.signalEMA = new EMAIndicator(signalPeriod, source);
  }

  /**
   * Calculate MACD for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns MACD value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): MACDValue | null {
    const idx = index ?? candles.length - 1;

    // Need enough candles for slow EMA
    if (idx < this.slowPeriod - 1) {
      return null;
    }

    // Calculate fast and slow EMAs
    const fastValue = this.fastEMA.calculate(candles, idx);
    const slowValue = this.slowEMA.calculate(candles, idx);

    if (fastValue === null || slowValue === null) {
      return null;
    }

    // Calculate MACD line
    const macdLine = fastValue - slowValue;

    // For signal line, we need enough MACD values
    const macdStartIndex = this.slowPeriod - 1;
    if (idx < macdStartIndex + this.signalPeriod - 1) {
      return {
        macd: macdLine,
        signal: macdLine, // Use MACD as signal when not enough data
        histogram: 0,
      };
    }

    // Calculate signal line (EMA of MACD line)
    // Build MACD candles for signal calculation
    const macdCandles: Candle[] = [];
    for (let i = macdStartIndex; i <= idx; i++) {
      const fast = this.fastEMA.calculate(candles, i);
      const slow = this.slowEMA.calculate(candles, i);
      if (fast !== null && slow !== null) {
        macdCandles.push({
          ...candles[i],
          close: fast - slow,
          open: fast - slow,
          high: fast - slow,
          low: fast - slow,
        });
      }
    }

    const signalValue = this.signalEMA.calculate(macdCandles);

    if (signalValue === null) {
      return {
        macd: macdLine,
        signal: macdLine,
        histogram: 0,
      };
    }

    // Calculate histogram
    const histogram = macdLine - signalValue;

    return {
      macd: macdLine,
      signal: signalValue,
      histogram,
    };
  }

  /**
   * Reset indicator state
   */
  reset(): void {
    super.reset();
    this.fastEMA.reset();
    this.slowEMA.reset();
    this.signalEMA.reset();
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      fastPeriod: this.fastPeriod,
      slowPeriod: this.slowPeriod,
      signalPeriod: this.signalPeriod,
      source: this.source,
    };
  }

  /**
   * Check for bullish crossover (MACD crosses above signal)
   */
  isBullishCrossover(): boolean {
    const current = this.getValue();
    const previous = this.getValueAt(1);

    if (!current || !previous) {
      return false;
    }

    return previous.macd <= previous.signal && current.macd > current.signal;
  }

  /**
   * Check for bearish crossover (MACD crosses below signal)
   */
  isBearishCrossover(): boolean {
    const current = this.getValue();
    const previous = this.getValueAt(1);

    if (!current || !previous) {
      return false;
    }

    return previous.macd >= previous.signal && current.macd < current.signal;
  }

  /**
   * Check if histogram is increasing (bullish momentum)
   */
  isHistogramIncreasing(): boolean {
    const current = this.getValue();
    const previous = this.getValueAt(1);

    if (!current || !previous) {
      return false;
    }

    return current.histogram > previous.histogram;
  }
}
