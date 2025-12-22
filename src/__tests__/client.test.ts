/**
 * Tests for TradeSync HTTP Client
 */

import { describe, test, expect, beforeEach, afterEach, mock, spyOn } from 'bun:test';
import {
  TradeSyncClient,
  createClient,
  createBasicAuthHeader,
  buildUrl,
  buildPaginationParams,
} from '../client.js';
import { TradeSyncError, TransientError, PermanentError } from '../errors.js';

describe('createBasicAuthHeader', () => {
  test('encodes credentials correctly', () => {
    const header = createBasicAuthHeader('my-api-key', 'my-api-secret');

    // "my-api-key:my-api-secret" in base64
    const expected = Buffer.from('my-api-key:my-api-secret').toString('base64');
    expect(header).toBe(`Basic ${expected}`);
  });

  test('handles special characters', () => {
    const header = createBasicAuthHeader('key+special=chars', 'secret/with+chars');

    const expected = Buffer.from('key+special=chars:secret/with+chars').toString('base64');
    expect(header).toBe(`Basic ${expected}`);
  });

  test('handles empty strings', () => {
    const header = createBasicAuthHeader('', '');

    const expected = Buffer.from(':').toString('base64');
    expect(header).toBe(`Basic ${expected}`);
  });
});

describe('buildUrl', () => {
  test('builds URL with path', () => {
    const url = buildUrl('https://api.example.com', '/v1/accounts');

    expect(url).toBe('https://api.example.com/v1/accounts');
  });

  test('builds URL with query parameters', () => {
    const url = buildUrl('https://api.example.com', '/v1/accounts', {
      limit: 10,
      order: 'asc',
    });

    expect(url).toContain('limit=10');
    expect(url).toContain('order=asc');
  });

  test('ignores undefined parameters', () => {
    const url = buildUrl('https://api.example.com', '/v1/accounts', {
      limit: 10,
      order: undefined,
    });

    expect(url).toContain('limit=10');
    expect(url).not.toContain('order');
  });

  test('ignores null parameters', () => {
    const url = buildUrl('https://api.example.com', '/v1/accounts', {
      limit: 10,
      order: null as any,
    });

    expect(url).toContain('limit=10');
    expect(url).not.toContain('order');
  });

  test('ignores empty string parameters', () => {
    const url = buildUrl('https://api.example.com', '/v1/accounts', {
      limit: 10,
      search: '',
    });

    expect(url).toContain('limit=10');
    expect(url).not.toContain('search');
  });

  test('handles boolean parameters', () => {
    const url = buildUrl('https://api.example.com', '/v1/accounts', {
      active: true,
      archived: false,
    });

    expect(url).toContain('active=true');
    expect(url).toContain('archived=false');
  });
});

describe('buildPaginationParams', () => {
  test('returns empty object for undefined', () => {
    const params = buildPaginationParams(undefined);

    expect(params).toEqual({});
  });

  test('returns empty object for empty pagination', () => {
    const params = buildPaginationParams({});

    expect(params).toEqual({
      limit: undefined,
      order: undefined,
      last_id: undefined,
    });
  });

  test('builds pagination params correctly', () => {
    const params = buildPaginationParams({
      limit: 50,
      order: 'desc',
      last_id: 'abc123',
    });

    expect(params.limit).toBe(50);
    expect(params.order).toBe('desc');
    expect(params.last_id).toBe('abc123');
  });

  test('includes last_id for cursor pagination', () => {
    const params = buildPaginationParams({
      last_id: 100,
      limit: 20,
    });

    expect(params.last_id).toBe(100);
    expect(params.limit).toBe(20);
  });
});

