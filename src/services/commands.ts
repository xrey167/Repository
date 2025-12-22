/**
 * TradeSync Commands API
 *
 * Provides methods for executing trading commands.
 * 5 endpoints matching actual TradeSync API:
 * - GET /commands - list commands
 * - GET /commands/{command_id} - get command
 * - POST /commands (open) - create open trade command
 * - POST /commands (modify) - create modify command
 * - POST /commands (close) - create close command
 * - PATCH /commands/{command_id} - cancel working command
 */

import { z } from 'zod';
import type { TradeSyncClient } from '../client.js';
import type { PaginationParams, RequestOptions } from '../types.js';

// ============================================================================
// Command Types (matching TradeSync API)
// ============================================================================

/**
 * Command group values
 */
export type CommandGroup = 'account' | 'copier' | 'trade' | 'user';

/**
 * Command type values
 */
export type CommandType =
  | 'open'
  | 'close_full'
  | 'close_partial'
  | 'modify_stop_loss'
  | 'modify_take_profit'
  | 'modify_pending_price';

/**
 * Trade type (direction)
 */
export type TradeType = 'buy' | 'sell';

/**
 * Trade identifier type
 */
export type ByType = 'ticket' | 'magic';

/**
 * Command status values
 */
export type CommandStatus = 'working' | 'complete' | 'paused' | 'abandoned' | 'cancelled';

/**
 * Command result values
 */
export type CommandResult =
  | 'success'
  | 'error'
  | 'mt_error'
  | 'not_found'
  | 'trade_closed'
  | 'cancelled_by_copier'
  | 'cancelled_by_user'
  | 'abandoned'
  | 'trade_exists'
  | 'symbol_not_found'
  | 'out_of_range'
  | 'trade_not_allowed'
  | 'open_volume_less_than_minimum'
  | 'close_volume_less_than_minimum'
  | 'no_valid_filling_mode'
  | 'stop_loss_missing'
  | 'invalid_risk_configuration'
  | 'insufficient_tick_data';

/**
 * Command record from TradeSync API
 */
export interface Command {
  id: number;
  created_at: string;
  updated_at: string;
  account_id: number;
  application: 'mt4' | 'mt5';
  group: CommandGroup;
  event: string;
  command: CommandType;
  status: CommandStatus;
  result?: CommandResult;
  retry_rate?: number;
  copier_id?: number;
  lead_id?: number;
  trade_id?: number;
  command_duration?: number;
  broker_duration?: number;
  total_duration?: number;
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
// Input Types
// ============================================================================

/**
 * Open trade command input
 */
export interface OpenCommandInput {
  /** Target account ID */
  account_id: number;
  /** Command type: open */
  command: 'open';
  /** Trade direction: buy or sell */
  type: TradeType;
  /** Broker symbol */
  symbol: string;
  /** Trade volume in lots */
  lots: number;
  /** Entry price */
  open_price: number;
  /** Acceptable price variance in pips */
  slippage: number;
  /** Stop loss price */
  stop_loss?: number;
  /** Take profit price */
  take_profit?: number;
  /** Magic number */
  magic?: number;
  /** Trade comment */
  comment?: string;
}

/**
 * Modify command input
 */
export interface ModifyCommandInput {
  /** Target account ID */
  account_id: number;
  /** Command type: modify_stop_loss, modify_take_profit, or modify_pending_price */
  command: 'modify_stop_loss' | 'modify_take_profit' | 'modify_pending_price';
  /** Trade identifier type: ticket or magic */
  by: ByType;
  /** Trade identifier value */
  trade_id: number;
  /** New price value */
  modify_price: number;
}

/**
 * Close command input
 */
export interface CloseCommandInput {
  /** Target account ID */
  account_id: number;
  /** Command type: close_full or close_partial */
  command: 'close_full' | 'close_partial';
  /** Trade identifier type: ticket or magic */
  by: ByType;
  /** Trade identifier value */
  trade_id: number;
  /** Percentage to close (required for close_partial) */
  percentage?: number;
}

/**
 * Cancel command input
 */
export interface CancelCommandInput {
  /** Set status to cancelled */
  status: 'cancelled';
}

/**
 * Command list filters
 */
export interface CommandListFilters extends PaginationParams {
  /** Filter by command group */
  group?: CommandGroup;
  /** Single command ID */
  id?: number;
  /** Comma-separated command IDs */
  ids?: string;
  /** Single copier ID */
  copier_id?: number;
  /** Comma-separated copier IDs */
  copier_ids?: string;
  /** Single lead ID */
  lead_id?: number;
  /** Comma-separated lead IDs */
  lead_ids?: string;
  /** Single account ID */
  account_id?: number;
  /** Comma-separated account IDs */
  account_ids?: string;
  /** Commands after timestamp (ISO 8601) */
  created_at_start?: string;
  /** Commands before timestamp (ISO 8601) */
  created_at_end?: string;
}

// ============================================================================
// Zod Schemas
// ============================================================================

export const OpenCommandInputSchema = z.object({
  account_id: z.number().int().positive('Account ID is required'),
  command: z.literal('open'),
  type: z.enum(['buy', 'sell']),
  symbol: z.string().min(1, 'Symbol is required'),
  lots: z.number().positive('Lots must be positive'),
  open_price: z.number().positive('Open price is required'),
  slippage: z.number().min(0, 'Slippage must be non-negative'),
  stop_loss: z.number().positive().optional(),
  take_profit: z.number().positive().optional(),
  magic: z.number().int().optional(),
  comment: z.string().max(255).optional(),
});

export const ModifyCommandInputSchema = z.object({
  account_id: z.number().int().positive('Account ID is required'),
  command: z.enum(['modify_stop_loss', 'modify_take_profit', 'modify_pending_price']),
  by: z.enum(['ticket', 'magic']),
  trade_id: z.number().int().positive('Trade ID is required'),
  modify_price: z.number().positive('Modify price is required'),
});

export const CloseCommandInputSchema = z.object({
  account_id: z.number().int().positive('Account ID is required'),
  command: z.enum(['close_full', 'close_partial']),
  by: z.enum(['ticket', 'magic']),
  trade_id: z.number().int().positive('Trade ID is required'),
  percentage: z.number().int().min(1).max(100).optional(),
});

export const CancelCommandInputSchema = z.object({
  status: z.literal('cancelled'),
});

// ============================================================================
// Commands Service
// ============================================================================

/**
 * Commands API service
 */
export class CommandsService {
  constructor(private readonly client: TradeSyncClient) {}

