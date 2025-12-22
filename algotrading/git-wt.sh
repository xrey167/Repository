#!/bin/bash
# Git Worktree Helper Script
# Usage: ./git-wt.sh <command> [args]

BARE_DIR=".bare"
GIT_CMD="git --git-dir=$BARE_DIR"

case "$1" in
    list|ls)
        echo "📋 Worktrees:"
        $GIT_CMD worktree list
        ;;

    branches|br)
        echo "🌿 Branches:"
        $GIT_CMD branch -a
        ;;

    add)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Usage: ./git-wt.sh add <name> <branch>"
            echo "Example: ./git-wt.sh add my-feature main"
            exit 1
        fi
        echo "➕ Adding worktree '$2' for branch '$3'..."
        $GIT_CMD worktree add "$2" "$3"
        ;;

    remove|rm)
        if [ -z "$2" ]; then
            echo "Usage: ./git-wt.sh remove <worktree-name>"
            echo "Example: ./git-wt.sh remove my-feature"
            exit 1
        fi
        echo "🗑️  Removing worktree '$2'..."
        $GIT_CMD worktree remove "$2"
        ;;

    status|st)
        echo "📊 Repository Status:"
        $GIT_CMD status
        ;;

    push-all)
        echo "⬆️  Pushing all branches..."
        $GIT_CMD push origin --all
        ;;

    pull-all)
        echo "⬇️  Pulling all branches..."
        for branch in $(git --git-dir=$BARE_DIR branch --format='%(refname:short)'); do
            echo "Updating $branch..."
            git --git-dir=$BARE_DIR fetch origin "$branch:$branch"
        done
        ;;

    help|--help|-h)
        echo "Git Worktree Helper"
        echo ""
        echo "Commands:"
        echo "  list, ls           - List all worktrees"
        echo "  branches, br       - Show all branches"
        echo "  add <name> <branch> - Add new worktree"
        echo "  remove, rm <name>  - Remove worktree"
        echo "  status, st         - Show repository status"
        echo "  push-all           - Push all branches to remote"
        echo "  pull-all           - Pull all branches from remote"
        echo "  help               - Show this help"
        echo ""
        echo "Examples:"
        echo "  ./git-wt.sh list"
        echo "  ./git-wt.sh add new-feature main"
        echo "  ./git-wt.sh remove old-feature"
        ;;

    *)
        echo "Unknown command: $1"
        echo "Run './git-wt.sh help' for usage"
        exit 1
        ;;
esac
