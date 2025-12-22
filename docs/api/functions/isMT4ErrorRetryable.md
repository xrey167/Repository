[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / isMT4ErrorRetryable

# Function: isMT4ErrorRetryable()

> **isMT4ErrorRetryable**(`code`): `boolean`

Defined in: src/errors.ts:550

Check if MT4 error code is retryable

Retryable errors include:
- Server busy
- No connection
- Too frequent requests
- Trade timeout
- Price changed
- Broker busy
- Requote
- Off quotes
- Trade context busy

## Parameters

### code

`number`

MT4 error code

## Returns

`boolean`

True if error is retryable
