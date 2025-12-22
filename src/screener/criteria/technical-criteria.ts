/**
 * Technical analysis screening criteria
 * Detects technical setups and patterns
 */

import type { ICriteria, ScreeningContext, ScreeningResult } from './criteria.interface';
import { RSIIndicator, MACDIndicator, SMAIndicator } from '@/indicators';
import { createLogger } from '@/utils';

/**
 * RSI oversold/overbought criteria
 */
export class RSIOversoldOverboughtCriteria implements ICriteria {
  readonly name: string;
  readonly description: string;

  private period: number;
  private threshold: number;
  private type: 'oversold' | 'overbought';
  private logger = createLogger('RSIOversoldOverboughtCriteria');

  constructor(period: number = 14, type: 'oversold' | 'overbought' = 'oversold') {
    this.period = period;
    this.type = type;
    this.threshold = type === 'oversold' ? 30 : 70;
    this.name = type === 'oversold' ? 'RSIOversold' : 'RSIOverbought';
    this.description = `Detects RSI ${type} conditions`;
  }

  check(context: ScreeningContext): ScreeningResult | null {
    const { candles } = context;

    if (!candles || candles.length < this.period + 1) {
      return null;
    }

    const rsi = new RSIIndicator(this.period);
    const value = rsi.calculate(candles);

    if (value === null) {
      return null;
    }

    const isMatch =
      this.type === 'oversold' ? value < this.threshold : value > this.threshold;

    if (isMatch) {
      const distance =
        this.type === 'oversold' ? this.threshold - value : value - this.threshold;

      const score = Math.min(1, distance / this.threshold);

      return {
        symbol: context.symbol.symbol,
        score,
        reason: `RSI ${this.type}: ${value.toFixed(2)} (threshold: ${this.threshold})`,
        metadata: { rsi: value, threshold: this.threshold, type: this.type },
      };
    }

    return null;
  }

  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      type: this.type,
      threshold: this.threshold,
    };
  }
}

/**
 * MACD crossover criteria
 */
export class MACDCrossoverCriteria implements ICriteria {
  readonly name: string;
  readonly description: string;

  private fastPeriod: number;
  private slowPeriod: number;
  private signalPeriod: number;
  private type: 'bullish' | 'bearish';
  private logger = createLogger('MACDCrossoverCriteria');

  constructor(
    type: 'bullish' | 'bearish' = 'bullish',
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
  ) {
    this.fastPeriod = fastPeriod;
    this.slowPeriod = slowPeriod;
    this.signalPeriod = signalPeriod;
    this.type = type;
    this.name = type === 'bullish' ? 'MACDBullish' : 'MACDBearish';
    this.description = `Detects MACD ${type} crossover`;
  }

  check(context: ScreeningContext): ScreeningResult | null {
    const { candles } = context;

    if (!candles || candles.length < this.slowPeriod + this.signalPeriod) {
      return null;
    }

    const macd = new MACDIndicator(this.fastPeriod, this.slowPeriod, this.signalPeriod);
    const current = macd.calculate(candles);
    const previous = macd.calculate(candles, candles.length - 2);

    if (!current || !previous) {
      return null;
    }

    const isCrossover =
      this.type === 'bullish'
        ? previous.macd <= previous.signal && current.macd > current.signal
        : previous.macd >= previous.signal && current.macd < current.signal;

    if (isCrossover) {
      const distance = Math.abs(current.macd - current.signal);
      const score = Math.min(1, distance / Math.abs(current.signal || 1));

      return {
        symbol: context.symbol.symbol,
        score,
        reason: `MACD ${this.type} crossover detected`,
        metadata: {
          macd: current.macd,
          signal: current.signal,
          histogram: current.histogram,
          type: this.type,
        },
      };
    }

    return null;
  }

  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      fastPeriod: this.fastPeriod,
      slowPeriod: this.slowPeriod,
      signalPeriod: this.signalPeriod,
      type: this.type,
    };
  }
}

/**
 * Golden/Death cross criteria (SMA crossover)
 */
export class GoldenDeathCrossCriteria implements ICriteria {
  readonly name: string;
  readonly description: string;

  private fastPeriod: number;
  private slowPeriod: number;
  private type: 'golden' | 'death';
  private logger = createLogger('GoldenDeathCrossCriteria');

  constructor(type: 'golden' | 'death' = 'golden', fastPeriod: number = 50, slowPeriod: number = 200) {
    this.fastPeriod = fastPeriod;
    this.slowPeriod = slowPeriod;
    this.type = type;
    this.name = type === 'golden' ? 'GoldenCross' : 'DeathCross';
    this.description = `Detects ${type} cross (${fastPeriod}/${slowPeriod} SMA)`;
  }

  check(context: ScreeningContext): ScreeningResult | null {
    const { candles } = context;

    if (!candles || candles.length < this.slowPeriod + 1) {
      return null;
    }

    const fastSMA = new SMAIndicator(this.fastPeriod);
    const slowSMA = new SMAIndicator(this.slowPeriod);

    const fastCurrent = fastSMA.calculate(candles);
    const slowCurrent = slowSMA.calculate(candles);
    const fastPrev = fastSMA.calculate(candles, candles.length - 2);
    const slowPrev = slowSMA.calculate(candles, candles.length - 2);

    if (
      fastCurrent === null ||
      slowCurrent === null ||
      fastPrev === null ||
      slowPrev === null
    ) {
      return null;
    }

    const isCross =
      this.type === 'golden'
        ? fastPrev <= slowPrev && fastCurrent > slowCurrent
        : fastPrev >= slowPrev && fastCurrent < slowCurrent;

    if (isCross) {
      const distance = Math.abs(fastCurrent - slowCurrent);
      const score = Math.min(1, (distance / slowCurrent) * 100);

      return {
        symbol: context.symbol.symbol,
        score,
        reason: `${this.type === 'golden' ? 'Golden' : 'Death'} cross: ${this.fastPeriod}/${this.slowPeriod} SMA`,
        metadata: {
          fastSMA: fastCurrent,
          slowSMA: slowCurrent,
          type: this.type,
        },
      };
    }

    return null;
  }

  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      fastPeriod: this.fastPeriod,
      slowPeriod: this.slowPeriod,
      type: this.type,
    };
  }
}
