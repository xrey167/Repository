/**
 * Webhooks Management API Tests
 *
 * Tests for WebhooksService (5 endpoints)
 * Matches actual TradeSync API structure
 */

import { describe, it, expect, beforeEach, mock } from 'bun:test';
import {
  WebhooksService,
  CreateWebhookInputSchema,
  UpdateWebhookInputSchema,
  WebhookInputNoneSchema,
  WebhookInputBasicAuthSchema,
  WebhookInputBearerTokenSchema,
  WebhookInputApiKeySchema,
} from '../services/webhooks.js';
import type { TradeSyncClient } from '../client.js';
import type { Webhook, ApiListResponse, ApiSingleResponse } from '../services/webhooks.js';

// Mock client factory
function createMockClient(overrides: Partial<TradeSyncClient> = {}): TradeSyncClient {
  return {
    get: mock(() => Promise.resolve({})),
    post: mock(() => Promise.resolve({})),
    put: mock(() => Promise.resolve({})),
    patch: mock(() => Promise.resolve({})),
    delete: mock(() => Promise.resolve(undefined)),
    ...overrides,
  } as unknown as TradeSyncClient;
}

// Mock data factory - matches actual TradeSync API response
function createMockWebhook(overrides: Partial<Webhook> = {}): Webhook {
  return {
    id: 12345,
    url: 'https://myapp.com/webhooks/tradesync',
    authentication: 'none',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    ...overrides,
  };
}

function createMockListResponse(webhooks: Webhook[]): ApiListResponse<Webhook> {
  return {
    result: 'success',
    status: 200,
    meta: {
      count: webhooks.length,
      limit: 50,
      order: 'desc',
      last_id: webhooks.length > 0 ? webhooks[webhooks.length - 1].id : 0,
    },
    data: webhooks,
  };
}

function createMockSingleResponse(webhook: Webhook): ApiSingleResponse<Webhook> {
  return {
    result: 'success',
    status: 200,
    data: webhook,
  };
}

