[**tradesync-sdk v1.0.0**](../README.md)

***

[tradesync-sdk](../globals.md) / ModifyCommandInput

# Interface: ModifyCommandInput

Defined in: src/services/commands.ts:155

Modify command input

## Properties

### account\_id

> **account\_id**: `number`

Defined in: src/services/commands.ts:157

Target account ID

***

### command

> **command**: `"modify_stop_loss"` \| `"modify_take_profit"` \| `"modify_pending_price"`

Defined in: src/services/commands.ts:159

Command type: modify_stop_loss, modify_take_profit, or modify_pending_price

***

### by

> **by**: [`ByType`](../type-aliases/ByType.md)

Defined in: src/services/commands.ts:161

Trade identifier type: ticket or magic

***

### trade\_id

> **trade\_id**: `number`

Defined in: src/services/commands.ts:163

Trade identifier value

***

### modify\_price

> **modify\_price**: `number`

Defined in: src/services/commands.ts:165

New price value
