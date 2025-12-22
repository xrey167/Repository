[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / isMT5ErrorRetryable

# Function: isMT5ErrorRetryable()

> **isMT5ErrorRetryable**(`code`): `boolean`

Defined in: src/errors.ts:569

Check if MT5 error code is retryable

Retryable errors include:
- Requote
- Timeout
- Price changed
- Price off (no quotes)
- Too many requests
- Locked
- Connection issues

## Parameters

### code

`number`

MT5 error code (return code)

## Returns

`boolean`

True if error is retryable
