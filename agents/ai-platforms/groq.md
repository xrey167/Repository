# Groq

## Overview
Groq provides ultra-fast LLM inference using custom LPU (Language Processing Unit) hardware. Known for industry-leading speeds with open-source models.

## Key Features
- Ultra-fast inference (500+ tokens/sec)
- Custom LPU hardware
- Low latency
- OpenAI-compatible API
- Competitive pricing
- Streaming support

## Models

| Model | Speed | Price (per 1M tokens) |
|-------|-------|----------------------|
| Llama 3.3 70B | ~330 tok/s | $0.59 input, $0.79 output |
| Llama 3.1 8B | ~750 tok/s | $0.05 input, $0.08 output |
| Mixtral 8x7B | ~575 tok/s | $0.24 input, $0.24 output |
| Gemma 2 9B | ~600 tok/s | $0.20 input, $0.20 output |

## Pricing

| Tier | Limits | Price |
|------|--------|-------|
| Free | 30 req/min, 14,400 req/day | Free |
| Paid | Higher limits | Pay-per-token |

## Installation

```bash
pip install groq
```

## Example

```python
from groq import Groq

client = Groq(api_key="...")
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Features
- OpenAI SDK compatible
- Real-time streaming
- Tool/function calling
- JSON mode
- Vision models

## Use Cases
- Real-time chat applications
- Voice assistants (low latency)
- High-throughput processing
- Interactive applications
- Rapid prototyping

## Links
- [Website](https://groq.com)
- [Documentation](https://console.groq.com/docs)
- [API Console](https://console.groq.com)
- [Playground](https://console.groq.com/playground)
