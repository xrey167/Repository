# Git Workflow Guide

## Repository Overview

**GitHub Repository:** https://github.com/xrey167/Repository.git
**Type:** Multi-project monorepo with Git worktrees
**User:** Darius Rey (xrey167@users.noreply.github.com)

## Current Setup Status ✅

All projects are now properly configured and synced with GitHub:

| Project | Branch | Status | Latest Commit |
|---------|--------|--------|---------------|
| agents | agents | ✅ Synced | e6c91b1 |
| algotrading | algotrading | ✅ Synced | fdd18cb |
| github | github | ✅ Synced | cf433ac |
| n8n | n8n | ✅ Synced | 9e722b1 |
| notion | notion | ✅ Synced | 5e97b1b |
| erp | erp | ✅ Synced | 34ac7e3 |

## Daily Git Workflow

### 1. Working on a Single Project

```bash
# Navigate to project
cd agents/

# Check status
git status

# Make your changes...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Your commit message"

# Push to GitHub
git push origin agents
```

### 2. Working Across Multiple Projects

```bash
# Work on agents
cd agents/
# ... make changes ...
git add .
git commit -m "Update agents"
git push origin agents

# Switch to algotrading
cd ../algotrading/
# ... make changes ...
git add .
git commit -m "Update algotrading"
git push origin algotrading
```

### 3. Check Status of All Projects

```bash
# From repository root
./git-wt.sh list

# Or manually check each
for dir in agents algotrading github n8n notion erp; do
    echo "=== $dir ==="
    cd "$dir" && git status --short && cd ..
done
```

## Helper Script Commands

The `git-wt.sh` script provides shortcuts:

```bash
# List all worktrees
./git-wt.sh list

# View all branches
./git-wt.sh branches

# Push all branches at once
./git-wt.sh push-all

# Pull updates for all branches
./git-wt.sh pull-all

# Show help
./git-wt.sh help
```

## Common Git Commands

### For Individual Projects (run inside project directory)

```bash
cd agents/  # or any project

# Check status
git status

# View commit history
git log --oneline -10

# View what changed
git diff

# Stage specific files
git add src/index.ts

# Stage all changes
git add .

# Commit
git commit -m "Your message"

# Push to remote
git push origin agents  # use correct branch name

# Pull latest changes
git pull origin agents

# Create new branch from current
git checkout -b feature-name

# Switch branches
git checkout main
```

### For All Projects (run from repository root)

```bash
# View all worktrees
git --git-dir=.bare worktree list

# View all branches (local and remote)
git --git-dir=.bare branch -a

# View commit log across all branches
git --git-dir=.bare log --all --oneline --graph -20

# Fetch all remote changes
git --git-dir=.bare fetch --all

# Push all branches
git --git-dir=.bare push origin --all
```

## Best Practices

### ✅ DO

- **Commit frequently** - Small, focused commits are better
- **Write clear commit messages** - Describe what and why
- **Push regularly** - Push to GitHub at least daily
- **Check status before committing** - Use `git status`
- **Pull before starting work** - Use `./git-wt.sh pull-all`
- **Keep branches synced** - Don't let them drift too far apart
- **Use .env.example** - Template for environment variables
- **Keep .env private** - Already in .gitignore

### ❌ DON'T

- **Don't commit .env files** - They contain secrets (already gitignored)
- **Don't commit node_modules/** - Already gitignored
- **Don't force push** - Unless absolutely necessary
- **Don't commit to main** - Use project-specific branches
- **Don't mix changes** - Keep commits focused on one task
- **Don't commit sensitive data** - API keys, passwords, tokens

## Commit Message Format

Use clear, descriptive commit messages:

```bash
# Good examples
git commit -m "Add user authentication feature"
git commit -m "Fix memory leak in data processor"
git commit -m "Update dependencies to latest versions"
git commit -m "Refactor database connection logic"

# Bad examples (too vague)
git commit -m "Update"
git commit -m "Fix"
git commit -m "Changes"
```

### Standard Format

