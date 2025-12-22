# OpenRouter

## Overview
OpenRouter provides a unified API to access 100+ AI models from multiple providers. Single integration for OpenAI, Anthropic, Google, Meta, Mistral, and more.

## Key Features
- 100+ models, one API
- Automatic fallbacks
- OpenAI-compatible format
- Pay-per-use pricing
- No minimums
- Model routing
- Usage analytics

## Models

| Provider | Example Models |
|----------|---------------|
| OpenAI | GPT-4o, o1 |
| Anthropic | Claude 3.5 Sonnet |
| Google | Gemini 1.5 Pro |
| Meta | Llama 3.3 70B |
| Mistral | Mistral Large |
| Cohere | Command R+ |

## Pricing
- Pay provider prices + small markup
- No monthly fees
- Free tier available
- Prepaid credits

## Installation

```bash
pip install openai  # OpenAI SDK works
```

## Example

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="sk-or-..."
)

response = client.chat.completions.create(
    model="anthropic/claude-3.5-sonnet",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Features
- Model fallback chains
- Cost optimization
- Provider comparison
- Stream responses
- Function calling

## Use Cases
- Multi-model applications
- Provider redundancy
- Cost comparison
- Model experimentation
- Unified billing

## Links
- [Website](https://openrouter.ai)
- [Documentation](https://openrouter.ai/docs)
- [Models](https://openrouter.ai/models)
- [Playground](https://openrouter.ai/playground)
