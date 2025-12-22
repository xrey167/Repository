[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / AccountsService

# Class: AccountsService

Defined in: src/services/accounts.ts:256

Accounts API service

## Constructors

### Constructor

> **new AccountsService**(`client`): `AccountsService`

Defined in: src/services/accounts.ts:257

#### Parameters

##### client

[`TradeSyncClient`](TradeSyncClient.md)

#### Returns

`AccountsService`

## Methods

### list()

> **list**(`filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`Account`](../interfaces/Account.md)\>\>

Defined in: src/services/accounts.ts:268

List all accounts

#### Parameters

##### filters?

[`AccountListFilters`](../interfaces/AccountListFilters.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`Account`](../interfaces/Account.md)\>\>

#### Example

```typescript
const response = await sdk.accounts.list();
console.log(response.data); // Array of accounts
```

***

### get()

> **get**(`accountId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Account`](../interfaces/Account.md)\>\>

Defined in: src/services/accounts.ts:291

Get a single account by ID

#### Parameters

##### accountId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Account`](../interfaces/Account.md)\>\>

#### Example

```typescript
const response = await sdk.accounts.get(12345);
console.log(response.data.balance);
```

***

### create()

> **create**(`input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Account`](../interfaces/Account.md)\>\>

Defined in: src/services/accounts.ts:310

Create a new account

#### Parameters

##### input

[`CreateAccountInput`](../interfaces/CreateAccountInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Account`](../interfaces/Account.md)\>\>

#### Example

```typescript
const response = await sdk.accounts.create({
  account_name: 'My Trading Account',
  account_number: 12345678,
  password: 'mypassword',
  application: 'mt5',
  broker_server_id: 4971,
  type: 'full'
});
```

***

### update()

> **update**(`accountId`, `input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Account`](../interfaces/Account.md)\>\>

Defined in: src/services/accounts.ts:329

Update an account's name and suffix

#### Parameters

##### accountId

`number`

##### input

[`UpdateAccountInput`](../interfaces/UpdateAccountInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Account`](../interfaces/Account.md)\>\>

#### Example

```typescript
const response = await sdk.accounts.update(12345, {
  account_name: 'New Name',
  suffix: '.pro'
});
```

***

### updateConnection()

> **updateConnection**(`accountId`, `input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`Account`](../interfaces/Account.md)\>\>

Defined in: src/services/accounts.ts:349

Update account connection settings (password and broker server)

#### Parameters

##### accountId

`number`

##### input

[`UpdateConnectionInput`](../interfaces/UpdateConnectionInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`Account`](../interfaces/Account.md)\>\>

#### Example

```typescript
const response = await sdk.accounts.updateConnection(12345, {
  password: 'newpassword',
  broker_server_id: 4972
});
```

***

### delete()

> **delete**(`accountId`, `options?`): `Promise`\<`void`\>

Defined in: src/services/accounts.ts:370

Delete an account

#### Parameters

##### accountId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await sdk.accounts.delete(12345);
```

***

### listSymbols()

> **listSymbols**(`accountId`, `filters?`, `options?`): `Promise`\<`ApiListResponse`\<[`AccountSymbol`](../interfaces/AccountSymbol.md)\>\>

Defined in: src/services/accounts.ts:383

List all symbols for an account

#### Parameters

##### accountId

`number`

##### filters?

[`PaginationParams`](../interfaces/PaginationParams.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`AccountSymbol`](../interfaces/AccountSymbol.md)\>\>

#### Example

```typescript
const response = await sdk.accounts.listSymbols(12345);
console.log(response.data); // Array of symbols
```

***

### getSymbol()

> **getSymbol**(`accountId`, `symbolId`, `options?`): `Promise`\<`ApiSingleResponse`\<[`AccountSymbol`](../interfaces/AccountSymbol.md)\>\>

Defined in: src/services/accounts.ts:409

Get a single symbol for an account

#### Parameters

##### accountId

`number`

##### symbolId

`number`

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`AccountSymbol`](../interfaces/AccountSymbol.md)\>\>

#### Example

```typescript
const response = await sdk.accounts.getSymbol(12345, 67890);
console.log(response.data.symbol); // e.g., 'EURUSD'
```

***

### updateSymbol()

> **updateSymbol**(`accountId`, `symbolId`, `input`, `options?`): `Promise`\<`ApiSingleResponse`\<[`AccountSymbol`](../interfaces/AccountSymbol.md)\>\>

Defined in: src/services/accounts.ts:431

Update a symbol's active status

#### Parameters

##### accountId

`number`

##### symbolId

`number`

##### input

[`UpdateSymbolInput`](../interfaces/UpdateSymbolInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiSingleResponse`\<[`AccountSymbol`](../interfaces/AccountSymbol.md)\>\>

#### Example

```typescript
const response = await sdk.accounts.updateSymbol(12345, 67890, {
  active: 'no'
});
```

***

### updateSymbolsBulk()

> **updateSymbolsBulk**(`accountId`, `input`, `options?`): `Promise`\<`ApiListResponse`\<[`AccountSymbol`](../interfaces/AccountSymbol.md)\>\>

Defined in: src/services/accounts.ts:458

Bulk update symbols' active status

#### Parameters

##### accountId

`number`

##### input

[`BulkSymbolUpdateInput`](../interfaces/BulkSymbolUpdateInput.md)

##### options?

[`RequestOptions`](../interfaces/RequestOptions.md)

#### Returns

`Promise`\<`ApiListResponse`\<[`AccountSymbol`](../interfaces/AccountSymbol.md)\>\>

#### Example

```typescript
const response = await sdk.accounts.updateSymbolsBulk(12345, {
  symbols: [
    { id: 67890, active: 'no' },
    { id: 67891, active: 'yes' }
  ]
});
```
