[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CreateEquityMonitorInputSchema

# Variable: CreateEquityMonitorInputSchema

> `const` **CreateEquityMonitorInputSchema**: `ZodObject`\<\{ `account_id`: `ZodNumber`; `type`: `ZodEnum`\<\[`"target_value"`, `"target_percentage"`, `"protect_value"`, `"protect_percentage"`\]\>; `value`: `ZodNumber`; `action`: `ZodEnum`\<\[`"alert"`, `"alert_disable_copiers"`, `"alert_disable_copiers_close_trades"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `account_id`: `number`; `type`: `"target_value"` \| `"target_percentage"` \| `"protect_value"` \| `"protect_percentage"`; `value`: `number`; `action`: `"alert"` \| `"alert_disable_copiers"` \| `"alert_disable_copiers_close_trades"`; \}, \{ `account_id`: `number`; `type`: `"target_value"` \| `"target_percentage"` \| `"protect_value"` \| `"protect_percentage"`; `value`: `number`; `action`: `"alert"` \| `"alert_disable_copiers"` \| `"alert_disable_copiers_close_trades"`; \}\>

Defined in: src/services/equity-monitors.ts:95
