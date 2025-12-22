[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / withRetryResult

# Function: withRetryResult()

> **withRetryResult**\<`T`\>(`fn`, `config`, `operationName`): `Promise`\<[`RetryResult`](../interfaces/RetryResult.md)\<`T`\>\>

Defined in: src/retry.ts:146

Execute a function with retry and return detailed result

Unlike withRetry, this doesn't throw but returns a result object

## Type Parameters

### T

`T`

## Parameters

### fn

() => `Promise`\<`T`\>

### config

`Partial`\<[`RetryConfig`](../interfaces/RetryConfig.md)\> = `{}`

### operationName

`string` = `'operation'`

## Returns

`Promise`\<[`RetryResult`](../interfaces/RetryResult.md)\<`T`\>\>
