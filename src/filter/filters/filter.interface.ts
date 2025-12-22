/**
 * Filter interface
 * Defines contract for all asset filters
 */

import type { Symbol, Candle, Ticker } from '@/core/types';

/**
 * Filter context
 * Data available for filtering decisions
 */
export interface FilterContext {
  /**
   * Symbol information
   */
  symbol: Symbol;

  /**
   * Latest ticker data
   */
  ticker?: Ticker;

  /**
   * Historical candles
   */
  candles?: Candle[];

  /**
   * Custom metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Filter result
 */
export interface FilterResult {
  /**
   * Whether symbol passes the filter
   */
  passed: boolean;

  /**
   * Reason for rejection (if failed)
   */
  reason?: string;

  /**
   * Score (0-1, higher is better)
   */
  score?: number;
}

/**
 * Filter interface
 * Base interface for all filters
 */
export interface IFilter {
  /**
   * Filter name
   */
  readonly name: string;

  /**
   * Filter description
   */
  readonly description: string;

  /**
   * Apply filter to symbol
   * @param context - Filter context
   * @returns Filter result
   */
  apply(context: FilterContext): Promise<FilterResult> | FilterResult;

  /**
   * Get filter configuration
   */
  getConfig(): Record<string, unknown>;
}

/**
 * Combined filter logic
 */
export type FilterLogic = 'AND' | 'OR';
