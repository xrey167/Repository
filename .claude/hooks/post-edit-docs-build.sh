#!/bin/bash
# Auto-build documentation after editing TypeScript source files

CHANGED_FILE="$1"
TOOL_NAME="$2"

# Only process TypeScript files in src directories
if [[ ! "$CHANGED_FILE" =~ src/.*\.ts$ ]]; then
  exit 0
fi

# Determine which project was edited
if [[ "$CHANGED_FILE" =~ ^agents/ ]]; then
  PROJECT="agents"
elif [[ "$CHANGED_FILE" =~ ^algotrading/ ]]; then
  PROJECT="algotrading"
elif [[ "$CHANGED_FILE" =~ ^github/ ]]; then
  PROJECT="github"
elif [[ "$CHANGED_FILE" =~ ^n8n/ ]]; then
  PROJECT="n8n"
elif [[ "$CHANGED_FILE" =~ ^notion/ ]]; then
  PROJECT="notion"
else
  exit 0
fi

echo "📚 Auto-generating documentation for $PROJECT..."

# Generate TypeDoc documentation
cd "$PROJECT" && bun run docs:generate 2>&1 | grep -E "(info|error|generated)"

if [ $? -eq 0 ]; then
  echo "✅ Documentation regenerated for $PROJECT"
else
  echo "⚠️  Documentation generation failed for $PROJECT"
fi
