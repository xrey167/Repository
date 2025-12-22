# Stability AI

## Overview
Stability AI develops open-source generative AI models, most notably Stable Diffusion. Offers both open-weight models and API services for image, video, and audio generation.

## Key Features
- Open-source models
- Stable Diffusion family
- Image generation
- Image editing
- Video generation (Stable Video)
- Audio (Stable Audio)
- 3D generation

## Models

| Model | Description | Best For |
|-------|-------------|----------|
| SD 3.5 | Latest flagship | High quality |
| SDXL | 1024px generation | Detailed images |
| SD 1.5 | Community favorite | Fine-tuning |
| Stable Video | Video generation | Short clips |
| Stable Audio | Music/sound | Audio content |

## Pricing (API)

| Endpoint | Price |
|----------|-------|
| Generate Core | $0.03/image |
| Generate SD3 | $0.035/image |
| Generate Ultra | $0.08/image |
| Upscale | $0.05/image |

## Installation (Self-hosted)

```bash
pip install diffusers transformers accelerate
```

## Example (Local)

```python
from diffusers import StableDiffusionXLPipeline
import torch

pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16
).to("cuda")

image = pipe("a cat astronaut").images[0]
```

## Example (API)

```python
import requests

response = requests.post(
    "https://api.stability.ai/v2beta/stable-image/generate/sd3",
    headers={"Authorization": "Bearer sk-..."},
    files={"none": ""},
    data={"prompt": "a cat astronaut"}
)
```

## Use Cases
- Image generation
- Art creation
- Product visualization
- Video creation
- Game assets
- Research

## Links
- [Website](https://stability.ai)
- [API Documentation](https://platform.stability.ai/docs)
- [Hugging Face](https://huggingface.co/stabilityai)
- [GitHub](https://github.com/Stability-AI)
