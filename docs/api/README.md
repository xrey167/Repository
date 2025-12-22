**tradesync-sdk v1.0.0**

***

# TradeSync SDK

A TypeScript SDK for the TradeSync API, providing type-safe access to trading account management, copy trading, command execution, and analytics.

## Installation

```bash
bun add @finx/sdk-tradesync
# or
npm install @finx/sdk-tradesync
```

## Quick Start

```typescript
import { TradeSync } from '@finx/sdk-tradesync';

// Initialize the client
const tradesync = new TradeSync({
  apiKey: 'your_api_key',
  apiSecret: 'your_api_secret',
});

// List accounts
const accounts = await tradesync.accounts.list();
console.log(accounts.data);

// Get account balance
const balance = await tradesync.accounts.getBalance('acc_123');
console.log(`Balance: ${balance.balance}, Equity: ${balance.equity}`);
```

## Configuration

### Environment Variables

The SDK reads configuration from environment variables by default:

```bash
TRADESYNC_API_KEY=your_api_key
TRADESYNC_API_SECRET=your_api_secret
TRADESYNC_BASE_URL=https://api.tradesync.com  # Optional
TRADESYNC_TIMEOUT=30000                        # Optional, in milliseconds
TRADESYNC_API_VERSION=v1                       # Optional
```

### Programmatic Configuration

```typescript
import { TradeSync } from '@finx/sdk-tradesync';

const tradesync = new TradeSync({
  apiKey: 'your_api_key',
  apiSecret: 'your_api_secret',
  baseUrl: 'https://api.tradesync.com',
  timeout: 30000,
  version: 'v1',
  retry: {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
  },
});
```

## API Reference

### Accounts (11 endpoints)

Manage trading accounts, retrieve balances, statistics, and trade history.

```typescript
// List accounts with filters
const accounts = await tradesync.accounts.list({
  status: 'active',
  broker_id: 'broker_123',
  limit: 50,
});

// Get account by ID
const account = await tradesync.accounts.get('acc_123');

// Create new account
const newAccount = await tradesync.accounts.create({
  name: 'My Trading Account',
  account_number: '12345678',
  broker_id: 'broker_123',
  server: 'Demo-Server',
  password: 'secretpassword',
});

// Update account
const updated = await tradesync.accounts.update('acc_123', {
  name: 'Updated Name',
});

// Delete (archive) account
await tradesync.accounts.delete('acc_123');

// Get account statistics
const stats = await tradesync.accounts.getStatistics('acc_123');
console.log(`Win rate: ${stats.win_rate}%`);

// Get account balance
const balance = await tradesync.accounts.getBalance('acc_123');

// Get equity history
const equity = await tradesync.accounts.getEquityHistory('acc_123', {
  start_date: '2024-01-01',
  end_date: '2024-12-31',
});

// Get risk metrics
const risk = await tradesync.accounts.getRiskMetrics('acc_123');

// Get open positions
const positions = await tradesync.accounts.getOpenPositions('acc_123');

// Get trade history
const history = await tradesync.accounts.getTradeHistory('acc_123', {
  symbol: 'EURUSD',
  limit: 100,
});
```

### Trades (2 endpoints)

List and retrieve trade details.

```typescript
// List trades with filters
const trades = await tradesync.trades.list({
  account_id: 'acc_123',
  symbol: 'EURUSD',
  status: 'open',
  start_date: '2024-01-01',
  limit: 50,
});

// Get trade by ID
const trade = await tradesync.trades.get('trade_123');
```

### Copiers (14 endpoints)

Manage copy trading relationships between accounts.

```typescript
// List copiers
const copiers = await tradesync.copiers.list({
  source_account_id: 'master_123',
  status: 'running',
});

// Create copier
const copier = await tradesync.copiers.create({
  name: 'My Copier',
  source_account_id: 'master_123',
  target_account_id: 'follower_456',
  lot_mode: 'multiplier',
  lot_multiplier: 0.5,
  copy_stop_loss: true,
  copy_take_profit: true,
});

// Start/Stop/Pause/Resume copier
await tradesync.copiers.start('copier_123');
await tradesync.copiers.pause('copier_123');
await tradesync.copiers.resume('copier_123');
await tradesync.copiers.stop('copier_123');

// Get copier statistics
const stats = await tradesync.copiers.getStatistics('copier_123');

// Add symbol filter
await tradesync.copiers.addFilter('copier_123', {
  type: 'symbol',
  action: 'include',
  value: 'EURUSD',
});

// Remove filter
await tradesync.copiers.removeFilter('copier_123', 'filter_456');

// Archive copier
await tradesync.copiers.archive('copier_123');
```

### Commands (7 endpoints)

Execute trading commands (open, close, modify positions).

