# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Project: AI/LLM Agents

Multi-agent system for automated task execution.

## Build Commands

```bash
# Install dependencies
bun install

# Run development
bun run dev

# Run tests
bun test

# Type check
bun run typecheck
```

## Architecture

- `src/agents/` - Individual agent implementations (extend BaseAgent)
- `src/tools/` - Tools available to agents (web search, file ops, etc.)
- `src/memory/` - Conversation and context memory
- `src/prompts/` - Agent prompt templates (.md files)
- `tests/` - Test files

## Documentation

Reference docs for AI services and frameworks (see [README.md](./README.md)):

- `llm-providers/` - LLM APIs (OpenAI, Anthropic, Google, Meta, etc.)
- `coding-assistants/` - AI coding tools (Copilot, Cursor, Codeium, etc.)
- `agent-frameworks/` - Agent libraries (LangChain, CrewAI, AutoGen, etc.)
- `ai-platforms/` - Inference platforms (Hugging Face, Replicate, Groq, etc.)
- `specialized/` - Domain-specific AI (ElevenLabs, Midjourney, Runway, etc.)

## Development Notes

- Use TypeScript for all source files
- Each agent extends BaseAgent class
- Tools must implement the Tool interface
- Keep agent system prompts in `src/prompts/` as .md files
