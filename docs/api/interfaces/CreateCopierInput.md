[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CreateCopierInput

# Interface: CreateCopierInput

Defined in: src/services/copiers.ts:134

Copier creation input

## Properties

### lead\_id

> **lead\_id**: `number`

Defined in: src/services/copiers.ts:136

Lead (source) account ID

***

### follower\_id

> **follower\_id**: `number`

Defined in: src/services/copiers.ts:138

Follower (destination) account ID

***

### risk\_type

> **risk\_type**: [`RiskType`](../type-aliases/RiskType.md)

Defined in: src/services/copiers.ts:140

Risk calculation type

***

### risk\_value

> **risk\_value**: `number`

Defined in: src/services/copiers.ts:142

Risk multiplier/value

***

### copy\_existing?

> `optional` **copy\_existing**: [`YesNo`](../type-aliases/YesNo.md)

Defined in: src/services/copiers.ts:144

Copy existing open trades (default: no)

***

### mode?

> `optional` **mode**: [`CopierMode`](../type-aliases/CopierMode.md)

Defined in: src/services/copiers.ts:146

Copier mode (default: off)

***

### reverse?

> `optional` **reverse**: [`YesNo`](../type-aliases/YesNo.md)

Defined in: src/services/copiers.ts:148

Reverse trade direction (default: no)

***

### use\_alt\_tick\_value?

> `optional` **use\_alt\_tick\_value**: [`YesNo`](../type-aliases/YesNo.md)

Defined in: src/services/copiers.ts:150

Use alternative tick value (default: no)

***

### force\_min?

> `optional` **force\_min**: [`YesNo`](../type-aliases/YesNo.md)

Defined in: src/services/copiers.ts:152

Round up undersized lots (default: no)

***

### max\_lot?

> `optional` **max\_lot**: `number`

Defined in: src/services/copiers.ts:154

Maximum lot size (default: 50)

***

### slippage?

> `optional` **slippage**: `number`

Defined in: src/services/copiers.ts:156

Acceptable price variance in pips (default: 100)

***

### copy\_pending?

> `optional` **copy\_pending**: [`YesNo`](../type-aliases/YesNo.md)

Defined in: src/services/copiers.ts:158

Copy pending orders (default: no)

***

### copy\_sl?

> `optional` **copy\_sl**: [`CopySlTpMode`](../type-aliases/CopySlTpMode.md)

Defined in: src/services/copiers.ts:160

Copy stop loss (default: no)

***

### fixed\_sl?

> `optional` **fixed\_sl**: `number`

Defined in: src/services/copiers.ts:162

Fixed stop loss value

***

### copy\_tp?

> `optional` **copy\_tp**: [`CopySlTpMode`](../type-aliases/CopySlTpMode.md)

Defined in: src/services/copiers.ts:164

Copy take profit (default: no)

***

### fixed\_tp?

> `optional` **fixed\_tp**: `number`

Defined in: src/services/copiers.ts:166

Fixed take profit value

***

### comment?

> `optional` **comment**: `string`

Defined in: src/services/copiers.ts:168

MT comment suffix
