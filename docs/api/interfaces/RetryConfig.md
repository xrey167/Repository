[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / RetryConfig

# Interface: RetryConfig

Defined in: src/retry.ts:17

Retry configuration

## Properties

### maxRetries

> **maxRetries**: `number`

Defined in: src/retry.ts:19

Maximum number of retry attempts (default: 3)

***

### initialDelayMs

> **initialDelayMs**: `number`

Defined in: src/retry.ts:21

Initial delay in milliseconds before first retry (default: 1000)

***

### maxDelayMs

> **maxDelayMs**: `number`

Defined in: src/retry.ts:23

Maximum delay in milliseconds between retries (default: 10000)

***

### backoffMultiplier

> **backoffMultiplier**: `number`

Defined in: src/retry.ts:25

Multiplier for exponential backoff (default: 2)

***

### jitterFactor?

> `optional` **jitterFactor**: `number`

Defined in: src/retry.ts:27

Optional jitter factor (0-1) to add randomness to delays
