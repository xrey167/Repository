/**
 * Screening criteria interface
 * Defines contract for market screening conditions
 */

import type { Symbol, Candle, Ticker } from '@/core/types';

/**
 * Screening context
 * Data available for screening decisions
 */
export interface ScreeningContext {
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
 * Screening result
 */
export interface ScreeningResult {
  /**
   * Symbol that matches criteria
   */
  symbol: string;

  /**
   * Match score (0-1, higher is better)
   */
  score: number;

  /**
   * Reason for match
   */
  reason: string;

  /**
   * Additional metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Screening criteria interface
 */
export interface ICriteria {
  /**
   * Criteria name
   */
  readonly name: string;

  /**
   * Criteria description
   */
  readonly description: string;

  /**
   * Check if symbol matches criteria
   * @param context - Screening context
   * @returns Screening result or null if no match
   */
  check(context: ScreeningContext): Promise<ScreeningResult | null> | ScreeningResult | null;

  /**
   * Get criteria configuration
   */
  getConfig(): Record<string, unknown>;
}
