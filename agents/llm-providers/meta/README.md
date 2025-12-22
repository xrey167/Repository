# Meta (Llama)

## Models
| Model | Parameters | Use Case |
|-------|------------|----------|
| Llama 3.3 | 70B | Best open model |
| Llama 3.2 | 1B-90B | Vision capable |

## Hosting Options
- **Together AI**: https://together.ai
- **Groq**: https://groq.com
- **Replicate**: https://replicate.com
- **Local**: Ollama, llama.cpp

## Quick Start (via Together)
```typescript
import Together from "together-ai";

const client = new Together();
const response = await client.chat.completions.create({
  model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  messages: [{ role: "user", content: "Hello" }],
});
```

## Environment
```bash
TOGETHER_API_KEY=xxx
```
