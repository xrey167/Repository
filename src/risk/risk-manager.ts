/**
 * Risk manager
 * Portfolio-level risk management and validation
 */

import type { RiskLimits, PositionSizingParams } from './risk.types';
import type { Portfolio, Position, Order } from '@/core/types';
import { PositionSizer } from './position-sizer';
import { createLogger } from '@/utils';
import { RiskLimitExceededError } from '@/core/errors';

/**
 * Risk manager
 * Enforces risk limits and validates trades
 */
export class RiskManager {
  private limits: RiskLimits;
  private positionSizer: PositionSizer;
  private logger = createLogger('RiskManager');
  private dailyLoss: number = 0;
  private dailyLossResetTime: number = 0;

  constructor(limits: RiskLimits) {
    this.limits = limits;
    this.positionSizer = new PositionSizer();
  }

  /**
   * Validate if order can be placed
   * @throws RiskLimitExceededError if risk limits exceeded
   */
  validateOrder(
    order: Partial<Order>,
    portfolio: Portfolio,
    positions: Position[]
  ): void {
    // Check max positions
    if (positions.length >= this.limits.maxPositions) {
      throw new RiskLimitExceededError(
        `Maximum positions reached: ${this.limits.maxPositions}`
      );
    }

    // Check position size
    if (order.quantity && order.price) {
      const positionValue = order.quantity * order.price;
      const portfolioPercent = positionValue / portfolio.equity;

      if (portfolioPercent > this.limits.maxPositionSize) {
        throw new RiskLimitExceededError(
          `Position size exceeds limit: ${portfolioPercent.toFixed(2)}% > ${this.limits.maxPositionSize * 100}%`
        );
      }

      if (positionValue < this.limits.minPositionSize) {
        throw new RiskLimitExceededError(
          `Position size below minimum: ${positionValue} < ${this.limits.minPositionSize}`
        );
      }
    }

    // Check portfolio risk
    const currentRisk = this.calculatePortfolioRisk(positions, portfolio.equity);
    if (currentRisk >= this.limits.maxPortfolioRisk) {
      throw new RiskLimitExceededError(
        `Portfolio risk limit reached: ${currentRisk.toFixed(2)}% >= ${this.limits.maxPortfolioRisk * 100}%`
      );
    }

    // Check daily loss limit
    if (this.limits.dailyLossLimit) {
      this.updateDailyLoss();

      if (Math.abs(this.dailyLoss) >= this.limits.dailyLossLimit) {
        throw new RiskLimitExceededError(
          `Daily loss limit reached: ${this.dailyLoss.toFixed(2)} >= ${this.limits.dailyLossLimit}`
        );
      }
    }

    // Check drawdown
    const initialEquity = portfolio.equity - portfolio.totalPnl;
    const drawdown = (initialEquity - portfolio.equity) / initialEquity;

    if (drawdown >= this.limits.maxDrawdown) {
      throw new RiskLimitExceededError(
        `Maximum drawdown reached: ${(drawdown * 100).toFixed(2)}% >= ${this.limits.maxDrawdown * 100}%`
      );
    }

    this.logger.debug(`Order validated successfully`);
  }

  /**
   * Check if order can be placed
   * Non-throwing version of validateOrder
   * @returns true if order can be placed, false otherwise
   */
  canPlaceOrder(
    order: Partial<Order>,
    portfolio: Portfolio,
    positions: Position[]
  ): boolean {
    try {
      this.validateOrder(order, portfolio, positions);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Calculate optimal position size
   */
  calculatePositionSize(
    params: PositionSizingParams,
    portfolio: Portfolio,
    entryPrice: number,
    stopPrice?: number,
    volatility?: number,
    winRate?: number,
    avgWinLoss?: number
  ): number {
    const size = this.positionSizer.calculateSize(
      params,
      portfolio.equity,
      entryPrice,
      stopPrice,
      volatility,
      winRate,
      avgWinLoss
    );

    // Apply limits
    const maxSize = this.positionSizer.calculateMaxSize(
      portfolio.equity,
      entryPrice,
      this.limits.maxPositionSize
    );

    return this.positionSizer.applyLimits(
      size,
      entryPrice,
      this.limits.minPositionSize,
      maxSize
    );
  }

  /**
   * Calculate portfolio risk (sum of position risks)
   */
  calculatePortfolioRisk(positions: Position[], equity: number): number {
    const totalRisk = positions.reduce((sum, pos) => {
      const positionRisk = Math.abs(pos.unrealizedPnl) / equity;
      return sum + positionRisk;
    }, 0);

    return totalRisk;
  }

  /**
   * Calculate risk for a single trade
   */
  calculateTradeRisk(
    entryPrice: number,
    stopPrice: number,
    quantity: number,
    equity: number
  ): number {
    const riskPerShare = Math.abs(entryPrice - stopPrice);
    const totalRisk = riskPerShare * quantity;
    return totalRisk / equity;
  }

  /**
   * Check if portfolio is within risk limits
   */
  isWithinLimits(portfolio: Portfolio, positions: Position[]): {
    withinLimits: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    // Check max positions
    if (positions.length > this.limits.maxPositions) {
      violations.push(`Too many positions: ${positions.length} > ${this.limits.maxPositions}`);
    }

    // Check portfolio risk
    const portfolioRisk = this.calculatePortfolioRisk(positions, portfolio.equity);
    if (portfolioRisk > this.limits.maxPortfolioRisk) {
      violations.push(
        `Portfolio risk too high: ${(portfolioRisk * 100).toFixed(2)}% > ${this.limits.maxPortfolioRisk * 100}%`
      );
    }

    // Check drawdown
    const initialEquity = portfolio.equity - portfolio.totalPnl;
    const drawdown = (initialEquity - portfolio.equity) / initialEquity;

    if (drawdown > this.limits.maxDrawdown) {
      violations.push(
        `Drawdown too high: ${(drawdown * 100).toFixed(2)}% > ${this.limits.maxDrawdown * 100}%`
      );
    }

    // Check daily loss limit
    if (this.limits.dailyLossLimit) {
      this.updateDailyLoss();

      if (Math.abs(this.dailyLoss) > this.limits.dailyLossLimit) {
        violations.push(
          `Daily loss limit exceeded: ${this.dailyLoss.toFixed(2)} > ${this.limits.dailyLossLimit}`
        );
      }
    }

    return {
      withinLimits: violations.length === 0,
      violations,
    };
  }

  /**
   * Update daily loss tracking
   */
  updateDailyLoss(pnl?: number): void {
    const now = Date.now();
    const dayStart = new Date().setHours(0, 0, 0, 0);

    // Reset if new day
    if (this.dailyLossResetTime < dayStart) {
      this.dailyLoss = 0;
      this.dailyLossResetTime = dayStart;
    }

    // Add P&L
    if (pnl !== undefined) {
      this.dailyLoss += pnl;
    }
  }

  /**
   * Get current risk limits
   */
  getLimits(): RiskLimits {
    return { ...this.limits };
  }

  /**
   * Update risk limits
   */
  updateLimits(limits: Partial<RiskLimits>): void {
    this.limits = { ...this.limits, ...limits };
    this.logger.info('Risk limits updated');
  }

  /**
   * Reset daily loss tracking
   */
  resetDailyLoss(): void {
    this.dailyLoss = 0;
    this.dailyLossResetTime = Date.now();
    this.logger.debug('Daily loss reset');
  }
}
