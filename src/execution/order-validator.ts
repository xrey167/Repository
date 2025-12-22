/**
 * Order validator
 * Validates orders before execution
 */

import type { Order, Portfolio, Position, Symbol } from '@/core/types';
import { InvalidOrderError, InsufficientBalanceError } from '@/core/errors';
import { createLogger } from '@/utils';

/**
 * Order validator
 * Pre-execution validation
 */
export class OrderValidator {
  private logger = createLogger('OrderValidator');

  /**
   * Validate order
   * @throws InvalidOrderError if validation fails
   */
  validate(
    order: Partial<Order>,
    portfolio: Portfolio,
    positions: Position[],
    symbolInfo?: Symbol
  ): void {
    // Validate required fields
    this.validateRequiredFields(order);

    // Validate symbol
    if (symbolInfo) {
      this.validateSymbol(order, symbolInfo);
    }

    // Validate quantity
    this.validateQuantity(order, symbolInfo);

    // Validate price
    if (order.type === 'limit' || order.type === 'stop-limit') {
      this.validatePrice(order, symbolInfo);
    }

    // Validate balance
    this.validateBalance(order, portfolio, positions);

    this.logger.debug(`Order validated: ${order.side} ${order.quantity} ${order.symbol}`);
  }

  /**
   * Validate required fields
   */
  private validateRequiredFields(order: Partial<Order>): void {
    if (!order.symbol) {
      throw new InvalidOrderError('Symbol is required');
    }

    if (!order.side) {
      throw new InvalidOrderError('Side is required');
    }

    if (!order.type) {
      throw new InvalidOrderError('Order type is required');
    }

    if (order.quantity === undefined || order.quantity <= 0) {
      throw new InvalidOrderError('Quantity must be positive');
    }
  }

  /**
   * Validate symbol
   */
  private validateSymbol(order: Partial<Order>, symbolInfo: Symbol): void {
    if (!symbolInfo.isActive) {
      throw new InvalidOrderError(`Symbol ${order.symbol} is not active`);
    }
  }

  /**
   * Validate quantity
   */
  private validateQuantity(order: Partial<Order>, symbolInfo?: Symbol): void {
    if (order.quantity === undefined || order.quantity <= 0) {
      throw new InvalidOrderError('Quantity must be positive');
    }

    if (symbolInfo) {
      // Check minimum quantity
      if (
        symbolInfo.minQuantity !== undefined &&
        order.quantity < symbolInfo.minQuantity
      ) {
        throw new InvalidOrderError(
          `Quantity ${order.quantity} below minimum ${symbolInfo.minQuantity}`
        );
      }

      // Check maximum quantity
      if (
        symbolInfo.maxQuantity !== undefined &&
        order.quantity > symbolInfo.maxQuantity
      ) {
        throw new InvalidOrderError(
          `Quantity ${order.quantity} exceeds maximum ${symbolInfo.maxQuantity}`
        );
      }

      // Check lot size
      if (symbolInfo.lotSize) {
        const remainder = order.quantity % symbolInfo.lotSize;
        if (remainder !== 0) {
          throw new InvalidOrderError(
            `Quantity must be multiple of lot size ${symbolInfo.lotSize}`
          );
        }
      }
    }
  }

  /**
   * Validate price
   */
  private validatePrice(order: Partial<Order>, symbolInfo?: Symbol): void {
    if (order.price === undefined || order.price <= 0) {
      throw new InvalidOrderError('Price must be positive for limit orders');
    }

    if (symbolInfo && symbolInfo.tickSize) {
      // Check tick size
      const remainder = order.price % symbolInfo.tickSize;
      if (remainder !== 0) {
        throw new InvalidOrderError(
          `Price must be multiple of tick size ${symbolInfo.tickSize}`
        );
      }
    }
  }

  /**
   * Validate balance
   */
  private validateBalance(
    order: Partial<Order>,
    portfolio: Portfolio,
    positions: Position[]
  ): void {
    if (order.side === 'buy') {
      // Check if enough cash to buy
      const requiredAmount = (order.quantity ?? 0) * (order.price ?? 0);

      if (portfolio.cash < requiredAmount) {
        throw new InsufficientBalanceError(
          requiredAmount,
          portfolio.cash,
          'cash'
        );
      }
    } else if (order.side === 'sell') {
      // Check if enough position to sell
      const position = positions.find((p) => p.symbol === order.symbol);

      if (!position) {
        throw new InsufficientBalanceError(
          order.quantity ?? 0,
          0,
          order.symbol
        );
      }

      if (position.quantity < (order.quantity ?? 0)) {
        throw new InsufficientBalanceError(
          order.quantity ?? 0,
          position.quantity,
          order.symbol
        );
      }
    }
  }
}
