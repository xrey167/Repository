/**
 * Base indicator interface
 * All technical indicators implement this interface
 */

import type { Candle } from '@/core/types';

/**
 * Indicator result type
 * Can be a single value or an object with multiple values
 */
export type IndicatorValue = number | Record<string, number> | null;

/**
 * Indicator interface
 * Defines the contract for all technical indicators
 */
export interface IIndicator<T extends IndicatorValue = IndicatorValue> {
  /**
   * Indicator name (e.g., "SMA", "RSI", "MACD")
   */
  readonly name: string;

  /**
   * Calculate indicator value for a single candle
   * @param candles - Historical candles (includes current candle)
   * @param index - Index of the candle to calculate for (default: last candle)
   * @returns Indicator value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): T;

  /**
   * Calculate indicator values for multiple candles
   * @param candles - Historical candles
   * @returns Array of indicator values
   */
  calculateAll(candles: Candle[]): T[];

  /**
   * Update indicator with a new candle
   * More efficient than recalculating from scratch
   * @param candle - New candle
   * @returns Updated indicator value
   */
  update(candle: Candle): T;

  /**
   * Reset indicator state
   */
  reset(): void;

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown>;

  /**
   * Minimum number of candles required for calculation
   */
  readonly requiredCandles: number;
}

/**
 * Indicator parameters interface
 * Common parameters shared by many indicators
 */
export interface IndicatorParams {
  /**
   * Period/length for calculation
   */
  period?: number;

  /**
   * Price field to use ('close', 'open', 'high', 'low', 'hl2', 'hlc3', 'ohlc4')
   */
  source?: PriceSource;
}

/**
 * Price source type
 */
export type PriceSource = 'close' | 'open' | 'high' | 'low' | 'hl2' | 'hlc3' | 'ohlc4';

/**
 * Extract price from candle based on source
 * @param candle - Candle data
 * @param source - Price source
 * @returns Price value
 */
export function getPrice(candle: Candle, source: PriceSource = 'close'): number {
  switch (source) {
    case 'close':
      return candle.close;
    case 'open':
      return candle.open;
    case 'high':
      return candle.high;
    case 'low':
      return candle.low;
    case 'hl2':
      return (candle.high + candle.low) / 2;
    case 'hlc3':
      return (candle.high + candle.low + candle.close) / 3;
    case 'ohlc4':
      return (candle.open + candle.high + candle.low + candle.close) / 4;
    default:
      return candle.close;
  }
}