```typescript
// Create open command
const openCmd = await tradesync.commands.createOpen({
  account_id: 'acc_123',
  symbol: 'EURUSD',
  direction: 'buy',
  lots: 0.1,
  stop_loss: 1.0900,
  take_profit: 1.1100,
});

// Create close command
const closeCmd = await tradesync.commands.createClose({
  account_id: 'acc_123',
  trade_id: 'trade_456',
});

// Create modify command
const modifyCmd = await tradesync.commands.createModify({
  account_id: 'acc_123',
  trade_id: 'trade_456',
  stop_loss: 1.0950,
});

// List commands
const commands = await tradesync.commands.list({
  account_id: 'acc_123',
  status: 'completed',
});

// Get command
const cmd = await tradesync.commands.get('cmd_123');

// Get command result
const result = await tradesync.commands.getResult('cmd_123');

// Cancel pending command
await tradesync.commands.cancel('cmd_123');

// Retry failed command
await tradesync.commands.retry('cmd_123');
```

### Equity Monitors (5 endpoints)

Set up equity threshold alerts.

```typescript
// List monitors
const monitors = await tradesync.equityMonitors.list({
  account_id: 'acc_123',
});

// Create monitor
const monitor = await tradesync.equityMonitors.create({
  account_id: 'acc_123',
  name: 'Drawdown Alert',
  type: 'drawdown',
  threshold: 10, // 10% drawdown
  action: 'notify',
});

// Update monitor
await tradesync.equityMonitors.update('monitor_123', {
  threshold: 15,
});

// Delete monitor
await tradesync.equityMonitors.delete('monitor_123');
```

### Analysis (8 endpoints)

Trading performance analytics.

```typescript
// Get performance summary
const performance = await tradesync.analysis.getPerformance({
  account_id: 'acc_123',
  start_date: '2024-01-01',
  end_date: '2024-12-31',
});

// Get symbol performance
const symbolPerf = await tradesync.analysis.getSymbolPerformance({
  account_id: 'acc_123',
  symbol: 'EURUSD',
});

// Get trading patterns
const patterns = await tradesync.analysis.getTradingPatterns({
  account_id: 'acc_123',
});

// Get risk metrics
const risk = await tradesync.analysis.getRiskMetrics({
  account_id: 'acc_123',
});

// Get profit/loss breakdown
const pnl = await tradesync.analysis.getProfitLoss({
  account_id: 'acc_123',
  group_by: 'month',
});

// Get trade distribution
const distribution = await tradesync.analysis.getTradeDistribution({
  account_id: 'acc_123',
});

// Get time-based analysis
const timeAnalysis = await tradesync.analysis.getTimeBasedAnalysis({
  account_id: 'acc_123',
});

// Get correlations
const correlations = await tradesync.analysis.getCorrelations({
  account_id: 'acc_123',
});
```

### Webhooks (5 endpoints)

Manage webhook subscriptions.

```typescript
// List webhooks
const webhooks = await tradesync.webhooks.list();

// Create webhook
const webhook = await tradesync.webhooks.create({
  url: 'https://your-server.com/webhooks/tradesync',
  events: ['account.connected', 'trade.opened', 'trade.closed'],
  secret: 'your_webhook_secret',
});

// Update webhook
await tradesync.webhooks.update('webhook_123', {
  events: ['account.connected', 'account.disconnected'],
});

// Delete webhook
await tradesync.webhooks.delete('webhook_123');
```

### Event APIs (8 endpoints)

Query event history for accounts, trades, copiers, and commands.

```typescript
// Account events
const accountEvents = await tradesync.accountEvents.list({
  account_id: 'acc_123',
  type: 'connected',
});

// Trade events
const tradeEvents = await tradesync.tradeEvents.list({
  trade_id: 'trade_123',
  type: 'closed',
});

// Copier events
const copierEvents = await tradesync.copierEvents.list({
  copier_id: 'copier_123',
});

// Command events
const commandEvents = await tradesync.commandEvents.list({
  command_id: 'cmd_123',
});
```

### Brokers (4 endpoints)

Get broker information.

```typescript
// List brokers
const brokers = await tradesync.brokers.list();

// Get broker
const broker = await tradesync.brokers.get('broker_123');

// Get broker symbols
const symbols = await tradesync.brokers.getSymbols('broker_123');

// Get server status
const status = await tradesync.brokers.getServerStatus('broker_123', 'Demo-Server');
```

## Error Handling

The SDK provides typed error classes for different error scenarios:

