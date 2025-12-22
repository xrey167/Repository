/**
 * Paper trading executor
 * Simulates order execution without real money
 */

import type { Order, Trade, Signal } from '@/core/types';
import type { IExecutor } from './executor.interface';
import { PortfolioManager } from '@/portfolio';
import { createLogger } from '@/utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Paper executor configuration
 */
export interface PaperExecutorConfig {
  /**
   * Simulated commission (as decimal)
   */
  commission: number;

  /**
   * Simulated slippage (as decimal)
   */
  slippage: number;

  /**
   * Fill delay in milliseconds
   */
  fillDelay: number;
}

/**
 * Paper trading executor
 * Simulates order execution with realistic fills
 */
export class PaperExecutor implements IExecutor {
  readonly name = 'PaperExecutor';

  private config: PaperExecutorConfig;
  private portfolioManager: PortfolioManager;
  private orders: Map<string, Order> = new Map();
  private logger = createLogger('PaperExecutor');

  constructor(config: PaperExecutorConfig, portfolioManager: PortfolioManager) {
    this.config = {
      ...config,
      commission: config.commission ?? 0.001,
      slippage: config.slippage ?? 0.0005,
      fillDelay: config.fillDelay ?? 100,
    };
    this.portfolioManager = portfolioManager;
  }

  /**
   * Execute order
   */
  async execute(order: Order): Promise<Trade> {
    this.logger.info(`Executing order: ${order.side} ${order.quantity} ${order.symbol}`);

    // Store order
    this.orders.set(order.id, order);

    // Simulate network delay
    if (this.config.fillDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.config.fillDelay));
    }

    // Calculate fill price with slippage
    let fillPrice = order.price || 0;

    if (order.type === 'market') {
      // For market orders, use current market price
      // In real implementation, would get from datafeed
      fillPrice = order.price || 0;
    }

    // Apply slippage
    if (order.side === 'buy') {
      fillPrice *= 1 + this.config.slippage;
    } else {
      fillPrice *= 1 - this.config.slippage;
    }

    // Calculate commission
    const commission = order.quantity * fillPrice * this.config.commission;

    // Create trade
    const trade: Trade = {
      id: uuidv4(),
      orderId: order.id,
      symbol: order.symbol,
      side: order.side,
      quantity: order.quantity,
      price: fillPrice,
      commission,
      timestamp: Date.now(),
    };

    // Calculate realized P&L for sell orders
    if (order.side === 'sell') {
      const position = this.portfolioManager.getPosition(order.symbol);
      if (position) {
        const pnl = (fillPrice - position.entryPrice) * order.quantity - commission;
        trade.realizedPnl = pnl;
      }
    }

    // Update order status
    order.status = 'filled';
    order.filledQuantity = order.quantity;
    order.averagePrice = fillPrice;
    this.orders.set(order.id, order);

    // Update portfolio
    this.portfolioManager.updateFromTrade(trade);

    this.logger.info(
      `Order filled: ${order.side} ${order.quantity} ${order.symbol} @ ${fillPrice.toFixed(2)} (commission: ${commission.toFixed(2)})`
    );

    return trade;
  }

  /**
   * Cancel order
   */
  async cancel(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);

    if (!order) {
      this.logger.warn(`Order not found: ${orderId}`);
      return;
    }

    if (order.status === 'filled') {
      throw new Error(`Cannot cancel filled order: ${orderId}`);
    }

    order.status = 'cancelled';
    this.orders.set(orderId, order);

    this.logger.info(`Order cancelled: ${orderId}`);
  }

  /**
   * Get order status
   */
  async getOrderStatus(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) || null;
  }

  /**
   * Create order from signal
   */
  createOrderFromSignal(signal: Signal): Order {
    return {
      id: uuidv4(),
      symbol: signal.symbol,
      side: signal.side,
      type: signal.orderType || 'market',
      quantity: signal.quantity ?? 1,
      price: signal.price,
      stopPrice: signal.stopPrice,
      status: 'pending',
      filledQuantity: 0,
      averagePrice: 0,
      timestamp: signal.timestamp,
    };
  }

  /**
   * Get all orders
   */
  getOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  /**
   * Clear orders (for new session)
   */
  clear(): void {
    this.orders.clear();
    this.logger.debug('Orders cleared');
  }
}
