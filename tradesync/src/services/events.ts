/**
 * TradeSync Events API
 *
 * Provides methods for retrieving event data.
 * 8 endpoints matching actual TradeSync API:
 * - GET /events/accounts - list account events
 * - GET /events/accounts/{event_id} - get account event
 * - GET /events/trades - list trade events
 * - GET /events/trades/{event_id} - get trade event
 * - GET /events/copiers - list copier events
 * - GET /events/copiers/{event_id} - get copier event
 * - GET /events/commands - list command events
 * - GET /events/commands/{event_id} - get command event
 */

import type { TradeSyncClient } from '../client.js';
import type { PaginationParams, RequestOptions } from '../types.js';

// ============================================================================
// Event Types (matching TradeSync API)
// ============================================================================

/**
 * Account event types
 */
export type AccountEventType =
  | 'connected'
  | 'disconnected'
  | 'not_connected'
  | 'reconnected'
  | 'restored'
  | 'out_of_sync'
  | 'in_sync'
  | 'equity_alert'
  | 'equity_alert_disable_copiers'
  | 'equity_disable_copiers_close_trades'
  | 'equity_alert_enabled_by_user'
  | 'equity_alert_modified_by_user'
  | 'equity_alert_disabled_by_user';

/**
 * Trade event types
 */
export type TradeEventType =
  | 'position_open'
  | 'position_close'
  | 'partial_close'
  | 'order_open'
  | 'order_close'
  | 'order_filled'
  | 'order_price_modified'
  | 'stop_loss_modified'
  | 'take_profit_modified';

/**
 * Copier event types
 */
export type CopierEventType =
  | 'ignored_symbol_disabled'
  | 'copy_existing'
  | 'copier_mode_off'
  | 'ignored_mode_off'
  | 'ignored_mode_monitor'
  | 'ignored_copy_pending_off'
  | 'ignored_copy_pending_on'
  | 'ignored_copy_stop_loss_off'
  | 'ignored_copy_take_profit_off'
  | 'ignored_copy_stop_loss_fixed'
  | 'ignored_copy_take_profit_fixed'
  | 'equity_alert_mode_off'
  | 'copier_mode_monitor';

/**
 * Command event types
 */
export type CommandEventType =
  | 'success'
  | 'trade_closed'
  | 'mt_error'
  | 'not_found'
  | 'symbol_not_found'
  | 'cancelled_by_copier'
  | 'cancelled_by_user'
  | 'abandoned'
  | 'out_of_range'
  | 'trade_not_allowed'
  | 'invalid_risk_configuration'
  | 'open_volume_less_than_minimum'
  | 'close_volume_less_than_minimum';

/**
 * Account event record
 */
export interface AccountEvent {
  id: number;
  created_at: string;
  updated_at: string;
  account_id: number;
  event: AccountEventType;
  data?: Record<string, unknown>;
}

/**
 * Trade event record
 */
export interface TradeEvent {
  id: number;
  created_at: string;
  updated_at: string;
  trade_id: number;
  account_id: number;
  event: TradeEventType;
  data?: Record<string, unknown>;
  event_id: number | null;
  ticket: number;
  type: 'buy' | 'sell';
  symbol: string;
  lots: number;
  open_time: string;
  open_price: number;
  stop_loss: number;
  take_profit: number;
  close_time: string | null;
  close_price: number;
  commission: number;
  swap: number;
  profit: number;
  balance: number;
  equity: number;
  comment: string;
  magic: number;
  digits: number;
  tick_value: number;
  tick_size: number;
  alt_tick_value: number;
  profit_calc_mode: 'forex' | 'cfd' | 'futures';
}

/**
 * Copier event record
 */
export interface CopierEvent {
  id: number;
  created_at: string;
  updated_at: string;
  copier_id: number;
  account_id?: number;
  event: CopierEventType;
  data?: Record<string, unknown>;
}

/**
 * Command event record
 */
export interface CommandEvent {
  id: number;
  created_at: string;
  updated_at: string;
  command_id: number;
  copier_id?: number;
  account_id?: number;
  event: CommandEventType;
  data?: Record<string, unknown>;
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
 * Account events list filters
 */
export interface AccountEventListFilters extends PaginationParams {
  /** Single event ID */
  id?: number;
  /** Comma-separated event IDs */
  ids?: string;
  /** Single account ID */
  account_id?: number;
  /** Comma-separated account IDs */
  account_ids?: string;
  /** Events after timestamp (ISO 8601) */
  created_at_start?: string;
  /** Events before timestamp (ISO 8601) */
  created_at_end?: string;
}

/**
 * Trade events list filters
 */
export interface TradeEventListFilters extends PaginationParams {
  /** Single event ID */
  id?: number;
  /** Comma-separated event IDs */
  ids?: string;
  /** Single trade ID */
  trade_id?: number;
  /** Comma-separated trade IDs */
  trade_ids?: string;
  /** Single account ID */
  account_id?: number;
  /** Comma-separated account IDs */
  account_ids?: string;
  /** Events after timestamp (ISO 8601) */
  created_at_start?: string;
  /** Events before timestamp (ISO 8601) */
  created_at_end?: string;
}

/**
 * Copier events list filters
 */
export interface CopierEventListFilters extends PaginationParams {
  /** Single event ID */
  id?: number;
  /** Comma-separated event IDs */
  ids?: string;
  /** Single copier ID */
  copier_id?: number;
  /** Comma-separated copier IDs */
  copier_ids?: string;
  /** Single account ID */
  account_id?: number;
  /** Comma-separated account IDs */
  account_ids?: string;
  /** Events after timestamp (ISO 8601) */
  created_at_start?: string;
  /** Events before timestamp (ISO 8601) */
  created_at_end?: string;
}

/**
 * Command events list filters
 */
export interface CommandEventListFilters extends PaginationParams {
  /** Single event ID */
  id?: number;
  /** Comma-separated event IDs */
  ids?: string;
  /** Single command ID */
  command_id?: number;
  /** Comma-separated command IDs */
  command_ids?: string;
  /** Single copier ID */
  copier_id?: number;
  /** Comma-separated copier IDs */
  copier_ids?: string;
  /** Single account ID */
  account_id?: number;
  /** Comma-separated account IDs */
  account_ids?: string;
  /** Events after timestamp (ISO 8601) */
  created_at_start?: string;
  /** Events before timestamp (ISO 8601) */
  created_at_end?: string;
}

// ============================================================================
// Events Service
// ============================================================================

/**
 * Events API service
 */
export class EventsService {
  constructor(private readonly client: TradeSyncClient) {}

