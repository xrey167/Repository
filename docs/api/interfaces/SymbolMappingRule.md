[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / SymbolMappingRule

# Interface: SymbolMappingRule

Defined in: src/symbol-mapper.ts:68

Mapping rule for a base symbol

## Properties

### masterPatterns

> **masterPatterns**: `string`[]

Defined in: src/symbol-mapper.ts:70

Base symbol patterns to match (regex or exact)

***

### clientBase

> **clientBase**: `string`

Defined in: src/symbol-mapper.ts:72

Client base symbol to map to

***

### fallback

> **fallback**: [`FallbackBehavior`](../type-aliases/FallbackBehavior.md)

Defined in: src/symbol-mapper.ts:74

Fallback behavior for this symbol

***

### forcePerpetual?

> `optional` **forcePerpetual**: `boolean`

Defined in: src/symbol-mapper.ts:76

Force perpetual mapping (ignore expiry even if available)

***

### clientExpiryFormat?

> `optional` **clientExpiryFormat**: `"lowercase_dot"` \| `"titlecase"` \| `"uppercase"` \| `"none"`

Defined in: src/symbol-mapper.ts:78

Custom expiry format for client (e.g., '.dec25' vs 'Dec25')
