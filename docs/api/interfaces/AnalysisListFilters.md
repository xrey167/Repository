[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / AnalysisListFilters

# Interface: AnalysisListFilters

Defined in: src/services/analysis.ts:114

Analysis list filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### account\_id?

> `optional` **account\_id**: `number`

Defined in: src/services/analysis.ts:116

Single account ID

***

### account\_ids?

> `optional` **account\_ids**: `string`

Defined in: src/services/analysis.ts:118

Comma-separated account IDs

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
