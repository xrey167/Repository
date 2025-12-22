[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / Command

# Interface: Command

Defined in: src/services/commands.ts:79

Command record from TradeSync API

## Properties

### id

> **id**: `number`

Defined in: src/services/commands.ts:80

***

### created\_at

> **created\_at**: `string`

Defined in: src/services/commands.ts:81

***

### updated\_at

> **updated\_at**: `string`

Defined in: src/services/commands.ts:82

***

### account\_id

> **account\_id**: `number`

Defined in: src/services/commands.ts:83

***

### application

> **application**: `"mt4"` \| `"mt5"`

Defined in: src/services/commands.ts:84

***

### group

> **group**: [`CommandGroup`](../type-aliases/CommandGroup.md)

Defined in: src/services/commands.ts:85

***

### event

> **event**: `string`

Defined in: src/services/commands.ts:86

***

### command

> **command**: [`CommandType`](../type-aliases/CommandType.md)

Defined in: src/services/commands.ts:87

***

### status

> **status**: [`CommandStatus`](../type-aliases/CommandStatus.md)

Defined in: src/services/commands.ts:88

***

### result?

> `optional` **result**: [`CommandResult`](../type-aliases/CommandResult.md)

Defined in: src/services/commands.ts:89

***

### retry\_rate?

> `optional` **retry\_rate**: `number`

Defined in: src/services/commands.ts:90

***

### copier\_id?

> `optional` **copier\_id**: `number`

Defined in: src/services/commands.ts:91

***

### lead\_id?

> `optional` **lead\_id**: `number`

Defined in: src/services/commands.ts:92

***

### trade\_id?

> `optional` **trade\_id**: `number`

Defined in: src/services/commands.ts:93

***

### command\_duration?

> `optional` **command\_duration**: `number`

Defined in: src/services/commands.ts:94

***

### broker\_duration?

> `optional` **broker\_duration**: `number`

Defined in: src/services/commands.ts:95

***

### total\_duration?

> `optional` **total\_duration**: `number`

Defined in: src/services/commands.ts:96
