/**
 * Risk calculator
 * Calculates risk metrics (Sharpe, Sortino, VaR, etc.)
 */

import type { RiskMetrics } from './risk.types';
import { createLogger } from '@/utils';

/**
 * Risk calculator
 * Provides comprehensive risk metric calculations
 */
export class RiskCalculator {
  private logger = createLogger('RiskCalculator');

  /**
   * Calculate all risk metrics
   */
  calculateMetrics(
    returns: number[],
    riskFreeRate: number = 0,
    benchmarkReturns?: number[]
  ): RiskMetrics {
    const sharpeRatio = this.calculateSharpe(returns, riskFreeRate);
    const sortinoRatio = this.calculateSortino(returns, riskFreeRate);
    const { maxDrawdown, maxDrawdownPercent } = this.calculateMaxDrawdown(returns);
    const calmarRatio = this.calculateCalmar(returns, maxDrawdown);
    const var95 = this.calculateVaR(returns, 0.95);
    const cvar95 = this.calculateCVaR(returns, 0.95);
    const volatility = this.calculateVolatility(returns);
    const beta = benchmarkReturns
      ? this.calculateBeta(returns, benchmarkReturns)
      : undefined;

    return {
      sharpeRatio,
      sortinoRatio,
      maxDrawdown,
      maxDrawdownPercent,
      calmarRatio,
      var95,
      cvar95,
      volatility,
      beta,
    };
  }

  /**
   * Calculate Sharpe ratio
   * (Average Return - Risk Free Rate) / Standard Deviation
   */
  calculateSharpe(returns: number[], riskFreeRate: number = 0): number {
    if (returns.length === 0) {
      return 0;
    }

    const avgReturn = this.mean(returns);
    const excessReturn = avgReturn - riskFreeRate;
    const stdDev = this.standardDeviation(returns);

    if (stdDev === 0) {
      return 0;
    }

    return excessReturn / stdDev;
  }

  /**
   * Calculate Sortino ratio
   * Similar to Sharpe but only considers downside volatility
   */
  calculateSortino(returns: number[], riskFreeRate: number = 0): number {
    if (returns.length === 0) {
      return 0;
    }

    const avgReturn = this.mean(returns);
    const excessReturn = avgReturn - riskFreeRate;

    // Calculate downside deviation (only negative returns)
    const negativeReturns = returns.filter((r) => r < riskFreeRate);
    if (negativeReturns.length === 0) {
      return Infinity;
    }

    const downsideDeviation = this.standardDeviation(negativeReturns);

    if (downsideDeviation === 0) {
      return 0;
    }

    return excessReturn / downsideDeviation;
  }

  /**
   * Calculate maximum drawdown
   */
  calculateMaxDrawdown(returns: number[]): {
    maxDrawdown: number;
    maxDrawdownPercent: number;
  } {
    if (returns.length === 0) {
      return { maxDrawdown: 0, maxDrawdownPercent: 0 };
    }

    // Convert returns to equity curve
    const equity: number[] = [100]; // Start with $100
    for (const ret of returns) {
      equity.push(equity[equity.length - 1] * (1 + ret));
    }

    let maxDrawdown = 0;
    let maxDrawdownPercent = 0;
    let peak = equity[0];

    for (const value of equity) {
      if (value > peak) {
        peak = value;
      }

      const drawdown = peak - value;
      const drawdownPercent = (drawdown / peak) * 100;

      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        maxDrawdownPercent = drawdownPercent;
      }
    }

