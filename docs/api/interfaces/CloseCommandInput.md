[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / CloseCommandInput

# Interface: CloseCommandInput

Defined in: src/services/commands.ts:171

Close command input

## Properties

### account\_id

> **account\_id**: `number`

Defined in: src/services/commands.ts:173

Target account ID

***

### command

> **command**: `"close_full"` \| `"close_partial"`

Defined in: src/services/commands.ts:175

Command type: close_full or close_partial

***

### by

> **by**: [`ByType`](../type-aliases/ByType.md)

Defined in: src/services/commands.ts:177

Trade identifier type: ticket or magic

***

### trade\_id

> **trade\_id**: `number`

Defined in: src/services/commands.ts:179

Trade identifier value

***

### percentage?

> `optional` **percentage**: `number`

Defined in: src/services/commands.ts:181

Percentage to close (required for close_partial)
