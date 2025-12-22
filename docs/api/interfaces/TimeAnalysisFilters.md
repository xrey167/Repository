[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / TimeAnalysisFilters

# Interface: TimeAnalysisFilters

Defined in: src/services/analysis.ts:124

Time-based analysis filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### start\_date?

> `optional` **start\_date**: `string`

Defined in: src/services/analysis.ts:126

Start date (ISO 8601)

***

### end\_date?

> `optional` **end\_date**: `string`

Defined in: src/services/analysis.ts:128

End date (ISO 8601)

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
