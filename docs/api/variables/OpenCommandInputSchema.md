[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / OpenCommandInputSchema

# Variable: OpenCommandInputSchema

> `const` **OpenCommandInputSchema**: `ZodObject`\<\{ `account_id`: `ZodNumber`; `command`: `ZodLiteral`\<`"open"`\>; `type`: `ZodEnum`\<\[`"buy"`, `"sell"`\]\>; `symbol`: `ZodString`; `lots`: `ZodNumber`; `open_price`: `ZodNumber`; `slippage`: `ZodNumber`; `stop_loss`: `ZodOptional`\<`ZodNumber`\>; `take_profit`: `ZodOptional`\<`ZodNumber`\>; `magic`: `ZodOptional`\<`ZodNumber`\>; `comment`: `ZodOptional`\<`ZodString`\>; \}, `"strip"`, `ZodTypeAny`, \{ `account_id`: `number`; `command`: `"open"`; `type`: `"buy"` \| `"sell"`; `symbol`: `string`; `lots`: `number`; `open_price`: `number`; `slippage`: `number`; `stop_loss?`: `number`; `take_profit?`: `number`; `magic?`: `number`; `comment?`: `string`; \}, \{ `account_id`: `number`; `command`: `"open"`; `type`: `"buy"` \| `"sell"`; `symbol`: `string`; `lots`: `number`; `open_price`: `number`; `slippage`: `number`; `stop_loss?`: `number`; `take_profit?`: `number`; `magic?`: `number`; `comment?`: `string`; \}\>

Defined in: src/services/commands.ts:224
