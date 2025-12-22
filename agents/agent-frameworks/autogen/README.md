# AutoGen

Microsoft's multi-agent conversation framework.

## Installation
```bash
pip install autogen-agentchat
```

## Key Concepts
- **ConversableAgent**: Base agent class
- **AssistantAgent**: LLM-powered agent
- **UserProxyAgent**: Human-in-the-loop
- **GroupChat**: Multi-agent conversations

## Quick Start
```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent("assistant", llm_config={"model": "gpt-4o"})
user = UserProxyAgent("user", human_input_mode="NEVER")

user.initiate_chat(assistant, message="Write a hello world in Python")
```

## Links
- Docs: https://microsoft.github.io/autogen
