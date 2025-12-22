[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / SymbolMapperConfig

# Interface: SymbolMapperConfig

Defined in: src/symbol-mapper.ts:84

Symbol mapping configuration

## Properties

### rules

> **rules**: [`SymbolMappingRule`](SymbolMappingRule.md)[]

Defined in: src/symbol-mapper.ts:86

Mapping rules by base symbol category

***

### defaultFallback

> **defaultFallback**: [`FallbackBehavior`](../type-aliases/FallbackBehavior.md)

Defined in: src/symbol-mapper.ts:88

Default fallback behavior

***

### aliases

> **aliases**: `Record`\<`string`, `string`[]\>

Defined in: src/symbol-mapper.ts:90

Known base symbol aliases (different names for same underlying)
