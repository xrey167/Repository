[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / MappingResult

# Interface: MappingResult

Defined in: src/symbol-mapper.ts:96

Result of a symbol mapping operation

## Properties

### success

> **success**: `boolean`

Defined in: src/symbol-mapper.ts:98

Whether mapping was successful

***

### masterSymbol

> **masterSymbol**: `string`

Defined in: src/symbol-mapper.ts:100

Original master symbol

***

### clientSymbol?

> `optional` **clientSymbol**: `string`

Defined in: src/symbol-mapper.ts:102

Mapped client symbol (if successful)

***

### appliedRule?

> `optional` **appliedRule**: [`SymbolMappingRule`](SymbolMappingRule.md)

Defined in: src/symbol-mapper.ts:104

Rule that was applied

***

### usedFallback

> **usedFallback**: `boolean`

Defined in: src/symbol-mapper.ts:106

Fallback was used

***

### warning?

> `optional` **warning**: `string`

Defined in: src/symbol-mapper.ts:108

Warning message if any

***

### error?

> `optional` **error**: `string`

Defined in: src/symbol-mapper.ts:110

Error message if failed
