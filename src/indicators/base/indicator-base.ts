/**
 * Abstract base class for indicators
 * Provides common functionality and state management
 */

import type { Candle } from '@/core/types';
import type { IIndicator, IndicatorValue, PriceSource } from './indicator.interface';
import { getPrice } from './indicator.interface';

/**
 * Abstract base indicator class
 * Implements common functionality for all indicators
 */
export abstract class IndicatorBase<T extends IndicatorValue = IndicatorValue>
  implements IIndicator<T>
{
  abstract readonly name: string;
  abstract requiredCandles: number;

  protected candles: Candle[] = [];
  protected values: (T | null)[] = [];
  protected source: PriceSource;

  constructor(source: PriceSource = 'close') {
    this.source = source;
  }

  /**
   * Calculate indicator value for a single candle
   */
  abstract calculate(candles: Candle[], index?: number): T | null;

  /**
   * Calculate indicator values for all candles
   */
  calculateAll(candles: Candle[]): (T | null)[] {
    const results: (T | null)[] = [];

    for (let i = 0; i < candles.length; i++) {
      results.push(this.calculate(candles, i));
    }

    return results;
  }

  /**
   * Update indicator with new candle
   */
  update(candle: Candle): T | null {
    this.candles.push(candle);

    // Keep only required candles for efficiency
    const maxCandles = this.requiredCandles * 2;
    if (this.candles.length > maxCandles) {
      this.candles = this.candles.slice(-maxCandles);
    }

    const value = this.calculate(this.candles);
    this.values.push(value);

    // Keep values array from growing too large
    if (this.values.length > maxCandles) {
      this.values = this.values.slice(-maxCandles);
    }

    return value;
  }

  /**
   * Reset indicator state
   */
  reset(): void {
    this.candles = [];
    this.values = [];
  }

  /**
   * Get indicator configuration
   */
  abstract getConfig(): Record<string, unknown>;

  /**
   * Get price from candle based on source
   */
  protected getPrice(candle: Candle): number {
    return getPrice(candle, this.source);
  }

  /**
   * Get prices array from candles
   */
  protected getPrices(candles: Candle[]): number[] {
    return candles.map((candle) => this.getPrice(candle));
  }

  /**
   * Get current value (most recent)
   */
  getValue(): T | null {
    return this.values.length > 0 ? this.values[this.values.length - 1] : null;
  }

  /**
   * Get value at specific index (from end)
   * @param index - Index from end (0 = most recent, 1 = previous, etc.)
   */
  getValueAt(index: number): T | null {
    const actualIndex = this.values.length - 1 - index;
    return actualIndex >= 0 ? this.values[actualIndex] : null;
  }

  /**
   * Get all calculated values
   */
  getValues(): (T | null)[] {
    return [...this.values];
  }

  /**
   * Check if indicator has enough data
   */
  hasEnoughData(candles?: Candle[]): boolean {
    const data = candles || this.candles;
    return data.length >= this.requiredCandles;
  }
}
