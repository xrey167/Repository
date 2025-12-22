# AWS Bedrock

## Overview
Amazon Bedrock is AWS's fully managed service for accessing foundation models from multiple providers. Enterprise-ready with deep AWS integration.

## Key Features
- Multiple model providers
- AWS integration
- Fine-tuning support
- Knowledge bases
- Agents for orchestration
- Guardrails
- Enterprise security

## Models

| Provider | Models |
|----------|--------|
| Anthropic | Claude 3.5 Sonnet, Claude 3 |
| Amazon | Titan Text, Titan Embeddings |
| Meta | Llama 3.2, Llama 3.1 |
| Mistral | Mistral Large, Mixtral |
| Cohere | Command R+, Embed |
| Stability AI | Stable Diffusion |

## Pricing

| Model | Input | Output |
|-------|-------|--------|
| Claude 3.5 Sonnet | $3/1M tokens | $15/1M tokens |
| Llama 3.1 70B | $0.99/1M tokens | $0.99/1M tokens |
| Titan Text Express | $0.20/1M tokens | $0.60/1M tokens |

## Installation

```bash
pip install boto3
```

## Example

```python
import boto3

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")

response = bedrock.converse(
    modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
    messages=[{"role": "user", "content": [{"text": "Hello!"}]}]
)
```

## Features
- VPC integration
- IAM access control
- CloudWatch logging
- PrivateLink support
- Custom model import

## Use Cases
- Enterprise AI applications
- AWS-native solutions
- Regulated industries
- Multi-model orchestration
- Knowledge-grounded apps

## Links
- [Website](https://aws.amazon.com/bedrock)
- [Documentation](https://docs.aws.amazon.com/bedrock)
- [Pricing](https://aws.amazon.com/bedrock/pricing)
- [Console](https://console.aws.amazon.com/bedrock)
