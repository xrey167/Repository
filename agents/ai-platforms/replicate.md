# Replicate

## Overview
Replicate provides a simple API to run machine learning models in the cloud. Pay-per-use pricing with no infrastructure management required.

## Key Features
- Run models via API
- Pay-per-second billing
- Custom model deployment
- Community model library
- Streaming support
- Webhooks
- Fine-tuning

## Products

| Product | Description |
|---------|-------------|
| Predictions | Run any model |
| Deployments | Dedicated hardware |
| Trainings | Fine-tune models |
| Collections | Curated model sets |

## Pricing

| Resource | Price |
|----------|-------|
| CPU | ~$0.0001/second |
| GPU (T4) | ~$0.00055/second |
| GPU (A40) | ~$0.00115/second |
| GPU (A100) | ~$0.0023/second |

## Installation

```bash
pip install replicate
```

## Example

```python
import replicate

output = replicate.run(
    "stability-ai/sdxl:latest",
    input={"prompt": "a photo of an astronaut riding a horse"}
)
```

## Popular Models
- Stable Diffusion XL (image generation)
- Whisper (speech-to-text)
- LLaMA (text generation)
- ControlNet (image editing)
- Codeformer (face restoration)

## Use Cases
- Image generation
- Video processing
- Audio transcription
- LLM inference
- Model experimentation

## Links
- [Website](https://replicate.com)
- [Documentation](https://replicate.com/docs)
- [API Reference](https://replicate.com/docs/reference/http)
- [Model Library](https://replicate.com/explore)
- [Pricing](https://replicate.com/pricing)
