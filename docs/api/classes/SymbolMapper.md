[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / SymbolMapper

# Class: SymbolMapper

Defined in: src/symbol-mapper.ts:662

Symbol Mapper for intelligent futures/CFD mapping

## Example

```typescript
const mapper = new SymbolMapper(client);

// Configure mapping rules
mapper.addRule({
  masterPatterns: ['UsaTec', 'USTEC'],
  clientBase: 'US100',
  fallback: 'map_to_perpetual',
});

// Map a symbol
const result = mapper.map('UsaTecDec25', ['US100', 'US100.dec25', 'US100.mar26']);
// result.clientSymbol = 'US100' (perpetual, since configured)

// Or with exact expiry matching
mapper.updateRule('US100', { forcePerpetual: false, clientExpiryFormat: 'lowercase_dot' });
const result2 = mapper.map('UsaTecDec25', ['US100', 'US100.dec25']);
// result2.clientSymbol = 'US100.dec25'
```

## Constructors

### Constructor

> **new SymbolMapper**(`client?`, `config?`): `SymbolMapper`

Defined in: src/symbol-mapper.ts:666

#### Parameters

##### client?

[`TradeSyncClient`](TradeSyncClient.md)

##### config?

`Partial`\<[`SymbolMapperConfig`](../interfaces/SymbolMapperConfig.md)\>

#### Returns

`SymbolMapper`

## Methods

### addRule()

> **addRule**(`rule`): `void`

Defined in: src/symbol-mapper.ts:679

Add a mapping rule

#### Parameters

##### rule

[`SymbolMappingRule`](../interfaces/SymbolMappingRule.md)

#### Returns

`void`

***

### updateRule()

> **updateRule**(`clientBase`, `updates`): `boolean`

Defined in: src/symbol-mapper.ts:705

Update an existing rule by client base

#### Parameters

##### clientBase

`string`

##### updates

`Partial`\<[`SymbolMappingRule`](../interfaces/SymbolMappingRule.md)\>

#### Returns

`boolean`

***

### addAlias()

> **addAlias**(`canonical`, `alias`): `void`

Defined in: src/symbol-mapper.ts:717

Add an alias for a base symbol

#### Parameters

##### canonical

`string`

##### alias

`string`

#### Returns

`void`

***

### map()

> **map**(`masterSymbol`, `availableClientSymbols`): [`MappingResult`](../interfaces/MappingResult.md)

Defined in: src/symbol-mapper.ts:733

Map a master symbol to a client symbol

#### Parameters

##### masterSymbol

`string`

The symbol from master account

##### availableClientSymbols

`string`[]

List of symbols available on client broker

#### Returns

[`MappingResult`](../interfaces/MappingResult.md)

Mapping result

***

### mapBatch()

> **mapBatch**(`masterSymbols`, `availableClientSymbols`): `Map`\<`string`, [`MappingResult`](../interfaces/MappingResult.md)\>

Defined in: src/symbol-mapper.ts:829

Map multiple symbols at once

#### Parameters

##### masterSymbols

`string`[]

##### availableClientSymbols

`string`[]

#### Returns

`Map`\<`string`, [`MappingResult`](../interfaces/MappingResult.md)\>

***

### discoverSymbols()

> **discoverSymbols**(`accountIds`): `Promise`\<[`DiscoveredSymbol`](../interfaces/DiscoveredSymbol.md)[]\>

Defined in: src/symbol-mapper.ts:845

Discover symbols from accounts via TradeSync API

#### Parameters

##### accountIds

`number`[]

#### Returns

`Promise`\<[`DiscoveredSymbol`](../interfaces/DiscoveredSymbol.md)[]\>

***

### suggestMappings()

> **suggestMappings**(`masterSymbols`, `clientSymbols`): `object`[]

Defined in: src/symbol-mapper.ts:880

Generate mapping suggestions based on discovered symbols

#### Parameters

##### masterSymbols

[`DiscoveredSymbol`](../interfaces/DiscoveredSymbol.md)[]

##### clientSymbols

[`DiscoveredSymbol`](../interfaces/DiscoveredSymbol.md)[]

#### Returns

`object`[]

***

### getConfig()

> **getConfig**(): [`SymbolMapperConfig`](../interfaces/SymbolMapperConfig.md)

Defined in: src/symbol-mapper.ts:962

Get current configuration

#### Returns

[`SymbolMapperConfig`](../interfaces/SymbolMapperConfig.md)

***

### exportConfig()

> **exportConfig**(): `string`

Defined in: src/symbol-mapper.ts:969

Export configuration as JSON

#### Returns

`string`

***

### importConfig()

> **importConfig**(`json`): `void`

Defined in: src/symbol-mapper.ts:976

Import configuration from JSON

#### Parameters

##### json

`string`

#### Returns

`void`
