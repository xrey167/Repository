# Microsoft AutoGen

## Overview
AutoGen is Microsoft's framework for building multi-agent conversational systems. Enables agents to communicate and collaborate on complex tasks.

## Key Features
- Multi-agent conversations
- Code execution
- Human participation
- Flexible agent types
- Group chat support
- Function calling
- Nested conversations

## Components

| Component | Description |
|-----------|-------------|
| ConversableAgent | Base agent class |
| AssistantAgent | AI-powered agent |
| UserProxyAgent | Human/code executor |
| GroupChat | Multi-agent coordination |
| GroupChatManager | Conversation orchestrator |

## Installation

```bash
pip install pyautogen
```

## Example

```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent(
    name="assistant",
    llm_config={"model": "gpt-4o"}
)

user_proxy = UserProxyAgent(
    name="user_proxy",
    code_execution_config={"work_dir": "coding"}
)

user_proxy.initiate_chat(
    assistant,
    message="Write a Python function to calculate fibonacci"
)
```

## Agent Types
- **AssistantAgent**: LLM-powered helper
- **UserProxyAgent**: Human or code executor
- **GroupChatManager**: Orchestrates group discussions

## Use Cases
- Code generation and execution
- Complex problem solving
- Interactive debugging
- Research automation
- Collaborative analysis

## Links
- [Website](https://microsoft.github.io/autogen)
- [Documentation](https://microsoft.github.io/autogen/docs)
- [GitHub](https://github.com/microsoft/autogen)
- [Examples](https://microsoft.github.io/autogen/docs/Examples)
