/**
 * TradeSync Copiers API
 *
 * Provides methods for managing trade copiers.
 * 7 endpoints matching actual TradeSync API:
 * - GET /copiers - list copiers
 * - GET /copiers/{copier_id} - get copier
 * - POST /copiers - create copier
 * - PATCH /copiers/{copier_id} - update copier
 * - DELETE /copiers/{copier_id} - delete copier
 * - GET /copiers/{copier_id}/disabled-symbols - list disabled symbols
 * - POST /copiers/{copier_id}/disabled-symbols - create disabled symbol
 *
 * Plus Copier Maps (3 endpoints):
 * - GET /copiers/{copier_id}/maps - list maps
 * - POST /copiers/{copier_id}/maps - create map
 * - DELETE /copiers/{copier_id}/maps/{map_id} - delete map
 */

import { z } from 'zod';
import type { TradeSyncClient } from '../client.js';
import type { PaginationParams, RequestOptions } from '../types.js';

// ============================================================================
// Copier Types (matching TradeSync API)
// ============================================================================

/**
 * Copier mode values
 */
export type CopierMode = 'on' | 'off' | 'monitor';

/**
 * Risk type values for lot calculation
 */
export type RiskType =
  | 'risk_multiplier_by_balance'
  | 'risk_multiplier_by_equity'
  | 'lot_multiplier'
  | 'fixed_lot'
  | 'percentage_risk_per_trade_by_balance'
  | 'percentage_risk_per_trade_by_equity'
  | 'risk_amount_per_trade';

/**
 * Copy SL/TP mode
 */
export type CopySlTpMode = 'yes' | 'no' | 'fixed';

/**
 * Yes/No string type
 */
export type YesNo = 'yes' | 'no';

/**
 * Copier record from TradeSync API
 */
export interface Copier {
  id: number;
  created_at: string;
  updated_at: string;
  lead_id: number;
  follower_id: number;
  mode: CopierMode;
  reverse: YesNo;
  use_alt_tick_value: YesNo;
  risk_type: RiskType;
  risk_value: string;
  force_min: YesNo;
  copy_pending: YesNo;
  copy_sl: CopySlTpMode;
  copy_tp: CopySlTpMode;
  max_lot: string;
  slippage: string;
  fixed_sl?: string;
  fixed_tp?: string;
  comment?: string;
}

/**
 * Disabled symbol record
 */
export interface DisabledSymbol {
  id: number;
  created_at: string;
  updated_at: string;
  copier_id: number;
  lead_symbol_id: number;
  lead_symbol?: string;
}

/**
 * Copier map record
 * Note: copier_id is not returned by API (it's in the request path)
 */
