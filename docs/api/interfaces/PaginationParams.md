[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / PaginationParams

# Interface: PaginationParams

Defined in: src/types.ts:16

TradeSync API pagination parameters

## Extended by

- [`AccountListFilters`](AccountListFilters.md)
- [`TradeListFilters`](TradeListFilters.md)
- [`CopierListFilters`](CopierListFilters.md)
- [`CommandListFilters`](CommandListFilters.md)
- [`AccountEventListFilters`](AccountEventListFilters.md)
- [`TradeEventListFilters`](TradeEventListFilters.md)
- [`CopierEventListFilters`](CopierEventListFilters.md)
- [`CommandEventListFilters`](CommandEventListFilters.md)
- [`WebhookListFilters`](WebhookListFilters.md)
- [`BrokerListFilters`](BrokerListFilters.md)
- [`BrokerServerListFilters`](BrokerServerListFilters.md)
- [`AnalysisListFilters`](AnalysisListFilters.md)
- [`TimeAnalysisFilters`](TimeAnalysisFilters.md)

## Properties

### limit?

> `optional` **limit**: `number`

Defined in: src/types.ts:18

Maximum number of items to return (default: 1000)

***

### order?

> `optional` **order**: `"asc"` \| `"desc"`

Defined in: src/types.ts:20

Sort order ('asc' or 'desc')

***

### last\_id?

> `optional` **last\_id**: `number`

Defined in: src/types.ts:22

ID to start after (for cursor-based pagination)
