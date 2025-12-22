# Claude Hooks & Workflows Guide

This guide explains the automated hooks and workflows set up for this repository.

## Overview

The repository uses **Claude Code hooks** to automate:
- 📚 Documentation generation
- 🔄 Git commits and pushes
- 🏗️ Build processes
- 🚀 Deployment workflows

## Directory Structure

```
.claude/
├── hooks/                          # Event-driven automation
│   ├── auto-docs.json             # Auto-generate docs on file changes
│   ├── auto-git-workflow.json     # Git workflow at session end
│   └── post-edit-docs-build.sh    # Documentation rebuild script
│
└── workflows/                      # Manual/scripted workflows
    ├── commit-and-push.sh          # Commit all projects
    └── build-all-docs.sh           # Build all documentation
```

## Hooks

### 1. Auto-Documentation Generator

**File:** `.claude/hooks/auto-docs.json`
**Event:** `PostToolUse` (after Edit/Write tools)
**Trigger:** TypeScript files in `src/` directories

**What it does:**
- Watches for changes to `.ts` files in project `src/` directories
- Automatically runs `bun run docs:generate` for the affected project
- Regenerates TypeDoc API documentation

**Status:** ✅ Enabled by default

**Example:**
```bash
# When you edit agents/src/index.ts:
# Hook automatically runs: cd agents && bun run docs:generate
```

### 2. Auto-Git Workflow

**File:** `.claude/hooks/auto-git-workflow.json`
**Event:** `SessionEnd` (when conversation ends)
**Trigger:** End of Claude Code session

**What it does:**
- Shows status of all worktrees
- Prompts if you want to commit/push changes
- Displays changes across all projects

**Status:** ⏸️ Disabled by default (set `"enabled": true` to activate)

**Enable it:**
```json
{
  "enabled": true  // Change from false to true
}
```

## Workflows (Manual Scripts)

### 1. Commit and Push All

**File:** `.claude/workflows/commit-and-push.sh`
**Purpose:** Commit and push changes across all projects

**Usage:**
```bash
./.claude/workflows/commit-and-push.sh
```

**What it does:**
1. Checks each project for changes
2. Commits changes with timestamped messages
3. Pushes to respective branches (agents, algotrading, etc.)
4. Handles main branch separately

**Output:**
```
🔄 Starting commit and push workflow...
  ✓ agents - No changes
  📝 algotrading - Changes detected
  ✅ algotrading - Committed and pushed
  ...
✅ All projects updated successfully!
```

### 2. Build All Documentation

**File:** `.claude/workflows/build-all-docs.sh`
**Purpose:** Build all documentation (TypeDoc + Docusaurus)

**Usage:**
```bash
./.claude/workflows/build-all-docs.sh
```

**What it does:**
1. Generates TypeDoc API docs for all TS projects
2. Builds Docusaurus static site
3. Optionally builds Sphinx docs for ERP

**Output:**
```
📚 Building all documentation...
🔧 Generating TypeDoc API documentation...
  → agents
  ✅ agents API docs generated
  ...
🌐 Building Docusaurus documentation site...
✅ Docusaurus build complete
```

## Hook Event Types

Claude Code supports these hook events:

| Event | When it fires | Use case |
|-------|---------------|----------|
| `PreToolUse` | Before any tool execution | Validation, pre-checks |
| `PostToolUse` | After tool execution | Auto-rebuild, notifications |
| `SessionStart` | When session begins | Setup, initialization |
| `SessionEnd` | When session ends | Cleanup, auto-commit |
| `Stop` | After each AI response | Logging, analytics |

## Creating Custom Hooks

### JSON Hook Configuration

Create a `.json` file in `.claude/hooks/`:

```json
{
  "name": "my-custom-hook",
  "description": "Description of what this hook does",
  "event": "PostToolUse",
  "enabled": true,
  "filter": {
    "tools": ["Edit", "Write"],
    "pathPatterns": ["src/**/*.ts"]
  },
  "actions": [
    {
      "type": "bash",
      "command": "echo 'File changed!'",
      "description": "Notify about file change",
      "async": true
    }
  ]
}
```

### Bash Script Hook

Create a `.sh` file in `.claude/hooks/`:

```bash
#!/bin/bash
# Hook script receives arguments:
# $1 = file path (for file-related events)
# $2 = tool name (for tool-related events)

echo "Hook triggered for: $1 by $2"

# Your automation logic here
```

Make it executable:
```bash
chmod +x .claude/hooks/my-hook.sh
```

## Common Workflows

### Workflow 1: Edit Code → Auto-Generate Docs

```bash
# 1. Edit TypeScript file
# Manually: Edit agents/src/index.ts

# 2. Hook automatically triggers
# Runs: cd agents && bun run docs:generate

# 3. Documentation is updated
# Output: agents/docs/api/
```

### Workflow 2: Session End → Commit All

```bash
# 1. Enable auto-git-workflow hook
# Edit: .claude/hooks/auto-git-workflow.json
# Set: "enabled": true

# 2. Work on projects...

# 3. End session (Ctrl+C or close)
# Hook shows status and prompts for commit

# 4. Confirm to auto-commit all changes
```

### Workflow 3: Manual Build & Deploy

```bash
# 1. Build all documentation
./.claude/workflows/build-all-docs.sh

# 2. Commit and push everything
./.claude/workflows/commit-and-push.sh

# 3. GitHub Actions deploys docs automatically
# (from .github/workflows/docs.yml)
```

## Integration with Existing Tools

### Git Worktrees

