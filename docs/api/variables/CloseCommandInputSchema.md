[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CloseCommandInputSchema

# Variable: CloseCommandInputSchema

> `const` **CloseCommandInputSchema**: `ZodObject`\<\{ `account_id`: `ZodNumber`; `command`: `ZodEnum`\<\[`"close_full"`, `"close_partial"`\]\>; `by`: `ZodEnum`\<\[`"ticket"`, `"magic"`\]\>; `trade_id`: `ZodNumber`; `percentage`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `account_id`: `number`; `command`: `"close_full"` \| `"close_partial"`; `by`: `"ticket"` \| `"magic"`; `trade_id`: `number`; `percentage?`: `number`; \}, \{ `account_id`: `number`; `command`: `"close_full"` \| `"close_partial"`; `by`: `"ticket"` \| `"magic"`; `trade_id`: `number`; `percentage?`: `number`; \}\>

Defined in: src/services/commands.ts:246
