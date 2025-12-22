# Hugging Face

ML model hub and inference platform.

## Installation
```bash
npm install @huggingface/inference
```

## Services
- **Hub**: Model repository
- **Inference API**: Hosted models
- **Spaces**: Demo apps
- **Transformers**: Model library

## Quick Start
```typescript
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

const result = await hf.textGeneration({
  model: "meta-llama/Llama-3.3-70B-Instruct",
  inputs: "Hello, how are you?",
});
```

## Environment
```bash
HF_TOKEN=hf_xxx
```

## Links
- Hub: https://huggingface.co
- Docs: https://huggingface.co/docs
