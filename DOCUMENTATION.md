# Documentation Setup Guide

This repository uses a multi-tiered documentation system designed for the monorepo structure.

## Documentation Tools

### 1. **Docusaurus** - Central Documentation Hub

**Location:** `/docs`
**Purpose:** Main documentation portal aggregating all project docs
**URL:** https://xrey167.github.io/Repository/

**Features:**
- Landing page and project overviews
- Tutorials and guides
- Integrated API documentation
- Search functionality
- Dark mode support

**Commands:**
```bash
cd docs/
bun install
bun start          # Development server (http://localhost:3000)
bun run build      # Production build
bun run serve      # Serve production build locally
```

### 2. **TypeDoc** - TypeScript API Documentation

**Location:** `<project>/docs/api`
**Purpose:** Auto-generate API docs from TypeScript source code
**Projects:** agents, algotrading, github, n8n, notion

**Features:**
- Automatic API reference from code
- Markdown output (integrates with Docusaurus)
- Type information and signatures
- Source code links

**Commands (per project):**
```bash
cd agents/  # or any TypeScript project
bun run docs:generate    # Generate documentation
bun run docs:watch       # Watch mode for development
```

**Configuration:** `typedoc.json` in each project root

### 3. **Sphinx** - Python Documentation

**Location:** `erp/docs`
**Purpose:** Document Python/Odoo modules
**Status:** To be configured

**Setup (coming soon):**
```bash
cd erp/
pip install sphinx sphinx-rtd-theme
sphinx-quickstart docs
sphinx-build -b html docs docs/_build
```

## Documentation Structure

```
Repository/
├── docs/                          # Docusaurus site (main hub)
│   ├── docs/                     # Documentation content
│   │   └── intro.md              # Getting started
│   ├── blog/                     # Blog posts
│   ├── src/                      # Docusaurus source
│   ├── static/                   # Static assets
│   ├── docusaurus.config.ts      # Docusaurus configuration
│   ├── sidebars.ts               # Sidebar structure
│   └── package.json              # Dependencies
│
├── agents/
│   ├── docs/                     # TypeDoc output
│   │   └── api/                  # Generated API docs
│   ├── src/                      # Source code (documented)
│   ├── typedoc.json              # TypeDoc configuration
│   └── package.json              # Includes docs:generate script
│
├── algotrading/
│   ├── docs/api/                 # TypeDoc output
│   └── typedoc.json
│
├── github/
│   ├── docs/api/
│   └── typedoc.json
│
├── n8n/
│   ├── docs/api/
│   └── typedoc.json
│
├── notion/
│   ├── docs/api/
│   └── typedoc.json
│
├── erp/
│   ├── docs/                     # Sphinx output
│   │   ├── conf.py               # Sphinx configuration
│   │   └── index.rst             # Documentation index
│   └── INSTALLATION_GUIDE.md     # Manual documentation
│
└── .github/workflows/
    └── docs.yml                  # Automated documentation build
```

## GitHub Pages Deployment

Documentation is automatically built and deployed to GitHub Pages when changes are pushed to the `main` branch.

**Workflow:** `.github/workflows/docs.yml`

### Build Process:
1. **Generate API Docs** - TypeDoc generates API docs from source code
2. **Build Docusaurus** - Compiles the documentation site
3. **Deploy to Pages** - Publishes to https://xrey167.github.io/Repository/

### Manual Deployment:

```bash
# From docs directory
cd docs/
bun run build

# Deploy to GitHub Pages (requires gh CLI)
gh-pages -d build
```

## Writing Documentation

### Adding a New Tutorial

1. Create a markdown file in `docs/docs/`:
```bash
touch docs/docs/my-tutorial.md
```

2. Add frontmatter:
```markdown
---
sidebar_position: 2
title: My Tutorial
---

# My Tutorial

Your content here...
```

### Adding a Blog Post

1. Create a markdown file in `docs/blog/`:
```bash
touch docs/blog/2025-12-22-my-post.md
```