  // ==========================================================================
  // Account Events
  // ==========================================================================

  /**
   * List account events
   *
   * @example
   * ```typescript
   * const response = await sdk.events.listAccountEvents({
   *   account_id: 12345
   * });
   * console.log(response.data); // Array of account events
   * ```
   */
  async listAccountEvents(
    filters?: AccountEventListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<AccountEvent>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
      account_id: filters?.account_id,
      account_ids: filters?.account_ids,
      created_at_start: filters?.created_at_start,
      created_at_end: filters?.created_at_end,
    };
    return this.client.get<ApiListResponse<AccountEvent>>('/events/accounts', params, options);
  }

  /**
   * Get a single account event by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.events.getAccountEvent(123456);
   * console.log(response.data.event);
   * ```
   */
  async getAccountEvent(
    eventId: number,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<AccountEvent>> {
    return this.client.get<ApiSingleResponse<AccountEvent>>(
      `/events/accounts/${eventId}`,
      undefined,
      options
    );
  }

  // ==========================================================================
  // Trade Events
  // ==========================================================================

  /**
   * List trade events
   *
   * @example
   * ```typescript
   * const response = await sdk.events.listTradeEvents({
   *   trade_id: 12345
   * });
   * console.log(response.data); // Array of trade events
   * ```
   */
  async listTradeEvents(
    filters?: TradeEventListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<TradeEvent>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
      trade_id: filters?.trade_id,
      trade_ids: filters?.trade_ids,
      account_id: filters?.account_id,
      account_ids: filters?.account_ids,
      created_at_start: filters?.created_at_start,
      created_at_end: filters?.created_at_end,
    };
    return this.client.get<ApiListResponse<TradeEvent>>('/events/trades', params, options);
  }

  /**
   * Get a single trade event by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.events.getTradeEvent(123456);
   * console.log(response.data.event);
   * ```
   */
  async getTradeEvent(
    eventId: number,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<TradeEvent>> {
    return this.client.get<ApiSingleResponse<TradeEvent>>(
      `/events/trades/${eventId}`,
      undefined,
      options
    );
  }

  // ==========================================================================
  // Copier Events
  // ==========================================================================

  /**
   * List copier events
   *
   * @example
   * ```typescript
   * const response = await sdk.events.listCopierEvents({
   *   copier_id: 12345
   * });
   * console.log(response.data); // Array of copier events
   * ```
   */
  async listCopierEvents(
    filters?: CopierEventListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<CopierEvent>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
      copier_id: filters?.copier_id,
      copier_ids: filters?.copier_ids,
      account_id: filters?.account_id,
      account_ids: filters?.account_ids,
      created_at_start: filters?.created_at_start,
      created_at_end: filters?.created_at_end,
    };
    return this.client.get<ApiListResponse<CopierEvent>>('/events/copiers', params, options);
  }

  /**
   * Get a single copier event by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.events.getCopierEvent(123456);
   * console.log(response.data.event);
   * ```
   */
  async getCopierEvent(
    eventId: number,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<CopierEvent>> {
    return this.client.get<ApiSingleResponse<CopierEvent>>(
      `/events/copiers/${eventId}`,
      undefined,
      options
    );
  }

  // ==========================================================================
  // Command Events
  // ==========================================================================

  /**
   * List command events
   *
   * @example
   * ```typescript
   * const response = await sdk.events.listCommandEvents({
   *   command_id: 12345
   * });
   * console.log(response.data); // Array of command events
   * ```
   */
  async listCommandEvents(
    filters?: CommandEventListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<CommandEvent>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
      command_id: filters?.command_id,
      command_ids: filters?.command_ids,
      copier_id: filters?.copier_id,
      copier_ids: filters?.copier_ids,
      account_id: filters?.account_id,
      account_ids: filters?.account_ids,
      created_at_start: filters?.created_at_start,
      created_at_end: filters?.created_at_end,
    };
    return this.client.get<ApiListResponse<CommandEvent>>('/events/commands', params, options);
  }

  /**
   * Get a single command event by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.events.getCommandEvent(123456);
   * console.log(response.data.event);
   * ```
   */
  async getCommandEvent(
    eventId: number,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<CommandEvent>> {
    return this.client.get<ApiSingleResponse<CommandEvent>>(
      `/events/commands/${eventId}`,
      undefined,
      options
    );
  }
}
