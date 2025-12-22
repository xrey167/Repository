# Claude Code

Anthropic's CLI coding assistant.

## Installation
```bash
npm install -g @anthropic-ai/claude-code
```

## Features
- **Terminal**: Full shell access
- **Edit**: Direct file modifications
- **Multi-file**: Understands project context
- **MCP**: Model Context Protocol support

## Configuration
```
.claude/
├── CLAUDE.md        # Project instructions
├── settings.json    # Local settings
└── plans/           # Plan mode files
```

## Commands
| Command | Description |
|---------|-------------|
| `/init` | Create CLAUDE.md |
| `/help` | Show commands |
| `/clear` | Clear context |

## Links
- Docs: https://docs.anthropic.com/claude-code
