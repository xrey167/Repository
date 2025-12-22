[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CreateAccountInput

# Interface: CreateAccountInput

Defined in: src/services/accounts.ts:150

Account creation input

## Properties

### account\_name

> **account\_name**: `string`

Defined in: src/services/accounts.ts:152

Descriptive account name

***

### account\_number

> **account\_number**: `number`

Defined in: src/services/accounts.ts:154

MetaTrader account number

***

### password

> **password**: `string`

Defined in: src/services/accounts.ts:156

MetaTrader account password

***

### application

> **application**: [`ApplicationType`](../type-aliases/ApplicationType.md)

Defined in: src/services/accounts.ts:158

Platform type: mt4 or mt5

***

### broker\_server\_id

> **broker\_server\_id**: `number`

Defined in: src/services/accounts.ts:160

Valid broker server ID from /broker-servers

***

### type?

> `optional` **type**: [`AccountTypeValue`](../type-aliases/AccountTypeValue.md)

Defined in: src/services/accounts.ts:162

Account type: readonly or full (default: full)
