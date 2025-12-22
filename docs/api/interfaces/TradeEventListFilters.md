[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / TradeEventListFilters

# Interface: TradeEventListFilters

Defined in: src/services/events.ts:212

Trade events list filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### id?

> `optional` **id**: `number`

Defined in: src/services/events.ts:214

Single event ID

***

### ids?

> `optional` **ids**: `string`

Defined in: src/services/events.ts:216

Comma-separated event IDs

***

### trade\_id?

> `optional` **trade\_id**: `number`

Defined in: src/services/events.ts:218

Single trade ID

***

### trade\_ids?

> `optional` **trade\_ids**: `string`

Defined in: src/services/events.ts:220

Comma-separated trade IDs

***

### account\_id?

> `optional` **account\_id**: `number`

Defined in: src/services/events.ts:222

Single account ID

***

### account\_ids?

> `optional` **account\_ids**: `string`

Defined in: src/services/events.ts:224

Comma-separated account IDs

***

### created\_at\_start?

> `optional` **created\_at\_start**: `string`

Defined in: src/services/events.ts:226

Events after timestamp (ISO 8601)

***

### created\_at\_end?

> `optional` **created\_at\_end**: `string`

Defined in: src/services/events.ts:228

Events before timestamp (ISO 8601)

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
