/**
 * Risk management types
 */

/**
 * Position sizing method
 */
export type PositionSizingMethod = 'fixed' | 'percent' | 'kelly' | 'volatility' | 'risk-based';

/**
 * Stop loss type
 */
export type StopLossType = 'fixed' | 'trailing' | 'atr' | 'time-based';

/**
 * Position sizing parameters
 */
export interface PositionSizingParams {
  /**
   * Sizing method
   */
  method: PositionSizingMethod;

  /**
   * Fixed quantity (for 'fixed' method)
   */
  fixedQuantity?: number;

  /**
   * Portfolio percentage (for 'percent' method)
   */
  portfolioPercent?: number;

  /**
   * Risk percentage per trade (for 'risk-based' method)
   */
  riskPercent?: number;

  /**
   * Kelly criterion fraction (for 'kelly' method)
   */
  kellyFraction?: number;

  /**
   * Volatility multiplier (for 'volatility' method)
   */
  volatilityMultiplier?: number;
}

/**
 * Stop loss parameters
 */
export interface StopLossParams {
  /**
   * Stop loss type
   */
  type: StopLossType;

  /**
   * Fixed stop loss price
   */
  price?: number;

  /**
   * Stop loss percentage
   */
  percent?: number;

  /**
   * Trailing percentage
   */
  trailingPercent?: number;

  /**
   * ATR multiplier (for ATR-based stops)
   */
  atrMultiplier?: number;

  /**
   * Maximum time in milliseconds (for time-based)
   */
  maxTime?: number;
}

/**
 * Risk limits
 */
export interface RiskLimits {
  /**
   * Maximum risk per trade (as percentage of portfolio)
   */
  maxRiskPerTrade: number;

  /**
   * Maximum portfolio risk (sum of all position risks)
   */
  maxPortfolioRisk: number;

  /**
   * Maximum drawdown allowed
   */
  maxDrawdown: number;

  /**
   * Maximum number of concurrent positions
   */
  maxPositions: number;

  /**
   * Maximum position size (as percentage of portfolio)
   */
  maxPositionSize: number;

  /**
   * Minimum position size (absolute value)
   */
  minPositionSize: number;

  /**
   * Maximum correlation between positions
   */
  maxCorrelation?: number;

  /**
   * Daily loss limit (circuit breaker)
   */
  dailyLossLimit?: number;
}

/**
 * Risk metrics
 */
export interface RiskMetrics {
  /**
   * Sharpe ratio
   */
  sharpeRatio: number;

  /**
   * Sortino ratio
   */
  sortinoRatio: number;

  /**
   * Maximum drawdown
   */
  maxDrawdown: number;

  /**
   * Maximum drawdown percentage
   */
  maxDrawdownPercent: number;

  /**
   * Calmar ratio (return / max drawdown)
   */
  calmarRatio: number;

  /**
   * Value at Risk (95% confidence)
   */
  var95: number;

  /**
   * Conditional Value at Risk (CVaR)
   */
  cvar95: number;

  /**
   * Volatility (standard deviation of returns)
   */
  volatility: number;

  /**
   * Beta (market correlation)
   */
  beta?: number;
}
