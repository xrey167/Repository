# Google AI (Gemini)

## Overview
Google's Gemini is a multimodal AI model family built natively for understanding text, images, audio, and video. Available via Google AI Studio and Vertex AI.

## Key Features
- Native multimodal understanding
- 1M+ token context window
- Grounding with Google Search
- Code execution capabilities
- Function calling
- Streaming responses

## Models

| Model | Description | Context | Best For |
|-------|-------------|---------|----------|
| gemini-2.0-flash | Latest fast model | 1M | General use, speed |
| gemini-1.5-pro | Advanced reasoning | 2M | Complex analysis |
| gemini-1.5-flash | Fast and efficient | 1M | High-volume tasks |

## Pricing

| Model | Input | Output |
|-------|-------|--------|
| gemini-2.0-flash | $0.10/1M tokens | $0.40/1M tokens |
| gemini-1.5-pro | $1.25/1M tokens | $5/1M tokens |
| gemini-1.5-flash | $0.075/1M tokens | $0.30/1M tokens |

## API Information
- **Base URL**: `https://generativelanguage.googleapis.com/v1beta`
- **Authentication**: API key or OAuth 2.0
- **Rate Limits**: Varies by model and tier

## SDKs & Libraries
- **Official**: Python (`google-generativeai`), Node.js, Go, Dart
- **Community**: Various wrappers

## Use Cases
- Multimodal content understanding
- Long document processing
- Video and audio analysis
- Grounded search responses
- Code generation

## Links
- [Website](https://ai.google.dev)
- [Documentation](https://ai.google.dev/docs)
- [API Reference](https://ai.google.dev/api)
- [AI Studio](https://aistudio.google.com)
- [Pricing](https://ai.google.dev/pricing)
