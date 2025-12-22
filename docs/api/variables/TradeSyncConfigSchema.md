[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / TradeSyncConfigSchema

# Variable: TradeSyncConfigSchema

> `const` **TradeSyncConfigSchema**: `ZodObject`\<\{ `apiKey`: `ZodString`; `apiSecret`: `ZodString`; `baseUrl`: `ZodDefault`\<`ZodString`\>; `timeout`: `ZodDefault`\<`ZodNumber`\>; `version`: `ZodDefault`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `apiKey`: `string`; `apiSecret`: `string`; `baseUrl`: `string`; `timeout`: `number`; `version`: `string`; \}, \{ `apiKey`: `string`; `apiSecret`: `string`; `baseUrl?`: `string`; `timeout?`: `number`; `version?`: `string`; \}\>

Defined in: src/config.ts:13

Zod schema for TradeSync configuration
