[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CommandEventListFilters

# Interface: CommandEventListFilters

Defined in: src/services/events.ts:256

Command events list filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### id?

> `optional` **id**: `number`

Defined in: src/services/events.ts:258

Single event ID

***

### ids?

> `optional` **ids**: `string`

Defined in: src/services/events.ts:260

Comma-separated event IDs

***

### command\_id?

> `optional` **command\_id**: `number`

Defined in: src/services/events.ts:262

Single command ID

***

### command\_ids?

> `optional` **command\_ids**: `string`

Defined in: src/services/events.ts:264

Comma-separated command IDs

***

### copier\_id?

> `optional` **copier\_id**: `number`

Defined in: src/services/events.ts:266

Single copier ID

***

### copier\_ids?

> `optional` **copier\_ids**: `string`

Defined in: src/services/events.ts:268

Comma-separated copier IDs

***

### account\_id?

> `optional` **account\_id**: `number`

Defined in: src/services/events.ts:270

Single account ID

***

### account\_ids?

> `optional` **account\_ids**: `string`

Defined in: src/services/events.ts:272

Comma-separated account IDs

***

### created\_at\_start?

> `optional` **created\_at\_start**: `string`

Defined in: src/services/events.ts:274

Events after timestamp (ISO 8601)

***

### created\_at\_end?

> `optional` **created\_at\_end**: `string`

Defined in: src/services/events.ts:276

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
