[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / ApiResponse

# Interface: ApiResponse\<T\>

Defined in: src/types.ts:123

Generic API response (used internally by client)

## Type Parameters

### T

`T`

## Properties

### result

> **result**: `"success"` \| `"error"`

Defined in: src/types.ts:124

***

### status

> **status**: `number`

Defined in: src/types.ts:125

***

### message?

> `optional` **message**: `string`

Defined in: src/types.ts:126

***

### errors?

> `optional` **errors**: `Record`\<`string`, `string`[]\>

Defined in: src/types.ts:127

***

### meta?

> `optional` **meta**: `object`

Defined in: src/types.ts:128

#### count

> **count**: `number`

#### limit

> **limit**: `number`

#### order

> **order**: `"asc"` \| `"desc"`

#### last\_id

> **last\_id**: `number`

***

### data?

> `optional` **data**: `T`

Defined in: src/types.ts:134
