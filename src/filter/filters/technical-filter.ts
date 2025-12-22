/**
 * Technical filter
 * Filters symbols based on technical indicators
 */

import type { IFilter, FilterContext, FilterResult } from './filter.interface';
import { RSIIndicator, SMAIndicator, MACDIndicator } from '@/indicators';
import { createLogger } from '@/utils';

/**
 * Technical filter criteria
 */
export type TechnicalCriteria =
  | 'rsi_oversold'
  | 'rsi_overbought'
  | 'sma_crossover'
  | 'sma_below'
  | 'sma_above'
  | 'macd_bullish'
  | 'macd_bearish'
  | 'price_above_sma'
  | 'price_below_sma';

/**
 * Technical filter options
 */
export interface TechnicalFilterOptions {
  /**
   * Technical criteria to check
   */
  criteria: TechnicalCriteria;

  /**
   * RSI period (for RSI criteria)
   */
  rsiPeriod?: number;

  /**
   * RSI oversold level
   */
  rsiOversold?: number;

  /**
   * RSI overbought level
   */
  rsiOverbought?: number;

  /**
   * Fast SMA period
   */
  fastSMA?: number;

  /**
   * Slow SMA period
   */
  slowSMA?: number;

  /**
   * MACD fast period
   */
  macdFast?: number;

  /**
   * MACD slow period
   */
  macdSlow?: number;

  /**
   * MACD signal period
   */
  macdSignal?: number;
}

/**
 * Technical filter
 * Filters based on technical indicator conditions
 */
export class TechnicalFilter implements IFilter {
  readonly name = 'TechnicalFilter';
  readonly description: string;

  private options: TechnicalFilterOptions;
  private logger = createLogger('TechnicalFilter');

  constructor(options: TechnicalFilterOptions) {
    this.options = {
      rsiPeriod: 14,
      rsiOversold: 30,
      rsiOverbought: 70,
      fastSMA: 20,
      slowSMA: 50,
      macdFast: 12,
      macdSlow: 26,
      macdSignal: 9,
      ...options,
    };

    this.description = `Filter by ${options.criteria}`;
  }

  /**
   * Apply technical filter
   */
  apply(context: FilterContext): FilterResult {
    const { candles } = context;

    if (!candles || candles.length === 0) {
      return {
        passed: false,
        reason: 'No candle data available',
        score: 0,
      };
    }

    switch (this.options.criteria) {
      case 'rsi_oversold':
        return this.checkRSIOversold(candles, context);

      case 'rsi_overbought':
        return this.checkRSIOverbought(candles, context);

      case 'sma_crossover':
        return this.checkSMACrossover(candles, context);

      case 'sma_below':
        return this.checkSMABelow(candles, context);

      case 'sma_above':
        return this.checkSMAAbove(candles, context);

      case 'macd_bullish':
        return this.checkMACDBullish(candles, context);

      case 'macd_bearish':
        return this.checkMACDBearish(candles, context);

      case 'price_above_sma':
        return this.checkPriceAboveSMA(candles, context);

      case 'price_below_sma':
        return this.checkPriceBelowSMA(candles, context);

      default:
        return {
          passed: false,
          reason: `Unknown criteria: ${this.options.criteria}`,
          score: 0,
        };
    }
  }

  /**
   * Check RSI oversold
   */
  private checkRSIOversold(candles: any[], context: FilterContext): FilterResult {
    const rsi = new RSIIndicator(this.options.rsiPeriod!);
    const value = rsi.calculate(candles);

    if (value === null) {
      return { passed: false, reason: 'Not enough data for RSI', score: 0 };
    }

    const passed = value < this.options.rsiOversold!;
    const score = passed ? (this.options.rsiOversold! - value) / this.options.rsiOversold! : 0;

    return {
      passed,
      reason: passed ? undefined : `RSI ${value.toFixed(2)} not oversold`,
      score,
    };
  }

  /**
   * Check RSI overbought
   */
  private checkRSIOverbought(candles: any[], context: FilterContext): FilterResult {
    const rsi = new RSIIndicator(this.options.rsiPeriod!);
    const value = rsi.calculate(candles);

    if (value === null) {
      return { passed: false, reason: 'Not enough data for RSI', score: 0 };
    }

    const passed = value > this.options.rsiOverbought!;
    const score = passed ? (value - this.options.rsiOverbought!) / (100 - this.options.rsiOverbought!) : 0;

    return {
      passed,
      reason: passed ? undefined : `RSI ${value.toFixed(2)} not overbought`,
      score,
    };
  }

