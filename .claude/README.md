# Claude Hooks & Workflows - Quick Start

## 🚀 Quick Start

### Run Manual Workflows

```bash
# Build all documentation
./.claude/workflows/build-all-docs.sh

# Commit and push all changes
./.claude/workflows/commit-and-push.sh
```

### Enable Auto-Documentation Hook

The auto-documentation hook is **enabled by default**. It automatically regenerates TypeDoc when you edit TypeScript files.

**No action needed** - it works automatically!

### Enable Auto-Git Workflow (Optional)

To auto-commit at session end, edit `.claude/hooks/auto-git-workflow.json`:

```json
{
  "enabled": true  // Change from false to true
}
```

## 📁 What's Included

### Hooks (Auto-trigger)

| Hook | Event | Status | Purpose |
|------|-------|--------|---------|
| `auto-docs.json` | PostToolUse | ✅ Enabled | Auto-generate TypeDoc on code changes |
| `auto-git-workflow.json` | SessionEnd | ⏸️ Disabled | Prompt to commit at session end |
| `post-edit-docs-build.sh` | PostToolUse | ✅ Enabled | Documentation rebuild script |

### Workflows (Manual)

| Script | Purpose |
|--------|---------|
| `commit-and-push.sh` | Commit and push all projects |
| `build-all-docs.sh` | Build all documentation |

## 🎯 Common Use Cases

### Use Case 1: Auto-Update Docs While Coding

**What happens:**
1. You edit `agents/src/index.ts`
2. Hook auto-runs `bun run docs:generate`
3. API docs regenerate automatically

**Status:** ✅ Already active

### Use Case 2: End of Day Commit

**What happens:**
1. You finish coding for the day
2. End your Claude session (Ctrl+C)
3. Hook prompts you to commit changes
4. Confirms and pushes all projects

**Status:** ⏸️ Disabled (enable in `auto-git-workflow.json`)

### Use Case 3: Build Before Deploy

**What to run:**
```bash
./.claude/workflows/build-all-docs.sh
./.claude/workflows/commit-and-push.sh
```

**Result:** All docs built and pushed to GitHub

## 📖 Full Documentation

See `.claude/HOOKS_GUIDE.md` for complete documentation including:
- Creating custom hooks
- Advanced workflows
- Troubleshooting
- Security best practices

## 🔧 Configuration Files

```
.claude/
├── hooks/                      # Auto-triggered hooks
│   ├── auto-docs.json         # ✅ Auto-generate docs
│   ├── auto-git-workflow.json # ⏸️ Auto-commit workflow
│   └── post-edit-docs-build.sh
│
├── workflows/                  # Manual workflows
│   ├── build-all-docs.sh      # Build everything
│   └── commit-and-push.sh     # Commit everything
│
├── HOOKS_GUIDE.md             # Full documentation
└── README.md                  # This file
```

## ✅ Testing

Test that hooks are working:

```bash
# 1. Edit a TypeScript file
# Edit agents/src/index.ts

# 2. Check if docs regenerated
ls -la agents/docs/api/

# 3. Run manual workflow
./.claude/workflows/build-all-docs.sh
```

## 🎛️ Enable/Disable Hooks

Edit the hook JSON files:

```json
{
  "enabled": true,   // Enable hook
  "enabled": false   // Disable hook
}
```

## 🆘 Troubleshooting

### Hook Not Working?

1. Check hook is enabled: `"enabled": true`
2. Make scripts executable: `chmod +x .claude/**/*.sh`
3. Check logs: `.claude/logs/` (if exists)

### Documentation Not Regenerating?

```bash
# Test manually
cd agents/
bun run docs:generate
```

### Permission Denied?

```bash
# Make all scripts executable
chmod +x .claude/hooks/*.sh
chmod +x .claude/workflows/*.sh
```

## 🔗 Quick Links

- **Full Guide**: `.claude/HOOKS_GUIDE.md`
- **Git Workflow**: `GIT_WORKFLOW.md`
- **Documentation**: `DOCUMENTATION.md`

---

**Status:** ✅ Hooks configured and ready to use!
