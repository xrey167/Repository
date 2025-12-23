/**
 * Tests for TradeSync SDK Configuration
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import {
  tradeSyncConfig,
  TradeSyncConfigSchema,
  validateConfig,
  validateEnvironment,
  isEnvironmentConfigured,
  createConfigFromEnv,
  createConfig,
  defaultRetryConfig,
  ConfigurationError,
} from '../config.js';

describe('TradeSyncConfigSchema', () => {
  test('validates complete config', () => {
    const config = {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      baseUrl: 'https://api.tradesync.com',
      timeout: 30000,
      version: 'v1',
    };

    const result = TradeSyncConfigSchema.parse(config);

    expect(result.apiKey).toBe('test-api-key');
    expect(result.apiSecret).toBe('test-api-secret');
    expect(result.baseUrl).toBe('https://api.tradesync.com');
    expect(result.timeout).toBe(30000);
    expect(result.version).toBe('v1');
  });

  test('applies default values', () => {
    const config = {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
    };

    const result = TradeSyncConfigSchema.parse(config);

    expect(result.baseUrl).toBe('https://api.tradesync.com');
    expect(result.timeout).toBe(30000);
    expect(result.version).toBe(''); // TradeSync API has no version prefix
  });

  test('rejects empty apiKey', () => {
    const config = {
      apiKey: '',
      apiSecret: 'test-api-secret',
    };

    expect(() => TradeSyncConfigSchema.parse(config)).toThrow();
  });

  test('rejects empty apiSecret', () => {
    const config = {
      apiKey: 'test-api-key',
      apiSecret: '',
    };

    expect(() => TradeSyncConfigSchema.parse(config)).toThrow();
  });

  test('rejects invalid baseUrl', () => {
    const config = {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      baseUrl: 'not-a-valid-url',
    };

    expect(() => TradeSyncConfigSchema.parse(config)).toThrow();
  });

  test('rejects negative timeout', () => {
    const config = {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      timeout: -1000,
    };

    expect(() => TradeSyncConfigSchema.parse(config)).toThrow();
  });

  test('rejects zero timeout', () => {
    const config = {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      timeout: 0,
    };

    expect(() => TradeSyncConfigSchema.parse(config)).toThrow();
  });
});

describe('ConfigurationError', () => {
  test('creates error with message', () => {
    const error = new ConfigurationError('Test error');

    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ConfigurationError');
    expect(error instanceof Error).toBe(true);
  });

  test('creates error with validation errors', () => {
    const zodError = {
      errors: [{ path: ['apiKey'], message: 'Required' }],
    };

    const error = new ConfigurationError('Validation failed', zodError as any);

    expect(error.validationErrors).toBeDefined();
  });
});

describe('validateConfig', () => {
  test('returns validated config for valid input', () => {
    const config = {
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
    };

    const result = validateConfig(config);

    expect(result.apiKey).toBe('test-api-key');
    expect(result.apiSecret).toBe('test-api-secret');
  });

  test('throws ConfigurationError for invalid input', () => {
    const config = {
      apiKey: '',
      apiSecret: 'test-api-secret',
    };

    expect(() => validateConfig(config)).toThrow(ConfigurationError);
  });

  test('includes field paths in error message', () => {
    const config = {
      apiKey: '',
      apiSecret: '',
    };

    try {
      validateConfig(config);
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigurationError);
      expect((error as ConfigurationError).message).toContain('apiKey');
    }
  });
});

describe('defaultRetryConfig', () => {
  test('has expected default values', () => {
    expect(defaultRetryConfig.maxRetries).toBe(3);
    expect(defaultRetryConfig.initialDelayMs).toBe(1000);
    expect(defaultRetryConfig.maxDelayMs).toBe(10000);
    expect(defaultRetryConfig.backoffMultiplier).toBe(2);
    expect(defaultRetryConfig.jitterFactor).toBe(0.1);
  });
});

describe('tradeSyncConfig (with environment variables)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Clear TradeSync env vars
    delete process.env.TRADESYNC_API_KEY;
    delete process.env.TRADESYNC_API_SECRET;
    delete process.env.TRADESYNC_BASE_URL;
    delete process.env.TRADESYNC_TIMEOUT;
    delete process.env.TRADESYNC_API_VERSION;
  });

  afterEach(() => {
    // Restore original env
    process.env = { ...originalEnv };
  });

  test('throws error when apiKey is missing', () => {
    expect(() => tradeSyncConfig.apiKey).toThrow(ConfigurationError);
  });

  test('throws error when apiSecret is missing', () => {
    process.env.TRADESYNC_API_KEY = 'test-key';
    expect(() => tradeSyncConfig.apiSecret).toThrow(ConfigurationError);
  });

  test('returns apiKey from environment', () => {
    process.env.TRADESYNC_API_KEY = 'my-api-key';

    expect(tradeSyncConfig.apiKey).toBe('my-api-key');
  });

  test('returns apiSecret from environment', () => {
    process.env.TRADESYNC_API_SECRET = 'my-api-secret';

    expect(tradeSyncConfig.apiSecret).toBe('my-api-secret');
  });

  test('returns default baseUrl when not set', () => {
    expect(tradeSyncConfig.baseUrl).toBe('https://api.tradesync.com');
  });

  test('returns custom baseUrl from environment', () => {
    process.env.TRADESYNC_BASE_URL = 'https://sandbox.tradesync.com';

    expect(tradeSyncConfig.baseUrl).toBe('https://sandbox.tradesync.com');
  });

  test('returns default timeout when not set', () => {
    expect(tradeSyncConfig.timeout).toBe(30000);
  });

  test('returns custom timeout from environment', () => {
    process.env.TRADESYNC_TIMEOUT = '60000';

    expect(tradeSyncConfig.timeout).toBe(60000);
  });

  test('throws error for invalid timeout value', () => {
    process.env.TRADESYNC_TIMEOUT = 'not-a-number';

    expect(() => tradeSyncConfig.timeout).toThrow(ConfigurationError);
  });

  test('returns default version when not set', () => {
    expect(tradeSyncConfig.version).toBe(''); // TradeSync API has no version prefix
  });

  test('returns custom version from environment', () => {
    process.env.TRADESYNC_API_VERSION = 'v2';

    expect(tradeSyncConfig.version).toBe('v2');
  });
});

describe('validateEnvironment', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.TRADESYNC_API_KEY;
    delete process.env.TRADESYNC_API_SECRET;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test('throws when required variables are missing', () => {
    expect(() => validateEnvironment()).toThrow(ConfigurationError);
  });

  test('does not throw when all required variables are set', () => {
    process.env.TRADESYNC_API_KEY = 'test-key';
    process.env.TRADESYNC_API_SECRET = 'test-secret';

    expect(() => validateEnvironment()).not.toThrow();
  });
});

describe('isEnvironmentConfigured', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.TRADESYNC_API_KEY;
    delete process.env.TRADESYNC_API_SECRET;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test('returns false when variables are missing', () => {
    expect(isEnvironmentConfigured()).toBe(false);
  });

  test('returns true when all required variables are set', () => {
    process.env.TRADESYNC_API_KEY = 'test-key';
    process.env.TRADESYNC_API_SECRET = 'test-secret';

    expect(isEnvironmentConfigured()).toBe(true);
  });
});

describe('createConfigFromEnv', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.TRADESYNC_API_KEY;
    delete process.env.TRADESYNC_API_SECRET;
    delete process.env.TRADESYNC_BASE_URL;
    delete process.env.TRADESYNC_TIMEOUT;
    delete process.env.TRADESYNC_API_VERSION;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test('creates config from environment variables', () => {
    process.env.TRADESYNC_API_KEY = 'env-api-key';
    process.env.TRADESYNC_API_SECRET = 'env-api-secret';
    process.env.TRADESYNC_BASE_URL = 'https://custom.tradesync.com';
    process.env.TRADESYNC_TIMEOUT = '45000';
    process.env.TRADESYNC_API_VERSION = 'v2';

    const config = createConfigFromEnv();

    expect(config.apiKey).toBe('env-api-key');
    expect(config.apiSecret).toBe('env-api-secret');
    expect(config.baseUrl).toBe('https://custom.tradesync.com');
    expect(config.timeout).toBe(45000);
    expect(config.version).toBe('v2');
  });

  test('throws when required variables are missing', () => {
    expect(() => createConfigFromEnv()).toThrow(ConfigurationError);
  });
});

describe('createConfig', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.TRADESYNC_API_KEY = 'env-api-key';
    process.env.TRADESYNC_API_SECRET = 'env-api-secret';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test('creates config with environment defaults', () => {
    const config = createConfig();

    expect(config.apiKey).toBe('env-api-key');
    expect(config.apiSecret).toBe('env-api-secret');
  });

  test('overrides apiKey', () => {
    const config = createConfig({ apiKey: 'override-key' });

    expect(config.apiKey).toBe('override-key');
    expect(config.apiSecret).toBe('env-api-secret');
  });

  test('overrides apiSecret', () => {
    const config = createConfig({ apiSecret: 'override-secret' });

    expect(config.apiKey).toBe('env-api-key');
    expect(config.apiSecret).toBe('override-secret');
  });

  test('overrides baseUrl', () => {
    const config = createConfig({ baseUrl: 'https://override.tradesync.com' });

    expect(config.baseUrl).toBe('https://override.tradesync.com');
  });

  test('overrides timeout', () => {
    const config = createConfig({ timeout: 60000 });

    expect(config.timeout).toBe(60000);
  });

  test('overrides version', () => {
    const config = createConfig({ version: 'v3' });

    expect(config.version).toBe('v3');
  });

  test('empty override falls back to env', () => {
    // Empty string is falsy, so it falls back to env var
    const config = createConfig({ apiKey: '' });

    expect(config.apiKey).toBe('env-api-key');
  });

  test('validates final config', () => {
    // Delete env var so empty override causes failure
    delete process.env.TRADESYNC_API_KEY;

    expect(() => createConfig({ apiKey: '' })).toThrow(ConfigurationError);
  });
});
