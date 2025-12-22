[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / getMT4ErrorMessage

# Function: getMT4ErrorMessage()

> **getMT4ErrorMessage**(`code`): `string`

Defined in: src/errors.ts:486

Get human-readable error message for MT4 error code

## Parameters

### code

`number`

MT4 error code

## Returns

`string`

Human-readable error description

## Example

```ts
getMT4ErrorMessage(134) // "Not enough money"
getMT4ErrorMessage(999) // "Unknown MT4 error: 999"
```
