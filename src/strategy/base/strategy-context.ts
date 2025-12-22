/**
 * Strategy context
 * Provides data and services to strategies during execution
 */

import type { Candle, Portfolio, Position, Balance, Symbol, Order, Trade } from '@/core/types';
import type { IIndicator } from '@/indicators';
import { PortfolioManager } from '@/portfolio';
import { RiskManager } from '@/risk';
import { EventBus } from '@/core/events';
import { createLogger } from '@/utils';

/**
 * Strategy context
 * Contains all data and services available to a strategy
 */
export class StrategyContext {
  // Symbol being traded
  readonly symbol: Symbol;

  // Current candle
  currentCandle: Candle | null = null;

  // Historical candles
  candles: Candle[] = [];

  // Portfolio manager
  readonly portfolioManager: PortfolioManager;

  // Risk manager
  readonly riskManager: RiskManager;

  // Event bus
  readonly eventBus: EventBus;

  // Indicators (managed by strategy)
  private indicators: Map<string, IIndicator> = new Map();

  // Pending orders
  private pendingOrders: Map<string, Order> = new Map();

  // Logger
  private logger = createLogger('StrategyContext');

  constructor(
    symbol: Symbol,
    portfolioManager: PortfolioManager,
    riskManager: RiskManager
  ) {
    this.symbol = symbol;
    this.portfolioManager = portfolioManager;
    this.riskManager = riskManager;
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Get portfolio
   */
  getPortfolio(): Portfolio {
    return this.portfolioManager.getPortfolio();
  }

  /**
   * Get current position for symbol
   */
  getPosition(): Position | undefined {
    return this.portfolioManager.getPosition(this.symbol.symbol);
  }

  /**
   * Get all positions
   */
  getAllPositions(): Position[] {
    return this.portfolioManager.getAllPositions();
  }

  /**
   * Get balance
   */
  getBalance(asset: string): Balance | undefined {
    return this.portfolioManager.getBalance(asset);
  }

  /**
   * Get portfolio summary
   */
  getPortfolioSummary() {
    return this.portfolioManager.getSummary();
  }

  /**
   * Register indicator
   */
  registerIndicator(name: string, indicator: IIndicator): void {
    this.indicators.set(name, indicator);
    this.logger.debug(`Registered indicator: ${name}`);
  }

  /**
   * Get indicator
   */
  getIndicator<T extends IIndicator>(name: string): T | undefined {
    return this.indicators.get(name) as T;
  }

  /**
   * Update indicator with new candle
   */
  updateIndicator(name: string, candle: Candle): void {
    const indicator = this.indicators.get(name);
    if (indicator) {
      indicator.update(candle);
    }
  }

  /**
   * Update all indicators with new candle
   */
  updateAllIndicators(candle: Candle): void {
    for (const [name, indicator] of this.indicators.entries()) {
      indicator.update(candle);
    }
    this.logger.debug(`Updated ${this.indicators.size} indicators`);
  }

  /**
   * Add candle to history
   */
  addCandle(candle: Candle): void {
    this.candles.push(candle);
    this.currentCandle = candle;

    // Limit candle history to avoid memory issues
    const maxCandles = 500;
    if (this.candles.length > maxCandles) {
      this.candles = this.candles.slice(-maxCandles);
    }
  }

  /**
   * Get candles (latest N candles)
   */
  getCandles(count?: number): Candle[] {
    if (count === undefined) {
      return [...this.candles];
    }
    return this.candles.slice(-count);
  }

  /**
   * Get current price
   */
  getCurrentPrice(): number | null {
    return this.currentCandle?.close ?? null;
  }

  /**
   * Add pending order
   */
  addPendingOrder(order: Order): void {
    this.pendingOrders.set(order.id, order);
  }

  /**
   * Remove pending order
   */
  removePendingOrder(orderId: string): void {
    this.pendingOrders.delete(orderId);
  }

  /**
   * Get pending order
   */
  getPendingOrder(orderId: string): Order | undefined {
    return this.pendingOrders.get(orderId);
  }

  /**
   * Get all pending orders
   */
  getPendingOrders(): Order[] {
    return Array.from(this.pendingOrders.values());
  }

  /**
   * Check if position is open
   */
  hasPosition(): boolean {
    return this.getPosition() !== undefined;
  }

  /**
   * Check if can buy
   */
  canBuy(quantity: number, price: number): boolean {
    return this.riskManager.canPlaceOrder(
      {
        symbol: this.symbol.symbol,
        side: 'buy',
        quantity,
        price,
        type: 'limit',
      },
      this.getPortfolio(),
      this.getAllPositions()
    );
  }

  /**
   * Check if can sell
   */
  canSell(quantity: number): boolean {
    const position = this.getPosition();
    if (!position) {
      return false;
    }
    return position.quantity >= quantity;
  }

  /**
   * Reset context (for new backtest run)
   */
  reset(): void {
    this.candles = [];
    this.currentCandle = null;
    this.indicators.clear();
    this.pendingOrders.clear();
    this.logger.debug('Context reset');
  }
}
