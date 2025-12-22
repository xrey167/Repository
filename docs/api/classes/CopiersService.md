[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CopiersService

# Class: CopiersService

Defined in: src/services/copiers.ts:314

Copiers API service

## Constructors

### Constructor

> **new CopiersService**(`client`): `CopiersService`

Defined in: src/services/copiers.ts:315

#### Parameters

##### client

[`TradeSyncClient`](TradeSyncClient.md)

#### Returns

`CopiersService`

## Methods

### list()

> **list**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`Copier`](../interfaces/Copier.md)\>\>

Defined in: src/services/copiers.ts:326

List all copiers

#### Parameters

##### filters?

[`CopierListFilters`](../interfaces/CopierListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`Copier`](../interfaces/Copier.md)\>\>

#### Example

```typescript
const response = await sdk.copiers.list();
console.log(response.data); // Array of copiers
```

***

### get()

> **get**(`copierId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Copier`](../interfaces/Copier.md)\>\>

Defined in: src/services/copiers.ts:353

Get a single copier by ID

#### Parameters

##### copierId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Copier`](../interfaces/Copier.md)\>\>

#### Example

```typescript
const response = await sdk.copiers.get(12345);
console.log(response.data.mode);
```

***

### create()

> **create**(`input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Copier`](../interfaces/Copier.md)\>\>

Defined in: src/services/copiers.ts:373

Create a new copier

#### Parameters

##### input

[`CreateCopierInput`](../interfaces/CreateCopierInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Copier`](../interfaces/Copier.md)\>\>

#### Example

```typescript
const response = await sdk.copiers.create({
  lead_id: 12345,
  follower_id: 67890,
  risk_type: 'lot_multiplier',
  risk_value: 1.0,
  mode: 'on',
  copy_sl: 'yes',
  copy_tp: 'yes'
});
```

***

### update()

> **update**(`copierId`, `input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Copier`](../interfaces/Copier.md)\>\>

Defined in: src/services/copiers.ts:392

Update a copier

#### Parameters

##### copierId

`number`

##### input

[`UpdateCopierInput`](../interfaces/UpdateCopierInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Copier`](../interfaces/Copier.md)\>\>

#### Example

```typescript
const response = await sdk.copiers.update(12345, {
  mode: 'off',
  max_lot: 5.0
});
```

***

### delete()

> **delete**(`copierId`, `options?`): `Promise`\<`void`\>

Defined in: src/services/copiers.ts:409

Delete a copier

#### Parameters

##### copierId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await sdk.copiers.delete(12345);
```

***

### listDisabledSymbols()

> **listDisabledSymbols**(`copierId`, `filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`DisabledSymbol`](../interfaces/DisabledSymbol.md)\>\>

Defined in: src/services/copiers.ts:426

List disabled symbols for a copier

#### Parameters

##### copierId

`number`

##### filters?

[`PaginationParams`](../interfaces/PaginationParams.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`DisabledSymbol`](../interfaces/DisabledSymbol.md)\>\>

#### Example

```typescript
const response = await sdk.copiers.listDisabledSymbols(12345);
console.log(response.data); // Array of disabled symbols
```

***

### createDisabledSymbol()

> **createDisabledSymbol**(`copierId`, `input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`DisabledSymbol`](../interfaces/DisabledSymbol.md)\>\>

Defined in: src/services/copiers.ts:453

Create a disabled symbol for a copier

#### Parameters

##### copierId

`number`

##### input

[`CreateDisabledSymbolInput`](../interfaces/CreateDisabledSymbolInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`DisabledSymbol`](../interfaces/DisabledSymbol.md)\>\>

#### Example

```typescript
const response = await sdk.copiers.createDisabledSymbol(12345, {
  lead_symbol_id: 67890
});
```

***

### listMaps()

> **listMaps**(`copierId`, `filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`CopierMap`](../interfaces/CopierMap.md)\>\>

Defined in: src/services/copiers.ts:479

List symbol mappings for a copier

#### Parameters

##### copierId

`number`

##### filters?

[`PaginationParams`](../interfaces/PaginationParams.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`CopierMap`](../interfaces/CopierMap.md)\>\>

#### Example

```typescript
const response = await sdk.copiers.listMaps(12345);
console.log(response.data); // Array of symbol mappings
```

***

### createMap()

> **createMap**(`copierId`, `input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`CopierMap`](../interfaces/CopierMap.md)\>\>

Defined in: src/services/copiers.ts:507

Create a symbol mapping for a copier

#### Parameters

##### copierId

`number`

##### input

[`CreateCopierMapInput`](../interfaces/CreateCopierMapInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`CopierMap`](../interfaces/CopierMap.md)\>\>

#### Example

```typescript
const response = await sdk.copiers.createMap(12345, {
  lead_symbol_id: 111,
  follower_symbol_id: 222
});
```

***

### deleteMap()

> **deleteMap**(`copierId`, `mapId`, `options?`): `Promise`\<`void`\>

Defined in: src/services/copiers.ts:528

Delete a symbol mapping

#### Parameters

##### copierId

`number`

##### mapId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await sdk.copiers.deleteMap(12345, 67890);
```
