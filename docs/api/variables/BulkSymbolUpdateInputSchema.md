[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / BulkSymbolUpdateInputSchema

# Variable: BulkSymbolUpdateInputSchema

> `const` **BulkSymbolUpdateInputSchema**: `ZodObject`\<\{ `symbols`: `ZodArray`\<`ZodObject`\<\{ `id`: `ZodUnion`\<\[`ZodString`, `ZodNumber`\]\>; `active`: `ZodEnum`\<\[`"yes"`, `"no"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `id`: `string` \| `number`; `active`: `"yes"` \| `"no"`; \}, \{ `id`: `string` \| `number`; `active`: `"yes"` \| `"no"`; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `symbols`: `object`[]; \}, \{ `symbols`: `object`[]; \}\>

Defined in: src/services/accounts.ts:240