```typescript
import {
  TradeSyncError,
  TransientError,
  PermanentError,
  ConfigurationError
} from '@finx/sdk-tradesync';

try {
  await tradesync.accounts.get('nonexistent');
} catch (error) {
  if (error instanceof PermanentError) {
    // Non-retryable errors (400, 401, 403, 404, 422)
    console.error(`Permanent error: ${error.message}`);
    console.error(`Status code: ${error.statusCode}`);
    console.error(`Error code: ${error.code}`);
  } else if (error instanceof TransientError) {
    // Retryable errors (429, 500, 502, 503, 504, timeout)
    console.error(`Transient error: ${error.message}`);
    // SDK will automatically retry these
  } else if (error instanceof ConfigurationError) {
    console.error(`Configuration error: ${error.message}`);
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing API credentials |
| `FORBIDDEN` | Access denied to resource |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request parameters |
| `RATE_LIMITED` | Too many requests |
| `SERVER_ERROR` | Internal server error |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |
| `TIMEOUT` | Request timed out |
| `NETWORK_ERROR` | Network connectivity issue |

## Retry Logic

The SDK includes automatic retry with exponential backoff for transient errors:

```typescript
const tradesync = new TradeSync({
  apiKey: 'your_api_key',
  apiSecret: 'your_api_secret',
  retry: {
    maxRetries: 3,          // Maximum retry attempts
    initialDelayMs: 1000,   // Initial delay (1 second)
    maxDelayMs: 10000,      // Maximum delay (10 seconds)
    backoffMultiplier: 2,   // Exponential backoff multiplier
    jitterFactor: 0.1,      // Add 10% jitter to delays
  },
});
```

### Disabling Retry for Specific Requests

```typescript
// Skip retry for this specific request
const account = await tradesync.accounts.get('acc_123', { skipRetry: true });
```

## Request Cancellation

Use AbortController to cancel requests:

```typescript
const controller = new AbortController();

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const accounts = await tradesync.accounts.list({}, { signal: controller.signal });
} catch (error) {
  if (error.code === 'TIMEOUT') {
    console.log('Request was cancelled');
  }
}
```

## Pagination

List endpoints support cursor-based pagination:

```typescript
// First page
const page1 = await tradesync.trades.list({ limit: 50 });

// Next page using last_id
if (page1.data.length === 50) {
  const lastTrade = page1.data[page1.data.length - 1];
  const page2 = await tradesync.trades.list({
    limit: 50,
    last_id: lastTrade.id,
  });
}

// Or use page-based pagination
const page1 = await tradesync.trades.list({ limit: 50, page: 1 });
const page2 = await tradesync.trades.list({ limit: 50, page: 2 });
```

## TypeScript Support

The SDK is fully typed. All request/response types are exported:

```typescript
import type {
  Account,
  Trade,
  Copier,
  Command,
  EquityMonitor,
  Webhook,
  AccountEvent,
  TradeEvent,
  CopierEvent,
  CommandEvent,
  Broker,
  CreateAccountInput,
  CreateCopierInput,
  OpenCommandInput,
  ListResponse,
} from '@finx/sdk-tradesync';
```

## Direct Client Access

For advanced use cases, access the HTTP client directly:

```typescript
import { TradeSyncClient, createClient } from '@finx/sdk-tradesync';

const client = createClient({
  apiKey: 'your_api_key',
  apiSecret: 'your_api_secret',
});

// Direct HTTP methods
const data = await client.get<CustomType>('/custom/endpoint', { param: 'value' });
const created = await client.post<CustomType>('/custom/endpoint', { body: 'data' });
const updated = await client.patch<CustomType>('/custom/endpoint/123', { field: 'value' });
await client.delete('/custom/endpoint/123');
```

## Testing

### Running Tests

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run specific test file
bun test src/__tests__/accounts.test.ts
```

### Mocking in Tests

```typescript
import { mock } from 'bun:test';
import { AccountsService } from '@finx/sdk-tradesync';

// Create mock client
const mockClient = {
  get: mock(() => Promise.resolve({ id: 'acc_123', name: 'Test' })),
  post: mock(() => Promise.resolve({ id: 'acc_456' })),
  // ... other methods
};

const service = new AccountsService(mockClient as any);
const account = await service.get('acc_123');
```

## API Endpoints Summary

| Category | Endpoints | Description |
|----------|-----------|-------------|
| Accounts | 11 | Account management, balance, statistics |
| Trades | 2 | Trade listing and details |
| Copiers | 14 | Copy trading configuration |
| Commands | 7 | Trade command execution |
| Equity Monitors | 5 | Equity threshold alerts |
| Analysis | 8 | Trading analytics |
| Webhooks | 5 | Webhook management |
| Account Events | 2 | Account event history |
| Trade Events | 2 | Trade event history |
| Copier Events | 2 | Copier event history |
| Command Events | 2 | Command event history |
| Brokers | 4 | Broker information |
| **Total** | **65** | |

## License

MIT
