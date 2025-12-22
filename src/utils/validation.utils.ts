/**
 * Validation utility functions
 */

import type { Order, Symbol, Timeframe } from '@/core/types';
import {
  InvalidOrderError,
  InvalidQuantityError,
  InvalidPriceError,
  InvalidSymbolError,
} from '@/core/errors';

/**
 * Validate trading symbol
 * @param symbol - Symbol to validate
 * @param symbolInfo - Symbol information (optional)
 * @throws InvalidSymbolError if invalid
 */
export function validateSymbol(symbol: string, symbolInfo?: Symbol): void {
  if (!symbol || typeof symbol !== 'string') {
    throw new InvalidSymbolError(symbol);
  }

  if (symbolInfo && !symbolInfo.active) {
    throw new InvalidSymbolError(symbol, { reason: 'Symbol is not active for trading' });
  }
}

/**
 * Validate order quantity
 * @param quantity - Quantity to validate
 * @param symbolInfo - Symbol information (optional)
 * @throws InvalidQuantityError if invalid
 */
export function validateQuantity(quantity: number, symbolInfo?: Symbol): void {
  if (!isFinite(quantity) || quantity <= 0) {
    throw new InvalidQuantityError('Quantity must be a positive number', quantity);
  }

  if (symbolInfo) {
    if (quantity < symbolInfo.minTradeSize) {
      throw new InvalidQuantityError(
        `Quantity ${quantity} is below minimum trade size ${symbolInfo.minTradeSize}`,
        quantity,
        { minTradeSize: symbolInfo.minTradeSize }
      );
    }

    if (quantity > symbolInfo.maxTradeSize) {
      throw new InvalidQuantityError(
        `Quantity ${quantity} exceeds maximum trade size ${symbolInfo.maxTradeSize}`,
        quantity,
        { maxTradeSize: symbolInfo.maxTradeSize }
      );
    }

    // Check lot size precision
    if (symbolInfo.lotSize) {
      const remainder = quantity % symbolInfo.lotSize;
      if (remainder !== 0) {
        throw new InvalidQuantityError(
          `Quantity ${quantity} does not match lot size ${symbolInfo.lotSize}`,
          quantity,
          { lotSize: symbolInfo.lotSize }
        );
      }
    }
  }
}

/**
 * Validate order price
 * @param price - Price to validate
 * @param symbolInfo - Symbol information (optional)
 * @throws InvalidPriceError if invalid
 */
export function validatePrice(price: number, symbolInfo?: Symbol): void {
  if (!isFinite(price) || price <= 0) {
    throw new InvalidPriceError('Price must be a positive number', price);
  }

  // Check tick size precision
  if (symbolInfo?.tickSize) {
    const remainder = price % symbolInfo.tickSize;
    if (Math.abs(remainder) > 1e-10) {
      // Allow small floating point errors
      throw new InvalidPriceError(
        `Price ${price} does not match tick size ${symbolInfo.tickSize}`,
        price,
        { tickSize: symbolInfo.tickSize }
      );
    }
  }
}

/**
 * Validate order parameters
 * @param order - Order to validate
 * @param symbolInfo - Symbol information (optional)
 * @throws InvalidOrderError if invalid
 */
export function validateOrder(
  order: Partial<Order>,
  symbolInfo?: Symbol
): void {
  // Validate symbol
  if (!order.symbol) {
    throw new InvalidOrderError('Order must have a symbol');
  }
  validateSymbol(order.symbol, symbolInfo);

  // Validate quantity
  if (!order.quantity) {
    throw new InvalidOrderError('Order must have a quantity');
  }
  validateQuantity(order.quantity, symbolInfo);

  // Validate price for limit orders
  if (order.type === 'limit' || order.type === 'stop-limit') {
    if (!order.price) {
      throw new InvalidOrderError(`${order.type} order must have a price`);
    }
    validatePrice(order.price, symbolInfo);
  }

  // Validate stop price for stop orders
  if (order.type === 'stop' || order.type === 'stop-limit') {
    if (!order.stopPrice) {
      throw new InvalidOrderError(`${order.type} order must have a stopPrice`);
    }
    validatePrice(order.stopPrice, symbolInfo);
  }

  // Validate side
  if (!order.side || (order.side !== 'buy' && order.side !== 'sell')) {
    throw new InvalidOrderError('Order side must be "buy" or "sell"');
  }

  // Validate type
  const validTypes = ['market', 'limit', 'stop', 'stop-limit'];
  if (!order.type || !validTypes.includes(order.type)) {
    throw new InvalidOrderError(
      `Order type must be one of: ${validTypes.join(', ')}`
    );
  }
}

/**
 * Validate timeframe
 * @param timeframe - Timeframe to validate
 * @throws Error if invalid
 */
export function validateTimeframe(timeframe: string): asserts timeframe is Timeframe {
  const validTimeframes: Timeframe[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M'];
  if (!validTimeframes.includes(timeframe as Timeframe)) {
    throw new Error(
      `Invalid timeframe: ${timeframe}. Must be one of: ${validTimeframes.join(', ')}`
    );
  }
}

/**
 * Validate percentage value (0-100)
 * @param value - Percentage value
 * @param name - Parameter name for error messages
 * @throws Error if invalid
 */
export function validatePercentage(value: number, name: string = 'value'): void {
  if (!isFinite(value) || value < 0 || value > 100) {
    throw new Error(`${name} must be between 0 and 100, got ${value}`);
  }
}

/**
 * Validate decimal value (0-1)
 * @param value - Decimal value
 * @param name - Parameter name for error messages
 * @throws Error if invalid
 */
export function validateDecimal(value: number, name: string = 'value'): void {
  if (!isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${name} must be between 0 and 1, got ${value}`);
  }
}

/**
 * Validate positive number
 * @param value - Number to validate
 * @param name - Parameter name for error messages
 * @throws Error if invalid
 */
export function validatePositive(value: number, name: string = 'value'): void {
  if (!isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number, got ${value}`);
  }
}

/**
 * Validate non-negative number
 * @param value - Number to validate
 * @param name - Parameter name for error messages
 * @throws Error if invalid
 */
export function validateNonNegative(value: number, name: string = 'value'): void {
  if (!isFinite(value) || value < 0) {
    throw new Error(`${name} must be non-negative, got ${value}`);
  }
}

/**
 * Check if value is a number
 * @param value - Value to check
 * @returns True if number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value);
}

/**
 * Check if value is a valid string
 * @param value - Value to check
 * @returns True if non-empty string
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}
