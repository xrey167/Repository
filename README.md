# Repository

Multi-project monorepo containing various software projects.

## Projects

### 🤖 [agents/](./agents/)
AI/LLM agent systems and documentation for various AI platforms, frameworks, and tools.

### 🏢 [erp/](./erp/)
Enterprise Resource Planning - Odoo installation and configuration.

### 🔄 [n8n/](./n8n/)
n8n workflow automation integrations.

### 🐙 [github/](./github/)
GitHub integrations and tools.

### 📈 [algotrading/](./algotrading/)
Algorithmic trading systems.

### 📝 [notion/](./notion/)
Notion API integrations.

## Repository Structure

This repository uses Git worktrees for managing multiple projects:

```
Repository/
├── agents/           # AI/LLM agents project
├── erp/              # Odoo ERP system
├── n8n/              # n8n workflows
├── github/           # GitHub tools
├── algotrading/      # Trading systems
├── notion/           # Notion integrations
├── .github/          # CI/CD workflows
└── .gitignore        # Global gitignore
```

## Development

Each project has its own `CLAUDE.md` file with project-specific development notes and build instructions.

### Git Worktree Setup

See [`.git-worktree-info.md`](./.git-worktree-info.md) for details on the worktree configuration.

## Contributing

Each project may have different contribution guidelines. Check the respective project directories for details.
