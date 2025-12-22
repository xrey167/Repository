[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / RetryResult

# Interface: RetryResult\<T\>

Defined in: src/retry.ts:44

Result of a retry operation

## Type Parameters

### T

`T`

## Properties

### success

> **success**: `boolean`

Defined in: src/retry.ts:45

***

### result?

> `optional` **result**: `T`

Defined in: src/retry.ts:46

***

### error?

> `optional` **error**: [`TradeSyncError`](../classes/TradeSyncError.md)

Defined in: src/retry.ts:47

***

### attempts

> **attempts**: `number`

Defined in: src/retry.ts:48

***

### totalDelayMs

> **totalDelayMs**: `number`

Defined in: src/retry.ts:49
