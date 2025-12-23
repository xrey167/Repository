/**
 * TradeSync Trades API
 *
 * Provides methods for retrieving trade data.
 * 2 endpoints matching actual TradeSync API:
 * - GET /trades - list trades
 * - GET /trades/{trade_id} - get trade
 */

import type { TradeSyncClient } from '../client.js';
import type { PaginationParams, RequestOptions } from '../types.js';

// ============================================================================
// Trade Types (matching TradeSync API)
// ============================================================================

/**
 * Trade state values
 */
export type TradeState = 'open' | 'closed';

/**
 * Trade type (direction)
 */
export type TradeType = 'buy' | 'sell';

/**
 * Profit calculation mode
 */
export type ProfitCalcMode = 'forex' | 'cfd' | 'futures';

/**
 * Trade record from TradeSync API
 */
export interface Trade {
  id: number;
  created_at: string;
  updated_at: string;
  state: TradeState;
  account_id: number;
  ticket: number;
  type: TradeType;
  symbol: string;
  lots: number;
  open_time: string;
  open_price: number;
  stop_loss?: string;
  take_profit?: string;
  close_time?: string;
  close_price?: number;
  commission: number;
  swap: number;
  profit: number;
  magic: number;
  digits: number;
  tick_value: number;
  tick_size: number;
  alt_tick_value: number;
  profit_calc_mode: ProfitCalcMode;
  comment?: string;
}

/**
 * API response wrapper
 */
export interface ApiListResponse<T> {
  result: 'success' | 'error';
  status: number;
  meta: {
    count: number;
    limit: number;
    order: 'asc' | 'desc';
    last_id: number;
  };
  data: T[];
}

export interface ApiSingleResponse<T> {
  result: 'success' | 'error';
  status: number;
  data: T;
}

// ============================================================================
// Filter Types
// ============================================================================

/**
 * Trade list filters
 */
export interface TradeListFilters extends PaginationParams {
  /** Single trade ID */
  id?: number;
  /** Comma-separated trade IDs */
  ids?: string;
  /** Single account ID */
  account_id?: number;
  /** Comma-separated account IDs */
  account_ids?: string;
  /** Trade state: open or closed */
  state?: TradeState;
  /** Trades opened after timestamp (ISO 8601) */
  open_time_start?: string;
  /** Trades opened before timestamp (ISO 8601) */
  open_time_end?: string;
  /** Trades closed after timestamp (ISO 8601) */
  close_time_start?: string;
  /** Trades closed before timestamp (ISO 8601) */
  close_time_end?: string;
}

// ============================================================================
// Trades Service
// ============================================================================

/**
 * Trades API service
 */
export class TradesService {
  constructor(private readonly client: TradeSyncClient) {}

  /**
   * List trades with optional filters
   *
   * @example
   * ```typescript
   * // List all open trades
   * const response = await sdk.trades.list({ state: 'open' });
   *
   * // List trades for specific account
   * const accountTrades = await sdk.trades.list({
   *   account_id: 12345,
   *   open_time_start: '2024-01-01T00:00:00Z'
   * });
   * ```
   */
  async list(
    filters?: TradeListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<Trade>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
      account_id: filters?.account_id,
      account_ids: filters?.account_ids,
      state: filters?.state,
      open_time_start: filters?.open_time_start,
      open_time_end: filters?.open_time_end,
      close_time_start: filters?.close_time_start,
      close_time_end: filters?.close_time_end,
    };
    return this.client.get<ApiListResponse<Trade>>('/trades', params, options);
  }

  /**
   * Get a single trade by ID
   *
   * Note: The `magic` field = 0 for master trades, otherwise contains master's trade_id for copied trades.
   *
   * @example
   * ```typescript
   * const response = await sdk.trades.get(123456);
   * console.log(response.data.profit);
   * ```
   */
  async get(tradeId: number, options?: RequestOptions): Promise<ApiSingleResponse<Trade>> {
    return this.client.get<ApiSingleResponse<Trade>>(`/trades/${tradeId}`, undefined, options);
  }
}
