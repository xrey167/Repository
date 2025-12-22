/**
 * Trading-related types for orders, positions, and portfolio management
 */

/**
 * Order side - buy or sell
 */
export type OrderSide = 'buy' | 'sell';

/**
 * Order type - market, limit, stop, or stop-limit
 */
export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit';

/**
 * Order status lifecycle
 */
export type OrderStatus = 'pending' | 'open' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected' | 'expired';

/**
 * Position side - long or short
 */
export type PositionSide = 'long' | 'short';

/**
 * Time in force for orders
 */
export type TimeInForce = 'GTC' | 'IOC' | 'FOK' | 'GTD';

/**
 * Trading order
 *
 * @example
 * ```typescript
 * const order: Order = {
 *   id: 'order-123',
 *   symbol: 'BTCUSD',
 *   side: 'buy',
 *   type: 'limit',
 *   quantity: 0.1,
 *   price: 50000,
 *   status: 'open',
 *   filledQuantity: 0,
 *   averagePrice: 0,
 *   timestamp: Date.now()
 * };
 * ```
 */
export interface Order {
  /** Unique order identifier */
  id: string;
  /** Trading symbol */
  symbol: string;
  /** Buy or sell */
  side: OrderSide;
  /** Order type */
  type: OrderType;
  /** Order quantity */
  quantity: number;
  /** Limit price (for limit and stop-limit orders) */
  price?: number;
  /** Stop price (for stop and stop-limit orders) */
  stopPrice?: number;
  /** Current order status */
  status: OrderStatus;
  /** Filled quantity */
  filledQuantity: number;
  /** Average fill price */
  averagePrice: number;
  /** Order creation timestamp */
  timestamp: number;
  /** Order update timestamp */
  updatedAt?: number;
  /** Time in force */
  timeInForce?: TimeInForce;
  /** Client order ID (optional custom identifier) */
  clientOrderId?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Trading position
 */
export interface Position {
  /** Unique position identifier */
  id: string;
  /** Trading symbol */
  symbol: string;
  /** Long or short */
  side: PositionSide;
  /** Position quantity */
  quantity: number;
  /** Average entry price */
  entryPrice: number;
  /** Current market price */
  currentPrice: number;
  /** Unrealized profit/loss */
  unrealizedPnl: number;
  /** Realized profit/loss */
  realizedPnl: number;
  /** Stop loss price (optional) */
  stopLoss?: number;
  /** Take profit price (optional) */
  takeProfit?: number;
  /** Margin used for this position (optional, for margin trading) */
  margin?: number;
  /** Position opened timestamp */
  openedAt: number;
  /** Position last updated timestamp */
  updatedAt?: number;
  /** Position closed timestamp (if closed) */
  closedAt?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Portfolio state containing cash and positions
 */
export interface Portfolio {
  /** Portfolio identifier */
  id: string;
  /** Available cash */
  cash: number;
  /** Total equity (cash + positions value) */
  equity: number;
  /** Open positions */
  positions: Map<string, Position>;
  /** Pending and open orders */
  orders: Map<string, Order>;
  /** Initial capital */
  initialCapital: number;
  /** Total profit/loss */
  totalPnl: number;
  /** Total realized profit/loss */
  realizedPnl: number;
  /** Total unrealized profit/loss */
  unrealizedPnl: number;
  /** Margin used (optional, for margin trading) */
  marginUsed?: number;
  /** Available margin (optional, for margin trading) */
  marginAvailable?: number;
  /** Last update timestamp */
  timestamp: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Executed trade (order fill)
 */
export interface Trade {
  /** Unique trade identifier */
  id: string;
  /** Associated order ID */
  orderId: string;
  /** Trading symbol */
  symbol: string;
  /** Buy or sell */
  side: OrderSide;
  /** Executed quantity */
  quantity: number;
  /** Execution price */
  price: number;
  /** Trading commission/fee */
  commission: number;
  /** Commission currency */
  commissionAsset?: string;
  /** Trade execution timestamp */
  timestamp: number;
  /** Strategy that generated the trade (optional) */
  strategy?: string;
  /** Realized profit/loss from this trade (optional) */
  realizedPnl?: number;
  /** Position side for this trade (optional) */
  positionSide?: PositionSide;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Trade result summary
 */
export interface TradeResult {
  /** Trade profit/loss */
  pnl: number;
  /** Profit/loss percentage */
  pnlPercent: number;
  /** Entry price */
  entryPrice: number;
  /** Exit price */
  exitPrice: number;
  /** Holding period in milliseconds */
  holdingPeriod: number;
  /** Total commission paid */
  commission: number;
}

/**
 * Balance information
 */
export interface Balance {
  /** Asset symbol */
  asset: string;
  /** Available (free) balance */
  free: number;
  /** Locked balance (in orders) */
  locked: number;
  /** Total balance */
  total: number;
}
