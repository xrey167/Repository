[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / createRetryWrapper

# Function: createRetryWrapper()

> **createRetryWrapper**\<`T`\>(`config`, `operationName`): (`fn`) => `Promise`\<`T`\>

Defined in: src/retry.ts:249

Create a retry wrapper for a specific operation

## Type Parameters

### T

`T`

## Parameters

### config

`Partial`\<[`RetryConfig`](../interfaces/RetryConfig.md)\> = `{}`

### operationName

`string` = `'operation'`

## Returns

> (`fn`): `Promise`\<`T`\>

### Parameters

#### fn

() => `Promise`\<`T`\>

### Returns

`Promise`\<`T`\>
