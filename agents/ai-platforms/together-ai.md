# Together AI

## Overview
Together AI provides fast, cost-effective inference for open-source models. Known for competitive pricing and high throughput on popular models like Llama and Mistral.

## Key Features
- Fast inference speeds
- Competitive pricing
- Open-source models
- Fine-tuning support
- Custom deployments
- OpenAI-compatible API
- Embedding models

## Models

| Model | Description | Price (per 1M tokens) |
|-------|-------------|----------------------|
| Llama 3.3 70B | Meta's latest | ~$0.88 |
| Mixtral 8x22B | Mistral MoE | ~$1.20 |
| Qwen 2.5 72B | Alibaba model | ~$0.90 |
| DeepSeek V3 | Reasoning model | ~$0.75 |

## Pricing

| Category | Price Range |
|----------|-------------|
| Chat models | $0.18 - $1.20 / 1M tokens |
| Embedding | $0.008 / 1M tokens |
| Image gen | $0.006 / image |
| Fine-tuning | $0.0022 / 1K tokens |

## Installation

```bash
pip install together
```

## Example

```python
from together import Together

client = Together(api_key="...")
response = client.chat.completions.create(
    model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Features
- OpenAI SDK compatible
- Streaming responses
- Function calling
- JSON mode
- Batch inference

## Use Cases
- Cost-effective LLM inference
- Open-source model access
- High-throughput applications
- Model fine-tuning
- Embedding generation

## Links
- [Website](https://together.ai)
- [Documentation](https://docs.together.ai)
- [API Reference](https://docs.together.ai/reference)
- [Playground](https://api.together.ai/playground)
- [Pricing](https://together.ai/pricing)
