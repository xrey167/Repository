[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / UpdateCopierInput

# Interface: UpdateCopierInput

Defined in: src/services/copiers.ts:174

Copier update input

## Properties

### mode?

> `optional` **mode**: [`CopierMode`](../type-aliases/CopierMode.md)

Defined in: src/services/copiers.ts:176

Copier mode

***

### reverse?

> `optional` **reverse**: [`YesNo`](../type-aliases/YesNo.md)

Defined in: src/services/copiers.ts:178

Reverse trade direction

***

### use\_alt\_tick\_value?

> `optional` **use\_alt\_tick\_value**: [`YesNo`](../type-aliases/YesNo.md)

Defined in: src/services/copiers.ts:180

Use alternative tick value

***

### risk\_type?

> `optional` **risk\_type**: [`RiskType`](../type-aliases/RiskType.md)

Defined in: src/services/copiers.ts:182

Risk calculation type

***

### risk\_value?

> `optional` **risk\_value**: `number`

Defined in: src/services/copiers.ts:184

Risk multiplier/value

***

### force\_min?

> `optional` **force\_min**: [`YesNo`](../type-aliases/YesNo.md)

Defined in: src/services/copiers.ts:186

Round up undersized lots

***

### max\_lot?

> `optional` **max\_lot**: `number`

Defined in: src/services/copiers.ts:188

Maximum lot size

***

### slippage?

> `optional` **slippage**: `number`

Defined in: src/services/copiers.ts:190

Acceptable price variance in pips

***

### copy\_pending?

> `optional` **copy\_pending**: [`YesNo`](../type-aliases/YesNo.md)

Defined in: src/services/copiers.ts:192

Copy pending orders

***

### copy\_sl?

> `optional` **copy\_sl**: [`CopySlTpMode`](../type-aliases/CopySlTpMode.md)

Defined in: src/services/copiers.ts:194

Copy stop loss

***

### fixed\_sl?

> `optional` **fixed\_sl**: `number`

Defined in: src/services/copiers.ts:196

Fixed stop loss value

***

### copy\_tp?

> `optional` **copy\_tp**: [`CopySlTpMode`](../type-aliases/CopySlTpMode.md)

Defined in: src/services/copiers.ts:198

Copy take profit

***

### fixed\_tp?

> `optional` **fixed\_tp**: `number`

Defined in: src/services/copiers.ts:200

Fixed take profit value

***

### comment?

> `optional` **comment**: `string`

Defined in: src/services/copiers.ts:202

MT comment suffix
