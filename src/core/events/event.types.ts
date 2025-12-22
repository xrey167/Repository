/**
 * Event types for the event-driven architecture
 * Events allow loose coupling between modules
 */

import type { Candle, Ticker } from '../types/market.types';
import type { Order, Trade, Position, Portfolio } from '../types/trading.types';
import type { Signal } from '../types/strategy.types';

/**
 * Event type identifiers
 */
export type EventType =
  | 'candle:new'
  | 'candle:updated'
  | 'ticker:update'
  | 'signal:generated'
  | 'signal:executed'
  | 'order:created'
  | 'order:submitted'
  | 'order:updated'
  | 'order:filled'
  | 'order:partially_filled'
  | 'order:cancelled'
  | 'order:rejected'
  | 'trade:executed'
  | 'position:opened'
  | 'position:updated'
  | 'position:closed'
  | 'portfolio:updated'
  | 'risk:limit_exceeded'
  | 'risk:stop_loss_triggered'
  | 'risk:take_profit_triggered'
  | 'strategy:started'
  | 'strategy:stopped'
  | 'strategy:error'
  | 'datafeed:connected'
  | 'datafeed:disconnected'
  | 'datafeed:error';

/**
 * Base event structure
 * All events extend this interface
 */
export interface BaseEvent<T = unknown> {
  /** Event type identifier */
  type: EventType;
  /** Event timestamp */
  timestamp: number;
  /** Event payload data */
  data: T;
  /** Optional event source identifier */
  source?: string;
  /** Optional correlation ID for tracking related events */
  correlationId?: string;
}

/**
 * Candle event - emitted when a new candle is received
 */
export interface CandleEvent extends BaseEvent<Candle> {
  type: 'candle:new' | 'candle:updated';
  data: Candle;
}

/**
 * Ticker event - emitted when ticker data is updated
 */
export interface TickerEvent extends BaseEvent<Ticker> {
  type: 'ticker:update';
  data: Ticker;
}

/**
 * Signal event - emitted when a strategy generates a signal
 */
export interface SignalEvent extends BaseEvent<{ signal: Signal; strategy: string }> {
  type: 'signal:generated' | 'signal:executed';
  data: {
    signal: Signal;
    strategy: string;
  };
}

/**
 * Order event - emitted for order lifecycle changes
 */
export interface OrderEvent extends BaseEvent<Order> {
  type:
    | 'order:created'
    | 'order:submitted'
    | 'order:updated'
    | 'order:filled'
    | 'order:partially_filled'
    | 'order:cancelled'
    | 'order:rejected';
  data: Order;
}

/**
 * Trade event - emitted when a trade is executed
 */
export interface TradeEvent extends BaseEvent<Trade> {
  type: 'trade:executed';
  data: Trade;
}

/**
 * Position event - emitted for position changes
 */
export interface PositionEvent extends BaseEvent<Position> {
  type: 'position:opened' | 'position:updated' | 'position:closed';
  data: Position;
}

/**
 * Portfolio event - emitted when portfolio state changes
 */
export interface PortfolioEvent extends BaseEvent<Portfolio> {
  type: 'portfolio:updated';
  data: Portfolio;
}

/**
 * Risk event - emitted for risk management alerts
 */
export interface RiskEvent extends BaseEvent<{
  type: string;
  message: string;
  details?: unknown;
}> {
  type: 'risk:limit_exceeded' | 'risk:stop_loss_triggered' | 'risk:take_profit_triggered';
  data: {
    type: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Strategy event - emitted for strategy lifecycle
 */
export interface StrategyEvent extends BaseEvent<{
  strategy: string;
  message?: string;
  error?: Error;
}> {
  type: 'strategy:started' | 'strategy:stopped' | 'strategy:error';
  data: {
    strategy: string;
    message?: string;
    error?: Error;
  };
}

/**
 * Datafeed event - emitted for datafeed connection status
 */
export interface DatafeedEvent extends BaseEvent<{
  adapter: string;
  message?: string;
  error?: Error;
}> {
  type: 'datafeed:connected' | 'datafeed:disconnected' | 'datafeed:error';
  data: {
    adapter: string;
    message?: string;
    error?: Error;
  };
}

/**
 * Union type of all trading events
 */
export type TradingEvent =
  | CandleEvent
  | TickerEvent
  | SignalEvent
  | OrderEvent
  | TradeEvent
  | PositionEvent
  | PortfolioEvent
  | RiskEvent
  | StrategyEvent
  | DatafeedEvent;

/**
 * Event handler callback function
 */
export type EventHandler<T extends BaseEvent = BaseEvent> = (event: T) => void | Promise<void>;

/**
 * Event subscription
 */
export interface EventSubscription {
  /** Subscription ID */
  id: string;
  /** Event type being subscribed to */
  type: EventType;
  /** Handler function */
  handler: EventHandler;
  /** Unsubscribe function */
  unsubscribe: () => void;
}
