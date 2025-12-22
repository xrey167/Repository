[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / getMT5ErrorMessage

# Function: getMT5ErrorMessage()

> **getMT5ErrorMessage**(`code`): `string`

Defined in: src/errors.ts:500

Get human-readable error message for MT5 error code

## Parameters

### code

`number`

MT5 error code (return code)

## Returns

`string`

Human-readable error description

## Example

```ts
getMT5ErrorMessage(10019) // "There is not enough money to complete the request"
getMT5ErrorMessage(99999) // "Unknown MT5 error: 99999"
```
