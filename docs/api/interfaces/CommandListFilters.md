[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CommandListFilters

# Interface: CommandListFilters

Defined in: src/services/commands.ts:195

Command list filters

## Extends

- [`PaginationParams`](PaginationParams.md)

## Properties

### group?

> `optional` **group**: [`CommandGroup`](../type-aliases/CommandGroup.md)

Defined in: src/services/commands.ts:197

Filter by command group

***

### id?

> `optional` **id**: `number`

Defined in: src/services/commands.ts:199

Single command ID

***

### ids?

> `optional` **ids**: `string`

Defined in: src/services/commands.ts:201

Comma-separated command IDs

***

### copier\_id?

> `optional` **copier\_id**: `number`

Defined in: src/services/commands.ts:203

Single copier ID

***

### copier\_ids?

> `optional` **copier\_ids**: `string`

Defined in: src/services/commands.ts:205

Comma-separated copier IDs

***

### lead\_id?

> `optional` **lead\_id**: `number`

Defined in: src/services/commands.ts:207

Single lead ID

***

### lead\_ids?

> `optional` **lead\_ids**: `string`

Defined in: src/services/commands.ts:209

Comma-separated lead IDs

***

### account\_id?

> `optional` **account\_id**: `number`

Defined in: src/services/commands.ts:211

Single account ID

***

### account\_ids?

> `optional` **account\_ids**: `string`

Defined in: src/services/commands.ts:213

Comma-separated account IDs

***

### created\_at\_start?

> `optional` **created\_at\_start**: `string`

Defined in: src/services/commands.ts:215

Commands after timestamp (ISO 8601)

***

### created\_at\_end?

> `optional` **created\_at\_end**: `string`

Defined in: src/services/commands.ts:217

Commands before timestamp (ISO 8601)

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