describe('WebhooksService', () => {
  let service: WebhooksService;
  let mockClient: TradeSyncClient;

  beforeEach(() => {
    mockClient = createMockClient();
    service = new WebhooksService(mockClient);
  });

  // ============================================================================
  // list()
  // ============================================================================

  describe('list()', () => {
    it('should list all webhooks without filters', async () => {
      const webhooks = [createMockWebhook(), createMockWebhook({ id: 67890 })];
      mockClient.get = mock(() => Promise.resolve(createMockListResponse(webhooks)));

      const result = await service.list();

      expect(result.data).toHaveLength(2);
      expect(mockClient.get).toHaveBeenCalled();
    });

    it('should list webhooks with ID filter', async () => {
      const webhooks = [createMockWebhook()];
      mockClient.get = mock(() => Promise.resolve(createMockListResponse(webhooks)));

      const result = await service.list({ id: 12345 });

      expect(result.data).toHaveLength(1);
      expect(mockClient.get).toHaveBeenCalled();
    });

    it('should list webhooks with multiple IDs', async () => {
      const webhooks = [createMockWebhook(), createMockWebhook({ id: 67890 })];
      mockClient.get = mock(() => Promise.resolve(createMockListResponse(webhooks)));

      const result = await service.list({ ids: '12345,67890' });

      expect(result.data).toHaveLength(2);
    });

    it('should list webhooks with pagination', async () => {
      mockClient.get = mock(() => Promise.resolve(createMockListResponse([])));

      await service.list({ limit: 10, last_id: 100 });

      expect(mockClient.get).toHaveBeenCalled();
    });

    it('should list webhooks with order', async () => {
      mockClient.get = mock(() => Promise.resolve(createMockListResponse([])));

      await service.list({ order: 'asc' });

      expect(mockClient.get).toHaveBeenCalled();
    });

    it('should pass request options', async () => {
      mockClient.get = mock(() => Promise.resolve(createMockListResponse([])));

      await service.list({}, { signal: new AbortController().signal });

      expect(mockClient.get).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // get()
  // ============================================================================

  describe('get()', () => {
    it('should get a webhook by ID', async () => {
      const webhook = createMockWebhook();
      mockClient.get = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      const result = await service.get(12345);

      expect(result.data.id).toBe(12345);
      expect(result.data.url).toBe('https://myapp.com/webhooks/tradesync');
      expect(result.data.authentication).toBe('none');
    });

    it('should get a webhook with basic_auth', async () => {
      const webhook = createMockWebhook({ authentication: 'basic_auth' });
      mockClient.get = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      const result = await service.get(12345);

      expect(result.data.authentication).toBe('basic_auth');
    });

    it('should get a webhook with bearer_token', async () => {
      const webhook = createMockWebhook({ authentication: 'bearer_token' });
      mockClient.get = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      const result = await service.get(12345);

      expect(result.data.authentication).toBe('bearer_token');
    });

    it('should get a webhook with api_key', async () => {
      const webhook = createMockWebhook({ authentication: 'api_key' });
      mockClient.get = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      const result = await service.get(12345);

      expect(result.data.authentication).toBe('api_key');
    });

    it('should pass request options', async () => {
      mockClient.get = mock(() => Promise.resolve(createMockSingleResponse(createMockWebhook())));

      await service.get(12345, { signal: new AbortController().signal });

      expect(mockClient.get).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // create()
  // ============================================================================

  describe('create()', () => {
    it('should create a webhook with no authentication', async () => {
      const webhook = createMockWebhook();
      mockClient.post = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      const result = await service.create({
        url: 'https://myapp.com/webhooks/tradesync',
        authentication: 'none',
      });

      expect(result.data.id).toBe(12345);
      expect(mockClient.post).toHaveBeenCalledWith(
        '/webhooks',
        {
          url: 'https://myapp.com/webhooks/tradesync',
          authentication: 'none',
        },
        undefined
      );
    });

    it('should create a webhook with basic auth', async () => {
      const webhook = createMockWebhook({ authentication: 'basic_auth' });
      mockClient.post = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      await service.create({
        url: 'https://example.com/webhook',
        authentication: 'basic_auth',
        username: 'user',
        password: 'pass',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/webhooks',
        {
          url: 'https://example.com/webhook',
          authentication: 'basic_auth',
          username: 'user',
          password: 'pass',
        },
        undefined
      );
    });

    it('should create a webhook with bearer token', async () => {
      const webhook = createMockWebhook({ authentication: 'bearer_token' });
      mockClient.post = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      await service.create({
        url: 'https://example.com/webhook',
        authentication: 'bearer_token',
        token: 'my-bearer-token',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/webhooks',
        {
          url: 'https://example.com/webhook',
          authentication: 'bearer_token',
          token: 'my-bearer-token',
        },
        undefined
      );
    });

    it('should create a webhook with API key', async () => {
      const webhook = createMockWebhook({ authentication: 'api_key' });
      mockClient.post = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      await service.create({
        url: 'https://example.com/webhook',
        authentication: 'api_key',
        key: 'X-API-Key',
        value: 'my-api-key',
      });

      expect(mockClient.post).toHaveBeenCalledWith(
        '/webhooks',
        {
          url: 'https://example.com/webhook',
          authentication: 'api_key',
          key: 'X-API-Key',
          value: 'my-api-key',
        },
        undefined
      );
    });

    it('should pass request options', async () => {
      mockClient.post = mock(() => Promise.resolve(createMockSingleResponse(createMockWebhook())));

      await service.create(
        { url: 'https://example.com/webhook', authentication: 'none' },
        { signal: new AbortController().signal }
      );

      expect(mockClient.post).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // update()
  // ============================================================================

  describe('update()', () => {
    it('should update webhook URL and authentication', async () => {
      const webhook = createMockWebhook({ url: 'https://new-url.com/webhook' });
      mockClient.patch = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      const result = await service.update(12345, {
        url: 'https://new-url.com/webhook',
        authentication: 'none',
      });

      expect(result.data.url).toBe('https://new-url.com/webhook');
      expect(mockClient.patch).toHaveBeenCalledWith(
        '/webhooks/12345',
        {
          url: 'https://new-url.com/webhook',
          authentication: 'none',
        },
        undefined
      );
    });

    it('should update to basic auth', async () => {
      const webhook = createMockWebhook({ authentication: 'basic_auth' });
      mockClient.patch = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      await service.update(12345, {
        url: 'https://example.com/webhook',
        authentication: 'basic_auth',
        username: 'newuser',
        password: 'newpass',
      });

      expect(mockClient.patch).toHaveBeenCalledWith(
        '/webhooks/12345',
        {
          url: 'https://example.com/webhook',
          authentication: 'basic_auth',
          username: 'newuser',
          password: 'newpass',
        },
        undefined
      );
    });

    it('should update to bearer token', async () => {
      const webhook = createMockWebhook({ authentication: 'bearer_token' });
      mockClient.patch = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      await service.update(12345, {
        url: 'https://example.com/webhook',
        authentication: 'bearer_token',
        token: 'new-token',
      });

      expect(mockClient.patch).toHaveBeenCalled();
    });

    it('should update to API key', async () => {
      const webhook = createMockWebhook({ authentication: 'api_key' });
      mockClient.patch = mock(() => Promise.resolve(createMockSingleResponse(webhook)));

      await service.update(12345, {
        url: 'https://example.com/webhook',
        authentication: 'api_key',
        key: 'X-New-Key',
        value: 'new-value',
      });

      expect(mockClient.patch).toHaveBeenCalled();
    });

    it('should pass request options', async () => {
      mockClient.patch = mock(() => Promise.resolve(createMockSingleResponse(createMockWebhook())));

      await service.update(
        12345,
        { url: 'https://example.com/webhook', authentication: 'none' },
        { signal: new AbortController().signal }
      );

      expect(mockClient.patch).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // delete()
  // ============================================================================

  describe('delete()', () => {
    it('should delete a webhook', async () => {
      mockClient.delete = mock(() => Promise.resolve(undefined));

      await service.delete(12345);

      expect(mockClient.delete).toHaveBeenCalledWith('/webhooks/12345', undefined);
    });

    it('should pass request options', async () => {
      mockClient.delete = mock(() => Promise.resolve(undefined));

      await service.delete(12345, { signal: new AbortController().signal });

      expect(mockClient.delete).toHaveBeenCalled();
    });
  });
});

// ============================================================================
// Schema Tests
// ============================================================================

describe('Webhook Schemas', () => {
  describe('WebhookInputNoneSchema', () => {
    it('should accept valid input', () => {
      const result = WebhookInputNoneSchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'none',
      });

      expect(result.url).toBe('https://example.com/webhook');
      expect(result.authentication).toBe('none');
    });

    it('should reject invalid URL', () => {
      expect(() =>
        WebhookInputNoneSchema.parse({
          url: 'not-a-url',
          authentication: 'none',
        })
      ).toThrow();
    });

    it('should reject missing URL', () => {
      expect(() =>
        WebhookInputNoneSchema.parse({
          authentication: 'none',
        })
      ).toThrow();
    });

    it('should reject wrong authentication type', () => {
      expect(() =>
        WebhookInputNoneSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'basic_auth',
        })
      ).toThrow();
    });
  });

  describe('WebhookInputBasicAuthSchema', () => {
    it('should accept valid input', () => {
      const result = WebhookInputBasicAuthSchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'basic_auth',
        username: 'user',
        password: 'pass',
      });

      expect(result.username).toBe('user');
      expect(result.password).toBe('pass');
    });

    it('should reject missing username', () => {
      expect(() =>
        WebhookInputBasicAuthSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'basic_auth',
          password: 'pass',
        })
      ).toThrow();
    });

    it('should reject missing password', () => {
      expect(() =>
        WebhookInputBasicAuthSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'basic_auth',
          username: 'user',
        })
      ).toThrow();
    });

    it('should reject empty username', () => {
      expect(() =>
        WebhookInputBasicAuthSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'basic_auth',
          username: '',
          password: 'pass',
        })
      ).toThrow();
    });

    it('should reject empty password', () => {
      expect(() =>
        WebhookInputBasicAuthSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'basic_auth',
          username: 'user',
          password: '',
        })
      ).toThrow();
    });
  });

  describe('WebhookInputBearerTokenSchema', () => {
    it('should accept valid input', () => {
      const result = WebhookInputBearerTokenSchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'bearer_token',
        token: 'my-token',
      });

      expect(result.token).toBe('my-token');
    });

    it('should reject missing token', () => {
      expect(() =>
        WebhookInputBearerTokenSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'bearer_token',
        })
      ).toThrow();
    });

    it('should reject empty token', () => {
      expect(() =>
        WebhookInputBearerTokenSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'bearer_token',
          token: '',
        })
      ).toThrow();
    });
  });

  describe('WebhookInputApiKeySchema', () => {
    it('should accept valid input', () => {
      const result = WebhookInputApiKeySchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'api_key',
        key: 'X-API-Key',
        value: 'my-api-key',
      });

      expect(result.key).toBe('X-API-Key');
      expect(result.value).toBe('my-api-key');
    });

    it('should reject missing key', () => {
      expect(() =>
        WebhookInputApiKeySchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'api_key',
          value: 'my-api-key',
        })
      ).toThrow();
    });

    it('should reject missing value', () => {
      expect(() =>
        WebhookInputApiKeySchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'api_key',
          key: 'X-API-Key',
        })
      ).toThrow();
    });

    it('should reject empty key', () => {
      expect(() =>
        WebhookInputApiKeySchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'api_key',
          key: '',
          value: 'my-api-key',
        })
      ).toThrow();
    });

    it('should reject empty value', () => {
      expect(() =>
        WebhookInputApiKeySchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'api_key',
          key: 'X-API-Key',
          value: '',
        })
      ).toThrow();
    });
  });

  describe('CreateWebhookInputSchema (union)', () => {
    it('should accept none authentication', () => {
      const result = CreateWebhookInputSchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'none',
      });
      expect(result.authentication).toBe('none');
    });

    it('should accept basic_auth authentication', () => {
      const result = CreateWebhookInputSchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'basic_auth',
        username: 'user',
        password: 'pass',
      });
      expect(result.authentication).toBe('basic_auth');
    });

    it('should accept bearer_token authentication', () => {
      const result = CreateWebhookInputSchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'bearer_token',
        token: 'my-token',
      });
      expect(result.authentication).toBe('bearer_token');
    });

    it('should accept api_key authentication', () => {
      const result = CreateWebhookInputSchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'api_key',
        key: 'X-API-Key',
        value: 'my-api-key',
      });
      expect(result.authentication).toBe('api_key');
    });

    it('should reject invalid authentication type', () => {
      expect(() =>
        CreateWebhookInputSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'invalid',
        })
      ).toThrow();
    });

    it('should reject basic_auth without credentials', () => {
      expect(() =>
        CreateWebhookInputSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'basic_auth',
        })
      ).toThrow();
    });

    it('should reject bearer_token without token', () => {
      expect(() =>
        CreateWebhookInputSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'bearer_token',
        })
      ).toThrow();
    });

    it('should reject api_key without key/value', () => {
      expect(() =>
        CreateWebhookInputSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'api_key',
        })
      ).toThrow();
    });
  });

  describe('UpdateWebhookInputSchema', () => {
    it('should accept none authentication', () => {
      const result = UpdateWebhookInputSchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'none',
      });
      expect(result.authentication).toBe('none');
    });

    it('should accept basic_auth with credentials', () => {
      const result = UpdateWebhookInputSchema.parse({
        url: 'https://example.com/webhook',
        authentication: 'basic_auth',
        username: 'user',
        password: 'pass',
      });
      expect(result.authentication).toBe('basic_auth');
    });

    it('should reject invalid URL', () => {
      expect(() =>
        UpdateWebhookInputSchema.parse({
          url: 'not-a-url',
          authentication: 'none',
        })
      ).toThrow();
    });

    it('should reject basic_auth without credentials', () => {
      expect(() =>
        UpdateWebhookInputSchema.parse({
          url: 'https://example.com/webhook',
          authentication: 'basic_auth',
        })
      ).toThrow();
    });
  });
});
