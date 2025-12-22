[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / EventsService

# Class: EventsService

Defined in: src/services/events.ts:286

Events API service

## Constructors

### Constructor

> **new EventsService**(`client`): `EventsService`

Defined in: src/services/events.ts:287

#### Parameters

##### client

[`TradeSyncClient`](TradeSyncClient.md)

#### Returns

`EventsService`

## Methods

### listAccountEvents()

> **listAccountEvents**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`AccountEvent`](../interfaces/AccountEvent.md)\>\>

Defined in: src/services/events.ts:304

List account events

#### Parameters

##### filters?

[`AccountEventListFilters`](../interfaces/AccountEventListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`AccountEvent`](../interfaces/AccountEvent.md)\>\>

#### Example

```typescript
const response = await sdk.events.listAccountEvents({
  account_id: 12345
});
console.log(response.data); // Array of account events
```

***

### getAccountEvent()

> **getAccountEvent**(`eventId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`AccountEvent`](../interfaces/AccountEvent.md)\>\>

Defined in: src/services/events.ts:331

Get a single account event by ID

#### Parameters

##### eventId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`AccountEvent`](../interfaces/AccountEvent.md)\>\>

#### Example

```typescript
const response = await sdk.events.getAccountEvent(123456);
console.log(response.data.event);
```

***

### listTradeEvents()

> **listTradeEvents**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`TradeEvent`](../interfaces/TradeEvent.md)\>\>

Defined in: src/services/events.ts:357

List trade events

#### Parameters

##### filters?

[`TradeEventListFilters`](../interfaces/TradeEventListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`TradeEvent`](../interfaces/TradeEvent.md)\>\>

#### Example

```typescript
const response = await sdk.events.listTradeEvents({
  trade_id: 12345
});
console.log(response.data); // Array of trade events
```

***

### getTradeEvent()

> **getTradeEvent**(`eventId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`TradeEvent`](../interfaces/TradeEvent.md)\>\>

Defined in: src/services/events.ts:386

Get a single trade event by ID

#### Parameters

##### eventId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`TradeEvent`](../interfaces/TradeEvent.md)\>\>

#### Example

```typescript
const response = await sdk.events.getTradeEvent(123456);
console.log(response.data.event);
```

***

### listCopierEvents()

> **listCopierEvents**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`CopierEvent`](../interfaces/CopierEvent.md)\>\>

Defined in: src/services/events.ts:412

List copier events

#### Parameters

##### filters?

[`CopierEventListFilters`](../interfaces/CopierEventListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`CopierEvent`](../interfaces/CopierEvent.md)\>\>

#### Example

```typescript
const response = await sdk.events.listCopierEvents({
  copier_id: 12345
});
console.log(response.data); // Array of copier events
```

***

### getCopierEvent()

> **getCopierEvent**(`eventId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`CopierEvent`](../interfaces/CopierEvent.md)\>\>

Defined in: src/services/events.ts:441

Get a single copier event by ID

#### Parameters

##### eventId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`CopierEvent`](../interfaces/CopierEvent.md)\>\>

#### Example

```typescript
const response = await sdk.events.getCopierEvent(123456);
console.log(response.data.event);
```

***

### listCommandEvents()

> **listCommandEvents**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`CommandEvent`](../interfaces/CommandEvent.md)\>\>

Defined in: src/services/events.ts:467

List command events

#### Parameters

##### filters?

[`CommandEventListFilters`](../interfaces/CommandEventListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`CommandEvent`](../interfaces/CommandEvent.md)\>\>

#### Example

```typescript
const response = await sdk.events.listCommandEvents({
  command_id: 12345
});
console.log(response.data); // Array of command events
```

***

### getCommandEvent()

> **getCommandEvent**(`eventId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`CommandEvent`](../interfaces/CommandEvent.md)\>\>

Defined in: src/services/events.ts:498

Get a single command event by ID

#### Parameters

##### eventId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`CommandEvent`](../interfaces/CommandEvent.md)\>\>

#### Example

```typescript
const response = await sdk.events.getCommandEvent(123456);
console.log(response.data.event);
```
