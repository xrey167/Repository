# Together AI

Open-source model hosting.

## Installation
```bash
npm install together-ai
```

## Models
- Llama 3.3 70B
- Mixtral 8x22B
- DeepSeek Coder
- Qwen 2.5

## Quick Start
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

## Links
- Site: https://together.ai
- Models: https://together.ai/models
