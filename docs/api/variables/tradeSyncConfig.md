[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / tradeSyncConfig

# Variable: tradeSyncConfig

> `const` **tradeSyncConfig**: `object`

Defined in: src/config.ts:88

TradeSync configuration with lazy environment variable getters

Environment variables are only read when accessed, allowing for
flexible configuration in different environments.

## Type Declaration

### apiKey

#### Get Signature

> **get** **apiKey**(): `string`

TradeSync API key (required)

##### Returns

`string`

### apiSecret

#### Get Signature

> **get** **apiSecret**(): `string`

TradeSync API secret (required)

##### Returns

`string`

### baseUrl

#### Get Signature

> **get** **baseUrl**(): `string`

TradeSync API base URL

##### Returns

`string`

### timeout

#### Get Signature

> **get** **timeout**(): `number`

Request timeout in milliseconds

##### Returns

`number`

### version

#### Get Signature

> **get** **version**(): `string`

API version (empty string = no version prefix)

##### Returns

`string`
