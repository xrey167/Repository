[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / TradeEvent

# Interface: TradeEvent

Defined in: src/services/events.ts:106

Trade event record

## Properties

### id

> **id**: `number`

Defined in: src/services/events.ts:107

***

### created\_at

> **created\_at**: `string`

Defined in: src/services/events.ts:108

***

### updated\_at

> **updated\_at**: `string`

Defined in: src/services/events.ts:109

***

### trade\_id

> **trade\_id**: `number`

Defined in: src/services/events.ts:110

***

### account\_id

> **account\_id**: `number`

Defined in: src/services/events.ts:111

***

### event

> **event**: [`TradeEventType`](../type-aliases/TradeEventType.md)

Defined in: src/services/events.ts:112

***

### data?

> `optional` **data**: `Record`\<`string`, `unknown`\>

Defined in: src/services/events.ts:113

***

### event\_id

> **event\_id**: `number` \| `null`

Defined in: src/services/events.ts:114

***

### ticket

> **ticket**: `number`

Defined in: src/services/events.ts:115

***

### type

> **type**: `"buy"` \| `"sell"`

Defined in: src/services/events.ts:116

***

### symbol

> **symbol**: `string`

Defined in: src/services/events.ts:117

***

### lots

> **lots**: `number`

Defined in: src/services/events.ts:118

***

### open\_time

> **open\_time**: `string`

Defined in: src/services/events.ts:119

***

### open\_price

> **open\_price**: `number`

Defined in: src/services/events.ts:120

***

### stop\_loss

> **stop\_loss**: `number`

Defined in: src/services/events.ts:121

***

### take\_profit

> **take\_profit**: `number`

Defined in: src/services/events.ts:122

***

### close\_time

> **close\_time**: `string` \| `null`

Defined in: src/services/events.ts:123

***

### close\_price

> **close\_price**: `number`

Defined in: src/services/events.ts:124

***

### commission

> **commission**: `number`

Defined in: src/services/events.ts:125

***

### swap

> **swap**: `number`

Defined in: src/services/events.ts:126

***

### profit

> **profit**: `number`

Defined in: src/services/events.ts:127

***

### balance

> **balance**: `number`

Defined in: src/services/events.ts:128

***

### equity

> **equity**: `number`

Defined in: src/services/events.ts:129

***

### comment

> **comment**: `string`

Defined in: src/services/events.ts:130

***

### magic

> **magic**: `number`

Defined in: src/services/events.ts:131

***

### digits

> **digits**: `number`

Defined in: src/services/events.ts:132

***

### tick\_value

> **tick\_value**: `number`

Defined in: src/services/events.ts:133

***

### tick\_size

> **tick\_size**: `number`

Defined in: src/services/events.ts:134

***

### alt\_tick\_value

> **alt\_tick\_value**: `number`

Defined in: src/services/events.ts:135

***

### profit\_calc\_mode

> **profit\_calc\_mode**: `"forex"` \| `"cfd"` \| `"futures"`

Defined in: src/services/events.ts:136
