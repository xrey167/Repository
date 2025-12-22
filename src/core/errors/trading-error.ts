/**
 * Trading-specific error classes
 */

/**
 * Base trading error
 */
export class TradingError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'TradingError';
    Object.setPrototypeOf(this, TradingError.prototype);
  }
}

/**
 * Insufficient balance error - thrown when account balance is too low
 */
export class InsufficientBalanceError extends TradingError {
  constructor(
    public readonly required: number,
    public readonly available: number,
    public readonly asset: string,
    details?: unknown
  ) {
    super(
      `Insufficient ${asset} balance. Required: ${required}, Available: ${available}`,
      'INSUFFICIENT_BALANCE',
      details
    );
    this.name = 'InsufficientBalanceError';
    Object.setPrototypeOf(this, InsufficientBalanceError.prototype);
  }
}

/**
 * Invalid order error - thrown when order parameters are invalid
 */
export class InvalidOrderError extends TradingError {
  constructor(message: string, details?: unknown) {
    super(message, 'INVALID_ORDER', details);
    this.name = 'InvalidOrderError';
    Object.setPrototypeOf(this, InvalidOrderError.prototype);
  }
}

/**
 * Order not found error - thrown when order ID doesn't exist
 */
export class OrderNotFoundError extends TradingError {
  constructor(
    public readonly orderId: string,
    details?: unknown
  ) {
    super(`Order not found: ${orderId}`, 'ORDER_NOT_FOUND', details);
    this.name = 'OrderNotFoundError';
    Object.setPrototypeOf(this, OrderNotFoundError.prototype);
  }
}

/**
 * Order rejected error - thrown when exchange rejects an order
 */
export class OrderRejectedError extends TradingError {
  constructor(
    message: string,
    public readonly reason?: string,
    details?: unknown
  ) {
    super(message, 'ORDER_REJECTED', details);
    this.name = 'OrderRejectedError';
    Object.setPrototypeOf(this, OrderRejectedError.prototype);
  }
}

/**
 * Position not found error - thrown when position doesn't exist
 */
export class PositionNotFoundError extends TradingError {
  constructor(
    public readonly symbol: string,
    details?: unknown
  ) {
    super(`Position not found for symbol: ${symbol}`, 'POSITION_NOT_FOUND', details);
    this.name = 'PositionNotFoundError';
    Object.setPrototypeOf(this, PositionNotFoundError.prototype);
  }
}

/**
 * Risk limit exceeded error - thrown when trade exceeds risk limits
 */
export class RiskLimitExceededError extends TradingError {
  constructor(
    message: string,
    public readonly limit: string = '',
    public readonly value: number = 0,
    details?: unknown
  ) {
    super(message, 'RISK_LIMIT_EXCEEDED', details);
    this.name = 'RiskLimitExceededError';
    Object.setPrototypeOf(this, RiskLimitExceededError.prototype);
  }
}

/**
 * Maximum positions error - thrown when max position limit is reached
 */
export class MaxPositionsError extends TradingError {
  constructor(
    public readonly maxPositions: number,
    details?: unknown
  ) {
    super(
      `Maximum positions limit reached: ${maxPositions}`,
      'MAX_POSITIONS',
      details
    );
    this.name = 'MaxPositionsError';
    Object.setPrototypeOf(this, MaxPositionsError.prototype);
  }
}

/**
 * Invalid quantity error - thrown when order quantity is invalid
 */
export class InvalidQuantityError extends TradingError {
  constructor(
    message: string,
    public readonly quantity: number,
    details?: unknown
  ) {
    super(message, 'INVALID_QUANTITY', details);
    this.name = 'InvalidQuantityError';
    Object.setPrototypeOf(this, InvalidQuantityError.prototype);
  }
}

/**
 * Invalid price error - thrown when price is invalid
 */
export class InvalidPriceError extends TradingError {
  constructor(
    message: string,
    public readonly price: number,
    details?: unknown
  ) {
    super(message, 'INVALID_PRICE', details);
    this.name = 'InvalidPriceError';
    Object.setPrototypeOf(this, InvalidPriceError.prototype);
  }
}

/**
 * Market closed error - thrown when trying to trade outside market hours
 */
export class MarketClosedError extends TradingError {
  constructor(
    public readonly symbol: string,
    details?: unknown
  ) {
    super(`Market is closed for symbol: ${symbol}`, 'MARKET_CLOSED', details);
    this.name = 'MarketClosedError';
    Object.setPrototypeOf(this, MarketClosedError.prototype);
  }
}

/**
 * Strategy error - thrown when strategy execution fails
 */
export class StrategyError extends TradingError {
  constructor(
    message: string,
    public readonly strategy: string,
    details?: unknown
  ) {
    super(message, 'STRATEGY_ERROR', details);
    this.name = 'StrategyError';
    Object.setPrototypeOf(this, StrategyError.prototype);
  }
}
