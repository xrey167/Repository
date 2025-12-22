/**
 * Executor interface
 * Defines contract for order execution
 */

import type { Order, Trade, Signal } from '@/core/types';

/**
 * Executor interface
 * Implementations handle order execution for different modes
 */
export interface IExecutor {
  /**
   * Executor name
   */
  readonly name: string;

  /**
   * Execute order
   * @param order - Order to execute
   * @returns Trade result
   */
  execute(order: Order): Promise<Trade>;

  /**
   * Cancel order
   * @param orderId - Order ID to cancel
   */
  cancel(orderId: string): Promise<void>;

  /**
   * Get order status
   * @param orderId - Order ID
   */
  getOrderStatus(orderId: string): Promise<Order | null>;

  /**
   * Create order from signal
   * @param signal - Trading signal
   * @returns Order
   */
  createOrderFromSignal(signal: Signal): Order;
}
