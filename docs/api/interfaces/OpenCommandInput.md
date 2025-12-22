[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / OpenCommandInput

# Interface: OpenCommandInput

Defined in: src/services/commands.ts:127

Open trade command input

## Properties

### account\_id

> **account\_id**: `number`

Defined in: src/services/commands.ts:129

Target account ID

***

### command

> **command**: `"open"`

Defined in: src/services/commands.ts:131

Command type: open

***

### type

> **type**: `TradeType`

Defined in: src/services/commands.ts:133

Trade direction: buy or sell

***

### symbol

> **symbol**: `string`

Defined in: src/services/commands.ts:135

Broker symbol

***

### lots

> **lots**: `number`

Defined in: src/services/commands.ts:137

Trade volume in lots

***

### open\_price

> **open\_price**: `number`

Defined in: src/services/commands.ts:139

Entry price

***

### slippage

> **slippage**: `number`

Defined in: src/services/commands.ts:141

Acceptable price variance in pips

***

### stop\_loss?

> `optional` **stop\_loss**: `number`

Defined in: src/services/commands.ts:143

Stop loss price

***

### take\_profit?

> `optional` **take\_profit**: `number`

Defined in: src/services/commands.ts:145

Take profit price

***

### magic?

> `optional` **magic**: `number`

Defined in: src/services/commands.ts:147

Magic number

***

### comment?

> `optional` **comment**: `string`

Defined in: src/services/commands.ts:149

Trade comment
