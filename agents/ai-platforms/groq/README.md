# Groq

Ultra-fast LLM inference.

## Installation
```bash
npm install groq-sdk
```

## Models
| Model | Speed | Use Case |
|-------|-------|----------|
| llama-3.3-70b | ~300 tok/s | Best quality |
| llama-3.1-8b | ~750 tok/s | Fast |
| mixtral-8x7b | ~500 tok/s | Balanced |

## Quick Start
```typescript
import Groq from "groq-sdk";

const groq = new Groq();
const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: "Hello" }],
});
```

## Environment
```bash
GROQ_API_KEY=gsk_xxx
```

## Links
- Console: https://console.groq.com
