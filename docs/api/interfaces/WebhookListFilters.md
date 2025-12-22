[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / WebhookListFilters

# Interface: WebhookListFilters

Defined in: src/services/webhooks.ts:117

Webhook list filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### id?

> `optional` **id**: `number`

Defined in: src/services/webhooks.ts:119

Single webhook ID

***

### ids?

> `optional` **ids**: `string`

Defined in: src/services/webhooks.ts:121

Comma-separated webhook IDs

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
