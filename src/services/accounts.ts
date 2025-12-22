/**
 * TradeSync Accounts API
 *
 * Provides methods for managing trading accounts.
 * 10 endpoints matching actual TradeSync API:
 * - GET /accounts - list accounts
 * - GET /accounts/{id} - get account
 * - POST /accounts - create account
 * - PATCH /accounts/{id} - update account
 * - PATCH /accounts/{id}/connection - update connection
 * - DELETE /accounts/{id} - delete account
 * - GET /accounts/{id}/symbols - list symbols
 * - GET /accounts/{id}/symbols/{id} - get symbol
 * - PATCH /accounts/{id}/symbols/{id} - update symbol
 * - PATCH /accounts/{id}/symbols/bulk - bulk update symbols
 */

import { z } from 'zod';
import type { TradeSyncClient } from '../client.js';
import type { PaginationParams, RequestOptions } from '../types.js';

// ============================================================================
// Account Types (matching TradeSync API)
// ============================================================================

/**
 * Account status values
 */
export type AccountStatusType =
  | 'allocating'
  | 'installing'
  | 'attempt_connection'
  | 'attempt_success'
  | 'attempt_failed'
  | 'connection_ok'
  | 'connection_slow'
  | 'connection_lost';

/**
 * Login response values
 */
export type LoginResponseType =
  | 'null'
  | 'long_success'
  | 'invalid_account'
  | 'no_connection'
  | 'investor_mode'
  | 'no_info';

/**
 * Account type (permission level)
 */
export type AccountTypeValue = 'readonly' | 'full';

/**
 * Application platform type
 */
export type ApplicationType = 'mt4' | 'mt5';

/**
 * Trading account from TradeSync API
 */
export interface Account {
  id: number;
  created_at: string;
  updated_at: string;
  restored_at?: string;
  type: AccountTypeValue;
  application: ApplicationType;
  account_name: string;
  account_number: number;
  password?: string;
  broker_server_id: number;
  status: AccountStatusType;
  login_response?: LoginResponseType;
  modify_disabled?: string;
  last_ping?: string;
  broker?: string;
  client_name?: string;
  server?: string;
  trade_mode?: 'demo' | 'live';
  leverage?: number;
  is_demo?: string;
  suffix?: string;
  currency?: string;
  balance?: string;
  credit?: string;
  equity?: string;
  free_margin?: string;
  used_margin?: string;
  open_trades?: number;
  pending_orders?: number;
  open_trades_lots?: string;
  pending_orders_lots?: string;
  daily_profit?: string;
  weekly_profit?: string;
  monthly_profit?: string;
  total_profit?: string;
}

/**
 * Account symbol
 */
export interface AccountSymbol {
  id: number;
  created_at: string;
  updated_at: string;
  symbol: string;
  active: 'yes' | 'no';
  profit_calc_mode: 'forex' | 'cfd' | 'futures';
  base_currency: string;
  profit_currency: string;
  contract_size: number;
  tick_value: number;
  tick_size: number;
  min_lot: number;
  max_lot: number;
  lot_step: number;
  stop_level: number;
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
 * Account creation input
 */
export interface CreateAccountInput {
  /** Descriptive account name */
  account_name: string;
  /** MetaTrader account number */
  account_number: number;
  /** MetaTrader account password */
  password: string;
  /** Platform type: mt4 or mt5 */
  application: ApplicationType;
  /** Valid broker server ID from /broker-servers */
  broker_server_id: number;
  /** Account type: readonly or full (default: full) */
  type?: AccountTypeValue;
}

/**
 * Account update input
 */
export interface UpdateAccountInput {
  /** Account name */
  account_name?: string;
  /** Suffix for FX trades */
  suffix?: string;
}

/**
 * Account connection update input
 */
export interface UpdateConnectionInput {
  /** MT account password */
  password: string;
  /** Valid broker server ID */
  broker_server_id: number;
}

/**
 * Symbol update input
 */
export interface UpdateSymbolInput {
  /** Active status: yes or no */
  active: 'yes' | 'no';
}

/**
 * Bulk symbol update input
 */
export interface BulkSymbolUpdateInput {
  symbols: Array<{
    id: string | number;
    active: 'yes' | 'no';
  }>;
}

/**
 * Account list filters
 */
export interface AccountListFilters extends PaginationParams {
  /** Single account ID */
  id?: number;
  /** Comma-separated account IDs */
  ids?: string;
}

// ============================================================================
// Zod Schemas
// ============================================================================

export const CreateAccountInputSchema = z.object({
  account_name: z.string().min(1, 'Account name is required'),
  account_number: z.number().int().positive('Account number must be positive'),
  password: z.string().min(1, 'Password is required'),
  application: z.enum(['mt4', 'mt5']),
  broker_server_id: z.number().int().positive('Broker server ID is required'),
  type: z.enum(['readonly', 'full']).optional(),
});

export const UpdateAccountInputSchema = z.object({
  account_name: z.string().min(1).optional(),
  suffix: z.string().optional(),
});

export const UpdateConnectionInputSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  broker_server_id: z.number().int().positive('Broker server ID is required'),
});

export const UpdateSymbolInputSchema = z.object({
  active: z.enum(['yes', 'no']),
});

