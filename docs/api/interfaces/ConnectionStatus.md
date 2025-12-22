[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / ConnectionStatus

# Interface: ConnectionStatus

Defined in: src/types.ts:158

Connection status tracking

## Properties

### isConnected

> **isConnected**: `boolean`

Defined in: src/types.ts:160

Whether the client is currently connected (had recent successful request)

***

### lastSuccessfulRequest

> **lastSuccessfulRequest**: `Date` \| `null`

Defined in: src/types.ts:162

Timestamp of last successful request

***

### lastFailedRequest

> **lastFailedRequest**: `Date` \| `null`

Defined in: src/types.ts:164

Timestamp of last failed request

***

### consecutiveFailures

> **consecutiveFailures**: `number`

Defined in: src/types.ts:166

Number of consecutive failures

***

### consecutiveTimeouts

> **consecutiveTimeouts**: `number`

Defined in: src/types.ts:168

Number of consecutive timeouts

***

### lastError

> **lastError**: `string` \| `null`

Defined in: src/types.ts:170

Last error message
