[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / withRetry

# Function: withRetry()

> **withRetry**\<`T`\>(`fn`, `config`, `operationName`): `Promise`\<`T`\>

Defined in: src/retry.ts:61

Execute a function with exponential backoff retry

## Type Parameters

### T

`T`

## Parameters

### fn

() => `Promise`\<`T`\>

Async function to execute

### config

`Partial`\<[`RetryConfig`](../interfaces/RetryConfig.md)\> = `{}`

Retry configuration

### operationName

`string` = `'operation'`

Name of the operation (for logging)

## Returns

`Promise`\<`T`\>

Result of the function

## Throws

TradeSyncError if all retries exhausted or non-retryable error
