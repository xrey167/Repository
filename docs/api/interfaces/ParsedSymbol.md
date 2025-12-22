[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / ParsedSymbol

# Interface: ParsedSymbol

Defined in: src/symbol-mapper.ts:33

Parsed symbol with normalized components

## Properties

### original

> **original**: `string`

Defined in: src/symbol-mapper.ts:35

Original symbol string

***

### base

> **base**: `string`

Defined in: src/symbol-mapper.ts:37

Normalized base symbol (e.g., 'USTEC', 'US100', 'NAS100')

***

### expiry?

> `optional` **expiry**: [`SymbolExpiry`](SymbolExpiry.md)

Defined in: src/symbol-mapper.ts:39

Expiry info if present

***

### isPerpetual

> **isPerpetual**: `boolean`

Defined in: src/symbol-mapper.ts:41

Whether this is a perpetual/CFD (no expiry)

***

### style

> **style**: [`SymbolStyle`](../type-aliases/SymbolStyle.md)

Defined in: src/symbol-mapper.ts:43

Detected broker naming style
