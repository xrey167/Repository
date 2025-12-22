# Happy Coder 🤖

AI Agents project with reference documentation for AI services and frameworks.

## Quick Start

```bash
bun install          # Install dependencies
cp .env.example .env # Set up environment
bun run dev          # Run development
```

## Project Structure

```
agents/
├── src/                    # Source code
│   ├── agents/             # Agent implementations
│   ├── tools/              # Agent tools
│   ├── memory/             # Context memory
│   ├── prompts/            # Prompt templates
│   └── config/             # Configuration
└── tests/                  # Test files
```

## Documentation

### [LLM Providers](./llm-providers/)
| Service | Description |
|---------|-------------|
| [OpenAI](./llm-providers/openai/) | GPT-4, GPT-4o, o1 |
| [Anthropic](./llm-providers/anthropic/) | Claude models |
| [Google](./llm-providers/google/) | Gemini |
| [Meta](./llm-providers/meta/) | Llama models |

### [Coding Assistants](./coding-assistants/)
| Service | Description |
|---------|-------------|
| [Cursor](./coding-assistants/cursor/) | AI-first IDE |
| [GitHub Copilot](./coding-assistants/copilot/) | AI pair programmer |
| [Claude Code](./coding-assistants/claude-code/) | Anthropic CLI |
| [Codeium](./coding-assistants/codeium/) | Free AI autocomplete |

### [Agent Frameworks](./agent-frameworks/)
| Framework | Description |
|-----------|-------------|
| [LangChain](./agent-frameworks/langchain/) | LLM application framework |
| [CrewAI](./agent-frameworks/crewai/) | Multi-agent orchestration |
| [AutoGen](./agent-frameworks/autogen/) | Microsoft multi-agent |
| [Claude Agent SDK](./agent-frameworks/claude-agent-sdk/) | Anthropic agent toolkit |

### [AI Platforms](./ai-platforms/)
| Platform | Description |
|----------|-------------|
| [Hugging Face](./ai-platforms/huggingface/) | Model hub & inference |
| [Replicate](./ai-platforms/replicate/) | Run models via API |
| [Groq](./ai-platforms/groq/) | Ultra-fast inference |
| [Together AI](./ai-platforms/together/) | Open-source models |

### [Specialized Services](./specialized/)
| Service | Description |
|---------|-------------|
| [ElevenLabs](./specialized/elevenlabs/) | Voice synthesis |
| [Midjourney](./specialized/midjourney/) | Image generation |
| [Runway](./specialized/runway/) | Video AI |
| [Stability AI](./specialized/stability/) | Stable Diffusion |

## Environment Variables

API keys can be set in Windows environment variables (shared) or `.env` file (project-specific).

See [.env.example](./.env.example) for required variables.
