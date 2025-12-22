# Hugging Face

## Overview
Hugging Face is the leading platform for machine learning models, datasets, and tools. Hosts 500K+ models and provides inference APIs, Spaces for demos, and enterprise solutions.

## Key Features
- Model Hub (500K+ models)
- Transformers library
- Inference API
- Spaces (demo hosting)
- Datasets Hub
- AutoTrain
- Enterprise deployment

## Products

| Product | Description | Best For |
|---------|-------------|----------|
| Hub | Model/dataset hosting | Sharing, discovery |
| Inference API | Hosted inference | Quick deployment |
| Spaces | Demo hosting | Showcasing |
| Endpoints | Dedicated inference | Production |
| AutoTrain | No-code fine-tuning | Custom models |

## Pricing

| Tier | Price | Includes |
|------|-------|----------|
| Free | $0 | Public repos, limited inference |
| Pro | $9/month | Private repos, more compute |
| Enterprise | Custom | SSO, dedicated support |

## Installation

```bash
pip install transformers datasets huggingface_hub
```

## Example

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
result = classifier("I love this product!")
```

## Inference API

```python
from huggingface_hub import InferenceClient

client = InferenceClient(token="hf_...")
response = client.text_generation(
    "The answer is",
    model="meta-llama/Llama-3.3-70B-Instruct"
)
```

## Use Cases
- Model discovery and sharing
- Quick prototyping
- Production inference
- Fine-tuning models
- Dataset management

## Links
- [Website](https://huggingface.co)
- [Documentation](https://huggingface.co/docs)
- [Model Hub](https://huggingface.co/models)
- [Datasets](https://huggingface.co/datasets)
- [Spaces](https://huggingface.co/spaces)
