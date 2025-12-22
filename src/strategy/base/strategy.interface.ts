/**
 * Strategy interface
 * Defines contract for all trading strategies
 */

import type { Candle, Signal, Order } from '@/core/types';
import type { StrategyContext } from './strategy-context';

/**
 * Strategy configuration
 */
export interface StrategyConfig {
  /**
   * Strategy name
   */
  name: string;

  /**
   * Strategy description
   */
  description: string;

  /**
   * Trading symbols
   */
  symbols: string[];

  /**
   * Timeframe
   */
  timeframe: string;

  /**
   * Custom parameters
   */
  parameters?: Record<string, any>;
}

/**
 * Strategy interface
 * All trading strategies must implement this interface
 */
export interface IStrategy {
  /**
   * Strategy name
   */
  readonly name: string;

  /**
   * Strategy description
   */
  readonly description: string;

  /**
   * Strategy configuration
   */
  readonly config: StrategyConfig;

  /**
   * Initialize strategy
   * Called once before backtesting or live trading
   */
  initialize(context: StrategyContext): Promise<void>;

  /**
   * Handle new candle
   * Called for each new candle
   */
  onCandle(candle: Candle, context: StrategyContext): Promise<Signal[]>;

  /**
   * Handle order fill
   * Called when an order is filled
   */
  onOrderFilled?(orderId: string, context: StrategyContext): Promise<void>;

  /**
   * Cleanup strategy
   * Called when strategy is stopped
   */
  cleanup?(): Promise<void>;

  /**
   * Get strategy parameters
   */
  getParameters(): Record<string, unknown>;

  /**
   * Set strategy parameters
   */
  setParameters(params: Record<string, unknown>): void;
}
