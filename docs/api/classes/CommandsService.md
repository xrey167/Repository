[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CommandsService

# Class: CommandsService

Defined in: src/services/commands.ts:265

Commands API service

## Constructors

### Constructor

> **new CommandsService**(`client`): `CommandsService`

Defined in: src/services/commands.ts:266

#### Parameters

##### client

[`TradeSyncClient`](TradeSyncClient.md)

#### Returns

`CommandsService`

## Methods

### list()

> **list**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`Command`](../interfaces/Command.md)\>\>

Defined in: src/services/commands.ts:280

List all commands

#### Parameters

##### filters?

[`CommandListFilters`](../interfaces/CommandListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`Command`](../interfaces/Command.md)\>\>

#### Example

```typescript
const response = await sdk.commands.list({
  account_id: 12345,
  group: 'user'
});
console.log(response.data); // Array of commands
```

***

### get()

> **get**(`commandId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

Defined in: src/services/commands.ts:312

Get a single command by ID

#### Parameters

##### commandId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

#### Example

```typescript
const response = await sdk.commands.get(123456);
console.log(response.data.status);
```

***

### createOpen()

> **createOpen**(`input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

Defined in: src/services/commands.ts:334

Create an open trade command

#### Parameters

##### input

[`OpenCommandInput`](../interfaces/OpenCommandInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

#### Example

```typescript
const response = await sdk.commands.createOpen({
  account_id: 12345,
  command: 'open',
  type: 'buy',
  symbol: 'EURUSD',
  lots: 0.1,
  open_price: 1.0850,
  slippage: 10,
  stop_loss: 1.0800,
  take_profit: 1.0950
});
```

***

### createModify()

> **createModify**(`input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

Defined in: src/services/commands.ts:366

Create a modify command (stop loss, take profit, or pending price)

#### Parameters

##### input

[`ModifyCommandInput`](../interfaces/ModifyCommandInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

#### Example

```typescript
// Modify stop loss
const response = await sdk.commands.createModify({
  account_id: 12345,
  command: 'modify_stop_loss',
  by: 'ticket',
  trade_id: 67890,
  modify_price: 1.0750
});

// Modify take profit
const response = await sdk.commands.createModify({
  account_id: 12345,
  command: 'modify_take_profit',
  by: 'ticket',
  trade_id: 67890,
  modify_price: 1.1000
});
```

***

### createClose()

> **createClose**(`input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

Defined in: src/services/commands.ts:397

Create a close command (full or partial)

#### Parameters

##### input

[`CloseCommandInput`](../interfaces/CloseCommandInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

#### Example

```typescript
// Close full position
const response = await sdk.commands.createClose({
  account_id: 12345,
  command: 'close_full',
  by: 'ticket',
  trade_id: 67890
});

// Close partial (50%)
const response = await sdk.commands.createClose({
  account_id: 12345,
  command: 'close_partial',
  by: 'ticket',
  trade_id: 67890,
  percentage: 50
});
```

***

### cancel()

> **cancel**(`commandId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

Defined in: src/services/commands.ts:415

Cancel a working command

Note: Only commands with status 'working' can be cancelled.

#### Parameters

##### commandId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Command`](../interfaces/Command.md)\>\>

#### Example

```typescript
const response = await sdk.commands.cancel(123456);
```
