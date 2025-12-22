[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / ConnectionStatusManager

# Class: ConnectionStatusManager

Defined in: src/connection-status.ts:30

Connection Status Manager

Tracks API connection health and provides status information.

## Constructors

### Constructor

> **new ConnectionStatusManager**(`staleTimeoutMs`): `ConnectionStatusManager`

Defined in: src/connection-status.ts:45

Create a new ConnectionStatusManager

#### Parameters

##### staleTimeoutMs

`number` = `DEFAULT_STALE_TIMEOUT_MS`

Time in ms after which a connection is considered stale

#### Returns

`ConnectionStatusManager`

## Methods

### recordSuccess()

> **recordSuccess**(): `void`

Defined in: src/connection-status.ts:52

Record a successful request

#### Returns

`void`

***

### recordFailure()

> **recordFailure**(`error`): `void`

Defined in: src/connection-status.ts:72

Record a failed request

#### Parameters

##### error

`Error`

The error that occurred

#### Returns

`void`

***

### recordTimeout()

> **recordTimeout**(): `void`

Defined in: src/connection-status.ts:89

Record a timeout

#### Returns

`void`

***

### getStatus()

> **getStatus**(): [`ConnectionStatus`](../interfaces/ConnectionStatus.md)

Defined in: src/connection-status.ts:107

Get current connection status

#### Returns

[`ConnectionStatus`](../interfaces/ConnectionStatus.md)

***

### isConnected()

> **isConnected**(): `boolean`

Defined in: src/connection-status.ts:121

Check if currently connected (had recent successful request)

#### Returns

`boolean`

***

### isHealthy()

> **isHealthy**(): `boolean`

Defined in: src/connection-status.ts:143

Check if connection is healthy (connected with no recent errors)

#### Returns

`boolean`

***

### getTimeSinceLastSuccess()

> **getTimeSinceLastSuccess**(): `number` \| `null`

Defined in: src/connection-status.ts:150

Get time since last successful request in milliseconds

#### Returns

`number` \| `null`

***

### reset()

> **reset**(): `void`

Defined in: src/connection-status.ts:160

Reset all counters and status

#### Returns

`void`

***

### addListener()

> **addListener**(`listener`): `void`

Defined in: src/connection-status.ts:172

Add a listener for connection status changes

#### Parameters

##### listener

[`ConnectionStatusListener`](../type-aliases/ConnectionStatusListener.md)

#### Returns

`void`

***

### removeListener()

> **removeListener**(`listener`): `void`

Defined in: src/connection-status.ts:179

Remove a listener

#### Parameters

##### listener

[`ConnectionStatusListener`](../type-aliases/ConnectionStatusListener.md)

#### Returns

`void`
