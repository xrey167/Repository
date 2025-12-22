/**
 * Order manager
 * Manages order lifecycle and execution
 */

import type { Order, Signal } from '@/core/types';
import type { IExecutor } from './executor.interface';
import { EventBus } from '@/core/events';
import { createLogger } from '@/utils';

/**
 * Order manager
 * Central manager for order lifecycle
 */
export class OrderManager {
  private executor: IExecutor;
  private eventBus: EventBus;
  private logger = createLogger('OrderManager');

  private orders: Map<string, Order> = new Map();

  constructor(executor: IExecutor) {
    this.executor = executor;
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Submit order from signal
   */
  async submitSignal(signal: Signal): Promise<Order> {
    this.logger.info(`Submitting signal: ${signal.type} ${signal.side} ${signal.symbol}`);

    // Create order from signal
    const order = this.executor.createOrderFromSignal(signal);

    // Store order
    this.orders.set(order.id, order);

    // Publish order submitted event
    this.eventBus.publish({
      type: 'order:submitted',
      timestamp: Date.now(),
      data: { order },
    });

    // Execute order
    try {
      const trade = await this.executor.execute(order);

      // Update order
      const updatedOrder = await this.executor.getOrderStatus(order.id);
      if (updatedOrder) {
        this.orders.set(order.id, updatedOrder);
      }

      // Publish order filled event
      this.eventBus.publish({
        type: 'order:filled',
        timestamp: Date.now(),
        data: { order: updatedOrder, trade },
      });

      this.logger.info(`Order filled: ${order.id}`);

      return updatedOrder || order;
    } catch (error) {
      this.logger.error(`Order execution failed: ${error}`);

      // Update order status to rejected
      order.status = 'rejected';
      this.orders.set(order.id, order);

      // Publish order rejected event
      this.eventBus.publish({
        type: 'order:rejected',
        timestamp: Date.now(),
        data: { order, error: String(error) },
      });

      throw error;
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<void> {
    const order = this.orders.get(orderId);

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    await this.executor.cancel(orderId);

    // Update order
    const updatedOrder = await this.executor.getOrderStatus(orderId);
    if (updatedOrder) {
      this.orders.set(orderId, updatedOrder);
    }

    // Publish order cancelled event
    this.eventBus.publish({
      type: 'order:cancelled',
      timestamp: Date.now(),
      data: { order: updatedOrder || order },
    });

    this.logger.info(`Order cancelled: ${orderId}`);
  }

  /**
   * Get order
   */
  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  /**
   * Get all orders
   */
  getOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  /**
   * Get pending orders
   */
  getPendingOrders(): Order[] {
    return this.getOrders().filter((o) => o.status === 'pending' || o.status === 'open');
  }

  /**
   * Get filled orders
   */
  getFilledOrders(): Order[] {
    return this.getOrders().filter((o) => o.status === 'filled');
  }

  /**
   * Clear all orders
   */
  clear(): void {
    this.orders.clear();
    this.logger.debug('Orders cleared');
  }
}
