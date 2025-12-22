[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / RateLimitInfo

# Interface: RateLimitInfo

Defined in: src/types.ts:176

Rate limit information from API headers

## Properties

### remaining

> **remaining**: `number` \| `null`

Defined in: src/types.ts:178

Remaining requests in current window

***

### limit

> **limit**: `number` \| `null`

Defined in: src/types.ts:180

Total limit for current window

***

### resetAt

> **resetAt**: `Date` \| `null`

Defined in: src/types.ts:182

When the rate limit resets

***

### retryAfterMs

> **retryAfterMs**: `number` \| `null`

Defined in: src/types.ts:184

Retry-After value in milliseconds (from 429 response)
