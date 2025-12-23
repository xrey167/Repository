/**
 * TradeSync SDK
 *
 * A TypeScript SDK for the TradeSync API with retry logic, error handling,
 * and comprehensive type support.
 *
 * @packageDocumentation
 */

// Error classes and utilities
export {
  TradeSyncError,
  TransientError,
  PermanentError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  TimeoutError,
  NetworkError,
  isRetryableError,
  isRetryableStatusCode,
  wrapError,
  // MetaTrader 4 Error Codes
  MT4_ERROR_CODES,
  getMT4ErrorMessage,
  isMT4ErrorRetryable,
  type MT4ErrorCode,
  // MetaTrader 5 Error Codes
  MT5_ERROR_CODES,
  getMT5ErrorMessage,
  isMT5ErrorRetryable,
  type MT5ErrorCode,
} from './errors.js';

// Retry utilities
export {
  withRetry,
  withRetryResult,
  calculateDelay,
  calculateTotalMaxDelay,
  createRetryWrapper,
  DEFAULT_RETRY_CONFIG,
  type RetryConfig,
  type RetryResult,
} from './retry.js';

// Configuration
export {
  tradeSyncConfig,
  TradeSyncConfigSchema,
  validateConfig,
  validateEnvironment,
  isEnvironmentConfigured,
  createConfigFromEnv,
  createConfig,
  defaultRetryConfig,
  ConfigurationError,
  type TradeSyncConfig,
  type TradeSyncConfigInput,
} from './config.js';

// Common types
export {
  type HttpMethod,
  type PaginationParams,
  type RequestOptions,
  type ApiListResponse,
  type ApiSingleResponse,
  type ApiErrorResponse,
  type ApiResponse,
  type SuccessCode,
  type FailCode,
  type ErrorCode,
  type ResponseCode,
  type Timestamp,
  type Result,
  type AsyncResult,
  // Connection & Health types
  type HealthCheckResult,
  type ConnectionStatus,
  type RateLimitInfo,
  type RateLimiterConfig,
} from './types.js';

// Connection Status Manager
export {
  ConnectionStatusManager,
  type ConnectionStatusEvent,
  type ConnectionStatusListener,
} from './connection-status.js';

// Rate Limiter
export { RateLimiter } from './rate-limiter.js';

// HTTP Client
export {
  TradeSyncClient,
  createClient,
  createBasicAuthHeader,
  buildUrl,
  buildPaginationParams,
  type TradeSyncClientOptions,
} from './client.js';

// Services - Accounts API (10 endpoints)
export {
  AccountsService,
  type Account,
  type AccountSymbol,
  type AccountStatusType,
  type LoginResponseType,
  type AccountTypeValue,
  type ApplicationType,
  type CreateAccountInput,
  type UpdateAccountInput,
  type UpdateConnectionInput,
  type UpdateSymbolInput,
  type BulkSymbolUpdateInput,
  type AccountListFilters,
  CreateAccountInputSchema,
  UpdateAccountInputSchema,
  UpdateConnectionInputSchema,
  UpdateSymbolInputSchema,
  BulkSymbolUpdateInputSchema,
} from './services/accounts.js';

// Services - Trades API (2 endpoints)
export {
  TradesService,
  type Trade,
  type TradeState,
  type TradeType,
  type ProfitCalcMode,
  type TradeListFilters,
} from './services/trades.js';

// Services - Copiers API (10 endpoints)
export {
  CopiersService,
  type Copier,
  type CopierMode,
  type RiskType,
  type CopySlTpMode,
  type YesNo,
  type DisabledSymbol,
  type CopierMap,
  type CreateCopierInput,
  type UpdateCopierInput,
  type CreateDisabledSymbolInput,
  type CreateCopierMapInput,
  type CopierListFilters,
  CreateCopierInputSchema,
  UpdateCopierInputSchema,
  CreateDisabledSymbolInputSchema,
  CreateCopierMapInputSchema,
} from './services/copiers.js';

// Services - Commands API (5 endpoints)
export {
  CommandsService,
  type Command,
  type CommandGroup,
  type CommandType,
  type CommandStatus,
  type CommandResult,
  type ByType,
  type OpenCommandInput,
  type ModifyCommandInput,
  type CloseCommandInput,
  type CancelCommandInput,
  type CommandListFilters,
  OpenCommandInputSchema,
  ModifyCommandInputSchema,
  CloseCommandInputSchema,
  CancelCommandInputSchema,
} from './services/commands.js';

// Services - Events API (8 endpoints)
export {
  EventsService,
  type AccountEvent,
  type AccountEventType,
  type AccountEventListFilters,
  type TradeEvent,
  type TradeEventType,
  type TradeEventListFilters,
  type CopierEvent,
  type CopierEventType,
  type CopierEventListFilters,
  type CommandEvent,
  type CommandEventType,
  type CommandEventListFilters,
} from './services/events.js';

// Services - Webhooks API (5 endpoints)
export {
  WebhooksService,
  type Webhook,
  type WebhookAuthenticationType,
  type WebhookInputNone,
  type WebhookInputBasicAuth,
  type WebhookInputBearerToken,
  type WebhookInputApiKey,
  type CreateWebhookInput,
  type UpdateWebhookInput,
  type WebhookListFilters,
  WebhookInputNoneSchema,
  WebhookInputBasicAuthSchema,
  WebhookInputBearerTokenSchema,
  WebhookInputApiKeySchema,
  CreateWebhookInputSchema,
  UpdateWebhookInputSchema,
} from './services/webhooks.js';

// Services - Brokers API (4 endpoints)
export {
  BrokersService,
  type Broker,
  type BrokerServer,
  type ApplicationType as BrokerApplicationType,
  type BrokerListFilters,
  type BrokerServerListFilters,
} from './services/brokers.js';

// Services - Analysis API (6 endpoints)
export {
  AnalysisService,
  type Analysis,
  type DailyAnalysis,
  type MonthlyAnalysis,
  type MonthlySymbolAnalysis,
  type HourlyAnalysis,
  type AnalysisListFilters,
  type TimeAnalysisFilters,
} from './services/analysis.js';

// Services - Equity Monitors API (2 endpoints)
export {
  EquityMonitorsService,
  type EquityMonitor,
  type MonitorType,
  type MonitorAction,
  type MonitorStatus,
  type CreateEquityMonitorInput,
  type CancelEquityMonitorInput,
  CreateEquityMonitorInputSchema,
  CancelEquityMonitorInputSchema,
} from './services/equity-monitors.js';

// Symbol Mapper (Futures/CFD intelligent mapping)
export {
  SymbolMapper,
  createSymbolMapper,
  parseSymbol,
  findCanonicalBase,
  formatExpiry,
  DEFAULT_ALIASES,
  DEFAULT_CONFIG,
  type SymbolExpiry,
  type ParsedSymbol,
  type SymbolStyle,
  type FallbackBehavior,
  type SymbolMappingRule,
  type SymbolMapperConfig,
  type MappingResult,
  type DiscoveredSymbol,
} from './symbol-mapper.js';

// Default mapping rules (ActivTrades → ACY Securities)
export {
  ACTIVTRADES_TO_ACY_RULES,
  SYMBOL_ALIASES,
} from './default-mapping-rules.js';

/**
 * SDK version
 */
export const SDK_VERSION = '1.0.0';

/**
 * SDK name
 */
export const SDK_NAME = '@acme/sdk-tradesync';
