[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CreateAccountInputSchema

# Variable: CreateAccountInputSchema

> `const` **CreateAccountInputSchema**: `ZodObject`\<\{ `account_name`: `ZodString`; `account_number`: `ZodNumber`; `password`: `ZodString`; `application`: `ZodEnum`\<\[`"mt4"`, `"mt5"`\]\>; `broker_server_id`: `ZodNumber`; `type`: `ZodOptional`\<`ZodEnum`\<\[`"readonly"`, `"full"`\]\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `account_name`: `string`; `account_number`: `number`; `password`: `string`; `application`: `"mt4"` \| `"mt5"`; `broker_server_id`: `number`; `type?`: `"readonly"` \| `"full"`; \}, \{ `account_name`: `string`; `account_number`: `number`; `password`: `string`; `application`: `"mt4"` \| `"mt5"`; `broker_server_id`: `number`; `type?`: `"readonly"` \| `"full"`; \}\>

Defined in: src/services/accounts.ts:217
