[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / TradesService

# Class: TradesService

Defined in: src/services/trades.ts:119

Trades API service

## Constructors

### Constructor

> **new TradesService**(`client`): `TradesService`

Defined in: src/services/trades.ts:120

#### Parameters

##### client

[`TradeSyncClient`](TradeSyncClient.md)

#### Returns

`TradesService`

## Methods

### list()

> **list**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`Trade`](../interfaces/Trade.md)\>\>

Defined in: src/services/trades.ts:137

List trades with optional filters

#### Parameters

##### filters?

[`TradeListFilters`](../interfaces/TradeListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`Trade`](../interfaces/Trade.md)\>\>

#### Example

```typescript
// List all open trades
const response = await sdk.trades.list({ state: 'open' });

// List trades for specific account
const accountTrades = await sdk.trades.list({
  account_id: 12345,
  open_time_start: '2024-01-01T00:00:00Z'
});
```

***

### get()

> **get**(`tradeId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Trade`](../interfaces/Trade.md)\>\>

Defined in: src/services/trades.ts:169

Get a single trade by ID

Note: The `magic` field = 0 for master trades, otherwise contains master's trade_id for copied trades.

#### Parameters

##### tradeId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Trade`](../interfaces/Trade.md)\>\>

#### Example

```typescript
const response = await sdk.trades.get(123456);
console.log(response.data.profit);
```
