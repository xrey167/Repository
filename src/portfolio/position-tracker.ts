/**
 * Position tracker
 * Tracks and analyzes individual positions
 */

import type { Position, Trade, Candle } from '@/core/types';
import { createLogger } from '@/utils';

/**
 * Position statistics
 */
export interface PositionStats {
  /**
   * Duration in milliseconds
   */
  duration: number;

  /**
   * Total P&L (realized + unrealized)
   */
  totalPnl: number;

  /**
   * P&L percentage
   */
  pnlPercent: number;

  /**
   * Maximum favorable excursion
   */
  mfe: number;

  /**
   * Maximum adverse excursion
   */
  mae: number;

  /**
   * Current risk-reward ratio
   */
  riskReward: number;

  /**
   * Win/loss status
   */
  status: 'winning' | 'losing' | 'breakeven';
}

/**
 * Position tracker
 * Provides detailed position analytics
 */
export class PositionTracker {
  private logger = createLogger('PositionTracker');
  private highWaterMarks: Map<string, number> = new Map();
  private lowWaterMarks: Map<string, number> = new Map();

  /**
   * Track position with new price update
   */
  track(position: Position, currentPrice: number): void {
    const symbol = position.symbol;

    // Update high/low water marks
    const hwm = this.highWaterMarks.get(symbol) ?? currentPrice;
    const lwm = this.lowWaterMarks.get(symbol) ?? currentPrice;

    if (currentPrice > hwm) {
      this.highWaterMarks.set(symbol, currentPrice);
    }

    if (currentPrice < lwm) {
      this.lowWaterMarks.set(symbol, currentPrice);
    }

    this.logger.debug(`Tracked position: ${symbol} @ ${currentPrice}`);
  }

  /**
   * Get position statistics
   */
  getStats(position: Position): PositionStats {
    const duration = Date.now() - position.openedAt;
    const totalPnl = position.realizedPnl + position.unrealizedPnl;
    const costBasis = position.quantity * position.entryPrice;
    const pnlPercent = (totalPnl / costBasis) * 100;

    // Calculate MFE and MAE
    const hwm = this.highWaterMarks.get(position.symbol) ?? position.currentPrice;
    const lwm = this.lowWaterMarks.get(position.symbol) ?? position.currentPrice;

    let mfe: number;
    let mae: number;

    if (position.side === 'long') {
      // For long positions
      mfe = (hwm - position.entryPrice) * position.quantity; // Best profit
      mae = (lwm - position.entryPrice) * position.quantity; // Worst loss
    } else {
      // For short positions
      mfe = (position.entryPrice - lwm) * position.quantity; // Best profit
      mae = (position.entryPrice - hwm) * position.quantity; // Worst loss
    }

    // Risk-reward ratio
    const riskReward = mae !== 0 ? Math.abs(mfe / mae) : 0;

    // Status
    let status: 'winning' | 'losing' | 'breakeven';
    if (totalPnl > 0) {
      status = 'winning';
    } else if (totalPnl < 0) {
      status = 'losing';
    } else {
      status = 'breakeven';
    }

    return {
      duration,
      totalPnl,
      pnlPercent,
      mfe,
      mae,
      riskReward,
      status,
    };
  }

  /**
   * Check if position should be closed (based on risk metrics)
   */
  shouldClose(
    position: Position,
    options: {
      takeProfitPercent?: number;
      stopLossPercent?: number;
      maxDuration?: number;
    }
  ): { should: boolean; reason?: string } {
    const stats = this.getStats(position);

    // Check take profit
    if (options.takeProfitPercent && stats.pnlPercent >= options.takeProfitPercent) {
      return {
        should: true,
        reason: `Take profit reached: ${stats.pnlPercent.toFixed(2)}%`,
      };
    }

    // Check stop loss
    if (options.stopLossPercent && stats.pnlPercent <= -Math.abs(options.stopLossPercent)) {
      return {
        should: true,
        reason: `Stop loss reached: ${stats.pnlPercent.toFixed(2)}%`,
      };
    }

    // Check max duration
    if (options.maxDuration && stats.duration >= options.maxDuration) {
      return {
        should: true,
        reason: `Max duration reached: ${stats.duration}ms`,
      };
    }

    return { should: false };
  }

  /**
   * Calculate position size for new trade
   */
  calculatePositionSize(
    capital: number,
    entryPrice: number,
    stopLossPrice: number,
    riskPercent: number = 0.02
  ): number {
    const riskAmount = capital * riskPercent;
    const riskPerShare = Math.abs(entryPrice - stopLossPrice);

    if (riskPerShare === 0) {
      return 0;
    }

    return riskAmount / riskPerShare;
  }

  /**
   * Get trailing stop price
   */
  getTrailingStopPrice(
    position: Position,
    trailingPercent: number
  ): number {
    const hwm = this.highWaterMarks.get(position.symbol) ?? position.currentPrice;
    const lwm = this.lowWaterMarks.get(position.symbol) ?? position.currentPrice;

    if (position.side === 'long') {
      return hwm * (1 - trailingPercent);
    } else {
      return lwm * (1 + trailingPercent);
    }
  }

  /**
   * Reset tracking for symbol
   */
  reset(symbol: string): void {
    this.highWaterMarks.delete(symbol);
    this.lowWaterMarks.delete(symbol);
    this.logger.debug(`Reset tracking for ${symbol}`);
  }

  /**
   * Clear all tracking data
   */
  clear(): void {
    this.highWaterMarks.clear();
    this.lowWaterMarks.clear();
    this.logger.debug('Cleared all tracking data');
  }
}
