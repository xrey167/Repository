[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / Account

# Interface: Account

Defined in: src/services/accounts.ts:63

Trading account from TradeSync API

## Properties

### id

> **id**: `number`

Defined in: src/services/accounts.ts:64

***

### created\_at

> **created\_at**: `string`

Defined in: src/services/accounts.ts:65

***

### updated\_at

> **updated\_at**: `string`

Defined in: src/services/accounts.ts:66

***

### restored\_at?

> `optional` **restored\_at**: `string`

Defined in: src/services/accounts.ts:67

***

### type

> **type**: [`AccountTypeValue`](../type-aliases/AccountTypeValue.md)

Defined in: src/services/accounts.ts:68

***

### application

> **application**: [`ApplicationType`](../type-aliases/ApplicationType.md)

Defined in: src/services/accounts.ts:69

***

### account\_name

> **account\_name**: `string`

Defined in: src/services/accounts.ts:70

***

### account\_number

> **account\_number**: `number`

Defined in: src/services/accounts.ts:71

***

### password?

> `optional` **password**: `string`

Defined in: src/services/accounts.ts:72

***

### broker\_server\_id

> **broker\_server\_id**: `number`

Defined in: src/services/accounts.ts:73

***

### status

> **status**: [`AccountStatusType`](../type-aliases/AccountStatusType.md)

Defined in: src/services/accounts.ts:74

***

### login\_response?

> `optional` **login\_response**: [`LoginResponseType`](../type-aliases/LoginResponseType.md)

Defined in: src/services/accounts.ts:75

***

### modify\_disabled?

> `optional` **modify\_disabled**: `string`

Defined in: src/services/accounts.ts:76

***

### last\_ping?

> `optional` **last\_ping**: `string`

Defined in: src/services/accounts.ts:77

***

### broker?

> `optional` **broker**: `string`

Defined in: src/services/accounts.ts:78

***

### client\_name?

> `optional` **client\_name**: `string`

Defined in: src/services/accounts.ts:79

***

### server?

> `optional` **server**: `string`

Defined in: src/services/accounts.ts:80

***

### trade\_mode?

> `optional` **trade\_mode**: `"demo"` \| `"live"`

Defined in: src/services/accounts.ts:81

***

### leverage?

> `optional` **leverage**: `number`

Defined in: src/services/accounts.ts:82

***

### is\_demo?

> `optional` **is\_demo**: `string`

Defined in: src/services/accounts.ts:83

***

### suffix?

> `optional` **suffix**: `string`

Defined in: src/services/accounts.ts:84

***

### currency?

> `optional` **currency**: `string`

Defined in: src/services/accounts.ts:85

***

### balance?

> `optional` **balance**: `string`

Defined in: src/services/accounts.ts:86

***

### credit?

> `optional` **credit**: `string`

Defined in: src/services/accounts.ts:87

***

### equity?

> `optional` **equity**: `string`

Defined in: src/services/accounts.ts:88

***

### free\_margin?

> `optional` **free\_margin**: `string`

Defined in: src/services/accounts.ts:89

***

### used\_margin?

> `optional` **used\_margin**: `string`

Defined in: src/services/accounts.ts:90

***

### open\_trades?

> `optional` **open\_trades**: `number`

Defined in: src/services/accounts.ts:91

***

### pending\_orders?

> `optional` **pending\_orders**: `number`

Defined in: src/services/accounts.ts:92

***

### open\_trades\_lots?

> `optional` **open\_trades\_lots**: `string`

Defined in: src/services/accounts.ts:93

***

### pending\_orders\_lots?

> `optional` **pending\_orders\_lots**: `string`

Defined in: src/services/accounts.ts:94

***

### daily\_profit?

> `optional` **daily\_profit**: `string`

Defined in: src/services/accounts.ts:95

***

### weekly\_profit?

> `optional` **weekly\_profit**: `string`

Defined in: src/services/accounts.ts:96

***

### monthly\_profit?

> `optional` **monthly\_profit**: `string`

Defined in: src/services/accounts.ts:97

***

### total\_profit?

> `optional` **total\_profit**: `string`

Defined in: src/services/accounts.ts:98
