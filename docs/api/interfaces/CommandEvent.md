[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CommandEvent

# Interface: CommandEvent

Defined in: src/services/events.ts:155

Command event record

## Properties

### id

> **id**: `number`

Defined in: src/services/events.ts:156

***

### created\_at

> **created\_at**: `string`

Defined in: src/services/events.ts:157

***

### updated\_at

> **updated\_at**: `string`

Defined in: src/services/events.ts:158

***

### command\_id

> **command\_id**: `number`

Defined in: src/services/events.ts:159

***

### copier\_id?

> `optional` **copier\_id**: `number`

Defined in: src/services/events.ts:160

***

### account\_id?

> `optional` **account\_id**: `number`

Defined in: src/services/events.ts:161

***

### event

> **event**: [`CommandEventType`](../type-aliases/CommandEventType.md)

Defined in: src/services/events.ts:162

***

### data?

> `optional` **data**: `Record`\<`string`, `unknown`\>

Defined in: src/services/events.ts:163
