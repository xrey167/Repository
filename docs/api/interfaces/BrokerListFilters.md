[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / BrokerListFilters

# Interface: BrokerListFilters

Defined in: src/services/brokers.ts:75

Broker list filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### id?

> `optional` **id**: `number`

Defined in: src/services/brokers.ts:77

Single broker ID

***

### ids?

> `optional` **ids**: `string`

Defined in: src/services/brokers.ts:79

Comma-separated broker IDs

***

### application?

> `optional` **application**: [`BrokerApplicationType`](../type-aliases/BrokerApplicationType.md)

Defined in: src/services/brokers.ts:81

Filter by platform: mt4 or mt5

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
