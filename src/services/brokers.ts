/**
 * TradeSync Brokers API
 *
 * Provides methods for retrieving broker information.
 * 4 endpoints matching actual TradeSync API:
 * - GET /brokers - list brokers
 * - GET /brokers/{broker_id} - get broker
 * - GET /broker-servers - list broker servers
 * - GET /broker-servers/{broker_server_id} - get broker server
 */

import type { TradeSyncClient } from '../client.js';
import type { PaginationParams, RequestOptions } from '../types.js';

// ============================================================================
// Broker Types (matching TradeSync API)
// ============================================================================

/**
 * Application platform type
 */
export type ApplicationType = 'mt4' | 'mt5';

/**
 * Broker record from TradeSync API
 */
export interface Broker {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  application: ApplicationType;
}

/**
 * Broker server record from TradeSync API
 */
export interface BrokerServer {
  id: number;
  created_at: string;
  updated_at: string;
  broker_id: number;
  application: ApplicationType;
  name: string;
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
 * Broker list filters
 */
export interface BrokerListFilters extends PaginationParams {
  /** Single broker ID */
  id?: number;
  /** Comma-separated broker IDs */
  ids?: string;
  /** Filter by platform: mt4 or mt5 */
  application?: ApplicationType;
}

/**
 * Broker server list filters
 */
export interface BrokerServerListFilters extends PaginationParams {
  /** Single server ID */
  id?: number;
  /** Comma-separated server IDs */
  ids?: string;
  /** Filter by broker ID */
  broker_id?: number;
  /** Comma-separated broker IDs */
  broker_ids?: string;
  /** Filter by platform: mt4 or mt5 */
  application?: ApplicationType;
}

// ============================================================================
// Brokers Service
// ============================================================================

/**
 * Brokers API service
 */
export class BrokersService {
  constructor(private readonly client: TradeSyncClient) {}

  /**
   * List all brokers
   *
   * @example
   * ```typescript
   * // List all brokers
   * const response = await sdk.brokers.list();
   *
   * // List MT5 brokers only
   * const response = await sdk.brokers.list({ application: 'mt5' });
   * ```
   */
  async list(
    filters?: BrokerListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<Broker>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
      application: filters?.application,
    };
    return this.client.get<ApiListResponse<Broker>>('/brokers', params, options);
  }

  /**
   * Get a single broker by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.brokers.get(12345);
   * console.log(response.data.name);
   * ```
   */
  async get(brokerId: number, options?: RequestOptions): Promise<ApiSingleResponse<Broker>> {
    return this.client.get<ApiSingleResponse<Broker>>(`/brokers/${brokerId}`, undefined, options);
  }

  /**
   * List all broker servers
   *
   * @example
   * ```typescript
   * // List all servers
   * const response = await sdk.brokers.listServers();
   *
   * // List servers for specific broker
   * const response = await sdk.brokers.listServers({ broker_id: 12345 });
   *
   * // List MT4 servers only
   * const response = await sdk.brokers.listServers({ application: 'mt4' });
   * ```
   */
  async listServers(
    filters?: BrokerServerListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<BrokerServer>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
      broker_id: filters?.broker_id,
      broker_ids: filters?.broker_ids,
      application: filters?.application,
    };
    return this.client.get<ApiListResponse<BrokerServer>>('/broker-servers', params, options);
  }

  /**
   * Get a single broker server by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.brokers.getServer(12345);
   * console.log(response.data.name);
   * ```
   */
  async getServer(
    serverId: number,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<BrokerServer>> {
    return this.client.get<ApiSingleResponse<BrokerServer>>(
      `/broker-servers/${serverId}`,
      undefined,
      options
    );
  }
}
