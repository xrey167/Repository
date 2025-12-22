# LangChain

Framework for building LLM applications.

## Installation
```bash
npm install langchain @langchain/core @langchain/anthropic
```

## Key Concepts
- **Chains**: Sequential LLM calls
- **Agents**: LLM decides actions
- **Tools**: Functions agents can call
- **Memory**: Conversation history

## Quick Start
```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatAnthropic({ model: "claude-sonnet-4-20250514" });
const response = await model.invoke([new HumanMessage("Hello")]);
```

## Links
- Docs: https://js.langchain.com
- Python: https://python.langchain.com
