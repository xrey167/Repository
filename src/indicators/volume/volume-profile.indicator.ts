/**
 * Volume Profile indicator
 * Shows volume distribution across price levels
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';

/**
 * Price level with volume
 */
export interface PriceLevel {
  price: number;
  volume: number;
}

/**
 * Volume Profile result
 */
export interface VolumeProfileValue extends Record<string, number | number[] | null> {
  /**
   * Point of Control (price level with highest volume)
   */
  poc: number | null;

  /**
   * Value Area High (top of 70% volume area)
   */
  valueAreaHigh: number | null;

  /**
   * Value Area Low (bottom of 70% volume area)
   */
  valueAreaLow: number | null;

  /**
   * Total volume in the period
   */
  totalVolume: number | null;

  /**
   * Volume distribution by price level (stored as array of numbers)
   */
  levels: number[] | null;
}

/**
 * Volume Profile indicator
 *
 * Shows where volume traded at each price level
 * Helps identify support/resistance and fair value areas
 *
 * @example
 * ```typescript
 * const vp = new VolumeProfileIndicator(100, 50); // 100 periods, 50 bins
 * const value = vp.calculate(candles);
 * console.log('Point of Control:', value.poc);
 * console.log('Value Area:', value.valueAreaLow, '-', value.valueAreaHigh);
 * ```
 */
export class VolumeProfileIndicator extends IndicatorBase<VolumeProfileValue> {
  readonly name = 'VolumeProfile';
  readonly requiredCandles: number;

  private period: number;
  private bins: number;

  constructor(period: number = 100, bins: number = 50) {
    super('close');
    this.period = period;
    this.bins = bins;
    this.requiredCandles = period;
  }

  /**
   * Calculate Volume Profile for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns Volume Profile value or null if not enough data
   */
  calculate(candles: Candle[], index?: number): VolumeProfileValue | null {
    const idx = index ?? candles.length - 1;

    // Need at least 'period' candles
    if (idx < this.period - 1) {
      return null;
    }

    const periodCandles = candles.slice(idx - this.period + 1, idx + 1);

    // Find price range
    let highestPrice = -Infinity;
    let lowestPrice = Infinity;
    let totalVolume = 0;

    for (const candle of periodCandles) {
      if (candle.high > highestPrice) {
        highestPrice = candle.high;
      }
      if (candle.low < lowestPrice) {
        lowestPrice = candle.low;
      }
      totalVolume += candle.volume;
    }

    const priceRange = highestPrice - lowestPrice;
    const binSize = priceRange / this.bins;

    // Initialize bins
    const volumeByBin: number[] = new Array(this.bins).fill(0);

    // Distribute volume across bins
    for (const candle of periodCandles) {
      // Approximate volume distribution within candle range
      const candleRange = candle.high - candle.low;
      const volumePerPrice = candleRange === 0 ? candle.volume : candle.volume / candleRange;

      // Find bins that this candle touches
      const lowBin = Math.floor((candle.low - lowestPrice) / binSize);
      const highBin = Math.floor((candle.high - lowestPrice) / binSize);

      const startBin = Math.max(0, lowBin);
      const endBin = Math.min(this.bins - 1, highBin);

      // Distribute volume to bins
      for (let bin = startBin; bin <= endBin; bin++) {
        const binLow = lowestPrice + bin * binSize;
        const binHigh = binLow + binSize;

        // Calculate overlap between candle and bin
        const overlapLow = Math.max(candle.low, binLow);
        const overlapHigh = Math.min(candle.high, binHigh);
        const overlapRange = Math.max(0, overlapHigh - overlapLow);

        volumeByBin[bin] += overlapRange * volumePerPrice;
      }
    }

    // Find Point of Control (highest volume bin)
    let maxVolume = -Infinity;
    let pocBin = 0;

    for (let i = 0; i < this.bins; i++) {
      if (volumeByBin[i] > maxVolume) {
        maxVolume = volumeByBin[i];
        pocBin = i;
      }
    }

    const poc = lowestPrice + (pocBin + 0.5) * binSize;

    // Calculate Value Area (70% of volume)
    const targetVolume = totalVolume * 0.7;
    let valueAreaVolume = volumeByBin[pocBin];
    let vaLowBin = pocBin;
    let vaHighBin = pocBin;

    // Expand value area around POC until 70% volume is captured
    while (valueAreaVolume < targetVolume && (vaLowBin > 0 || vaHighBin < this.bins - 1)) {
      const canExpandLow = vaLowBin > 0;
      const canExpandHigh = vaHighBin < this.bins - 1;

      if (!canExpandLow && !canExpandHigh) {
        break;
      }

      const lowVolume = canExpandLow ? volumeByBin[vaLowBin - 1] : -Infinity;
      const highVolume = canExpandHigh ? volumeByBin[vaHighBin + 1] : -Infinity;

      if (lowVolume > highVolume) {
        vaLowBin--;
        valueAreaVolume += volumeByBin[vaLowBin];
      } else {
        vaHighBin++;
        valueAreaVolume += volumeByBin[vaHighBin];
      }
    }

    const valueAreaLow = lowestPrice + vaLowBin * binSize;
    const valueAreaHigh = lowestPrice + (vaHighBin + 1) * binSize;

    // Return volume distribution by bin
    const levels = volumeByBin.filter(v => v > 0);

    return {
      poc,
      valueAreaHigh,
      valueAreaLow,
      totalVolume,
      levels,
    };
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      bins: this.bins,
    };
  }

  /**
   * Check if price is in value area
   * @param price - Price to check
   */
  isInValueArea(price: number): boolean {
    const value = this.getValue();
    if (!value || value.valueAreaLow === null || value.valueAreaHigh === null) {
      return false;
    }

    return price >= value.valueAreaLow && price <= value.valueAreaHigh;
  }

  /**
   * Check if price is near Point of Control
   * @param price - Price to check
   * @param threshold - Percentage threshold (default: 0.5%)
   */
  isNearPOC(price: number, threshold: number = 0.005): boolean {
    const value = this.getValue();
    if (!value || value.poc === null) {
      return false;
    }

    const diff = Math.abs(price - value.poc);
    const percentDiff = diff / value.poc;

    return percentDiff <= threshold;
  }
}
