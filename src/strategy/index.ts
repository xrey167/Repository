/**
 * Strategy module
 * Trading strategy framework with backtesting
 */

// Base (IStrategy, StrategyConfig, and StrategyContext already exported from core/types)
export { StrategyBase } from './base';

// Backtesting
export { Backtester, PerformanceMetricsCalculator } from './backtest';
export type { BacktestConfig, PerformanceMetrics } from './backtest';

// Example strategies
export { SMACrossoverStrategy, RSIMeanReversionStrategy } from './examples';
