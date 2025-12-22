# Claude Agent SDK

Anthropic's official agent building toolkit.

## Installation
```bash
npm install @anthropic-ai/agent-sdk
```

## Key Concepts
- **Agent**: Core agent class
- **Tools**: Function definitions
- **Context**: Conversation state
- **Hooks**: Lifecycle callbacks

## Quick Start
```typescript
import { Agent } from "@anthropic-ai/agent-sdk";

const agent = new Agent({
  model: "claude-sonnet-4-20250514",
  tools: [
    {
      name: "get_weather",
      description: "Get current weather",
      input_schema: {
        type: "object",
        properties: {
          location: { type: "string" }
        }
      }
    }
  ]
});

const result = await agent.run("What's the weather in Tokyo?");
```

## Links
- Docs: https://docs.anthropic.com/agent-sdk
