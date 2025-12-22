# LangChain

## Overview
LangChain is a framework for building applications powered by language models. Provides composable components for chains, agents, memory, and integrations.

## Key Features
- Modular components
- Agent architectures
- Memory management
- Tool integration
- Vector store support
- Prompt templates
- Output parsers

## Components

| Component | Description | Use Case |
|-----------|-------------|----------|
| LLMs/Chat Models | Model wrappers | Core inference |
| Chains | Linked components | Sequential tasks |
| Agents | Autonomous reasoning | Dynamic workflows |
| Memory | Conversation state | Chat history |
| Retrievers | Document fetching | RAG |
| Tools | External capabilities | Actions |

## Installation

```bash
# Python
pip install langchain langchain-openai langchain-anthropic

# JavaScript
npm install langchain @langchain/openai @langchain/anthropic
```

## Example

```python
from langchain_openai import ChatOpenAI
from langchain.agents import create_react_agent

llm = ChatOpenAI(model="gpt-4o")
agent = create_react_agent(llm, tools, prompt)
```

## Ecosystem
- **LangSmith**: Tracing and evaluation
- **LangServe**: Deploy as APIs
- **LangGraph**: Stateful agents

## Use Cases
- RAG applications
- Chatbots with memory
- Autonomous agents
- Document Q&A
- Data extraction

## Links
- [Website](https://langchain.com)
- [Python Docs](https://python.langchain.com)
- [JS Docs](https://js.langchain.com)
- [GitHub](https://github.com/langchain-ai/langchain)
- [LangSmith](https://smith.langchain.com)
