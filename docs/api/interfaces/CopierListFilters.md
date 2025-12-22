[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CopierListFilters

# Interface: CopierListFilters

Defined in: src/services/copiers.ts:226

Copier list filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### id?

> `optional` **id**: `number`

Defined in: src/services/copiers.ts:228

Single copier ID

***

### ids?

> `optional` **ids**: `string`

Defined in: src/services/copiers.ts:230

Comma-separated copier IDs

***

### lead\_id?

> `optional` **lead\_id**: `number`

Defined in: src/services/copiers.ts:232

Single lead account ID

***

### lead\_ids?

> `optional` **lead\_ids**: `string`

Defined in: src/services/copiers.ts:234

Comma-separated lead account IDs

***

### follower\_id?

> `optional` **follower\_id**: `number`

Defined in: src/services/copiers.ts:236

Single follower account ID

***

### follower\_ids?

> `optional` **follower\_ids**: `string`

Defined in: src/services/copiers.ts:238

Comma-separated follower account IDs

***

### limit?

> `optional` **limit**: `number`

Defined in: src/types.ts:18

Maximum number of items to return (default: 1000)

#### Inherited from

[`PaginationParams`](PaginationParams.md).[`limit`](PaginationParams.md#limit)

***

### order?

> `optional` **order**: `"asc"` \| `"desc"`

Defined in: src/types.ts:20

Sort order ('asc' or 'desc')

#### Inherited from

[`PaginationParams`](PaginationParams.md).[`order`](PaginationParams.md#order)

***

### last\_id?

> `optional` **last\_id**: `number`

Defined in: src/types.ts:22

ID to start after (for cursor-based pagination)

#### Inherited from

[`PaginationParams`](PaginationParams.md).[`last_id`](PaginationParams.md#last_id)
