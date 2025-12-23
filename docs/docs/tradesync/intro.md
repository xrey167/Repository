---
sidebar_position: 1
---

# TradeSync SDK

TypeScript SDK for the TradeSync trading API with comprehensive type safety, retry logic, and error handling.

## Features

- **Full API Coverage**: Accounts, Trades, Copiers, Commands, Events, Brokers
- **MT4/MT5 Error Codes**: Comprehensive error handling with intelligent retry logic
- **Rate Limiting**: Built-in rate limiter with exponential backoff
- **Connection Status**: Health check and connection monitoring
- **Symbol Mapping**: Translate between broker symbol formats (futures/CFD)
- **Type Safety**: Zod schema validation throughout

## Installation

```bash
bun add @xrey167/sdk-tradesync
```

Or install from GitHub:

```bash
bun add github:xrey167/sdk-tradesync
```

## Quick Start

```typescript
import { createTradeSync } from '@xrey167/sdk-tradesync';

const sdk = createTradeSync({
  apiKey: process.env.TRADESYNC_API_KEY!,
  apiSecret: process.env.TRADESYNC_API_SECRET!,
});

// Health check
const health = await sdk.client.ping();
console.log(`API healthy: ${health.success}`);

// List accounts
const accounts = await sdk.accounts.list();
console.log(`Found ${accounts.data.length} accounts`);

// Get open trades
const trades = await sdk.trades.list({ state: 'open' });
console.log(`${trades.data.length} open trades`);
```

## API Services

| Service | Description |
|---------|-------------|
| `accounts` | Manage trading accounts |
| `trades` | Trade operations and history |
| `copiers` | Copy trading configuration |
| `commands` | Send MT4/MT5 commands |
| `events` | Event streaming and history |
| `brokers` | Broker information |
| `equityMonitors` | Equity monitoring alerts |
| `webhooks` | Webhook management |

## Error Handling

The SDK includes comprehensive MT4/MT5 error code handling:

```typescript
import {
  isMT4ErrorRetryable,
  isMT5ErrorRetryable,
  MT4_ERROR_CODES
} from '@xrey167/sdk-tradesync';

try {
  await sdk.commands.openTrade(params);
} catch (error) {
  if (error.mt4ErrorCode && isMT4ErrorRetryable(error.mt4ErrorCode)) {
    // Safe to retry
  }
}
```

## Configuration Options

```typescript
const sdk = createTradeSync({
  apiKey: 'your-key',
  apiSecret: 'your-secret',
  baseUrl: 'https://api.tradesync.com/v1', // optional
  timeout: 30000, // optional, default 30s
  retryConfig: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
  },
});
```


## Source Code

The SDK source code is available in the tradesync/ directory of this repository.
