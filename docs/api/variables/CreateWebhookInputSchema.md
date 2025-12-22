[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CreateWebhookInputSchema

# Variable: CreateWebhookInputSchema

> `const` **CreateWebhookInputSchema**: `ZodUnion`\<\[`ZodObject`\<\{ `url`: `ZodString`; `authentication`: `ZodLiteral`\<`"none"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `url`: `string`; `authentication`: `"none"`; \}, \{ `url`: `string`; `authentication`: `"none"`; \}\>, `ZodObject`\<\{ `url`: `ZodString`; `authentication`: `ZodLiteral`\<`"basic_auth"`\>; `username`: `ZodString`; `password`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `url`: `string`; `authentication`: `"basic_auth"`; `username`: `string`; `password`: `string`; \}, \{ `url`: `string`; `authentication`: `"basic_auth"`; `username`: `string`; `password`: `string`; \}\>, `ZodObject`\<\{ `url`: `ZodString`; `authentication`: `ZodLiteral`\<`"bearer_token"`\>; `token`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `url`: `string`; `authentication`: `"bearer_token"`; `token`: `string`; \}, \{ `url`: `string`; `authentication`: `"bearer_token"`; `token`: `string`; \}\>, `ZodObject`\<\{ `url`: `ZodString`; `authentication`: `ZodLiteral`\<`"api_key"`\>; `key`: `ZodString`; `value`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `url`: `string`; `authentication`: `"api_key"`; `key`: `string`; `value`: `string`; \}, \{ `url`: `string`; `authentication`: `"api_key"`; `key`: `string`; `value`: `string`; \}\>\]\>

Defined in: src/services/webhooks.ts:153
