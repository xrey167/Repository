/**
 * RSI Mean Reversion Strategy
 * Buy when RSI is oversold, sell when overbought
 */

import type { Candle, Signal } from '@/core/types';
import { StrategyBase, type StrategyConfig, type StrategyContext } from '../base';
import { RSIIndicator } from '@/indicators';

/**
 * RSI Mean Reversion Strategy
 *
 * @example
 * ```typescript
 * const strategy = new RSIMeanReversionStrategy({
 *   name: 'RSI-MeanReversion',
 *   description: 'RSI oversold/overbought strategy',
 *   symbols: ['BTCUSD'],
 *   timeframe: '1h',
 *   parameters: { period: 14, oversold: 30, overbought: 70 },
 * });
 * ```
 */
export class RSIMeanReversionStrategy extends StrategyBase {
  readonly name = 'RSI-MeanReversion';
  readonly description = 'RSI mean reversion strategy';

  private rsi!: RSIIndicator;

  constructor(config: StrategyConfig) {
    super(config);
  }

  async initialize(context: StrategyContext): Promise<void> {
    await super.initialize(context);

    const period = this.getParameter('period', 14);

    // Create RSI indicator
    this.rsi = new RSIIndicator(period);

    // Register with context
    context.registerIndicator('rsi', this.rsi);

    this.log('info', `Initialized with ${period}-period RSI`);
  }

  async onCandle(candle: Candle, context: StrategyContext): Promise<Signal[]> {
    const signals: Signal[] = [];

    const period = this.getParameter('period', 14);
    if (context.candles.length < period + 1) {
      return signals;
    }

    const rsiValue = this.rsi.getValue();
    if (rsiValue === null) {
      return signals;
    }

    const oversoldLevel = this.getParameter('oversold', 30);
    const overboughtLevel = this.getParameter('overbought', 70);
    const hasPosition = context.hasPosition();

    // Buy when oversold
    if (!hasPosition && rsiValue < oversoldLevel) {
      const portfolio = context.getPortfolio();
      const quantity = Math.floor((portfolio.cash * 0.95) / candle.close);

      if (quantity > 0) {
        signals.push(
          this.createBuySignal(
            candle.close,
            quantity,
            `RSI oversold: ${rsiValue.toFixed(2)} < ${oversoldLevel}`
          )
        );

        this.log('info', `BUY signal: RSI ${rsiValue.toFixed(2)} (oversold)`);
      }
    }

    // Sell when overbought
    if (hasPosition && rsiValue > overboughtLevel) {
      const position = context.getPosition()!;

      signals.push(
        this.createSellSignal(
          candle.close,
          position.quantity,
          `RSI overbought: ${rsiValue.toFixed(2)} > ${overboughtLevel}`
        )
      );

      this.log('info', `SELL signal: RSI ${rsiValue.toFixed(2)} (overbought)`);
    }

    return signals;
  }
}
