/**
 * SMA Crossover Strategy
 * Simple moving average crossover strategy
 * Buy when fast SMA crosses above slow SMA, sell when crosses below
 */

import type { Candle, Signal } from '@/core/types';
import { StrategyBase, type StrategyConfig, type StrategyContext } from '../base';
import { SMAIndicator } from '@/indicators';

/**
 * SMA Crossover Strategy
 *
 * @example
 * ```typescript
 * const strategy = new SMACrossoverStrategy({
 *   name: 'SMA-Crossover',
 *   description: '20/50 SMA crossover',
 *   symbols: ['BTCUSD'],
 *   timeframe: '1h',
 *   parameters: { fastPeriod: 20, slowPeriod: 50 },
 * });
 * ```
 */
export class SMACrossoverStrategy extends StrategyBase {
  readonly name = 'SMA-Crossover';
  readonly description = 'Simple moving average crossover strategy';

  private fastSMA!: SMAIndicator;
  private slowSMA!: SMAIndicator;

  constructor(config: StrategyConfig) {
    super(config);
  }

  async initialize(context: StrategyContext): Promise<void> {
    await super.initialize(context);

    const fastPeriod = this.getParameter('fastPeriod', 20);
    const slowPeriod = this.getParameter('slowPeriod', 50);

    // Create indicators
    this.fastSMA = new SMAIndicator(fastPeriod);
    this.slowSMA = new SMAIndicator(slowPeriod);

    // Register indicators with context
    context.registerIndicator('fastSMA', this.fastSMA);
    context.registerIndicator('slowSMA', this.slowSMA);

    this.log('info', `Initialized with ${fastPeriod}/${slowPeriod} SMA`);
  }

  async onCandle(candle: Candle, context: StrategyContext): Promise<Signal[]> {
    const signals: Signal[] = [];

    // Need enough candles
    const slowPeriod = this.getParameter('slowPeriod', 50);
    if (context.candles.length < slowPeriod + 1) {
      return signals;
    }

    // Calculate current and previous SMA values
    const fastCurrent = this.fastSMA.getValue();
    const slowCurrent = this.slowSMA.getValue();
    const fastPrev = this.fastSMA.getValueAt(1);
    const slowPrev = this.slowSMA.getValueAt(1);

    if (
      fastCurrent === null ||
      slowCurrent === null ||
      fastPrev === null ||
      slowPrev === null
    ) {
      return signals;
    }

    const hasPosition = context.hasPosition();

    // Bullish crossover: Fast crosses above slow
    if (!hasPosition && fastPrev <= slowPrev && fastCurrent > slowCurrent) {
      const portfolio = context.getPortfolio();
      const quantity = Math.floor((portfolio.cash * 0.95) / candle.close);

      if (quantity > 0) {
        signals.push(
          this.createBuySignal(
            candle.close,
            quantity,
            `Bullish crossover: Fast SMA (${fastCurrent.toFixed(2)}) > Slow SMA (${slowCurrent.toFixed(2)})`
          )
        );

        this.log('info', `BUY signal: ${quantity} @ ${candle.close}`);
      }
    }

    // Bearish crossover: Fast crosses below slow
    if (hasPosition && fastPrev >= slowPrev && fastCurrent < slowCurrent) {
      const position = context.getPosition()!;

      signals.push(
        this.createSellSignal(
          candle.close,
          position.quantity,
          `Bearish crossover: Fast SMA (${fastCurrent.toFixed(2)}) < Slow SMA (${slowCurrent.toFixed(2)})`
        )
      );

      this.log('info', `SELL signal: ${position.quantity} @ ${candle.close}`);
    }

    return signals;
  }
}