    return { maxDrawdown, maxDrawdownPercent };
  }

  /**
   * Calculate Calmar ratio
   * Annualized Return / Maximum Drawdown
   */
  calculateCalmar(returns: number[], maxDrawdown: number): number {
    if (returns.length === 0 || maxDrawdown === 0) {
      return 0;
    }

    const avgReturn = this.mean(returns);
    const annualizedReturn = avgReturn * Math.sqrt(252); // Assume daily returns

    return annualizedReturn / (maxDrawdown / 100);
  }

  /**
   * Calculate Value at Risk (VaR)
   * Maximum loss at given confidence level
   */
  calculateVaR(returns: number[], confidence: number = 0.95): number {
    if (returns.length === 0) {
      return 0;
    }

    const sorted = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sorted.length);

    return -sorted[index]; // Return as positive number
  }

  /**
   * Calculate Conditional Value at Risk (CVaR / Expected Shortfall)
   * Average loss beyond VaR
   */
  calculateCVaR(returns: number[], confidence: number = 0.95): number {
    if (returns.length === 0) {
      return 0;
    }

    const sorted = [...returns].sort((a, b) => a - b);
    const cutoffIndex = Math.floor((1 - confidence) * sorted.length);

    // Average of worst returns beyond VaR
    const worstReturns = sorted.slice(0, cutoffIndex + 1);
    const avgWorst = this.mean(worstReturns);

    return -avgWorst; // Return as positive number
  }

  /**
   * Calculate volatility (standard deviation of returns)
   */
  calculateVolatility(returns: number[]): number {
    return this.standardDeviation(returns);
  }

  /**
   * Calculate Beta (correlation with market)
   * Covariance(asset, market) / Variance(market)
   */
  calculateBeta(assetReturns: number[], marketReturns: number[]): number {
    if (assetReturns.length !== marketReturns.length || assetReturns.length === 0) {
      return 0;
    }

    const covariance = this.covariance(assetReturns, marketReturns);
    const marketVariance = this.variance(marketReturns);

    if (marketVariance === 0) {
      return 0;
    }

    return covariance / marketVariance;
  }

  /**
   * Calculate annualized return
   */
  calculateAnnualizedReturn(returns: number[], periodsPerYear: number = 252): number {
    if (returns.length === 0) {
      return 0;
    }

    const avgReturn = this.mean(returns);
    return avgReturn * periodsPerYear;
  }

  /**
   * Calculate information ratio
   * (Portfolio Return - Benchmark Return) / Tracking Error
   */
  calculateInformationRatio(
    portfolioReturns: number[],
    benchmarkReturns: number[]
  ): number {
    if (portfolioReturns.length !== benchmarkReturns.length || portfolioReturns.length === 0) {
      return 0;
    }

    const excessReturns = portfolioReturns.map((r, i) => r - benchmarkReturns[i]);
    const avgExcess = this.mean(excessReturns);
    const trackingError = this.standardDeviation(excessReturns);

    if (trackingError === 0) {
      return 0;
    }

    return avgExcess / trackingError;
  }

  // ========== Statistical Helper Methods ==========

  /**
   * Calculate mean (average)
   */
  private mean(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate variance
   */
  private variance(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    const avg = this.mean(values);
    const squaredDiffs = values.map((val) => Math.pow(val - avg, 2));

    return this.mean(squaredDiffs);
  }

  /**
   * Calculate standard deviation
   */
  private standardDeviation(values: number[]): number {
    return Math.sqrt(this.variance(values));
  }

  /**
   * Calculate covariance between two series
   */
  private covariance(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) {
      return 0;
    }

    const meanX = this.mean(x);
    const meanY = this.mean(y);

    const products = x.map((xi, i) => (xi - meanX) * (y[i] - meanY));

    return this.mean(products);
  }

  /**
   * Calculate correlation between two series
   */
  private correlation(x: number[], y: number[]): number {
    const cov = this.covariance(x, y);
    const stdX = this.standardDeviation(x);
    const stdY = this.standardDeviation(y);

    if (stdX === 0 || stdY === 0) {
      return 0;
    }

    return cov / (stdX * stdY);
  }

  /**
   * Calculate win rate metrics from trade P&Ls
   * @param tradePnLs - Array of trade P&L objects
   * @returns Win rate statistics
   */
  calculateWinRate(tradePnLs: Array<{ netPnl: number }>): {
    winRate: number;
    winningTrades: number;
    losingTrades: number;
    totalTrades: number;
    averageWin: number;
    averageLoss: number;
    winLossRatio: number;
    profitFactor: number;
  } {
    if (tradePnLs.length === 0) {
      return {
        winRate: 0,
        winningTrades: 0,
        losingTrades: 0,
        totalTrades: 0,
        averageWin: 0,
        averageLoss: 0,
        winLossRatio: 0,
        profitFactor: 0,
      };
    }

    // Extract net P&L values
    const pnlValues = tradePnLs.map((t) => t.netPnl);

    const wins = pnlValues.filter((pnl) => pnl > 0);
    const losses = pnlValues.filter((pnl) => pnl < 0);

    const winningTrades = wins.length;
    const losingTrades = losses.length;
    const totalTrades = pnlValues.length;

    const winRate = totalTrades > 0 ? winningTrades / totalTrades : 0;
    const averageWin = winningTrades > 0 ? this.mean(wins) : 0;
    const averageLoss = losingTrades > 0 ? Math.abs(this.mean(losses)) : 0;
    const winLossRatio = averageLoss > 0 ? averageWin / averageLoss : 0;

    // Calculate profit factor (total wins / total losses)
    const totalWins = wins.reduce((sum, w) => sum + w, 0);
    const totalLosses = Math.abs(losses.reduce((sum, l) => sum + l, 0));
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0;

    return {
      winRate,
      winningTrades,
      losingTrades,
      totalTrades,
      averageWin,
      averageLoss,
      winLossRatio,
      profitFactor,
    };
  }
}