```
Brief summary (50 chars or less)

More detailed explanation if needed. Wrap at 72 characters.
Explain what changed and why, not how.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Syncing with GitHub

### Morning Routine

```bash
# Pull latest changes for all projects
./git-wt.sh pull-all

# Or manually for each project
cd agents/ && git pull origin agents && cd ..
cd algotrading/ && git pull origin algotrading && cd ..
# etc...
```

### End of Day Routine

```bash
# Check what changed in each project
./git-wt.sh list

# Commit and push each project with changes
cd agents/
git add .
git commit -m "Summary of today's work"
git push origin agents
cd ..

# Or push all at once (if already committed)
./git-wt.sh push-all
```

## Handling Merge Conflicts

If you get merge conflicts when pulling:

```bash
# Pull and see conflict
git pull origin agents

# Git will mark conflicts in files
# Edit files and resolve conflicts

# After resolving, stage the files
git add .

# Complete the merge
git commit -m "Merge remote changes"

# Push
git push origin agents
```

## Creating New Features

### Using Feature Branches (Optional)

```bash
cd agents/

# Create feature branch from agents
git checkout -b feature-auth

# Work on feature...
git add .
git commit -m "Add authentication"

# Merge back to agents
git checkout agents
git merge feature-auth

# Push to GitHub
git push origin agents

# Delete feature branch
git branch -d feature-auth
```

## Viewing History

```bash
# View commits for current project
git log --oneline -20

# View commits with changes
git log -p -5

# View graphical history
git log --oneline --graph --all -20

# Search commits
git log --grep="authentication"

# View who changed a file
git blame src/index.ts
```

## Undoing Changes

```bash
# Discard changes in working directory (CAREFUL!)
git checkout -- filename

# Unstage a file
git reset HEAD filename

# Amend last commit (ONLY if not pushed!)
git commit --amend -m "New message"

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) (CAREFUL!)
git reset --hard HEAD~1
```

## GitHub Repository Structure

On GitHub, you'll see these branches:

- `main` - Base/shared branch
- `agents` - AI/LLM agents project ✅
- `algotrading` - Algorithmic trading project ✅
- `github` - GitHub integrations project ✅
- `n8n` - n8n workflow automation project ✅
- `notion` - Notion API integrations project ✅
- `erp` - Odoo ERP project ✅

Each branch contains the complete project for that module.

## Quick Reference

| Task | Command |
|------|---------|
| Check all project status | `./git-wt.sh list` |
| Push all projects | `./git-wt.sh push-all` |
| Pull all projects | `./git-wt.sh pull-all` |
| Check single project | `cd agents/ && git status` |
| Commit changes | `git add . && git commit -m "message"` |
| Push single project | `git push origin agents` |
| View history | `git log --oneline -10` |
| View all branches | `git --git-dir=.bare branch -a` |

## Troubleshooting

### "Permission denied" when pushing

```bash
# Check remote URL
git remote -v

# Should be HTTPS (not SSH if you don't have keys set up)
# If wrong, update it:
git remote set-url origin https://github.com/xrey167/Repository.git
```

### "Diverged branches" error

```bash
# Pull first, then push
git pull origin agents
git push origin agents

# Or if you're sure your changes should override
git push origin agents --force  # CAREFUL!
```

### "Working directory not clean"

```bash
# Stash changes temporarily
git stash

# Pull changes
git pull origin agents

# Reapply your changes
git stash pop
```

## Environment Files

**Never commit these:**
- `.env` - Your actual API keys (gitignored)
- `.env.local` - Local overrides (gitignored)

**Always commit these:**
- `.env.example` - Template for other developers ✅

## Next Steps

1. **Clone elsewhere:** `git clone https://github.com/xrey167/Repository.git`
2. **Set up CI/CD:** GitHub Actions already configured
3. **Create PRs:** Use feature branches and pull requests
4. **Add collaborators:** Settings → Collaborators on GitHub
5. **Protect branches:** Settings → Branches → Add protection rules

---

**Repository:** https://github.com/xrey167/Repository
**Last Updated:** 2025-12-22
