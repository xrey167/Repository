/**
 * Performance metrics calculator
 * Analyzes backtest results and calculates performance metrics
 */

import type { Trade } from '@/core/types';
import { RiskCalculator, type RiskMetrics } from '@/risk';
import { PnLCalculator, type TradePnL } from '@/portfolio';
import { createLogger } from '@/utils';

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  // Returns
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  cagr: number;

  // Risk metrics
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  volatility: number;

  // Trade statistics
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  expectancy: number;

  // Position metrics
  avgHoldTime: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
}

/**
 * Performance metrics calculator
 */
export class PerformanceMetricsCalculator {
  private riskCalculator: RiskCalculator;
  private pnlCalculator: PnLCalculator;
  private logger = createLogger('PerformanceMetrics');

  constructor() {
    this.riskCalculator = new RiskCalculator();
    this.pnlCalculator = new PnLCalculator();
  }

  /**
   * Calculate all performance metrics
   */
  calculate(
    trades: Trade[],
    initialCapital: number,
    finalEquity: number,
    backtestDuration: number
  ): PerformanceMetrics {
    // Calculate returns
    const totalReturn = finalEquity - initialCapital;
    const totalReturnPercent = (totalReturn / initialCapital) * 100;

    // Calculate trade P&Ls
    const tradePnLs = this.calculateTradePnLs(trades);

    // Calculate win rate metrics
    const winRateMetrics = this.riskCalculator.calculateWinRate(tradePnLs);

    // Calculate equity curve and returns
    const { equityCurve, returns } = this.buildEquityCurve(
      trades,
      initialCapital
    );

    // Calculate risk metrics
    const riskMetrics = this.riskCalculator.calculateMetrics(returns);

    // Calculate CAGR
    const years = backtestDuration / (365 * 24 * 60 * 60 * 1000);
    const cagr = years > 0
      ? (Math.pow(finalEquity / initialCapital, 1 / years) - 1) * 100
      : 0;

    // Calculate annualized return
    const annualizedReturn = this.riskCalculator.calculateAnnualizedReturn(
      returns,
      252
    );

    // Calculate trade statistics
    const avgHoldTime = this.calculateAvgHoldTime(trades);
    const { maxConsecutiveWins, maxConsecutiveLosses } =
      this.calculateConsecutiveWinsLosses(tradePnLs);

    // Calculate expectancy
    const expectancy =
      winRateMetrics.winRate > 0
        ? (winRateMetrics.averageWin * winRateMetrics.winRate) / 100 -
          (winRateMetrics.averageLoss * (100 - winRateMetrics.winRate)) / 100
        : 0;

    return {
      // Returns
      totalReturn,
      totalReturnPercent,
      annualizedReturn,
      cagr,

      // Risk metrics
      sharpeRatio: riskMetrics.sharpeRatio,
      sortinoRatio: riskMetrics.sortinoRatio,
      calmarRatio: riskMetrics.calmarRatio,
      maxDrawdown: riskMetrics.maxDrawdown,
      maxDrawdownPercent: riskMetrics.maxDrawdownPercent,
      volatility: riskMetrics.volatility,

      // Trade statistics
      totalTrades: winRateMetrics.totalTrades,
      winningTrades: winRateMetrics.winningTrades,
      losingTrades: winRateMetrics.losingTrades,
      winRate: winRateMetrics.winRate,
      averageWin: winRateMetrics.averageWin,
      averageLoss: winRateMetrics.averageLoss,
      profitFactor: winRateMetrics.profitFactor,
      expectancy,

      // Position metrics
      avgHoldTime,
      maxConsecutiveWins,
      maxConsecutiveLosses,
    };
  }

  /**
   * Calculate trade P&Ls
   */
  private calculateTradePnLs(trades: Trade[]): TradePnL[] {
    const pnls: TradePnL[] = [];
    const positions = new Map<string, Trade[]>();

    // Group trades by symbol
    for (const trade of trades) {
      const symbolTrades = positions.get(trade.symbol) || [];
      symbolTrades.push(trade);
      positions.set(trade.symbol, symbolTrades);
    }

    // Calculate P&L for each closed position
    for (const symbolTrades of positions.values()) {
      for (let i = 0; i < symbolTrades.length; i += 2) {
        const entry = symbolTrades[i];
        const exit = symbolTrades[i + 1];

        if (entry && exit) {
          const pnl = this.pnlCalculator.calculateFromTrades(entry, exit);
          pnls.push(pnl);
        }
      }
    }

    return pnls;
  }

