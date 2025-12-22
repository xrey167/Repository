/**
 * Trading configuration
 * Centralized settings for trading modes, risk parameters, and execution settings
 */

import { env } from './env';
import type { TradingMode } from '@/core/types';

/**
 * Trading system configuration
 */
export interface TradingConfig {
  /** Trading mode (backtest, paper, or live) */
  mode: TradingMode;

  /** Risk parameters */
  risk: {
    /** Default risk per trade (% of capital, e.g., 0.02 = 2%) */
    defaultRiskPerTrade: number;
    /** Maximum risk per trade (% of capital) */
    maxRiskPerTrade: number;
    /** Maximum portfolio risk (% of capital) */
    maxPortfolioRisk: number;
    /** Maximum drawdown before stopping (% of capital) */
    maxDrawdown: number;
  };

  /** Position limits */
  positions: {
    /** Maximum number of concurrent positions */
    maxPositions: number;
    /** Maximum position size (% of portfolio) */
    maxPositionSize: number;
    /** Minimum position size (absolute value) */
    minPositionSize: number;
  };

  /** Order execution parameters */
  execution: {
    /** Default commission rate (e.g., 0.001 = 0.1%) */
    defaultCommission: number;
    /** Default slippage estimate (e.g., 0.0005 = 0.05%) */
    defaultSlippage: number;
    /** Order timeout in seconds */
    orderTimeout: number;
    /** Number of retry attempts for failed orders */
    retryAttempts: number;
    /** Delay between retries in milliseconds */
    retryDelay: number;
  };

  /** Logging configuration */
  logging: {
    /** Enable trade logging */
    logTrades: boolean;
    /** Enable order logging */
    logOrders: boolean;
    /** Enable signal logging */
    logSignals: boolean;
    /** Log directory path */
    logDirectory: string;
  };

  /** Performance monitoring */
  monitoring: {
    /** Enable real-time performance tracking */
    enabled: boolean;
    /** Update interval in milliseconds */
    updateInterval: number;
    /** Track detailed metrics */
    detailedMetrics: boolean;
  };
}

/**
 * Default trading configuration
 * Can be overridden via environment variables or at runtime
 */
export const tradingConfig: TradingConfig = {
  mode: (env.TRADING_MODE as TradingMode) || 'paper',

  risk: {
    defaultRiskPerTrade: 0.02, // 2% per trade
    maxRiskPerTrade: 0.05, // 5% maximum
    maxPortfolioRisk: 0.10, // 10% total portfolio risk
    maxDrawdown: 0.20, // 20% maximum drawdown
  },

  positions: {
    maxPositions: 5,
    maxPositionSize: 0.25, // 25% of portfolio per position
    minPositionSize: 10, // Minimum $10 position
  },

  execution: {
    defaultCommission: 0.001, // 0.1% commission
    defaultSlippage: 0.0005, // 0.05% slippage
    orderTimeout: 30, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  logging: {
    logTrades: true,
    logOrders: true,
    logSignals: true,
    logDirectory: env.LOG_DIRECTORY || './data/logs',
  },

  monitoring: {
    enabled: true,
    updateInterval: 1000, // Update metrics every second
    detailedMetrics: env.NODE_ENV === 'development',
  },
};

/**
 * Get trading configuration
 * @returns Current trading configuration
 */
export function getTradingConfig(): Readonly<TradingConfig> {
  return tradingConfig;
}

/**
 * Update trading configuration at runtime
 * @param updates - Partial configuration updates
 */
export function updateTradingConfig(updates: Partial<TradingConfig>): void {
  Object.assign(tradingConfig, updates);
}
