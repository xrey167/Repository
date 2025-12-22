[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / TradeSyncClientOptions

# Interface: TradeSyncClientOptions

Defined in: src/client.ts:69

Client configuration options

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: src/client.ts:71

API key (defaults to env TRADESYNC_API_KEY)

***

### apiSecret?

> `optional` **apiSecret**: `string`

Defined in: src/client.ts:73

API secret (defaults to env TRADESYNC_API_SECRET)

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: src/client.ts:75

Base URL (defaults to env or https://api.tradesync.com)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: src/client.ts:77

Request timeout in ms (defaults to 30000)

***

### version?

> `optional` **version**: `string`

Defined in: src/client.ts:79

API version (defaults to v1)

***

### retry?

> `optional` **retry**: `Partial`\<[`RetryConfig`](RetryConfig.md)\>

Defined in: src/client.ts:81

Retry configuration

***

### rateLimiter?

> `optional` **rateLimiter**: [`RateLimiter`](../classes/RateLimiter.md)

Defined in: src/client.ts:83

Rate limiter instance (optional, for client-side throttling)

***

### trackConnectionStatus?

> `optional` **trackConnectionStatus**: `boolean`

Defined in: src/client.ts:85

Enable connection status tracking (default: true)
