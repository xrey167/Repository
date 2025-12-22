# Cohere

## Overview
Cohere provides enterprise-focused language models with strong retrieval and embedding capabilities. Specializes in RAG applications and enterprise search.

## Key Features
- Command models for generation
- Embed models for search/RAG
- Rerank for result ordering
- Fine-tuning support
- Enterprise security
- Multilingual support (100+ languages)

## Models

| Model | Description | Context | Best For |
|-------|-------------|---------|----------|
| command-r-plus | Most capable | 128K | Complex tasks |
| command-r | Balanced | 128K | General RAG |
| command | Standard | 4K | Simple tasks |
| embed-english-v3.0 | English embeddings | - | Search, RAG |
| embed-multilingual-v3.0 | Multilingual embeddings | - | Global search |
| rerank-english-v3.0 | Result reranking | - | Search quality |

## Pricing

| Model | Price |
|-------|-------|
| command-r-plus | $3/1M input, $15/1M output |
| command-r | $0.50/1M input, $1.50/1M output |
| embed-english-v3.0 | $0.10/1M tokens |
| rerank-english-v3.0 | $2/1K searches |

## API Information
- **Base URL**: `https://api.cohere.ai/v1`
- **Authentication**: Bearer token
- **Rate Limits**: Based on subscription

## SDKs & Libraries
- **Official**: Python (`cohere`), TypeScript, Go, Java
- **Integrations**: LangChain, LlamaIndex

## Use Cases
- Enterprise RAG applications
- Semantic search
- Document analysis
- Multilingual applications
- Customer support automation

## Links
- [Website](https://cohere.com)
- [Documentation](https://docs.cohere.com)
- [API Reference](https://docs.cohere.com/reference)
- [Dashboard](https://dashboard.cohere.com)
- [Pricing](https://cohere.com/pricing)