export interface CopierMap {
  id: number;
  created_at: string;
  updated_at: string;
  lead_symbol_id: number;
  follower_symbol_id: number;
  lead_symbol?: string;
  follower_symbol?: string;
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
 * Copier creation input
 */
export interface CreateCopierInput {
  /** Lead (source) account ID */
  lead_id: number;
  /** Follower (destination) account ID */
  follower_id: number;
  /** Risk calculation type */
  risk_type: RiskType;
  /** Risk multiplier/value */
  risk_value: number;
  /** Copy existing open trades (default: no) */
  copy_existing?: YesNo;
  /** Copier mode (default: off) */
  mode?: CopierMode;
  /** Reverse trade direction (default: no) */
  reverse?: YesNo;
  /** Use alternative tick value (default: no) */
  use_alt_tick_value?: YesNo;
  /** Round up undersized lots (default: no) */
  force_min?: YesNo;
  /** Maximum lot size (default: 50) */
  max_lot?: number;
  /** Acceptable price variance in pips (default: 100) */
  slippage?: number;
  /** Copy pending orders (default: no) */
  copy_pending?: YesNo;
  /** Copy stop loss (default: no) */
  copy_sl?: CopySlTpMode;
  /** Fixed stop loss value */
  fixed_sl?: number;
  /** Copy take profit (default: no) */
  copy_tp?: CopySlTpMode;
  /** Fixed take profit value */
  fixed_tp?: number;
  /** MT comment suffix */
  comment?: string;
}

/**
 * Copier update input
 */
export interface UpdateCopierInput {
  /** Copier mode */
  mode?: CopierMode;
  /** Reverse trade direction */
  reverse?: YesNo;
  /** Use alternative tick value */
  use_alt_tick_value?: YesNo;
  /** Risk calculation type */
  risk_type?: RiskType;
  /** Risk multiplier/value */
  risk_value?: number;
  /** Round up undersized lots */
  force_min?: YesNo;
  /** Maximum lot size */
  max_lot?: number;
  /** Acceptable price variance in pips */
  slippage?: number;
  /** Copy pending orders */
  copy_pending?: YesNo;
  /** Copy stop loss */
  copy_sl?: CopySlTpMode;
  /** Fixed stop loss value */
  fixed_sl?: number;
  /** Copy take profit */
  copy_tp?: CopySlTpMode;
  /** Fixed take profit value */
  fixed_tp?: number;
  /** MT comment suffix */
  comment?: string;
}

/**
 * Create disabled symbol input
 */
export interface CreateDisabledSymbolInput {
  /** Lead account symbol ID */
  lead_symbol_id: number;
}

/**
 * Create copier map input
 */
export interface CreateCopierMapInput {
  /** Lead symbol ID */
  lead_symbol_id: number;
  /** Follower symbol ID */
  follower_symbol_id: number;
}

/**
 * Copier list filters
 */
export interface CopierListFilters extends PaginationParams {
  /** Single copier ID */
  id?: number;
  /** Comma-separated copier IDs */
  ids?: string;
  /** Single lead account ID */
  lead_id?: number;
  /** Comma-separated lead account IDs */
  lead_ids?: string;
  /** Single follower account ID */
  follower_id?: number;
  /** Comma-separated follower account IDs */
  follower_ids?: string;
}

// ============================================================================
// Zod Schemas
// ============================================================================

export const CreateCopierInputSchema = z.object({
  lead_id: z.number().int().positive('Lead ID is required'),
  follower_id: z.number().int().positive('Follower ID is required'),
  risk_type: z.enum([
    'risk_multiplier_by_balance',
    'risk_multiplier_by_equity',
    'lot_multiplier',
    'fixed_lot',
    'percentage_risk_per_trade_by_balance',
    'percentage_risk_per_trade_by_equity',
    'risk_amount_per_trade',
  ]),
  risk_value: z.number().positive('Risk value is required'),
  copy_existing: z.enum(['yes', 'no']).optional(),
  mode: z.enum(['on', 'off', 'monitor']).optional(),
  reverse: z.enum(['yes', 'no']).optional(),
  use_alt_tick_value: z.enum(['yes', 'no']).optional(),
  force_min: z.enum(['yes', 'no']).optional(),
  max_lot: z.number().positive().optional(),
  slippage: z.number().min(0).optional(),
  copy_pending: z.enum(['yes', 'no']).optional(),
  copy_sl: z.enum(['yes', 'no', 'fixed']).optional(),
  fixed_sl: z.number().positive().optional(),
  copy_tp: z.enum(['yes', 'no', 'fixed']).optional(),
  fixed_tp: z.number().positive().optional(),
  comment: z.string().optional(),
});

export const UpdateCopierInputSchema = z.object({
  mode: z.enum(['on', 'off', 'monitor']).optional(),
  reverse: z.enum(['yes', 'no']).optional(),
  use_alt_tick_value: z.enum(['yes', 'no']).optional(),
  risk_type: z.enum([
    'risk_multiplier_by_balance',
    'risk_multiplier_by_equity',
    'lot_multiplier',
    'fixed_lot',
    'percentage_risk_per_trade_by_balance',
    'percentage_risk_per_trade_by_equity',
    'risk_amount_per_trade',
  ]).optional(),
  risk_value: z.number().positive().optional(),
  force_min: z.enum(['yes', 'no']).optional(),
  max_lot: z.number().positive().optional(),
  slippage: z.number().min(0).optional(),
  copy_pending: z.enum(['yes', 'no']).optional(),
  copy_sl: z.enum(['yes', 'no', 'fixed']).optional(),
  fixed_sl: z.number().positive().optional(),
  copy_tp: z.enum(['yes', 'no', 'fixed']).optional(),
  fixed_tp: z.number().positive().optional(),
  comment: z.string().optional(),
});

export const CreateDisabledSymbolInputSchema = z.object({
  lead_symbol_id: z.number().int().positive('Lead symbol ID is required'),
});

export const CreateCopierMapInputSchema = z.object({
  lead_symbol_id: z.number().int().positive('Lead symbol ID is required'),
  follower_symbol_id: z.number().int().positive('Follower symbol ID is required'),
});

// ============================================================================
// Copiers Service
// ============================================================================

/**
 * Copiers API service
 */
export class CopiersService {
  constructor(private readonly client: TradeSyncClient) {}

  /**
   * List all copiers
   *
   * @example
   * ```typescript
   * const response = await sdk.copiers.list();
   * console.log(response.data); // Array of copiers
   * ```
   */
  async list(
    filters?: CopierListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<Copier>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
      lead_id: filters?.lead_id,
      lead_ids: filters?.lead_ids,
      follower_id: filters?.follower_id,
      follower_ids: filters?.follower_ids,
    };
    return this.client.get<ApiListResponse<Copier>>('/copiers', params, options);
  }

