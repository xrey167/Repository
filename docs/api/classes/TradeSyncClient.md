[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / TradeSyncClient

# Class: TradeSyncClient

Defined in: src/client.ts:94

TradeSync API Client

Provides HTTP methods for interacting with the TradeSync API.
Handles authentication, retries, and error mapping.

## Constructors

### Constructor

> **new TradeSyncClient**(`options`): `TradeSyncClient`

Defined in: src/client.ts:109

Create a new TradeSync client

#### Parameters

##### options

[`TradeSyncClientOptions`](../interfaces/TradeSyncClientOptions.md) = `{}`

Client configuration options

#### Returns

`TradeSyncClient`

## Methods

### get()

> **get**\<`T`\>(`path`, `params?`, `options?`): `Promise`\<`T`\>

Defined in: src/client.ts:295

Make a GET request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

API path

##### params?

`Record`\<`string`, `string` \| `number` \| `boolean` \| `undefined`\>

Query parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

Request options

#### Returns

`Promise`\<`T`\>

***

### post()

> **post**\<`T`\>(`path`, `body?`, `options?`): `Promise`\<`T`\>

Defined in: src/client.ts:310

Make a POST request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

API path

##### body?

`unknown`

Request body

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

Request options

#### Returns

`Promise`\<`T`\>

***

### put()

> **put**\<`T`\>(`path`, `body?`, `options?`): `Promise`\<`T`\>

Defined in: src/client.ts:321

Make a PUT request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

API path

##### body?

`unknown`

Request body

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

Request options

#### Returns

`Promise`\<`T`\>

***

### patch()

> **patch**\<`T`\>(`path`, `body?`, `options?`): `Promise`\<`T`\>

Defined in: src/client.ts:332

Make a PATCH request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

API path

##### body?

`unknown`

Request body

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

Request options

#### Returns

`Promise`\<`T`\>

***

### delete()

> **delete**\<`T`\>(`path`, `options?`): `Promise`\<`T`\>

Defined in: src/client.ts:342

Make a DELETE request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

API path

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

Request options

#### Returns

`Promise`\<`T`\>

***

### getPaginated()

> **getPaginated**\<`T`\>(`path`, `pagination?`, `additionalParams?`, `options?`): `Promise`\<`T`\>

Defined in: src/client.ts:354

Make a paginated GET request

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

API path

##### pagination?

[`PaginationParams`](../interfaces/PaginationParams.md)

Pagination parameters

##### additionalParams?

`Record`\<`string`, `string` \| `number` \| `boolean` \| `undefined`\>

Additional query parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

Request options

#### Returns

`Promise`\<`T`\>

***

### ping()

> **ping**(`options?`): `Promise`\<[`HealthCheckResult`](../interfaces/HealthCheckResult.md)\>

Defined in: src/client.ts:377

Ping the API to check connectivity and authentication

Makes a lightweight request to verify the API is reachable.
Uses /brokers endpoint which is available to all authenticated users.
Does not retry on failure.

#### Parameters

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

Request options (timeout defaults to 5000ms)

#### Returns

`Promise`\<[`HealthCheckResult`](../interfaces/HealthCheckResult.md)\>

Health check result

***

### getConnectionStatus()

> **getConnectionStatus**(): [`ConnectionStatus`](../interfaces/ConnectionStatus.md) \| `null`

Defined in: src/client.ts:409

Get current connection status

#### Returns

[`ConnectionStatus`](../interfaces/ConnectionStatus.md) \| `null`

Connection status or null if tracking is disabled

***

### isConnected()

> **isConnected**(): `boolean`

Defined in: src/client.ts:418

Check if the client is currently connected

#### Returns

`boolean`

true if connected, false otherwise

***

### getRateLimitInfo()

> **getRateLimitInfo**(): [`RateLimitInfo`](../interfaces/RateLimitInfo.md) \| `null`

Defined in: src/client.ts:427

Get rate limit information

#### Returns

[`RateLimitInfo`](../interfaces/RateLimitInfo.md) \| `null`

Rate limit info or null if rate limiting is disabled

***

### getConfig()

> **getConfig**(): `object`

Defined in: src/client.ts:434

Get the current configuration

#### Returns

`object`

##### apiKey

> **apiKey**: `string`

##### apiSecret

> **apiSecret**: `string`

##### baseUrl

> **baseUrl**: `string`

##### timeout

> **timeout**: `number`

##### version

> **version**: `string`
