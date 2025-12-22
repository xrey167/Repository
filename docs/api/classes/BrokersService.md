[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / BrokersService

# Class: BrokersService

Defined in: src/services/brokers.ts:107

Brokers API service

## Constructors

### Constructor

> **new BrokersService**(`client`): `BrokersService`

Defined in: src/services/brokers.ts:108

#### Parameters

##### client

[`TradeSyncClient`](TradeSyncClient.md)

#### Returns

`BrokersService`

## Methods

### list()

> **list**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`Broker`](../interfaces/Broker.md)\>\>

Defined in: src/services/brokers.ts:122

List all brokers

#### Parameters

##### filters?

[`BrokerListFilters`](../interfaces/BrokerListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`Broker`](../interfaces/Broker.md)\>\>

#### Example

```typescript
// List all brokers
const response = await sdk.brokers.list();

// List MT5 brokers only
const response = await sdk.brokers.list({ application: 'mt5' });
```

***

### get()

> **get**(`brokerId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Broker`](../interfaces/Broker.md)\>\>

Defined in: src/services/brokers.ts:146

Get a single broker by ID

#### Parameters

##### brokerId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Broker`](../interfaces/Broker.md)\>\>

#### Example

```typescript
const response = await sdk.brokers.get(12345);
console.log(response.data.name);
```

***

### listServers()

> **listServers**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`BrokerServer`](../interfaces/BrokerServer.md)\>\>

Defined in: src/services/brokers.ts:165

List all broker servers

#### Parameters

##### filters?

[`BrokerServerListFilters`](../interfaces/BrokerServerListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`BrokerServer`](../interfaces/BrokerServer.md)\>\>

#### Example

```typescript
// List all servers
const response = await sdk.brokers.listServers();

// List servers for specific broker
const response = await sdk.brokers.listServers({ broker_id: 12345 });

// List MT4 servers only
const response = await sdk.brokers.listServers({ application: 'mt4' });
```

***

### getServer()

> **getServer**(`serverId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`BrokerServer`](../interfaces/BrokerServer.md)\>\>

Defined in: src/services/brokers.ts:191

Get a single broker server by ID

#### Parameters

##### serverId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`BrokerServer`](../interfaces/BrokerServer.md)\>\>

#### Example

```typescript
const response = await sdk.brokers.getServer(12345);
console.log(response.data.name);
```
