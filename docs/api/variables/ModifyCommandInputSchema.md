[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / ModifyCommandInputSchema

# Variable: ModifyCommandInputSchema

> `const` **ModifyCommandInputSchema**: `ZodObject`\<\{ `account_id`: `ZodNumber`; `command`: `ZodEnum`\<\[`"modify_stop_loss"`, `"modify_take_profit"`, `"modify_pending_price"`\]\>; `by`: `ZodEnum`\<\[`"ticket"`, `"magic"`\]\>; `trade_id`: `ZodNumber`; `modify_price`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `account_id`: `number`; `command`: `"modify_stop_loss"` \| `"modify_take_profit"` \| `"modify_pending_price"`; `by`: `"ticket"` \| `"magic"`; `trade_id`: `number`; `modify_price`: `number`; \}, \{ `account_id`: `number`; `command`: `"modify_stop_loss"` \| `"modify_take_profit"` \| `"modify_pending_price"`; `by`: `"ticket"` \| `"magic"`; `trade_id`: `number`; `modify_price`: `number`; \}\>

Defined in: src/services/commands.ts:238
