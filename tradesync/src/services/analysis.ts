/**
 * TradeSync Analysis API
 *
 * Provides methods for retrieving trading analysis and statistics.
 * 6 endpoints matching actual TradeSync API:
 * - GET /analyses - list analyses for all accounts
 * - GET /analyses/{account_id} - get analysis for account
 * - GET /analyses/{account_id}/dailies - get daily analysis
 * - GET /analyses/{account_id}/monthlies - get monthly analysis
 * - GET /analyses/{account_id}/monthly-symbols - get monthly symbol analysis
 * - GET /analyses/{account_id}/hourlies - get hourly analysis
 */

import type { TradeSyncClient } from '../client.js';
import type { PaginationParams, RequestOptions } from '../types.js';

// ============================================================================
// Analysis Types (matching TradeSync API)
// ============================================================================

/**
 * Account analysis record
 */
export interface Analysis {
  id: number;
  account_id: number;
  profit_loss: string;
  growth: string;
  total_deposits: string;
  total_withdrawals: string;
  total_trades: number;
  total_longs: number;
  total_shorts: number;
  total_commission: string;
  total_swap: string;
  total_trades_won: number;
  total_trades_lost: number;
  average_win: string;
  average_loss: string;
  best_trade: string;
  worst_trade: string;
  best_trade_date?: string;
  worst_trade_date?: string;
  longs_won: number;
  shorts_won: number;
}

/**
 * Daily analysis record
 */
export interface DailyAnalysis {
  date: string;
  running_balance: string;
  profit_loss: string;
  running_profit_loss: string;
  running_growth: string;
  lots: string;
}

/**
 * Monthly analysis record
 */
export interface MonthlyAnalysis {
  date: string;
  growth: string;
}

/**
 * Monthly symbol analysis record
 */
export interface MonthlySymbolAnalysis {
  date: string;
  symbol: string;
  count: number;
}

/**
 * Hourly analysis record
 */
export interface HourlyAnalysis {
  hour: number;
  count: number;
  profit_loss: string;
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
 * Analysis list filters
 */
export interface AnalysisListFilters extends PaginationParams {
  /** Single account ID */
  account_id?: number;
  /** Comma-separated account IDs */
  account_ids?: string;
}

/**
 * Time-based analysis filters
 */
export interface TimeAnalysisFilters extends PaginationParams {
  /** Start date (ISO 8601) */
  start_date?: string;
  /** End date (ISO 8601) */
  end_date?: string;
}

// ============================================================================
// Analysis Service
// ============================================================================

/**
 * Analysis API service
 */
export class AnalysisService {
  constructor(private readonly client: TradeSyncClient) {}

  /**
   * List analyses for all accounts
   *
   * @example
   * ```typescript
   * const response = await sdk.analysis.list();
   * console.log(response.data); // Array of analyses
   * ```
   */
  async list(
    filters?: AnalysisListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<Analysis>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      account_id: filters?.account_id,
      account_ids: filters?.account_ids,
    };
    return this.client.get<ApiListResponse<Analysis>>('/analyses', params, options);
  }

  /**
   * Get analysis for a single account
   *
   * @example
   * ```typescript
   * const response = await sdk.analysis.get(12345);
   * console.log(response.data.profit_loss);
   * ```
   */
  async get(accountId: number, options?: RequestOptions): Promise<ApiSingleResponse<Analysis>> {
    return this.client.get<ApiSingleResponse<Analysis>>(
      `/analyses/${accountId}`,
      undefined,
      options
    );
  }

  /**
   * Get daily analysis for an account
   *
   * @example
   * ```typescript
   * const response = await sdk.analysis.getDailies(12345, {
   *   start_date: '2024-01-01',
   *   end_date: '2024-12-31'
   * });
   * console.log(response.data); // Array of daily analyses
   * ```
   */
  async getDailies(
    accountId: number,
    filters?: TimeAnalysisFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<DailyAnalysis>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
    };
    return this.client.get<ApiListResponse<DailyAnalysis>>(
      `/analyses/${accountId}/dailies`,
      params,
      options
    );
  }

  /**
   * Get monthly analysis for an account
   *
   * @example
   * ```typescript
   * const response = await sdk.analysis.getMonthlies(12345);
   * console.log(response.data); // Array of monthly analyses
   * ```
   */
  async getMonthlies(
    accountId: number,
    filters?: TimeAnalysisFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<MonthlyAnalysis>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
    };
    return this.client.get<ApiListResponse<MonthlyAnalysis>>(
      `/analyses/${accountId}/monthlies`,
      params,
      options
    );
  }

  /**
   * Get monthly symbol analysis for an account
   *
   * @example
   * ```typescript
   * const response = await sdk.analysis.getMonthlySymbols(12345);
   * console.log(response.data); // Array of monthly symbol analyses
   * ```
   */
  async getMonthlySymbols(
    accountId: number,
    filters?: TimeAnalysisFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<MonthlySymbolAnalysis>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
    };
    return this.client.get<ApiListResponse<MonthlySymbolAnalysis>>(
      `/analyses/${accountId}/monthly-symbols`,
      params,
      options
    );
  }

  /**
   * Get hourly analysis for an account
   *
   * @example
   * ```typescript
   * const response = await sdk.analysis.getHourlies(12345);
   * console.log(response.data); // Array of hourly analyses
   * ```
   */
  async getHourlies(
    accountId: number,
    filters?: TimeAnalysisFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<HourlyAnalysis>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      start_date: filters?.start_date,
      end_date: filters?.end_date,
    };
    return this.client.get<ApiListResponse<HourlyAnalysis>>(
      `/analyses/${accountId}/hourlies`,
      params,
      options
    );
  }
}
