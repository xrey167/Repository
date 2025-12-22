[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / RateLimiter

# Class: RateLimiter

Defined in: src/rate-limiter.ts:32

Rate Limiter

Provides client-side rate limiting with sliding window algorithm.
Also respects server-provided rate limit headers.

## Constructors

### Constructor

> **new RateLimiter**(`config`): `RateLimiter`

Defined in: src/rate-limiter.ts:49

Create a new RateLimiter

#### Parameters

##### config

[`RateLimiterConfig`](../interfaces/RateLimiterConfig.md) = `{}`

Rate limiter configuration

#### Returns

`RateLimiter`

## Methods

### acquire()

> **acquire**(): `Promise`\<`void`\>

Defined in: src/rate-limiter.ts:59

Acquire permission to make a request
Waits if rate limit would be exceeded

#### Returns

`Promise`\<`void`\>

#### Throws

Error if queue is full

***

### recordRateLimitResponse()

> **recordRateLimitResponse**(`retryAfterMs`): `void`

Defined in: src/rate-limiter.ts:128

Record a rate limit response from the server

#### Parameters

##### retryAfterMs

`number`

The Retry-After value in milliseconds

#### Returns

`void`

***

### updateFromHeaders()

> **updateFromHeaders**(`headers`): `void`

Defined in: src/rate-limiter.ts:140

Update rate limit info from response headers

#### Parameters

##### headers

`Headers`

Response headers

#### Returns

`void`

***

### getInfo()

> **getInfo**(): [`RateLimitInfo`](../interfaces/RateLimitInfo.md)

Defined in: src/rate-limiter.ts:180

Get current rate limit info

#### Returns

[`RateLimitInfo`](../interfaces/RateLimitInfo.md)

***

### getPendingCount()

> **getPendingCount**(): `number`

Defined in: src/rate-limiter.ts:192

Get the number of pending requests in the queue

#### Returns

`number`

***

### getCurrentRate()

> **getCurrentRate**(): `number`

Defined in: src/rate-limiter.ts:199

Get current requests per second usage

#### Returns

`number`

***

### isServerRateLimited()

> **isServerRateLimited**(): `boolean`

Defined in: src/rate-limiter.ts:208

Check if currently rate limited by server

#### Returns

`boolean`

***

### reset()

> **reset**(): `void`

Defined in: src/rate-limiter.ts:219

Reset the rate limiter state

#### Returns

`void`