  /**
   * Build equity curve and calculate returns
   */
  private buildEquityCurve(
    trades: Trade[],
    initialCapital: number
  ): { equityCurve: number[]; returns: number[] } {
    const equityCurve: number[] = [initialCapital];
    const returns: number[] = [];

    let equity = initialCapital;

    for (const trade of trades) {
      if (trade.realizedPnl !== undefined) {
        equity += trade.realizedPnl;
        const ret = trade.realizedPnl / equity;
        returns.push(ret);
      }

      equityCurve.push(equity);
    }

    return { equityCurve, returns };
  }

  /**
   * Calculate average hold time
   */
  private calculateAvgHoldTime(trades: Trade[]): number {
    if (trades.length < 2) {
      return 0;
    }

    let totalHoldTime = 0;
    let count = 0;

    for (let i = 0; i < trades.length; i += 2) {
      const entry = trades[i];
      const exit = trades[i + 1];

      if (entry && exit) {
        totalHoldTime += exit.timestamp - entry.timestamp;
        count++;
      }
    }

    return count > 0 ? totalHoldTime / count : 0;
  }

  /**
   * Calculate consecutive wins and losses
   */
  private calculateConsecutiveWinsLosses(tradePnLs: TradePnL[]): {
    maxConsecutiveWins: number;
    maxConsecutiveLosses: number;
  } {
    let maxWins = 0;
    let maxLosses = 0;
    let currentWins = 0;
    let currentLosses = 0;

    for (const pnl of tradePnLs) {
      if (pnl.netPnl > 0) {
        currentWins++;
        currentLosses = 0;
        maxWins = Math.max(maxWins, currentWins);
      } else if (pnl.netPnl < 0) {
        currentLosses++;
        currentWins = 0;
        maxLosses = Math.max(maxLosses, currentLosses);
      }
    }

    return {
      maxConsecutiveWins: maxWins,
      maxConsecutiveLosses: maxLosses,
    };
  }

  /**
   * Format metrics for display
   */
  format(metrics: PerformanceMetrics): string {
    const lines: string[] = [];

    lines.push('=== Performance Metrics ===\n');

    lines.push('Returns:');
    lines.push(`  Total Return: $${metrics.totalReturn.toFixed(2)} (${metrics.totalReturnPercent.toFixed(2)}%)`);
    lines.push(`  Annualized Return: ${metrics.annualizedReturn.toFixed(2)}%`);
    lines.push(`  CAGR: ${metrics.cagr.toFixed(2)}%\n`);

    lines.push('Risk Metrics:');
    lines.push(`  Sharpe Ratio: ${metrics.sharpeRatio.toFixed(2)}`);
    lines.push(`  Sortino Ratio: ${metrics.sortinoRatio.toFixed(2)}`);
    lines.push(`  Calmar Ratio: ${metrics.calmarRatio.toFixed(2)}`);
    lines.push(`  Max Drawdown: $${metrics.maxDrawdown.toFixed(2)} (${metrics.maxDrawdownPercent.toFixed(2)}%)`);
    lines.push(`  Volatility: ${metrics.volatility.toFixed(4)}\n`);

    lines.push('Trade Statistics:');
    lines.push(`  Total Trades: ${metrics.totalTrades}`);
    lines.push(`  Win Rate: ${metrics.winRate.toFixed(2)}% (${metrics.winningTrades}W / ${metrics.losingTrades}L)`);
    lines.push(`  Average Win: $${metrics.averageWin.toFixed(2)}`);
    lines.push(`  Average Loss: $${metrics.averageLoss.toFixed(2)}`);
    lines.push(`  Profit Factor: ${metrics.profitFactor.toFixed(2)}`);
    lines.push(`  Expectancy: $${metrics.expectancy.toFixed(2)}\n`);

    lines.push('Position Metrics:');
    lines.push(`  Avg Hold Time: ${(metrics.avgHoldTime / (1000 * 60 * 60)).toFixed(2)} hours`);
    lines.push(`  Max Consecutive Wins: ${metrics.maxConsecutiveWins}`);
    lines.push(`  Max Consecutive Losses: ${metrics.maxConsecutiveLosses}`);

    return lines.join('\n');
  }
}
