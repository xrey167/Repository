/**
 * TradeSync Equity Monitors API
 *
 * Provides methods for managing equity monitors.
 * 2 endpoints matching actual TradeSync API:
 * - POST /equity-monitors - create equity monitor
 * - PATCH /equity-monitors/{monitor_id} - cancel equity monitor
 */

import { z } from 'zod';
import type { TradeSyncClient } from '../client.js';
import type { RequestOptions } from '../types.js';

// ============================================================================
// Equity Monitor Types (matching TradeSync API)
// ============================================================================

/**
 * Monitor type values
 */
export type MonitorType =
  | 'target_value'
  | 'target_percentage'
  | 'protect_value'
  | 'protect_percentage';

/**
 * Monitor action values
 */
export type MonitorAction =
  | 'alert'
  | 'alert_disable_copiers'
  | 'alert_disable_copiers_close_trades';

/**
 * Monitor status values
 */
export type MonitorStatus = 'active' | 'triggered' | 'cancelled';

/**
 * Equity monitor record from TradeSync API
 */
export interface EquityMonitor {
  id: number;
  created_at: string;
  updated_at: string;
  account_id: number;
  type: MonitorType;
  value: string;
  action: MonitorAction;
  status: MonitorStatus;
  triggered_at?: string;
  cancelled_at?: string;
}

/**
 * API response wrapper
 */
export interface ApiSingleResponse<T> {
  result: 'success' | 'error';
  status: number;
  data: T;
}

// ============================================================================
// Input Types
// ============================================================================

/**
 * Equity monitor creation input
 */
export interface CreateEquityMonitorInput {
  /** Target account ID */
  account_id: number;
  /** Monitor trigger type */
  type: MonitorType;
  /** Equity threshold value */
  value: number;
  /** Action to take when triggered */
  action: MonitorAction;
}

/**
 * Equity monitor cancel input
 */
export interface CancelEquityMonitorInput {
  /** Set status to cancelled */
  status: 'cancelled';
}

// ============================================================================
// Zod Schemas
// ============================================================================

export const CreateEquityMonitorInputSchema = z.object({
  account_id: z.number().int().positive('Account ID is required'),
  type: z.enum(['target_value', 'target_percentage', 'protect_value', 'protect_percentage']),
  value: z.number().positive('Value must be positive'),
  action: z.enum(['alert', 'alert_disable_copiers', 'alert_disable_copiers_close_trades']),
});

export const CancelEquityMonitorInputSchema = z.object({
  status: z.literal('cancelled'),
});

// ============================================================================
// Equity Monitors Service
// ============================================================================

/**
 * Equity Monitors API service
 */
export class EquityMonitorsService {
  constructor(private readonly client: TradeSyncClient) {}

  /**
   * Create an equity monitor
   *
   * @example
   * ```typescript
   * // Target value monitor - alerts when equity reaches $10,000
   * const response = await sdk.equityMonitors.create({
   *   account_id: 12345,
   *   type: 'target_value',
   *   value: 10000,
   *   action: 'alert'
   * });
   *
   * // Protect percentage - disables copiers when equity drops 10%
   * const response = await sdk.equityMonitors.create({
   *   account_id: 12345,
   *   type: 'protect_percentage',
   *   value: 10,
   *   action: 'alert_disable_copiers'
   * });
   *
   * // Protect value - closes trades when equity falls below $5,000
   * const response = await sdk.equityMonitors.create({
   *   account_id: 12345,
   *   type: 'protect_value',
   *   value: 5000,
   *   action: 'alert_disable_copiers_close_trades'
   * });
   * ```
   */
  async create(
    input: CreateEquityMonitorInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<EquityMonitor>> {
    const validated = CreateEquityMonitorInputSchema.parse(input);
    return this.client.post<ApiSingleResponse<EquityMonitor>>(
      '/equity-monitors',
      validated,
      options
    );
  }

  /**
   * Cancel an equity monitor
   *
   * Note: Only the status can be modified; other attributes are immutable.
   *
   * @example
   * ```typescript
   * const response = await sdk.equityMonitors.cancel(123456);
   * console.log(response.data.status); // 'cancelled'
   * ```
   */
  async cancel(
    monitorId: number,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<EquityMonitor>> {
    const validated = CancelEquityMonitorInputSchema.parse({ status: 'cancelled' });
    return this.client.patch<ApiSingleResponse<EquityMonitor>>(
      `/equity-monitors/${monitorId}`,
      validated,
      options
    );
  }
}
