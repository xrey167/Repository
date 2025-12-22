# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Project: TradeSync SDK

TypeScript SDK for the TradeSync trading API with comprehensive type safety, retry logic, and error handling.

## Build Commands

```bash
# Install dependencies
bun install

# Run development
bun run dev

# Run tests
bun test

# Type check
bun run typecheck

# Build for production
bun run build

# Generate API documentation
bun run docs:generate
```

## Architecture

```
src/
├── index.ts              # Main entry point & exports
├── client.ts             # HTTP client with retry logic
├── config.ts             # Configuration management
├── types.ts              # Shared types & interfaces
├── errors.ts             # Error classes (MT4/MT5 codes)
├── retry.ts              # Retry strategies & backoff
├── rate-limiter.ts       # Rate limiting implementation
├── connection-status.ts  # Connection health tracking
├── symbol-mapper.ts      # Symbol translation (futures/CFD)
├── services/             # API service modules
│   ├── accounts.ts       # Account management
│   ├── trades.ts         # Trade operations
│   ├── copiers.ts        # Copy trading
│   ├── commands.ts       # MT commands
│   ├── events.ts         # Event streaming
│   ├── brokers.ts        # Broker information
│   ├── equity-monitors.ts# Equity monitoring
│   └── webhooks.ts       # Webhook management
└── __tests__/            # Test files
```

## Key Features

- **Full API Coverage**: Accounts, Trades, Copiers, Commands, Events, Brokers
- **MT4/MT5 Error Codes**: Comprehensive error handling with retry logic
- **Rate Limiting**: Built-in rate limiter with backoff
- **Connection Status**: Health check and connection monitoring
- **Symbol Mapping**: Translate between broker symbol formats
- **Type Safety**: Zod schema validation throughout

## Environment Variables

```bash
TRADESYNC_API_KEY=your_api_key
TRADESYNC_API_SECRET=your_api_secret
TRADESYNC_BASE_URL=https://api.tradesync.com/v1  # optional
```

## Development Notes

- Use TypeScript strict mode for all source files
- All API responses validated with Zod schemas
- MT4/MT5 error codes have retry classification
- Rate limiter respects server Retry-After headers
- Keep tests in `src/__tests__/` directory

## Usage Example

```typescript
import { createTradeSync } from 'tradesync-sdk';

const sdk = createTradeSync({
  apiKey: process.env.TRADESYNC_API_KEY!,
  apiSecret: process.env.TRADESYNC_API_SECRET!,
});

// Health check
const health = await sdk.client.ping();

// List accounts
const accounts = await sdk.accounts.list();

// Get trades
const trades = await sdk.trades.list({ state: 'open' });
```
