[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / ApiListResponse

# Interface: ApiListResponse\<T\>

Defined in: src/types.ts:42

TradeSync API standard list response wrapper

## Type Parameters

### T

`T`

## Properties

### result

> **result**: `"success"` \| `"error"`

Defined in: src/types.ts:43

***

### status

> **status**: `number`

Defined in: src/types.ts:44

***

### meta

> **meta**: `object`

Defined in: src/types.ts:45

#### count

> **count**: `number`

#### limit

> **limit**: `number`

#### order

> **order**: `"asc"` \| `"desc"`

#### last\_id

> **last\_id**: `number`

***

### data

> **data**: `T`[]

Defined in: src/types.ts:51
