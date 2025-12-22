[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / TradeListFilters

# Interface: TradeListFilters

Defined in: src/services/trades.ts:91

Trade list filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### id?

> `optional` **id**: `number`

Defined in: src/services/trades.ts:93

Single trade ID

***

### ids?

> `optional` **ids**: `string`

Defined in: src/services/trades.ts:95

Comma-separated trade IDs

***

### account\_id?

> `optional` **account\_id**: `number`

Defined in: src/services/trades.ts:97

Single account ID

***

### account\_ids?

> `optional` **account\_ids**: `string`

Defined in: src/services/trades.ts:99

Comma-separated account IDs

***

### state?

> `optional` **state**: [`TradeState`](../type-aliases/TradeState.md)

Defined in: src/services/trades.ts:101

Trade state: open or closed

***

### open\_time\_start?

> `optional` **open\_time\_start**: `string`

Defined in: src/services/trades.ts:103

Trades opened after timestamp (ISO 8601)

***

### open\_time\_end?

> `optional` **open\_time\_end**: `string`

Defined in: src/services/trades.ts:105

Trades opened before timestamp (ISO 8601)

***

### close\_time\_start?

> `optional` **close\_time\_start**: `string`

Defined in: src/services/trades.ts:107

Trades closed after timestamp (ISO 8601)

***

### close\_time\_end?

> `optional` **close\_time\_end**: `string`

Defined in: src/services/trades.ts:109

Trades closed before timestamp (ISO 8601)

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
