/**
 * Stop loss manager
 * Manages various types of stop losses
 */

import type { StopLossType, StopLossParams } from './risk.types';
import type { Position, Candle } from '@/core/types';
import { ATRIndicator } from '@/indicators';
import { createLogger } from '@/utils';

/**
 * Stop loss manager
 * Calculates and manages stop loss levels
 */
export class StopLossManager {
  private logger = createLogger('StopLossManager');
  private atrIndicators: Map<string, ATRIndicator> = new Map();
  private highWaterMarks: Map<string, number> = new Map();
  private lowWaterMarks: Map<string, number> = new Map();
  private entryTimestamps: Map<string, number> = new Map();

  /**
   * Calculate stop loss price
   */
  calculateStopPrice(
    params: StopLossParams,
    position: Position,
    candles?: Candle[]
  ): number {
    switch (params.type) {
      case 'fixed':
        return this.fixedStop(params, position);

      case 'trailing':
        return this.trailingStop(params, position);

      case 'atr':
        if (!candles) {
          throw new Error('Candles required for ATR-based stop loss');
        }
        return this.atrStop(params, position, candles);

      case 'time-based':
        return this.timeBasedStop(params, position);

      default:
        throw new Error(`Unknown stop loss type: ${params.type}`);
    }
  }

  /**
   * Fixed stop loss
   */
  private fixedStop(params: StopLossParams, position: Position): number {
    if (params.price !== undefined) {
      return params.price;
    }

    if (params.percent !== undefined) {
      if (position.side === 'long') {
        return position.entryPrice * (1 - params.percent);
      } else {
        return position.entryPrice * (1 + params.percent);
      }
    }

    throw new Error('Fixed stop requires either price or percent');
  }

  /**
   * Trailing stop loss
   */
  private trailingStop(params: StopLossParams, position: Position): number {
    if (params.trailingPercent === undefined) {
      throw new Error('Trailing stop requires trailingPercent');
    }

    const symbol = position.symbol;

    // Initialize water marks on first call
    if (!this.highWaterMarks.has(symbol)) {
      this.highWaterMarks.set(symbol, position.currentPrice);
      this.lowWaterMarks.set(symbol, position.currentPrice);
    }

    // Update water marks
    const hwm = this.highWaterMarks.get(symbol)!;
    const lwm = this.lowWaterMarks.get(symbol)!;

    if (position.currentPrice > hwm) {
      this.highWaterMarks.set(symbol, position.currentPrice);
    }

    if (position.currentPrice < lwm) {
      this.lowWaterMarks.set(symbol, position.currentPrice);
    }

    // Calculate trailing stop
    if (position.side === 'long') {
      const updatedHwm = this.highWaterMarks.get(symbol)!;
      return updatedHwm * (1 - params.trailingPercent);
    } else {
      const updatedLwm = this.lowWaterMarks.get(symbol)!;
      return updatedLwm * (1 + params.trailingPercent);
    }
  }

  /**
   * ATR-based stop loss
   */
  private atrStop(params: StopLossParams, position: Position, candles: Candle[]): number {
    if (params.atrMultiplier === undefined) {
      throw new Error('ATR stop requires atrMultiplier');
    }

    const symbol = position.symbol;

    // Get or create ATR indicator
    if (!this.atrIndicators.has(symbol)) {
      this.atrIndicators.set(symbol, new ATRIndicator(14));
    }

    const atr = this.atrIndicators.get(symbol)!;
    const atrValue = atr.calculate(candles);

    if (atrValue === null) {
      this.logger.warn(`ATR not available for ${symbol}, using fixed 2% stop`);
      return this.fixedStop({ type: 'fixed', percent: 0.02 }, position);
    }

    // Calculate ATR-based stop
    const stopDistance = atrValue * params.atrMultiplier;

    if (position.side === 'long') {
      return position.currentPrice - stopDistance;
    } else {
      return position.currentPrice + stopDistance;
    }
  }

