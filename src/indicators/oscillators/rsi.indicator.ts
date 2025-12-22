/**
 * Relative Strength Index (RSI) indicator
 * Momentum oscillator that measures the speed and magnitude of price changes
 * Range: 0-100, typically overbought > 70, oversold < 30
 */

import type { Candle } from '@/core/types';
import { IndicatorBase } from '../base/indicator-base';
import type { PriceSource } from '../base';

/**
 * RSI indicator
 *
 * Formula:
 * RSI = 100 - (100 / (1 + RS))
 * where RS = Average Gain / Average Loss
 *
 * @example
 * ```typescript
 * const rsi = new RSIIndicator(14); // 14-period RSI
 * const value = rsi.calculate(candles);
 * if (value < 30) console.log('Oversold');
 * if (value > 70) console.log('Overbought');
 * ```
 */
export class RSIIndicator extends IndicatorBase<number> {
  readonly name = 'RSI';
  readonly requiredCandles: number;

  private period: number;
  private previousAvgGain: number | null = null;
  private previousAvgLoss: number | null = null;

  constructor(period: number = 14, source: PriceSource = 'close') {
    super(source);
    this.period = period;
    this.requiredCandles = period + 1; // Need period + 1 for initial calculation
  }

  /**
   * Calculate RSI for given candles
   * @param candles - Historical candles
   * @param index - Index to calculate at (default: last candle)
   * @returns RSI value (0-100) or null if not enough data
   */
  calculate(candles: Candle[], index?: number): number | null {
    const idx = index ?? candles.length - 1;

    // Need at least period + 1 candles
    if (idx < this.period) {
      return null;
    }

    const prices = this.getPrices(candles.slice(0, idx + 1));

    // Calculate price changes
    const changes: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }

    // For the first RSI calculation
    if (idx === this.period) {
      const gains = changes.slice(0, this.period).map((c) => (c > 0 ? c : 0));
      const losses = changes.slice(0, this.period).map((c) => (c < 0 ? -c : 0));

      const avgGain = gains.reduce((sum, g) => sum + g, 0) / this.period;
      const avgLoss = losses.reduce((sum, l) => sum + l, 0) / this.period;

      this.previousAvgGain = avgGain;
      this.previousAvgLoss = avgLoss;

      if (avgLoss === 0) {
        return 100;
      }

      const rs = avgGain / avgLoss;
      return 100 - 100 / (1 + rs);
    }

    // For subsequent calculations, use smoothed averages
    const currentChange = changes[changes.length - 1];
    const currentGain = currentChange > 0 ? currentChange : 0;
    const currentLoss = currentChange < 0 ? -currentChange : 0;

    let avgGain: number;
    let avgLoss: number;

    if (this.previousAvgGain !== null && this.previousAvgLoss !== null && idx === candles.length - 1) {
      // Use stored values for real-time calculation
      avgGain = (this.previousAvgGain * (this.period - 1) + currentGain) / this.period;
      avgLoss = (this.previousAvgLoss * (this.period - 1) + currentLoss) / this.period;
    } else {
      // Recalculate from scratch for historical values
      const prevRSI = this.calculate(candles, idx - 1);
      if (prevRSI === null) {
        return null;
      }

      // Reverse engineer previous avg gain/loss from RSI
      const prevRS = prevRSI === 100 ? 100 : (100 - prevRSI) / prevRSI;
      const prevAvgGain = prevRS / (1 + prevRS);
      const prevAvgLoss = 1 / (1 + prevRS);

      avgGain = (prevAvgGain * (this.period - 1) + currentGain) / this.period;
      avgLoss = (prevAvgLoss * (this.period - 1) + currentLoss) / this.period;
    }

    // Store for next calculation
    if (idx === candles.length - 1) {
      this.previousAvgGain = avgGain;
      this.previousAvgLoss = avgLoss;
    }

    if (avgLoss === 0) {
      return 100;
    }

    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  }

  /**
   * Reset indicator state
   */
  reset(): void {
    super.reset();
    this.previousAvgGain = null;
    this.previousAvgLoss = null;
  }

  /**
   * Get indicator configuration
   */
  getConfig(): Record<string, unknown> {
    return {
      name: this.name,
      period: this.period,
      source: this.source,
    };
  }

  /**
   * Get period
   */
  getPeriod(): number {
    return this.period;
  }

  /**
   * Set period (resets indicator)
   */
  setPeriod(period: number): void {
    this.period = period;
    this.requiredCandles = period + 1;
    this.reset();
  }

  /**
   * Check if RSI indicates oversold condition
   * @param threshold - Oversold threshold (default: 30)
   */
  isOversold(threshold: number = 30): boolean {
    const value = this.getValue();
    return value !== null && value < threshold;
  }

  /**
   * Check if RSI indicates overbought condition
   * @param threshold - Overbought threshold (default: 70)
   */
  isOverbought(threshold: number = 70): boolean {
    const value = this.getValue();
    return value !== null && value > threshold;
  }
}
