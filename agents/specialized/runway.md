# Runway

## Overview
Runway is an AI creative platform specializing in video generation and editing. Known for Gen-3 Alpha, a leading text-to-video and image-to-video model.

## Key Features
- Text-to-video generation
- Image-to-video animation
- Video editing tools
- Motion brush
- Green screen removal
- Frame interpolation
- Multi-modal generation

## Products

| Product | Description |
|---------|-------------|
| Gen-3 Alpha | Latest video model |
| Gen-2 | Previous video model |
| Image Tools | Expand, remove, etc. |
| Video Tools | Edit, enhance |
| Motion Brush | Animate regions |
| Lip Sync | Audio to video |

## Pricing

| Tier | Price | Credits |
|------|-------|---------|
| Basic | Free | 125 credits |
| Standard | $12/month | 625 credits/month |
| Pro | $28/month | 2250 credits/month |
| Unlimited | $76/month | Unlimited Gen-2 |
| Enterprise | Custom | Custom limits |

## Credit Usage
- Gen-3 Alpha: ~5 sec per 50 credits
- Gen-2: ~4 sec per 50 credits
- Image generation: ~5 credits

## API Example

```python
import requests

response = requests.post(
    "https://api.runwayml.com/v1/generate",
    headers={"Authorization": "Bearer ..."},
    json={
        "model": "gen3a_turbo",
        "prompt": "A dog running on the beach"
    }
)
```

## Use Cases
- Video content creation
- Marketing videos
- Social media content
- Film production
- Animation
- Visual effects

## Links
- [Website](https://runwayml.com)
- [Documentation](https://docs.runwayml.com)
- [API Reference](https://docs.runwayml.com/reference)
- [Pricing](https://runwayml.com/pricing)
