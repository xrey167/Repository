/**
 * Core types index
 * Re-exports all type definitions for easy importing
 */

// Market types
export type {
  Timeframe,
  Candle,
  Ticker,
  OrderBook,
  Symbol,
  DataRange,
} from './market.types';

// Trading types
export type {
  OrderSide,
  OrderType,
  OrderStatus,
  PositionSide,
  TimeInForce,
  Order,
  Position,
  Portfolio,
  Trade,
  TradeResult,
  Balance,
} from './trading.types';

// Datafeed types
export type {
  AdapterType,
  DatafeedConfig,
  IDatafeedAdapter,
  ITradingAdapter,
  CacheEntry,
  IDatafeedCache,
} from './datafeed.types';

// Strategy types
export type {
  TradingMode,
  StrategyConfig,
  StrategyContext,
  Signal,
  StrategyMetrics,
  IStrategy,
  BacktestResult,
  StrategyState,
} from './strategy.types';