  /**
   * Get a single copier by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.copiers.get(12345);
   * console.log(response.data.mode);
   * ```
   */
  async get(copierId: number, options?: RequestOptions): Promise<ApiSingleResponse<Copier>> {
    return this.client.get<ApiSingleResponse<Copier>>(`/copiers/${copierId}`, undefined, options);
  }

  /**
   * Create a new copier
   *
   * @example
   * ```typescript
   * const response = await sdk.copiers.create({
   *   lead_id: 12345,
   *   follower_id: 67890,
   *   risk_type: 'lot_multiplier',
   *   risk_value: 1.0,
   *   mode: 'on',
   *   copy_sl: 'yes',
   *   copy_tp: 'yes'
   * });
   * ```
   */
  async create(
    input: CreateCopierInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Copier>> {
    const validated = CreateCopierInputSchema.parse(input);
    return this.client.post<ApiSingleResponse<Copier>>('/copiers', validated, options);
  }

  /**
   * Update a copier
   *
   * @example
   * ```typescript
   * const response = await sdk.copiers.update(12345, {
   *   mode: 'off',
   *   max_lot: 5.0
   * });
   * ```
   */
  async update(
    copierId: number,
    input: UpdateCopierInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Copier>> {
    const validated = UpdateCopierInputSchema.parse(input);
    return this.client.patch<ApiSingleResponse<Copier>>(`/copiers/${copierId}`, validated, options);
  }

  /**
   * Delete a copier
   *
   * @example
   * ```typescript
   * await sdk.copiers.delete(12345);
   * ```
   */
  async delete(copierId: number, options?: RequestOptions): Promise<void> {
    await this.client.delete<void>(`/copiers/${copierId}`, options);
  }

  // ==========================================================================
  // Disabled Symbols
  // ==========================================================================

  /**
   * List disabled symbols for a copier
   *
   * @example
   * ```typescript
   * const response = await sdk.copiers.listDisabledSymbols(12345);
   * console.log(response.data); // Array of disabled symbols
   * ```
   */
  async listDisabledSymbols(
    copierId: number,
    filters?: PaginationParams,
    options?: RequestOptions
  ): Promise<ApiListResponse<DisabledSymbol>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
    };
    return this.client.get<ApiListResponse<DisabledSymbol>>(
      `/copiers/${copierId}/disabled-symbols`,
      params,
      options
    );
  }

  /**
   * Create a disabled symbol for a copier
   *
   * @example
   * ```typescript
   * const response = await sdk.copiers.createDisabledSymbol(12345, {
   *   lead_symbol_id: 67890
   * });
   * ```
   */
  async createDisabledSymbol(
    copierId: number,
    input: CreateDisabledSymbolInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<DisabledSymbol>> {
    const validated = CreateDisabledSymbolInputSchema.parse(input);
    return this.client.post<ApiSingleResponse<DisabledSymbol>>(
      `/copiers/${copierId}/disabled-symbols`,
      validated,
      options
    );
  }

  // ==========================================================================
  // Copier Maps
  // ==========================================================================

  /**
   * List symbol mappings for a copier
   *
   * @example
   * ```typescript
   * const response = await sdk.copiers.listMaps(12345);
   * console.log(response.data); // Array of symbol mappings
   * ```
   */
  async listMaps(
    copierId: number,
    filters?: PaginationParams,
    options?: RequestOptions
  ): Promise<ApiListResponse<CopierMap>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
    };
    return this.client.get<ApiListResponse<CopierMap>>(
      `/copiers/${copierId}/maps`,
      params,
      options
    );
  }

  /**
   * Create a symbol mapping for a copier
   *
   * @example
   * ```typescript
   * const response = await sdk.copiers.createMap(12345, {
   *   lead_symbol_id: 111,
   *   follower_symbol_id: 222
   * });
   * ```
   */
  async createMap(
    copierId: number,
    input: CreateCopierMapInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<CopierMap>> {
    const validated = CreateCopierMapInputSchema.parse(input);
    return this.client.post<ApiSingleResponse<CopierMap>>(
      `/copiers/${copierId}/maps`,
      validated,
      options
    );
  }

  /**
   * Delete a symbol mapping
   *
   * @example
   * ```typescript
   * await sdk.copiers.deleteMap(12345, 67890);
   * ```
   */
  async deleteMap(
    copierId: number,
    mapId: number,
    options?: RequestOptions
  ): Promise<void> {
    await this.client.delete<void>(`/copiers/${copierId}/maps/${mapId}`, options);
  }
}
