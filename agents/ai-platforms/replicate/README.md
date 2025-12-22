# Replicate

Run ML models via API.

## Installation
```bash
npm install replicate
```

## Quick Start
```typescript
import Replicate from "replicate";

const replicate = new Replicate();

const output = await replicate.run("meta/llama-2-70b-chat", {
  input: { prompt: "Hello" }
});
```

## Popular Models
- Llama
- Stable Diffusion
- Whisper
- SDXL

## Environment
```bash
REPLICATE_API_TOKEN=xxx
```

## Links
- Site: https://replicate.com
- Explore: https://replicate.com/explore
