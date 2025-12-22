# OpenAI

## API Reference
- Base URL: `https://api.openai.com/v1`
- Docs: https://platform.openai.com/docs

## Models
| Model | Context | Use Case |
|-------|---------|----------|
| gpt-4o | 128K | Best overall |
| gpt-4o-mini | 128K | Fast, cheap |
| o1 | 200K | Reasoning |

## Quick Start
```typescript
import OpenAI from "openai";

const client = new OpenAI();
const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }],
});
```

## Environment
```bash
OPENAI_API_KEY=sk-xxx
```