  /**
   * Check SMA crossover (fast crosses above slow)
   */
  private checkSMACrossover(candles: any[], context: FilterContext): FilterResult {
    const fastSMA = new SMAIndicator(this.options.fastSMA!);
    const slowSMA = new SMAIndicator(this.options.slowSMA!);

    const fastCurrent = fastSMA.calculate(candles);
    const slowCurrent = slowSMA.calculate(candles);
    const fastPrev = fastSMA.calculate(candles, candles.length - 2);
    const slowPrev = slowSMA.calculate(candles, candles.length - 2);

    if (fastCurrent === null || slowCurrent === null || fastPrev === null || slowPrev === null) {
      return { passed: false, reason: 'Not enough data for SMA crossover', score: 0 };
    }

    const crossed = fastPrev <= slowPrev && fastCurrent > slowCurrent;

    return {
      passed: crossed,
      reason: crossed ? undefined : 'No SMA crossover detected',
      score: crossed ? 1 : 0,
    };
  }

  /**
   * Check fast SMA below slow SMA
   */
  private checkSMABelow(candles: any[], context: FilterContext): FilterResult {
    const fastSMA = new SMAIndicator(this.options.fastSMA!);
    const slowSMA = new SMAIndicator(this.options.slowSMA!);

    const fast = fastSMA.calculate(candles);
    const slow = slowSMA.calculate(candles);

    if (fast === null || slow === null) {
      return { passed: false, reason: 'Not enough data for SMA', score: 0 };
    }

    const passed = fast < slow;
    const score = passed ? (slow - fast) / slow : 0;

    return {
      passed,
      reason: passed ? undefined : 'Fast SMA not below slow SMA',
      score,
    };
  }

  /**
   * Check fast SMA above slow SMA
   */
  private checkSMAAbove(candles: any[], context: FilterContext): FilterResult {
    const fastSMA = new SMAIndicator(this.options.fastSMA!);
    const slowSMA = new SMAIndicator(this.options.slowSMA!);

    const fast = fastSMA.calculate(candles);
    const slow = slowSMA.calculate(candles);

    if (fast === null || slow === null) {
      return { passed: false, reason: 'Not enough data for SMA', score: 0 };
    }

    const passed = fast > slow;
    const score = passed ? (fast - slow) / slow : 0;

    return {
      passed,
      reason: passed ? undefined : 'Fast SMA not above slow SMA',
      score,
    };
  }

  /**
   * Check MACD bullish crossover
   */
  private checkMACDBullish(candles: any[], context: FilterContext): FilterResult {
    const macd = new MACDIndicator(
      this.options.macdFast!,
      this.options.macdSlow!,
      this.options.macdSignal!
    );

    const current = macd.calculate(candles);
    const previous = macd.calculate(candles, candles.length - 2);

    if (!current || !previous ||
        current.macd === null || current.signal === null ||
        previous.macd === null || previous.signal === null) {
      return { passed: false, reason: 'Not enough data for MACD', score: 0 };
    }

    const crossed = previous.macd <= previous.signal && current.macd > current.signal;

    return {
      passed: crossed,
      reason: crossed ? undefined : 'No MACD bullish crossover',
      score: crossed ? 1 : 0,
    };
  }

  /**
   * Check MACD bearish crossover
   */
  private checkMACDBearish(candles: any[], context: FilterContext): FilterResult {
    const macd = new MACDIndicator(
      this.options.macdFast!,
      this.options.macdSlow!,
      this.options.macdSignal!
    );

    const current = macd.calculate(candles);
    const previous = macd.calculate(candles, candles.length - 2);

    if (!current || !previous ||
        current.macd === null || current.signal === null ||
        previous.macd === null || previous.signal === null) {
      return { passed: false, reason: 'Not enough data for MACD', score: 0 };
    }

    const crossed = previous.macd >= previous.signal && current.macd < current.signal;

    return {
      passed: crossed,
      reason: crossed ? undefined : 'No MACD bearish crossover',
      score: crossed ? 1 : 0,
    };
  }

  /**
   * Check price above SMA
   */
  private checkPriceAboveSMA(candles: any[], context: FilterContext): FilterResult {
    const sma = new SMAIndicator(this.options.slowSMA!);
    const smaValue = sma.calculate(candles);

    if (smaValue === null) {
      return { passed: false, reason: 'Not enough data for SMA', score: 0 };
    }

    const currentPrice = candles[candles.length - 1].close;
    const passed = currentPrice > smaValue;
    const score = passed ? (currentPrice - smaValue) / smaValue : 0;

    return {
      passed,
      reason: passed ? undefined : 'Price not above SMA',
      score,
    };
  }

  /**
   * Check price below SMA
   */
  private checkPriceBelowSMA(candles: any[], context: FilterContext): FilterResult {
    const sma = new SMAIndicator(this.options.slowSMA!);
    const smaValue = sma.calculate(candles);

    if (smaValue === null) {
      return { passed: false, reason: 'Not enough data for SMA', score: 0 };
    }

    const currentPrice = candles[candles.length - 1].close;
    const passed = currentPrice < smaValue;
    const score = passed ? (smaValue - currentPrice) / smaValue : 0;

    return {
      passed,
      reason: passed ? undefined : 'Price not below SMA',
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
