# Stability AI

Image generation (Stable Diffusion).

## Installation
```bash
npm install @stability-ai/api
```

## Models
- Stable Diffusion 3
- SDXL
- Stable Video Diffusion

## Quick Start
```typescript
const response = await fetch(
  "https://api.stability.ai/v2beta/stable-image/generate/sd3",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STABILITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: "A lighthouse on a cliff",
      output_format: "png",
    }),
  }
);
```

## Environment
```bash
STABILITY_API_KEY=sk-xxx
```

## Links
- API: https://platform.stability.ai
- Docs: https://platform.stability.ai/docs
