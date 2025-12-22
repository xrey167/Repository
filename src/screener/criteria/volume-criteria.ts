/**
 * Volume-based screening criteria
 * Detects volume spikes, unusual volume, etc.
 */

import type { ICriteria, ScreeningContext, ScreeningResult } from './criteria.interface';
import { SMAIndicator } from '@/indicators';
import { createLogger } from '@/utils';

/**
 * Volume spike criteria
 * Detects unusual volume spikes
 */
export class VolumeSpikeCriteria implements ICriteria {
  readonly name = 'VolumeSpike';
  readonly description = 'Detects unusual volume spikes';

  private period: number;
  private spikeMultiplier: number;
  private logger = createLogger('VolumeSpikeCriteria');

  constructor(period: number = 20, spikeMultiplier: number = 2.0) {
    this.period = period;
    this.spikeMultiplier = spikeMultiplier;
  }

  check(context: ScreeningContext): ScreeningResult | null {
    const { candles } = context;

    if (!candles || candles.length < this.period + 1) {
      return null;
    }

    // Calculate average volume
    const recentCandles = candles.slice(-this.period - 1, -1);
    const avgVolume =
      recentCandles.reduce((sum, c) => sum + c.volume, 0) / recentCandles.length;

    const currentVolume = candles[candles.length - 1].volume;
    const volumeRatio = currentVolume / avgVolume;

    // Check for volume spike
    if (volumeRatio >= this.spikeMultiplier) {
      const score = Math.min(1, volumeRatio / (this.spikeMultiplier * 2));

      return {
        symbol: context.symbol.symbol,
        score,
        reason: `Volume spike ${volumeRatio.toFixed(2)}x average (${this.spikeMultiplier}x threshold)`,
        metadata: { volumeRatio, avgVolume, currentVolume },
      };
    }

    return null;
  }

  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      spikeMultiplier: this.spikeMultiplier,
    };
  }
}

/**
 * Volume trend criteria
 * Detects increasing or decreasing volume trends
 */
export class VolumeTrendCriteria implements ICriteria {
  readonly name = 'VolumeTrend';
  readonly description = 'Detects volume trends';

  private period: number;
  private direction: 'increasing' | 'decreasing';
  private logger = createLogger('VolumeTrendCriteria');

  constructor(period: number = 10, direction: 'increasing' | 'decreasing' = 'increasing') {
    this.period = period;
    this.direction = direction;
  }

  check(context: ScreeningContext): ScreeningResult | null {
    const { candles } = context;

    if (!candles || candles.length < this.period + 1) {
      return null;
    }

    // Get volume candles for SMA
    const volumeCandles = candles.slice(-this.period - 1).map((c) => ({
      ...c,
      close: c.volume,
      open: c.volume,
      high: c.volume,
      low: c.volume,
    }));

    const sma = new SMAIndicator(5);
    const recentMA = sma.calculate(volumeCandles);
    const previousMA = sma.calculate(volumeCandles, volumeCandles.length - 5);

    if (recentMA === null || previousMA === null) {
      return null;
    }

    const isTrending =
      this.direction === 'increasing' ? recentMA > previousMA : recentMA < previousMA;

    if (isTrending) {
      const change = Math.abs((recentMA - previousMA) / previousMA);
      const score = Math.min(1, change * 5); // Scale to 0-1

      return {
        symbol: context.symbol.symbol,
        score,
        reason: `Volume ${this.direction} (MA: ${recentMA.toFixed(0)} vs ${previousMA.toFixed(0)})`,
        metadata: { recentMA, previousMA, direction: this.direction },
      };
    }

    return null;
  }

  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      direction: this.direction,
    };
  }
}