export const BulkSymbolUpdateInputSchema = z.object({
  symbols: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      active: z.enum(['yes', 'no']),
    })
  ),
});

// ============================================================================
// Accounts Service
// ============================================================================

/**
 * Accounts API service
 */
export class AccountsService {
  constructor(private readonly client: TradeSyncClient) {}

  /**
   * List all accounts
   *
   * @example
   * ```typescript
   * const response = await sdk.accounts.list();
   * console.log(response.data); // Array of accounts
   * ```
   */
  async list(
    filters?: AccountListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<Account>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
    };
    return this.client.get<ApiListResponse<Account>>('/accounts', params, options);
  }

  /**
   * Get a single account by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.accounts.get(12345);
   * console.log(response.data.balance);
   * ```
   */
  async get(accountId: number, options?: RequestOptions): Promise<ApiSingleResponse<Account>> {
    return this.client.get<ApiSingleResponse<Account>>(`/accounts/${accountId}`, undefined, options);
  }

  /**
   * Create a new account
   *
   * @example
   * ```typescript
   * const response = await sdk.accounts.create({
   *   account_name: 'My Trading Account',
   *   account_number: 12345678,
   *   password: 'mypassword',
   *   application: 'mt5',
   *   broker_server_id: 4971,
   *   type: 'full'
   * });
   * ```
   */
  async create(
    input: CreateAccountInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Account>> {
    const validated = CreateAccountInputSchema.parse(input);
    return this.client.post<ApiSingleResponse<Account>>('/accounts', validated, options);
  }

  /**
   * Update an account's name and suffix
   *
   * @example
   * ```typescript
   * const response = await sdk.accounts.update(12345, {
   *   account_name: 'New Name',
   *   suffix: '.pro'
   * });
   * ```
   */
  async update(
    accountId: number,
    input: UpdateAccountInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Account>> {
    const validated = UpdateAccountInputSchema.parse(input);
    return this.client.patch<ApiSingleResponse<Account>>(`/accounts/${accountId}`, validated, options);
  }

  /**
   * Update account connection settings (password and broker server)
   *
   * @example
   * ```typescript
   * const response = await sdk.accounts.updateConnection(12345, {
   *   password: 'newpassword',
   *   broker_server_id: 4972
   * });
   * ```
   */
  async updateConnection(
    accountId: number,
    input: UpdateConnectionInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Account>> {
    const validated = UpdateConnectionInputSchema.parse(input);
    return this.client.patch<ApiSingleResponse<Account>>(
      `/accounts/${accountId}/connection`,
      validated,
      options
    );
  }

  /**
   * Delete an account
   *
   * @example
   * ```typescript
   * await sdk.accounts.delete(12345);
   * ```
   */
  async delete(accountId: number, options?: RequestOptions): Promise<void> {
    await this.client.delete<void>(`/accounts/${accountId}`, options);
  }

  /**
   * List all symbols for an account
   *
   * @example
   * ```typescript
   * const response = await sdk.accounts.listSymbols(12345);
   * console.log(response.data); // Array of symbols
   * ```
   */
  async listSymbols(
    accountId: number,
    filters?: PaginationParams,
    options?: RequestOptions
  ): Promise<ApiListResponse<AccountSymbol>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
    };
    return this.client.get<ApiListResponse<AccountSymbol>>(
      `/accounts/${accountId}/symbols`,
      params,
      options
    );
  }

  /**
   * Get a single symbol for an account
   *
   * @example
   * ```typescript
   * const response = await sdk.accounts.getSymbol(12345, 67890);
   * console.log(response.data.symbol); // e.g., 'EURUSD'
   * ```
   */
  async getSymbol(
    accountId: number,
    symbolId: number,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<AccountSymbol>> {
    return this.client.get<ApiSingleResponse<AccountSymbol>>(
      `/accounts/${accountId}/symbols/${symbolId}`,
      undefined,
      options
    );
  }

  /**
   * Update a symbol's active status
   *
   * @example
   * ```typescript
   * const response = await sdk.accounts.updateSymbol(12345, 67890, {
   *   active: 'no'
   * });
   * ```
   */
  async updateSymbol(
    accountId: number,
    symbolId: number,
    input: UpdateSymbolInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<AccountSymbol>> {
    const validated = UpdateSymbolInputSchema.parse(input);
    return this.client.patch<ApiSingleResponse<AccountSymbol>>(
      `/accounts/${accountId}/symbols/${symbolId}`,
      validated,
      options
    );
  }

  /**
   * Bulk update symbols' active status
   *
   * @example
   * ```typescript
   * const response = await sdk.accounts.updateSymbolsBulk(12345, {
   *   symbols: [
   *     { id: 67890, active: 'no' },
   *     { id: 67891, active: 'yes' }
   *   ]
   * });
   * ```
   */
  async updateSymbolsBulk(
    accountId: number,
    input: BulkSymbolUpdateInput,
    options?: RequestOptions
  ): Promise<ApiListResponse<AccountSymbol>> {
    const validated = BulkSymbolUpdateInputSchema.parse(input);
    return this.client.patch<ApiListResponse<AccountSymbol>>(
      `/accounts/${accountId}/symbols/bulk`,
      validated,
      options
    );
  }
}
