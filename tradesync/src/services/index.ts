/**
 * TradeSync SDK Services
 *
 * Service modules for all TradeSync API endpoints.
 * Total: 55 endpoints across 14 categories
 */

// Accounts API (10 endpoints)
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
  type ApiListResponse,
  type ApiSingleResponse,
  CreateAccountInputSchema,
  UpdateAccountInputSchema,
  UpdateConnectionInputSchema,
  UpdateSymbolInputSchema,
  BulkSymbolUpdateInputSchema,
} from './accounts.js';

// Trades API (2 endpoints)
export {
  TradesService,
  type Trade,
  type TradeState,
  type TradeType,
  type ProfitCalcMode,
  type TradeListFilters,
} from './trades.js';

// Copiers API (10 endpoints including maps and disabled symbols)
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
} from './copiers.js';

// Commands API (5 endpoints)
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
} from './commands.js';

// Events API (8 endpoints)
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
} from './events.js';

// Webhooks API (5 endpoints)
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
} from './webhooks.js';

// Brokers API (4 endpoints)
export {
  BrokersService,
  type Broker,
  type BrokerServer,
  type ApplicationType as BrokerApplicationType,
  type BrokerListFilters,
  type BrokerServerListFilters,
} from './brokers.js';

// Analysis API (6 endpoints)
export {
  AnalysisService,
  type Analysis,
  type DailyAnalysis,
  type MonthlyAnalysis,
  type MonthlySymbolAnalysis,
  type HourlyAnalysis,
  type AnalysisListFilters,
  type TimeAnalysisFilters,
} from './analysis.js';

// Equity Monitors API (2 endpoints)
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
} from './equity-monitors.js';
