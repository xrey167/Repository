#!/bin/bash
# Workflow: Build all documentation

set -e

echo "📚 Building all documentation..."

# Generate TypeDoc for all TypeScript projects
echo "🔧 Generating TypeDoc API documentation..."

for project in agents algotrading github n8n notion; do
  if [ -f "$project/typedoc.json" ]; then
    echo "  → $project"
    cd "$project"
    bun run docs:generate 2>&1 | grep -E "(info|generated|error)" || echo "    No output"
    cd ..
    echo "  ✅ $project API docs generated"
  else
    echo "  ⏭️  $project - TypeDoc not configured yet"
  fi
done

# Build Docusaurus site
echo "🌐 Building Docusaurus documentation site..."
cd docs
bun run build 2>&1 | tail -5
echo "✅ Docusaurus build complete"
cd ..

# Optional: Build Sphinx docs for ERP (if configured)
if [ -f "erp/docs/conf.py" ]; then
  echo "📖 Building Sphinx documentation for ERP..."
  cd erp/docs
  sphinx-build -b html . _build
  echo "✅ Sphinx docs generated"
  cd ../..
else
  echo "⏭️  ERP Sphinx docs not configured yet"
fi

echo "✅ All documentation built successfully!"
echo ""
echo "📍 Documentation locations:"
echo "  - Agents API: agents/docs/api/"
echo "  - Docusaurus: docs/build/"
echo "  - Local preview: cd docs && bun run serve"
