# Anthropic (Claude)

## API Reference
- Base URL: `https://api.anthropic.com/v1`
- Docs: https://docs.anthropic.com

## Models
| Model | Context | Use Case |
|-------|---------|----------|
| claude-opus-4-5 | 200K | Most capable |
| claude-sonnet-4 | 200K | Balanced |
| claude-haiku-3-5 | 200K | Fast, cheap |

## Quick Start
```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }],
});
```

## Environment
```bash
ANTHROPIC_API_KEY=sk-ant-xxx
```
