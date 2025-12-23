/**
 * TradeSync SDK Configuration
 *
 * Uses Zod for runtime validation and lazy getters for environment variables.
 */

import { z } from 'zod';
import type { RetryConfig } from './retry.js';

/**
 * Zod schema for TradeSync configuration
 */
export const TradeSyncConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  apiSecret: z.string().min(1, 'API secret is required'),
  baseUrl: z.string().url().default('https://api.tradesync.com'),
  timeout: z.number().positive().default(30000),
  version: z.string().default(''),
});

/**
 * TradeSync configuration type (inferred from schema)
 */
export type TradeSyncConfig = z.infer<typeof TradeSyncConfigSchema>;

/**
 * Input type for creating config (optional fields use defaults)
 */
export type TradeSyncConfigInput = z.input<typeof TradeSyncConfigSchema>;

/**
 * Configuration validation error
 */
export class ConfigurationError extends Error {
  constructor(
    message: string,
    public readonly validationErrors?: z.ZodError
  ) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/**
 * Get a required environment variable with a descriptive error
 */
function getRequiredEnvVar(name: string, description: string): string {
  const value = process.env[name];
  if (!value) {
    throw new ConfigurationError(
      `${description} missing: ${name} environment variable must be set. ` +
      `Please add ${name} to your .env file or set it in your environment.`
    );
  }
  return value;
}

/**
 * Get an optional environment variable with a default value
 */
function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

/**
 * Get an optional numeric environment variable with a default value
 */
function getOptionalNumericEnvVar(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new ConfigurationError(
      `Invalid value for ${name}: expected a number, got "${value}"`
    );
  }
  return parsed;
}

/**
 * TradeSync configuration with lazy environment variable getters
 *
 * Environment variables are only read when accessed, allowing for
 * flexible configuration in different environments.
 */
export const tradeSyncConfig = {
  /**
   * TradeSync API key (required)
   */
  get apiKey(): string {
    return getRequiredEnvVar('TRADESYNC_API_KEY', 'TradeSync API key');
  },

  /**
   * TradeSync API secret (required)
   */
  get apiSecret(): string {
    return getRequiredEnvVar('TRADESYNC_API_SECRET', 'TradeSync API secret');
  },

  /**
   * TradeSync API base URL
   */
  get baseUrl(): string {
    return getOptionalEnvVar('TRADESYNC_BASE_URL', 'https://api.tradesync.com');
  },

  /**
   * Request timeout in milliseconds
   */
  get timeout(): number {
    return getOptionalNumericEnvVar('TRADESYNC_TIMEOUT', 30000);
  },

  /**
   * API version (empty string = no version prefix)
   */
  get version(): string {
    return getOptionalEnvVar('TRADESYNC_API_VERSION', '');
  },
};

/**
 * Default retry configuration for TradeSync API calls
 */
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
};

/**
 * Validate configuration against the schema
 *
 * @param config - Configuration object to validate
 * @returns Validated configuration
 * @throws ConfigurationError if validation fails
 */
export function validateConfig(config: unknown): TradeSyncConfig {
  try {
    return TradeSyncConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      throw new ConfigurationError(
        `Invalid TradeSync configuration:\n${messages.join('\n')}`,
        error
      );
    }
    throw error;
  }
}

/**
 * Create configuration from environment variables
 *
 * @returns Validated configuration from environment
 * @throws ConfigurationError if required variables are missing
 */
export function createConfigFromEnv(): TradeSyncConfig {
  return validateConfig({
    apiKey: tradeSyncConfig.apiKey,
    apiSecret: tradeSyncConfig.apiSecret,
    baseUrl: tradeSyncConfig.baseUrl,
    timeout: tradeSyncConfig.timeout,
    version: tradeSyncConfig.version,
  });
}

/**
 * Validate that required environment variables are set
 *
 * Call this at application startup to fail fast if configuration is missing.
 *
 * @throws ConfigurationError if required variables are missing
 */
export function validateEnvironment(): void {
  // Trigger the getters to validate the required variables exist
  void tradeSyncConfig.apiKey;
  void tradeSyncConfig.apiSecret;
}

/**
 * Safely check if environment is configured (doesn't throw)
 */
export function isEnvironmentConfigured(): boolean {
  try {
    validateEnvironment();
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a partial config with overrides
 */
export function createConfig(overrides: Partial<TradeSyncConfigInput> = {}): TradeSyncConfig {
  const baseConfig: TradeSyncConfigInput = {
    apiKey: overrides.apiKey || tradeSyncConfig.apiKey,
    apiSecret: overrides.apiSecret || tradeSyncConfig.apiSecret,
    baseUrl: overrides.baseUrl || tradeSyncConfig.baseUrl,
    timeout: overrides.timeout || tradeSyncConfig.timeout,
    version: overrides.version || tradeSyncConfig.version,
  };

  return validateConfig(baseConfig);
}
