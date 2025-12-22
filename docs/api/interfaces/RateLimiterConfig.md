[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / RateLimiterConfig

# Interface: RateLimiterConfig

Defined in: src/types.ts:190

Rate limiter configuration

## Properties

### requestsPerSecond?

> `optional` **requestsPerSecond**: `number`

Defined in: src/types.ts:192

Maximum requests per second (client-side throttling)

***

### respectServerLimits?

> `optional` **respectServerLimits**: `boolean`

Defined in: src/types.ts:194

Whether to respect server-provided Retry-After headers

***

### maxQueueSize?

> `optional` **maxQueueSize**: `number`

Defined in: src/types.ts:196

Maximum queue size for pending requests
