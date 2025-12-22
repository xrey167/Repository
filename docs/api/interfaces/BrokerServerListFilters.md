[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / BrokerServerListFilters

# Interface: BrokerServerListFilters

Defined in: src/services/brokers.ts:87

Broker server list filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### id?

> `optional` **id**: `number`

Defined in: src/services/brokers.ts:89

Single server ID

***

### ids?

> `optional` **ids**: `string`

Defined in: src/services/brokers.ts:91

Comma-separated server IDs

***

### broker\_id?

> `optional` **broker\_id**: `number`

Defined in: src/services/brokers.ts:93

Filter by broker ID

***

### broker\_ids?

> `optional` **broker\_ids**: `string`

Defined in: src/services/brokers.ts:95

Comma-separated broker IDs

***

### application?

> `optional` **application**: [`BrokerApplicationType`](../type-aliases/BrokerApplicationType.md)

Defined in: src/services/brokers.ts:97

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
