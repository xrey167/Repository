/**
 * P&L calculator
 * Calculates profit and loss for trades and portfolios
 */

import type { Trade, Position, Portfolio } from '@/core/types';
import { createLogger } from '@/utils';

/**
 * Trade P&L result
 */
export interface TradePnL {
  /**
   * Gross P&L (before commissions)
   */
  grossPnl: number;

  /**
   * Net P&L (after commissions)
   */
  netPnl: number;

  /**
   * Total commissions
   */
  commission: number;

  /**
   * P&L percentage
   */
  pnlPercent: number;
}

/**
 * Portfolio P&L result
 */
export interface PortfolioPnL {
  /**
   * Total realized P&L
   */
  realized: number;

  /**
   * Total unrealized P&L
   */
  unrealized: number;

  /**
   * Total P&L
   */
  total: number;

  /**
   * P&L percentage
   */
  totalPercent: number;

  /**
   * Return on investment
   */
  roi: number;
}

/**
 * P&L calculator
 * Calculates various profit and loss metrics
 */
export class PnLCalculator {
  private logger = createLogger('PnLCalculator');

  /**
   * Calculate P&L for a single trade
   */
  calculateTradePnL(
    entryPrice: number,
    exitPrice: number,
    quantity: number,
    side: 'buy' | 'sell',
    commission: number = 0
  ): TradePnL {
    let grossPnl: number;

    if (side === 'buy') {
      // Long position
      grossPnl = (exitPrice - entryPrice) * quantity;
    } else {
      // Short position
      grossPnl = (entryPrice - exitPrice) * quantity;
    }

    const netPnl = grossPnl - commission;
    const costBasis = quantity * entryPrice;
    const pnlPercent = (netPnl / costBasis) * 100;

    return {
      grossPnl,
      netPnl,
      commission,
      pnlPercent,
    };
  }

  /**
   * Calculate P&L from trade pair (entry and exit)
   */
  calculateFromTrades(entryTrade: Trade, exitTrade: Trade): TradePnL {
    const totalCommission = entryTrade.commission + exitTrade.commission;

    return this.calculateTradePnL(
      entryTrade.price,
      exitTrade.price,
      entryTrade.quantity,
      entryTrade.side,
      totalCommission
    );
  }

  /**
   * Calculate unrealized P&L for position
   */
  calculateUnrealizedPnL(position: Position): number {
    if (position.side === 'long') {
      return (position.currentPrice - position.entryPrice) * position.quantity;
    } else {
      return (position.entryPrice - position.currentPrice) * position.quantity;
    }
  }

  /**
   * Calculate portfolio P&L
   */
  calculatePortfolioPnL(portfolio: Portfolio, initialCapital: number): PortfolioPnL {
    const total = portfolio.totalPnl;
    const totalPercent = (total / initialCapital) * 100;
    const roi = (portfolio.equity / initialCapital - 1) * 100;

    return {
      realized: portfolio.realizedPnl,
      unrealized: portfolio.unrealizedPnl,
      total,
      totalPercent,
      roi,
    };
  }

  /**
   * Calculate average entry price from multiple trades
   */
  calculateAverageEntryPrice(trades: Trade[]): number {
    const totalCost = trades.reduce((sum, trade) => sum + trade.price * trade.quantity, 0);
    const totalQuantity = trades.reduce((sum, trade) => sum + trade.quantity, 0);

    return totalQuantity > 0 ? totalCost / totalQuantity : 0;
  }

  /**
   * Calculate break-even price
   */
  calculateBreakEvenPrice(
    entryPrice: number,
    commission: number,
    quantity: number,
    side: 'buy' | 'sell'
  ): number {
    const commissionPerShare = commission / quantity;

    if (side === 'buy') {
      return entryPrice + commissionPerShare;
    } else {
      return entryPrice - commissionPerShare;
    }
  }

  /**
   * Calculate risk-reward ratio
   */
  calculateRiskReward(
    entryPrice: number,
    targetPrice: number,
    stopPrice: number,
    side: 'buy' | 'sell'
  ): number {
    let potentialProfit: number;
    let potentialLoss: number;

    if (side === 'buy') {
      potentialProfit = targetPrice - entryPrice;
      potentialLoss = entryPrice - stopPrice;
    } else {
      potentialProfit = entryPrice - targetPrice;
      potentialLoss = stopPrice - entryPrice;
    }

    return potentialLoss !== 0 ? potentialProfit / potentialLoss : 0;
  }

  /**
   * Calculate maximum drawdown
   */
  calculateMaxDrawdown(equityCurve: number[]): {
    maxDrawdown: number;
    maxDrawdownPercent: number;
    peak: number;
    trough: number;
  } {
    if (equityCurve.length === 0) {
      return { maxDrawdown: 0, maxDrawdownPercent: 0, peak: 0, trough: 0 };
    }

    let maxDrawdown = 0;
    let maxDrawdownPercent = 0;
    let peak = equityCurve[0];
    let trough = equityCurve[0];
    let runningMax = equityCurve[0];

    for (const equity of equityCurve) {
      if (equity > runningMax) {
        runningMax = equity;
      }

      const drawdown = runningMax - equity;
      const drawdownPercent = (drawdown / runningMax) * 100;

      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        maxDrawdownPercent = drawdownPercent;
        peak = runningMax;
        trough = equity;
      }
    }

    return { maxDrawdown, maxDrawdownPercent, peak, trough };
  }

  /**
   * Calculate win rate from trades
   */
  calculateWinRate(trades: TradePnL[]): {
    winRate: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    averageWin: number;
    averageLoss: number;
    profitFactor: number;
  } {
    const totalTrades = trades.length;
    const winningTrades = trades.filter((t) => t.netPnl > 0);
    const losingTrades = trades.filter((t) => t.netPnl < 0);

    const winCount = winningTrades.length;
    const lossCount = losingTrades.length;
    const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;

    const totalWins = winningTrades.reduce((sum, t) => sum + t.netPnl, 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.netPnl, 0));

    const averageWin = winCount > 0 ? totalWins / winCount : 0;
    const averageLoss = lossCount > 0 ? totalLosses / lossCount : 0;
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0;

    return {
      winRate,
      totalTrades,
      winningTrades: winCount,
      losingTrades: lossCount,
      averageWin,
      averageLoss,
      profitFactor,
    };
  }
}
