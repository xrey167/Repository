/**
 * Errors module index
 * Re-exports all custom error classes
 */

// Datafeed errors
export {
  DatafeedError,
  ConnectionError,
  AuthenticationError,
  RateLimitError,
  InvalidSymbolError,
  DataNotAvailableError,
  TimeoutError,
  NetworkError,
  ParseError,
} from './datafeed-error';

// Trading errors
export {
  TradingError,
  InsufficientBalanceError,
  InvalidOrderError,
  OrderNotFoundError,
  OrderRejectedError,
  PositionNotFoundError,
  RiskLimitExceededError,
  MaxPositionsError,
  InvalidQuantityError,
  InvalidPriceError,
  MarketClosedError,
  StrategyError,
} from './trading-error';