  /**
   * List all commands
   *
   * @example
   * ```typescript
   * const response = await sdk.commands.list({
   *   account_id: 12345,
   *   group: 'user'
   * });
   * console.log(response.data); // Array of commands
   * ```
   */
  async list(
    filters?: CommandListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<Command>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      group: filters?.group,
      id: filters?.id,
      ids: filters?.ids,
      copier_id: filters?.copier_id,
      copier_ids: filters?.copier_ids,
      lead_id: filters?.lead_id,
      lead_ids: filters?.lead_ids,
      account_id: filters?.account_id,
      account_ids: filters?.account_ids,
      created_at_start: filters?.created_at_start,
      created_at_end: filters?.created_at_end,
    };
    return this.client.get<ApiListResponse<Command>>('/commands', params, options);
  }

  /**
   * Get a single command by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.commands.get(123456);
   * console.log(response.data.status);
   * ```
   */
  async get(commandId: number, options?: RequestOptions): Promise<ApiSingleResponse<Command>> {
    return this.client.get<ApiSingleResponse<Command>>(`/commands/${commandId}`, undefined, options);
  }

  /**
   * Create an open trade command
   *
   * @example
   * ```typescript
   * const response = await sdk.commands.createOpen({
   *   account_id: 12345,
   *   command: 'open',
   *   type: 'buy',
   *   symbol: 'EURUSD',
   *   lots: 0.1,
   *   open_price: 1.0850,
   *   slippage: 10,
   *   stop_loss: 1.0800,
   *   take_profit: 1.0950
   * });
   * ```
   */
  async createOpen(
    input: OpenCommandInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Command>> {
    const validated = OpenCommandInputSchema.parse(input);
    return this.client.post<ApiSingleResponse<Command>>('/commands', validated, options);
  }

  /**
   * Create a modify command (stop loss, take profit, or pending price)
   *
   * @example
   * ```typescript
   * // Modify stop loss
   * const response = await sdk.commands.createModify({
   *   account_id: 12345,
   *   command: 'modify_stop_loss',
   *   by: 'ticket',
   *   trade_id: 67890,
   *   modify_price: 1.0750
   * });
   *
   * // Modify take profit
   * const response = await sdk.commands.createModify({
   *   account_id: 12345,
   *   command: 'modify_take_profit',
   *   by: 'ticket',
   *   trade_id: 67890,
   *   modify_price: 1.1000
   * });
   * ```
   */
  async createModify(
    input: ModifyCommandInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Command>> {
    const validated = ModifyCommandInputSchema.parse(input);
    return this.client.post<ApiSingleResponse<Command>>('/commands', validated, options);
  }

  /**
   * Create a close command (full or partial)
   *
   * @example
   * ```typescript
   * // Close full position
   * const response = await sdk.commands.createClose({
   *   account_id: 12345,
   *   command: 'close_full',
   *   by: 'ticket',
   *   trade_id: 67890
   * });
   *
   * // Close partial (50%)
   * const response = await sdk.commands.createClose({
   *   account_id: 12345,
   *   command: 'close_partial',
   *   by: 'ticket',
   *   trade_id: 67890,
   *   percentage: 50
   * });
   * ```
   */
  async createClose(
    input: CloseCommandInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Command>> {
    const validated = CloseCommandInputSchema.parse(input);
    return this.client.post<ApiSingleResponse<Command>>('/commands', validated, options);
  }

  /**
   * Cancel a working command
   *
   * Note: Only commands with status 'working' can be cancelled.
   *
   * @example
   * ```typescript
   * const response = await sdk.commands.cancel(123456);
   * ```
   */
  async cancel(
    commandId: number,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Command>> {
    const validated = CancelCommandInputSchema.parse({ status: 'cancelled' });
    return this.client.patch<ApiSingleResponse<Command>>(
      `/commands/${commandId}`,
      validated,
      options
    );
  }
}
