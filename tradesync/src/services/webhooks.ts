/**
 * TradeSync Webhooks API
 *
 * Provides methods for managing webhooks.
 * 5 endpoints matching actual TradeSync API:
 * - GET /webhooks - list webhooks
 * - GET /webhooks/{webhook_id} - get webhook
 * - POST /webhooks - create webhook
 * - PATCH /webhooks/{webhook_id} - update webhook
 * - DELETE /webhooks/{webhook_id} - delete webhook
 */

import { z } from 'zod';
import type { TradeSyncClient } from '../client.js';
import type { PaginationParams, RequestOptions } from '../types.js';

// ============================================================================
// Webhook Types (matching TradeSync API)
// ============================================================================

/**
 * Authentication types
 */
export type WebhookAuthenticationType = 'none' | 'basic_auth' | 'bearer_token' | 'api_key';

/**
 * Webhook record from TradeSync API
 */
export interface Webhook {
  id: number;
  created_at: string;
  updated_at: string;
  url: string;
  authentication: WebhookAuthenticationType;
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
 * Base webhook input
 */
interface BaseWebhookInput {
  /** Receiving URL */
  url: string;
}

/**
 * Webhook with no authentication
 */
export interface WebhookInputNone extends BaseWebhookInput {
  authentication: 'none';
}

/**
 * Webhook with basic auth
 */
export interface WebhookInputBasicAuth extends BaseWebhookInput {
  authentication: 'basic_auth';
  username: string;
  password: string;
}

/**
 * Webhook with bearer token
 */
export interface WebhookInputBearerToken extends BaseWebhookInput {
  authentication: 'bearer_token';
  token: string;
}

/**
 * Webhook with API key
 */
export interface WebhookInputApiKey extends BaseWebhookInput {
  authentication: 'api_key';
  key: string;
  value: string;
}

/**
 * Webhook creation/update input
 */
export type CreateWebhookInput =
  | WebhookInputNone
  | WebhookInputBasicAuth
  | WebhookInputBearerToken
  | WebhookInputApiKey;

export type UpdateWebhookInput = CreateWebhookInput;

/**
 * Webhook list filters
 */
export interface WebhookListFilters extends PaginationParams {
  /** Single webhook ID */
  id?: number;
  /** Comma-separated webhook IDs */
  ids?: string;
}

// ============================================================================
// Zod Schemas
// ============================================================================

export const WebhookInputNoneSchema = z.object({
  url: z.string().url('Valid URL is required'),
  authentication: z.literal('none'),
});

export const WebhookInputBasicAuthSchema = z.object({
  url: z.string().url('Valid URL is required'),
  authentication: z.literal('basic_auth'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const WebhookInputBearerTokenSchema = z.object({
  url: z.string().url('Valid URL is required'),
  authentication: z.literal('bearer_token'),
  token: z.string().min(1, 'Token is required'),
});

export const WebhookInputApiKeySchema = z.object({
  url: z.string().url('Valid URL is required'),
  authentication: z.literal('api_key'),
  key: z.string().min(1, 'Key header name is required'),
  value: z.string().min(1, 'Key value is required'),
});

export const CreateWebhookInputSchema = z.union([
  WebhookInputNoneSchema,
  WebhookInputBasicAuthSchema,
  WebhookInputBearerTokenSchema,
  WebhookInputApiKeySchema,
]);

/** Alias for CreateWebhookInputSchema (same validation for updates) */
export const UpdateWebhookInputSchema = CreateWebhookInputSchema;

// ============================================================================
// Webhooks Service
// ============================================================================

/**
 * Webhooks API service
 */
export class WebhooksService {
  constructor(private readonly client: TradeSyncClient) {}

  /**
   * List all webhooks
   *
   * @example
   * ```typescript
   * const response = await sdk.webhooks.list();
   * console.log(response.data); // Array of webhooks
   * ```
   */
  async list(
    filters?: WebhookListFilters,
    options?: RequestOptions
  ): Promise<ApiListResponse<Webhook>> {
    const params: Record<string, string | number | undefined> = {
      limit: filters?.limit,
      order: filters?.order,
      last_id: filters?.last_id,
      id: filters?.id,
      ids: filters?.ids,
    };
    return this.client.get<ApiListResponse<Webhook>>('/webhooks', params, options);
  }

  /**
   * Get a single webhook by ID
   *
   * @example
   * ```typescript
   * const response = await sdk.webhooks.get(12345);
   * console.log(response.data.url);
   * ```
   */
  async get(webhookId: number, options?: RequestOptions): Promise<ApiSingleResponse<Webhook>> {
    return this.client.get<ApiSingleResponse<Webhook>>(`/webhooks/${webhookId}`, undefined, options);
  }

  /**
   * Create a new webhook
   *
   * @example
   * ```typescript
   * // No authentication
   * const response = await sdk.webhooks.create({
   *   url: 'https://example.com/webhook',
   *   authentication: 'none'
   * });
   *
   * // Basic auth
   * const response = await sdk.webhooks.create({
   *   url: 'https://example.com/webhook',
   *   authentication: 'basic_auth',
   *   username: 'user',
   *   password: 'pass'
   * });
   *
   * // Bearer token
   * const response = await sdk.webhooks.create({
   *   url: 'https://example.com/webhook',
   *   authentication: 'bearer_token',
   *   token: 'your-token'
   * });
   *
   * // API key
   * const response = await sdk.webhooks.create({
   *   url: 'https://example.com/webhook',
   *   authentication: 'api_key',
   *   key: 'X-API-Key',
   *   value: 'your-key'
   * });
   * ```
   */
  async create(
    input: CreateWebhookInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Webhook>> {
    const validated = CreateWebhookInputSchema.parse(input);
    return this.client.post<ApiSingleResponse<Webhook>>('/webhooks', validated, options);
  }

  /**
   * Update a webhook
   *
   * Note: Both url and authentication must be provided.
   *
   * @example
   * ```typescript
   * const response = await sdk.webhooks.update(12345, {
   *   url: 'https://new-url.com/webhook',
   *   authentication: 'bearer_token',
   *   token: 'new-token'
   * });
   * ```
   */
  async update(
    webhookId: number,
    input: UpdateWebhookInput,
    options?: RequestOptions
  ): Promise<ApiSingleResponse<Webhook>> {
    const validated = CreateWebhookInputSchema.parse(input);
    return this.client.patch<ApiSingleResponse<Webhook>>(
      `/webhooks/${webhookId}`,
      validated,
      options
    );
  }

  /**
   * Delete a webhook
   *
   * @example
   * ```typescript
   * await sdk.webhooks.delete(12345);
   * ```
   */
  async delete(webhookId: number, options?: RequestOptions): Promise<void> {
    await this.client.delete<void>(`/webhooks/${webhookId}`, options);
  }
}