Hooks work seamlessly with your git worktree setup:
- Each project hook operates in its own worktree
- Commits are made to the correct branch
- `git-wt.sh` helper script can be used in hooks

### Documentation System

Hooks integrate with your docs setup:
- **TypeDoc**: Auto-generates API docs from code changes
- **Docusaurus**: Can trigger rebuilds
- **GitHub Actions**: Deployment is automatic on push

### Existing GitHub Workflows

Hooks complement (don't replace) GitHub Actions:
- **Local hooks**: Fast feedback during development
- **GitHub Actions**: Production builds and deployment
- **Both**: Work together for complete automation

## Advanced Hook Examples

### Hook: Auto-Commit After Successful Build

```json
{
  "name": "auto-commit-on-build",
  "event": "PostToolUse",
  "enabled": false,
  "filter": {
    "tools": ["Bash"],
    "commandPatterns": ["bun run build"]
  },
  "actions": [
    {
      "type": "bash",
      "command": "git add dist/ && git commit -m 'Build: Update dist'",
      "description": "Auto-commit build output",
      "async": true
    }
  ]
}
```

### Hook: Notify on Test Failure

```json
{
  "name": "notify-test-failure",
  "event": "PostToolUse",
  "enabled": true,
  "filter": {
    "tools": ["Bash"],
    "commandPatterns": ["bun test"]
  },
  "actions": [
    {
      "type": "bash",
      "command": "if [ $? -ne 0 ]; then echo '❌ Tests failed!'; fi",
      "description": "Notify on test failure"
    }
  ]
}
```

### Hook: Auto-Format on Save

```json
{
  "name": "auto-format",
  "event": "PostToolUse",
  "enabled": true,
  "filter": {
    "tools": ["Edit", "Write"],
    "pathPatterns": ["**/*.ts", "**/*.tsx"]
  },
  "actions": [
    {
      "type": "bash",
      "command": "prettier --write $FILE_PATH",
      "description": "Auto-format TypeScript files"
    }
  ]
}
```

## Troubleshooting

### Hook Not Triggering

1. Check hook is enabled: `"enabled": true`
2. Verify event type matches your use case
3. Check filter patterns match your files
4. Look at `.claude/logs/` for hook execution logs

### Script Permission Denied

```bash
# Make scripts executable
chmod +x .claude/hooks/*.sh
chmod +x .claude/workflows/*.sh
```

### Hook Fails Silently

Enable verbose logging in hook:
```json
{
  "actions": [
    {
      "type": "bash",
      "command": "your-command 2>&1 | tee -a .claude/logs/hook.log",
      "async": false
    }
  ]
}
```

### Documentation Not Regenerating

Check TypeDoc configuration:
```bash
cd agents/
bun run docs:generate --logLevel Verbose
```

## Best Practices

### 1. Start with Hooks Disabled

Test hooks manually before enabling:
```json
{
  "enabled": false,  // Test first
  "note": "Enable after testing"
}
```

### 2. Use Async for Long Operations

For slow operations, use `"async": true`:
```json
{
  "async": true,  // Don't block Claude
  "command": "bun run build"
}
```

### 3. Add Descriptive Messages

Help future you understand what hooks do:
```json
{
  "description": "Why this hook exists and what it does",
  "actions": [
    {
      "description": "Specific action description"
    }
  ]
}
```

### 4. Test Incrementally

Don't enable all hooks at once:
1. Enable one hook
2. Test thoroughly
3. Move to next hook

### 5. Log Important Actions

Add logging to critical hooks:
```bash
echo "$(date): Hook triggered" >> .claude/logs/hooks.log
```

## Security Considerations

### Never Commit Secrets

Hooks run in your local environment - don't:
- Commit API keys in hook scripts
- Push `.claude/hooks/` if they contain sensitive data
- Add `.env` files to hooks

### Review Auto-Commit Hooks

Be cautious with hooks that auto-commit:
- Review what's being committed
- Avoid auto-pushing to `main` branch
- Use for development branches primarily

### Validate External Commands

If hooks call external scripts, validate them:
```bash
if [ -f "external-script.sh" ]; then
  ./external-script.sh
else
  echo "Script not found, skipping"
fi
```

## Example Use Cases

### Use Case 1: Documentation-Driven Development

```bash
# Hook: Auto-generate docs on code change
# Benefit: Always have up-to-date API docs
# Files: auto-docs.json (enabled)
```

### Use Case 2: Continuous Integration Locally

```bash
# Hook: Run tests after each edit
# Benefit: Catch errors immediately
# Files: Create test-on-edit.json
```

### Use Case 3: End-of-Day Commits

```bash
# Hook: Prompt to commit at session end
# Benefit: Never forget to commit work
# Files: auto-git-workflow.json (enable it)
```

## Related Documentation

- **Git Workflow Guide**: `GIT_WORKFLOW.md`
- **Documentation Guide**: `DOCUMENTATION.md`
- **Claude Hooks SDK**: https://github.com/anthropics/claude-hooks-sdk

## Quick Reference

| Command | Description |
|---------|-------------|
| `./.claude/workflows/commit-and-push.sh` | Commit/push all projects |
| `./.claude/workflows/build-all-docs.sh` | Build all documentation |
| `chmod +x .claude/**/*.sh` | Make all scripts executable |
| `cat .claude/logs/hooks.log` | View hook execution logs |

## Support

For hook-related issues:
- **Claude Code Docs**: https://claude.com/claude-code
- **GitHub Issues**: https://github.com/xrey167/Repository/issues
- **Hooks Guide**: This file

---

**Last Updated:** 2025-12-22
**Status:** ✅ Hooks configured and ready to use
