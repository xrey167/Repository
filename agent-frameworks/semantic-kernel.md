# Microsoft Semantic Kernel

## Overview
Semantic Kernel is Microsoft's SDK for integrating LLMs into applications. Provides enterprise-ready patterns for AI orchestration with .NET and Python support.

## Key Features
- Plugin architecture
- Prompt templating
- Memory and embeddings
- Planners for orchestration
- .NET and Python support
- Azure OpenAI integration
- Enterprise patterns

## Components

| Component | Description |
|-----------|-------------|
| Kernel | Core orchestrator |
| Plugins | Reusable capabilities |
| Functions | Semantic or native |
| Memory | Context storage |
| Planners | Task orchestration |
| Connectors | LLM integrations |

## Installation

```bash
# Python
pip install semantic-kernel

# .NET
dotnet add package Microsoft.SemanticKernel
```

## Example (Python)

```python
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

kernel = sk.Kernel()
kernel.add_service(OpenAIChatCompletion(
    service_id="gpt4",
    ai_model_id="gpt-4o"
))

result = await kernel.invoke_prompt("Tell me a joke")
```

## Example (.NET)

```csharp
var kernel = Kernel.CreateBuilder()
    .AddOpenAIChatCompletion("gpt-4o", apiKey)
    .Build();

var result = await kernel.InvokePromptAsync("Tell me a joke");
```

## Use Cases
- Enterprise AI applications
- Copilot development
- Plugin-based assistants
- .NET AI integration
- Azure AI solutions

## Links
- [Website](https://learn.microsoft.com/semantic-kernel)
- [Documentation](https://learn.microsoft.com/semantic-kernel/overview)
- [GitHub](https://github.com/microsoft/semantic-kernel)
- [Samples](https://github.com/microsoft/semantic-kernel/tree/main/samples)
