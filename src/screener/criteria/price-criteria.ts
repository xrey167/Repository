/**
 * Price-based screening criteria
 * Detects price breakouts, support/resistance tests, etc.
 */

import type { ICriteria, ScreeningContext, ScreeningResult } from './criteria.interface';
import { SMAIndicator } from '@/indicators';
import { createLogger } from '@/utils';

/**
 * Price breakout criteria
 * Detects when price breaks above resistance or below support
 */
export class PriceBreakoutCriteria implements ICriteria {
  readonly name = 'PriceBreakout';
  readonly description = 'Detects price breakouts from trading range';

  private lookbackPeriod: number;
  private breakoutPercent: number;
  private logger = createLogger('PriceBreakoutCriteria');

  constructor(lookbackPeriod: number = 20, breakoutPercent: number = 2) {
    this.lookbackPeriod = lookbackPeriod;
    this.breakoutPercent = breakoutPercent;
  }

  check(context: ScreeningContext): ScreeningResult | null {
    const { candles } = context;

    if (!candles || candles.length < this.lookbackPeriod + 1) {
      return null;
    }

    const recentCandles = candles.slice(-this.lookbackPeriod - 1, -1);
    const currentCandle = candles[candles.length - 1];

    // Find resistance (highest high)
    const resistance = Math.max(...recentCandles.map((c) => c.high));

    // Find support (lowest low)
    const support = Math.min(...recentCandles.map((c) => c.low));

    const range = resistance - support;
    const breakoutThreshold = (this.breakoutPercent / 100) * range;

    // Check for upward breakout
    if (currentCandle.close > resistance + breakoutThreshold) {
      const score = Math.min(1, ((currentCandle.close - resistance) / range) * 2);

      return {
        symbol: context.symbol.symbol,
        score,
        reason: `Upward breakout above ${resistance.toFixed(2)} (${this.breakoutPercent}%)`,
        metadata: { resistance, support, breakoutType: 'upward' },
      };
    }

    // Check for downward breakout
    if (currentCandle.close < support - breakoutThreshold) {
      const score = Math.min(1, ((support - currentCandle.close) / range) * 2);

      return {
        symbol: context.symbol.symbol,
        score,
        reason: `Downward breakout below ${support.toFixed(2)} (${this.breakoutPercent}%)`,
        metadata: { resistance, support, breakoutType: 'downward' },
      };
    }

    return null;
  }

  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      lookbackPeriod: this.lookbackPeriod,
      breakoutPercent: this.breakoutPercent,
    };
  }
}

/**
 * Moving average touch criteria
 * Detects when price touches a moving average
 */
export class MATouchCriteria implements ICriteria {
  readonly name = 'MATouch';
  readonly description = 'Detects when price touches moving average';

  private period: number;
  private tolerance: number; // Percentage tolerance for "touching"
  private logger = createLogger('MATouchCriteria');

  constructor(period: number = 50, tolerance: number = 0.5) {
    this.period = period;
    this.tolerance = tolerance;
  }

  check(context: ScreeningContext): ScreeningResult | null {
    const { candles } = context;

    if (!candles || candles.length < this.period + 1) {
      return null;
    }

    const sma = new SMAIndicator(this.period);
    const maValue = sma.calculate(candles);

    if (maValue === null) {
      return null;
    }

    const currentPrice = candles[candles.length - 1].close;
    const distance = Math.abs(currentPrice - maValue);
    const distancePercent = (distance / maValue) * 100;

    // Check if price is touching MA (within tolerance)
    if (distancePercent <= this.tolerance) {
      const score = 1 - distancePercent / this.tolerance;

      return {
        symbol: context.symbol.symbol,
        score,
        reason: `Price ${currentPrice.toFixed(2)} touching ${this.period}-period MA ${maValue.toFixed(2)}`,
        metadata: { maValue, distance: distancePercent },
      };
    }

    return null;
  }

  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      tolerance: this.tolerance,
    };
  }
}
