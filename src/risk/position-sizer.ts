/**
 * Position sizer
 * Calculates position sizes using various methods
 */

import type { PositionSizingMethod, PositionSizingParams } from './risk.types';
import { createLogger } from '@/utils';

/**
 * Position sizer
 * Determines optimal position size based on risk parameters
 */
export class PositionSizer {
  private logger = createLogger('PositionSizer');

  /**
   * Calculate position size
   * @param params - Position sizing parameters
   * @param portfolio - Current portfolio equity
   * @param entryPrice - Entry price
   * @param stopPrice - Stop loss price (required for risk-based sizing)
   * @param volatility - Asset volatility (required for volatility-based sizing)
   * @param winRate - Historical win rate (required for Kelly criterion)
   * @param avgWinLoss - Average win/loss ratio (required for Kelly criterion)
   */
  calculateSize(
    params: PositionSizingParams,
    portfolio: number,
    entryPrice: number,
    stopPrice?: number,
    volatility?: number,
    winRate?: number,
    avgWinLoss?: number
  ): number {
    let size: number;

    switch (params.method) {
      case 'fixed':
        size = this.fixedSize(params.fixedQuantity ?? 1);
        break;

      case 'percent':
        size = this.percentSize(portfolio, entryPrice, params.portfolioPercent ?? 0.1);
        break;

      case 'risk-based':
        if (!stopPrice) {
          throw new Error('Stop price required for risk-based sizing');
        }
        size = this.riskBasedSize(
          portfolio,
          entryPrice,
          stopPrice,
          params.riskPercent ?? 0.02
        );
        break;

      case 'kelly':
        if (winRate === undefined || avgWinLoss === undefined) {
          throw new Error('Win rate and avg win/loss required for Kelly sizing');
        }
        size = this.kellySize(
          portfolio,
          entryPrice,
          winRate,
          avgWinLoss,
          params.kellyFraction ?? 0.25
        );
        break;

      case 'volatility':
        if (!volatility) {
          throw new Error('Volatility required for volatility-based sizing');
        }
        size = this.volatilitySize(
          portfolio,
          entryPrice,
          volatility,
          params.volatilityMultiplier ?? 1.0
        );
        break;

      default:
        throw new Error(`Unknown position sizing method: ${params.method}`);
    }

    this.logger.debug(`Calculated position size: ${size} (method: ${params.method})`);
    return size;
  }

  /**
   * Fixed quantity sizing
   */
  private fixedSize(quantity: number): number {
    return quantity;
  }

  /**
   * Portfolio percentage sizing
   */
  private percentSize(portfolio: number, entryPrice: number, percent: number): number {
    const allocation = portfolio * percent;
    return allocation / entryPrice;
  }

  /**
   * Risk-based sizing (based on stop loss distance)
   */
  private riskBasedSize(
    portfolio: number,
    entryPrice: number,
    stopPrice: number,
    riskPercent: number
  ): number {
    const riskAmount = portfolio * riskPercent;
    const riskPerShare = Math.abs(entryPrice - stopPrice);

    if (riskPerShare === 0) {
      this.logger.warn('Risk per share is zero, returning 0 size');
      return 0;
    }

    return riskAmount / riskPerShare;
  }

  /**
   * Kelly criterion sizing
   * Kelly% = W - (1 - W) / R
   * where W = win rate, R = avg win / avg loss
   */
  private kellySize(
    portfolio: number,
    entryPrice: number,
    winRate: number,
    avgWinLoss: number,
    fraction: number
  ): number {
    // Kelly formula
    const kelly = winRate - (1 - winRate) / avgWinLoss;

    // Apply fractional Kelly (safer)
    const kellyFractional = kelly * fraction;

    // Ensure positive and reasonable
    const safeKelly = Math.max(0, Math.min(kellyFractional, 0.25));

    const allocation = portfolio * safeKelly;
    return allocation / entryPrice;
  }

  /**
   * Volatility-based sizing
   * Reduce position size when volatility is high
   */
  private volatilitySize(
    portfolio: number,
    entryPrice: number,
    volatility: number,
    multiplier: number
  ): number {
    // Inverse relationship with volatility
    // Higher volatility = smaller position
    const targetVolatility = 0.02; // 2% target
    const sizingFactor = (targetVolatility / volatility) * multiplier;

    const safeSize = Math.max(0, Math.min(sizingFactor, 1));
    const allocation = portfolio * safeSize;

    return allocation / entryPrice;
  }

  /**
   * Calculate maximum position size based on limits
   */
  calculateMaxSize(
    portfolio: number,
    entryPrice: number,
    maxPositionPercent: number
  ): number {
    const maxAllocation = portfolio * maxPositionPercent;
    return maxAllocation / entryPrice;
  }

  /**
   * Adjust size to respect minimum and maximum limits
   */
  applyLimits(
    size: number,
    entryPrice: number,
    minSize: number,
    maxSize: number
  ): number {
    const notionalValue = size * entryPrice;

    // Check minimum
    if (notionalValue < minSize) {
      this.logger.debug(`Size below minimum, returning 0`);
      return 0;
    }

    // Check maximum
    if (size > maxSize) {
      this.logger.debug(`Size exceeds maximum, capping at ${maxSize}`);
      return maxSize;
    }

    return size;
  }

  /**
   * Round size to lot size (exchange requirement)
   */
  roundToLotSize(size: number, lotSize: number): number {
    return Math.floor(size / lotSize) * lotSize;
  }
}