2. Add frontmatter:
```markdown
---
title: My Blog Post
authors: [yourname]
tags: [typescript, documentation]
---

Your post content...
```

### Documenting TypeScript Code

Add JSDoc comments to your code:

```typescript
/**
 * Creates a new AI agent with specified configuration
 *
 * @param config - Agent configuration options
 * @param config.name - Name of the agent
 * @param config.model - LLM model to use
 * @returns Configured agent instance
 *
 * @example
 * ```ts
 * const agent = createAgent({
 *   name: 'Assistant',
 *   model: 'claude-sonnet-4'
 * });
 * ```
 */
export function createAgent(config: AgentConfig): Agent {
  // Implementation
}
```

TypeDoc will automatically generate documentation from these comments.

## Configuration Files

### TypeDoc Configuration (`typedoc.json`)

```json
{
  "entryPoints": ["./src/index.ts"],
  "out": "./docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "readme": "./README.md",
  "excludePrivate": true,
  "includeVersion": true
}
```

### Docusaurus Configuration (`docusaurus.config.ts`)

Key settings:
- **url**: https://xrey167.github.io
- **baseUrl**: /Repository/
- **organizationName**: xrey167
- **projectName**: Repository

## Best Practices

### 1. **Keep Documentation Close to Code**
- Write JSDoc comments in source code
- Update docs when code changes
- Link to source code from documentation

### 2. **Use Clear Examples**
- Provide code examples in tutorials
- Show both input and expected output
- Include error handling examples

### 3. **Update Regularly**
- Regenerate API docs after code changes
- Review documentation in pull requests
- Keep tutorials up to date with latest features

### 4. **Cross-Reference**
- Link between related documentation
- Reference API docs from tutorials
- Include "See also" sections

### 5. **Test Documentation**
- Verify code examples actually work
- Check links aren't broken
- Test documentation build locally

## Local Development

### Start Documentation Server

```bash
cd docs/
bun start
```

Visit http://localhost:3000/Repository/

### Watch Mode for API Docs

```bash
cd agents/
bun run docs:watch
```

This will regenerate API docs whenever source files change.

### Full Documentation Build

```bash
# 1. Generate all API documentation
cd agents && bun run docs:generate && cd ..
cd algotrading && bun run docs:generate && cd ..
cd github && bun run docs:generate && cd ..
cd n8n && bun run docs:generate && cd ..
cd notion && bun run docs:generate && cd ..

# 2. Build Docusaurus
cd docs && bun run build
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
cd docs/
rm -rf .docusaurus build
bun run build
```

### TypeDoc Not Generating

```bash
# Verify TypeDoc is installed
cd agents/
bun install

# Check configuration
cat typedoc.json

# Run with verbose output
bunx typedoc --logLevel Verbose
```

### Broken Links

Docusaurus will fail the build on broken links. Fix them before deploying:
- Check file paths are correct
- Verify external URLs are valid
- Update links when files are moved

## Next Steps

1. **Configure Sphinx for ERP project**
   - Set up Python documentation
   - Document Odoo modules

2. **Add TypeDoc to other projects**
   - Configure algotrading, github, n8n, notion
   - Generate API docs for each

3. **Create More Tutorials**
   - Getting started guides
   - Architecture overviews
   - Integration examples

4. **Set up Search**
   - Configure Algolia DocSearch
   - Or use local search plugin

5. **Add Versioning**
   - Version documentation with releases
   - Maintain docs for multiple versions

## Resources

- **Docusaurus**: https://docusaurus.io/docs
- **TypeDoc**: https://typedoc.org
- **Sphinx**: https://www.sphinx-doc.org
- **JSDoc**: https://jsdoc.app
- **GitHub Pages**: https://docs.github.com/pages

## Contact

For documentation questions or issues:
- **GitHub Issues**: https://github.com/xrey167/Repository/issues
- **Repository**: https://github.com/xrey167/Repository

---

**Last Updated:** 2025-12-22
