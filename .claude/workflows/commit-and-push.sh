#!/bin/bash
# Workflow: Commit and push all changes across all projects

set -e

echo "🔄 Starting commit and push workflow..."

# Function to commit and push a project
commit_push_project() {
  local project=$1
  local branch=$2

  cd "$project"

  # Check if there are changes
  if [[ -z $(git status --porcelain) ]]; then
    echo "  ✓ $project - No changes"
    cd ..
    return 0
  fi

  echo "  📝 $project - Changes detected"

  # Show status
  git status --short

  # Add all changes
  git add .

  # Generate commit message
  local timestamp=$(date +"%Y-%m-%d %H:%M")
  local commit_msg="Update $project [$timestamp]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

  # Commit
  git commit -m "$commit_msg"

  # Push
  git push origin "$branch"

  echo "  ✅ $project - Committed and pushed"

  cd ..
}

# Process each project
commit_push_project "agents" "agents"
commit_push_project "algotrading" "algotrading"
commit_push_project "github" "github"
commit_push_project "n8n" "n8n"
commit_push_project "notion" "notion"
commit_push_project "erp" "erp"

# Handle main branch if needed
if [[ -n $(git --git-dir=.bare status --porcelain) ]]; then
  echo "  📝 main - Changes detected in root"
  git --git-dir=.bare add -A
  git --git-dir=.bare commit -m "Update repository root [$(date +"%Y-%m-%d %H:%M")]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
  git --git-dir=.bare push origin main
  echo "  ✅ main - Committed and pushed"
fi

echo "✅ All projects updated successfully!"
