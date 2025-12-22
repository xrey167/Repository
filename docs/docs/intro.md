---
sidebar_position: 1
---

# Welcome to Repository Documentation

This is the central documentation hub for the multi-project monorepo.

## 🎯 Projects Overview

### 🤖 Agents
AI/LLM agent systems with support for multiple providers (Anthropic, OpenAI).
- **Status**: Fully implemented
- **Tech Stack**: Bun, TypeScript, Anthropic SDK, OpenAI SDK
- **Documentation**: API docs generated with TypeDoc

### 📈 AlgoTrading
Algorithmic trading systems and strategies.
- **Status**: Scaffolded
- **Tech Stack**: Bun, TypeScript
- **Use Cases**: Trading bots, market analysis, backtesting

### 🔗 GitHub
GitHub integrations and automation tools.
- **Status**: Scaffolded
- **Tech Stack**: Bun, TypeScript
- **Use Cases**: Webhooks, automation, CI/CD integrations

### 🔄 n8n
n8n workflow automation integrations.
- **Status**: Scaffolded
- **Tech Stack**: Bun, TypeScript
- **Use Cases**: Workflow automation, API integrations

### 📝 Notion
Notion API integrations and tools.
- **Status**: Scaffolded
- **Tech Stack**: Bun, TypeScript
- **Use Cases**: Database sync, content management

### 🏢 ERP
Enterprise Resource Planning (Odoo 17).
- **Status**: Installation guide available
- **Tech Stack**: Python, PostgreSQL, Odoo 17
- **Platform**: WSL2 Ubuntu 24.04

## 🚀 Getting Started

### Prerequisites
- **Bun** - Fast JavaScript runtime and package manager
- **TypeScript 5.7+** - For TypeScript projects
- **Python 3.11+** - For ERP project
- **Git** - Version control with worktree support

### Quick Start

```bash
# Clone the repository
git clone https://github.com/xrey167/Repository.git
cd Repository

# Choose a project
cd agents/  # or algotrading/, github/, n8n/, notion/, erp/

# Install dependencies
bun install  # for TypeScript projects

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Run the project
bun run dev
```

## 📚 Architecture

This repository uses **Git worktrees** for managing multiple projects:
- ✅ Each project has its own branch
- ✅ All projects share the same Git history
- ✅ Work on multiple projects simultaneously without branch switching
- ✅ Independent CI/CD pipelines per project

See the [Git Workflow Guide](https://github.com/xrey167/Repository/blob/main/GIT_WORKFLOW.md) for details.

## 📖 Documentation Tools

- **Docusaurus** - This documentation site
- **TypeDoc** - API documentation for TypeScript projects
- **Sphinx** - Documentation for Python/ERP project (coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📧 Contact

- **GitHub**: [@xrey167](https://github.com/xrey167)
- **Repository**: [xrey167/Repository](https://github.com/xrey167/Repository)