  /**
   * Time-based stop (close position after max time)
   */
  private timeBasedStop(params: StopLossParams, position: Position): number {
    if (params.maxTime === undefined) {
      throw new Error('Time-based stop requires maxTime');
    }

    const symbol = position.symbol;

    // Track entry time
    if (!this.entryTimestamps.has(symbol)) {
      this.entryTimestamps.set(symbol, position.openedAt);
    }

    const entryTime = this.entryTimestamps.get(symbol)!;
    const elapsed = Date.now() - entryTime;

    // If max time exceeded, return current price (close at market)
    if (elapsed >= params.maxTime) {
      this.logger.info(`Time-based stop triggered for ${symbol} after ${elapsed}ms`);
      return position.currentPrice;
    }

    // Otherwise, return a stop that won't trigger
    if (position.side === 'long') {
      return 0;
    } else {
      return Infinity;
    }
  }

  /**
   * Check if stop loss is triggered
   */
  isStopTriggered(stopPrice: number, currentPrice: number, side: 'long' | 'short'): boolean {
    if (side === 'long') {
      return currentPrice <= stopPrice;
    } else {
      return currentPrice >= stopPrice;
    }
  }

  /**
   * Update position tracking (for trailing stops)
   */
  updateTracking(position: Position): void {
    const symbol = position.symbol;
    const currentPrice = position.currentPrice;

    // Update high water mark
    const hwm = this.highWaterMarks.get(symbol) ?? currentPrice;
    if (currentPrice > hwm) {
      this.highWaterMarks.set(symbol, currentPrice);
      this.logger.debug(`Updated high water mark for ${symbol}: ${currentPrice}`);
    }

    // Update low water mark
    const lwm = this.lowWaterMarks.get(symbol) ?? currentPrice;
    if (currentPrice < lwm) {
      this.lowWaterMarks.set(symbol, currentPrice);
      this.logger.debug(`Updated low water mark for ${symbol}: ${currentPrice}`);
    }
  }

  /**
   * Reset tracking for symbol
   */
  reset(symbol: string): void {
    this.highWaterMarks.delete(symbol);
    this.lowWaterMarks.delete(symbol);
    this.atrIndicators.delete(symbol);
    this.entryTimestamps.delete(symbol);
    this.logger.debug(`Reset tracking for ${symbol}`);
  }

  /**
   * Clear all tracking data
   */
  clear(): void {
    this.highWaterMarks.clear();
    this.lowWaterMarks.clear();
    this.atrIndicators.clear();
    this.entryTimestamps.clear();
    this.logger.debug('Cleared all tracking data');
  }

  /**
   * Get stop loss recommendation
   * Analyzes position and suggests optimal stop loss
   */
  getRecommendation(
    position: Position,
    candles: Candle[],
    riskPercent: number = 0.02
  ): {
    type: StopLossType;
    price: number;
    distance: number;
    distancePercent: number;
  } {
    // Calculate ATR-based stop
    const atr = new ATRIndicator(14);
    const atrValue = atr.calculate(candles);

    let recommendedPrice: number;
    let recommendedType: StopLossType = 'fixed';

    if (atrValue !== null) {
      // Use ATR for volatile assets
      const atrPercent = (atrValue / position.currentPrice) * 100;

      if (atrPercent > 3) {
        // High volatility - use ATR-based stop
        recommendedType = 'atr';
        const stopDistance = atrValue * 2;
        recommendedPrice =
          position.side === 'long'
            ? position.currentPrice - stopDistance
            : position.currentPrice + stopDistance;
      } else {
        // Normal volatility - use trailing stop
        recommendedType = 'trailing';
        recommendedPrice =
          position.side === 'long'
            ? position.currentPrice * (1 - riskPercent)
            : position.currentPrice * (1 + riskPercent);
      }
    } else {
      // Fallback to fixed percentage stop
      recommendedPrice =
        position.side === 'long'
          ? position.entryPrice * (1 - riskPercent)
          : position.entryPrice * (1 + riskPercent);
    }

    const distance = Math.abs(position.currentPrice - recommendedPrice);
    const distancePercent = (distance / position.currentPrice) * 100;

    return {
      type: recommendedType,
      price: recommendedPrice,
      distance,
      distancePercent,
    };
  }
}
