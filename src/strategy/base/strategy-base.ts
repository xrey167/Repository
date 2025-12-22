/**
 * Abstract base strategy class
 * Provides common functionality for all strategies
 */

import type { Candle, Signal } from '@/core/types';
import type { IStrategy, StrategyConfig } from './strategy.interface';
import type { StrategyContext } from './strategy-context';
import { createLogger } from '@/utils';

/**
 * Base strategy class
 * Extend this class to create custom strategies
 */
export abstract class StrategyBase implements IStrategy {
  abstract readonly name: string;
  abstract readonly description: string;
  readonly config: StrategyConfig;

  protected logger: ReturnType<typeof createLogger>;
  protected parameters: Record<string, unknown>;

  constructor(config: StrategyConfig) {
    this.config = config;
    this.logger = createLogger(this.constructor.name);
    this.parameters = config.parameters || {};
  }

  /**
   * Initialize strategy
   * Override to add custom initialization logic
   */
  async initialize(context: StrategyContext): Promise<void> {
    this.logger.info('Strategy initialized');
  }

  /**
   * Handle new candle
   * Must be implemented by strategy
   */
  abstract onCandle(candle: Candle, context: StrategyContext): Promise<Signal[]>;

  /**
   * Handle order filled
   * Override to add custom logic
   */
  async onOrderFilled?(orderId: string, context: StrategyContext): Promise<void> {
    this.logger.debug(`Order filled: ${orderId}`);
  }

  /**
   * Cleanup strategy
   * Override to add custom cleanup logic
   */
  async cleanup?(): Promise<void> {
    this.logger.info('Strategy cleanup');
  }

  /**
   * Get strategy parameters
   */
  getParameters(): Record<string, unknown> {
    return { ...this.parameters };
  }

  /**
   * Set strategy parameters
   */
  setParameters(params: Record<string, unknown>): void {
    this.parameters = { ...this.parameters, ...params };
    this.logger.debug('Parameters updated');
  }

  /**
   * Get parameter value
   */
  protected getParameter<T>(key: string, defaultValue: T): T {
    return (this.parameters[key] as T) ?? defaultValue;
  }

  /**
   * Create buy signal
   */
  protected createBuySignal(
    price: number,
    quantity: number,
    reason: string
  ): Signal {
    return {
      type: 'entry',
      side: 'buy',
      symbol: this.config.symbols[0],
      strength: 1.0,
      price,
      quantity,
      timestamp: Date.now(),
      reason,
      strategy: this.name,
    };
  }

  /**
   * Create sell signal
   */
  protected createSellSignal(
    price: number,
    quantity: number,
    reason: string
  ): Signal {
    return {
      type: 'exit',
      side: 'sell',
      symbol: this.config.symbols[0],
      strength: 1.0,
      price,
      quantity,
      timestamp: Date.now(),
      reason,
      strategy: this.name,
    };
  }

  /**
   * Log strategy event
   */
  protected log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    switch (level) {
      case 'debug':
        this.logger.debug(message, data);
        break;
      case 'info':
        this.logger.info(message, data);
        break;
      case 'warn':
        this.logger.warn(message, data);
        break;
      case 'error':
        this.logger.error(message, data);
        break;
    }
  }
}
