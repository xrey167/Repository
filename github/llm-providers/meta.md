# Meta AI (Llama)

## Overview
Meta's Llama is an open-weight large language model family. Llama models can be self-hosted or accessed via various cloud providers, offering flexibility and customization.

## Key Features
- Open weights (free to use)
- Self-hosting capability
- Fine-tuning friendly
- Multiple size variants
- Strong multilingual support
- Active community ecosystem

## Models

| Model | Description | Context | Best For |
|-------|-------------|---------|----------|
| Llama 3.3 70B | Latest large model | 128K | Complex tasks |
| Llama 3.2 90B Vision | Multimodal | 128K | Image understanding |
| Llama 3.2 11B Vision | Efficient multimodal | 128K | Vision tasks |
| Llama 3.1 405B | Largest open model | 128K | Maximum capability |
| Llama 3.2 3B | Lightweight | 128K | Edge deployment |

## Pricing

| Provider | Notes |
|----------|-------|
| Self-hosted | Free (compute costs only) |
| Together AI | ~$0.90/1M tokens (70B) |
| Groq | ~$0.59/1M tokens (70B) |
| AWS Bedrock | Varies by region |

## API Information
- **Self-hosting**: Use vLLM, TGI, or Ollama
- **Cloud**: Together AI, Groq, AWS Bedrock, Azure
- **Authentication**: Varies by provider

## SDKs & Libraries
- **Official**: `transformers`, `llama-cpp-python`
- **Serving**: vLLM, TGI, Ollama, llama.cpp

## Use Cases
- Private/on-premise deployment
- Custom fine-tuning
- Research and experimentation
- Cost-effective inference
- Edge computing

## Links
- [Website](https://ai.meta.com/llama)
- [Model Cards](https://github.com/meta-llama/llama-models)
- [Hugging Face](https://huggingface.co/meta-llama)
- [Documentation](https://llama.meta.com)
