/**
 * Market data types for the algotrading system
 * Defines standard structures for OHLCV candles, tickers, order books, and symbols
 */

/**
 * Supported timeframe intervals for candle data
 */
export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M';

/**
 * Standard OHLCV (Open-High-Low-Close-Volume) candle data
 *
 * @example
 * ```typescript
 * const candle: Candle = {
 *   timestamp: Date.now(),
 *   open: 50000,
 *   high: 51000,
 *   low: 49500,
 *   close: 50500,
 *   volume: 1234.56,
 *   symbol: 'BTCUSD',
 *   timeframe: '1h'
 * };
 * ```
 */
export interface Candle {
  /** Unix timestamp in milliseconds */
  timestamp: number;
  /** Opening price */
  open: number;
  /** Highest price during the period */
  high: number;
  /** Lowest price during the period */
  low: number;
  /** Closing price */
  close: number;
  /** Trading volume */
  volume: number;
  /** Trading symbol (e.g., 'BTCUSD', 'ETHUSD') */
  symbol: string;
  /** Candle timeframe */
  timeframe: Timeframe;
}

/**
 * Real-time ticker data with bid/ask spread
 */
export interface Ticker {
  /** Trading symbol */
  symbol: string;
  /** Best bid price */
  bid: number;
  /** Best ask price */
  ask: number;
  /** Last traded price */
  last: number;
  /** Unix timestamp in milliseconds */
  timestamp: number;
  /** 24-hour trading volume (optional) */
  volume24h?: number;
  /** 24-hour price change percentage (optional) */
  change24h?: number;
}

/**
 * Order book depth data
 * Contains bids (buy orders) and asks (sell orders)
 */
export interface OrderBook {
  /** Trading symbol */
  symbol: string;
  /** Bid levels [price, quantity][] */
  bids: [price: number, quantity: number][];
  /** Ask levels [price, quantity][] */
  asks: [price: number, quantity: number][];
  /** Unix timestamp in milliseconds */
  timestamp: number;
}

/**
 * Trading symbol information and constraints
 */
export interface Symbol {
  /** Trading symbol (e.g., 'BTCUSD') */
  symbol: string;
  /** Base currency (e.g., 'BTC' in BTC/USD) */
  base: string;
  /** Quote currency (e.g., 'USD' in BTC/USD) */
  quote: string;
  /** Whether the symbol is currently active for trading */
  active: boolean;
  /** Minimum trade size */
  minTradeSize: number;
  /** Maximum trade size */
  maxTradeSize: number;
  /** Price precision (decimal places) */
  pricePrecision: number;
  /** Quantity precision (decimal places) */
  quantityPrecision: number;
  /** Minimum price movement (tick size) */
  tickSize?: number;
  /** Minimum quantity movement (lot size) */
  lotSize?: number;
}

/**
 * Historical data range query
 */
export interface DataRange {
  /** Start timestamp in milliseconds */
  start: number;
  /** End timestamp in milliseconds */
  end: number;
  /** Optional limit on number of candles */
  limit?: number;
}
