/**
 * Strategy module
 * Trading strategy framework with backtesting
 */

// Base
export type { IStrategy, StrategyConfig } from './base';
export { StrategyBase, StrategyContext } from './base';

// Backtesting
export { Backtester, PerformanceMetricsCalculator } from './backtest';
export type { BacktestConfig, PerformanceMetrics } from './backtest';

// Example strategies
export { SMACrossoverStrategy, RSIMeanReversionStrategy } from './examples';