describe('TradeSyncClient', () => {
  const originalEnv = { ...process.env };
  let fetchSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    process.env.TRADESYNC_API_KEY = 'test-api-key';
    process.env.TRADESYNC_API_SECRET = 'test-api-secret';

    // Mock fetch
    fetchSpy = spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    fetchSpy.mockRestore();
  });

  test('creates client with default options', () => {
    const client = new TradeSyncClient();
    const config = client.getConfig();

    expect(config.apiKey).toBe('test-api-key');
    expect(config.apiSecret).toBe('test-api-secret');
    expect(config.baseUrl).toBe('https://api.tradesync.com');
    expect(config.timeout).toBe(30000);
    expect(config.version).toBe(''); // TradeSync API has no version prefix
  });

  test('creates client with custom options', () => {
    const client = new TradeSyncClient({
      apiKey: 'custom-key',
      apiSecret: 'custom-secret',
      baseUrl: 'https://sandbox.tradesync.com',
      timeout: 60000,
      version: 'v2',
    });

    const config = client.getConfig();
    expect(config.apiKey).toBe('custom-key');
    expect(config.apiSecret).toBe('custom-secret');
    expect(config.baseUrl).toBe('https://sandbox.tradesync.com');
    expect(config.timeout).toBe(60000);
    expect(config.version).toBe('v2');
  });

  test('createClient factory function works', () => {
    const client = createClient({
      apiKey: 'factory-key',
      apiSecret: 'factory-secret',
    });

    const config = client.getConfig();
    expect(config.apiKey).toBe('factory-key');
    expect(config.apiSecret).toBe('factory-secret');
  });

  describe('GET requests', () => {
    test('makes GET request with correct headers', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: { id: '123' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
      });

      await client.get('/accounts');

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('/accounts'); // No version prefix in TradeSync API
      expect(options.method).toBe('GET');
      expect((options.headers as Record<string, string>)['Authorization']).toContain('Basic');
      expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    });

    test('makes GET request with query parameters', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.get('/accounts', { limit: 10, status: 'active' });

      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('limit=10');
      expect(url).toContain('status=active');
    });

    test('returns data from response', async () => {
      const responseData = { id: '123', name: 'Test Account' };
      const fullResponse = { result: 'success', data: responseData };
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(fullResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      const result = await client.get('/accounts/123');

      // Client returns full API response wrapper
      expect(result).toEqual(fullResponse);
    });
  });

  describe('POST requests', () => {
    test('makes POST request with body', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: { id: 'new-123' } }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      const body = { name: 'New Account', broker_id: 'broker-1' };
      await client.post('/accounts', body);

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(options.method).toBe('POST');
      expect(options.body).toBe(JSON.stringify(body));
    });

    test('makes POST request without body', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.post('/accounts/123/connect');

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(options.body).toBeUndefined();
    });
  });

  describe('PUT requests', () => {
    test('makes PUT request with body', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: { id: '123' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      const body = { name: 'Updated Account' };
      await client.put('/accounts/123', body);

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(options.method).toBe('PUT');
      expect(options.body).toBe(JSON.stringify(body));
    });
  });

  describe('PATCH requests', () => {
    test('makes PATCH request with body', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: { id: '123' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      const body = { status: 'active' };
      await client.patch('/accounts/123', body);

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(options.method).toBe('PATCH');
      expect(options.body).toBe(JSON.stringify(body));
    });
  });

  describe('DELETE requests', () => {
    test('makes DELETE request', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.delete('/accounts/123');

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(options.method).toBe('DELETE');
    });
  });

  describe('getPaginated', () => {
    test('makes paginated GET request', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: [], meta: { total: 100 } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.getPaginated('/accounts', { limit: 50, order: 'desc' });

      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('limit=50');
      expect(url).toContain('order=desc');
    });

    test('combines pagination with additional params', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.getPaginated(
        '/accounts',
        { limit: 20 },
        { status: 'connected' }
      );

      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('limit=20');
      expect(url).toContain('status=connected');
    });
  });

  describe('error handling', () => {
    test('throws PermanentError for 400 response', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify({ result: 'error', message: 'Bad request' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const client = new TradeSyncClient({
        retry: { maxRetries: 0 },
      });

      await expect(client.get('/accounts')).rejects.toThrow(TradeSyncError);
    });

    test('throws PermanentError for 401 response', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify({ result: 'error', message: 'Unauthorized' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const client = new TradeSyncClient({
        retry: { maxRetries: 0 },
      });

      await expect(client.get('/accounts')).rejects.toThrow(TradeSyncError);
    });

    test('throws PermanentError for 404 response', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify({ result: 'error', message: 'Not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const client = new TradeSyncClient({
        retry: { maxRetries: 0 },
      });

      await expect(client.get('/accounts/invalid')).rejects.toThrow(TradeSyncError);
    });

    test('throws error for invalid JSON response', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response('not json', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        })
      );

      const client = new TradeSyncClient({
        retry: { maxRetries: 0 },
      });

      await expect(client.get('/accounts')).rejects.toThrow(TradeSyncError);
    });

    test('retries on 500 server error', async () => {
      // First call fails, second succeeds
      fetchSpy
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ result: 'error', message: 'Server error' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ result: 'success', data: { id: '123' } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );

      const client = new TradeSyncClient({
        retry: { maxRetries: 1, initialDelayMs: 10 },
      });

      const result = await client.get('/accounts/123');

      expect(fetchSpy).toHaveBeenCalledTimes(2);
      // Client returns full API response wrapper
      expect(result).toEqual({ result: 'success', data: { id: '123' } });
    });

    test('retries on 429 rate limit', async () => {
      fetchSpy
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ result: 'error', message: 'Rate limited' }),
            {
              status: 429,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ result: 'success', data: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );

      const client = new TradeSyncClient({
        retry: { maxRetries: 1, initialDelayMs: 10 },
      });

      const result = await client.get('/accounts');

      expect(fetchSpy).toHaveBeenCalledTimes(2);
      // Client returns full API response wrapper
      expect(result).toEqual({ result: 'success', data: [] });
    });

    test('skips retry when skipRetry is true', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify({ result: 'error', message: 'Server error' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const client = new TradeSyncClient();

      await expect(
        client.get('/accounts', undefined, { skipRetry: true })
      ).rejects.toThrow(TradeSyncError);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    test('wraps network errors', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Network error: ECONNREFUSED'));

      const client = new TradeSyncClient({
        retry: { maxRetries: 0 },
      });

      await expect(client.get('/accounts')).rejects.toThrow(TradeSyncError);
    });
  });

  describe('URL construction', () => {
    test('adds version prefix to path', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient({ version: 'v2' });
      await client.get('/accounts');

      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('/v2/accounts');
    });

    test('handles path with leading slash', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.get('/accounts');

      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit];
      // TradeSync API has no version prefix by default
      expect(url).toBe('https://api.tradesync.com/accounts');
    });

    test('handles path without leading slash', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.get('accounts');

      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit];
      // TradeSync API has no version prefix by default
      expect(url).toBe('https://api.tradesync.com/accounts');
    });

    test('does not double version prefix', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.get('/v1/accounts');

      const [url] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).not.toContain('/v1/v1');
    });
  });

  describe('custom headers', () => {
    test('includes custom headers', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.get('/accounts', undefined, {
        headers: { 'X-Custom-Header': 'custom-value' },
      });

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect((options.headers as Record<string, string>)['X-Custom-Header']).toBe('custom-value');
    });

    test('custom headers do not override auth', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify({ result: 'success', data: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const client = new TradeSyncClient();
      await client.get('/accounts', undefined, {
        headers: { 'Content-Type': 'text/plain' },
      });

      const [, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
      // Custom header should override Content-Type in this case
      expect((options.headers as Record<string, string>)['Authorization']).toContain('Basic');
    });
  });
});
