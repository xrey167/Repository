# Perplexity AI

## Overview
Perplexity is an AI-powered search engine that provides direct answers with citations. Combines LLMs with real-time web search for accurate, sourced responses.

## Key Features
- AI-powered search
- Real-time web access
- Source citations
- Follow-up questions
- Focus modes
- File analysis
- API access

## Products

| Product | Description |
|---------|-------------|
| Perplexity Search | Consumer search |
| Perplexity Pro | Advanced features |
| Perplexity API | Developer access |
| Enterprise | Organization features |

## Pricing

| Tier | Price | Includes |
|------|-------|----------|
| Free | $0 | Basic search, limited Pro queries |
| Pro | $20/month | Unlimited Pro, file upload, API credits |
| Enterprise | Custom | SSO, admin, dedicated support |

## API Models

| Model | Description | Price |
|-------|-------------|-------|
| sonar | Fast online model | $1/1M tokens |
| sonar-pro | Advanced reasoning | $3/1M tokens |
| sonar-reasoning | Chain-of-thought | $5/1M tokens |

## Example

```python
import requests

response = requests.post(
    "https://api.perplexity.ai/chat/completions",
    headers={"Authorization": "Bearer pplx-..."},
    json={
        "model": "sonar",
        "messages": [{"role": "user", "content": "What is quantum computing?"}]
    }
)
```

## Focus Modes
- **Web**: Full internet search
- **Academic**: Scholarly sources
- **Writing**: Content creation
- **Math**: Calculations
- **Video**: YouTube content

## Use Cases
- Research with citations
- Fact-checking
- Academic research
- Current events
- Technical questions

## Links
- [Website](https://perplexity.ai)
- [API Documentation](https://docs.perplexity.ai)
- [Pricing](https://perplexity.ai/pricing)
