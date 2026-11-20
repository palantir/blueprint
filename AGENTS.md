# Blueprint.js Agentic Development Guide

## Build/Test Commands

- **Build**: `pnpm compile` (all packages), `pnpm turbo run compile --filter=@blueprintjs/core` (single package)
- **Test all**: `pnpm test`
- **Test single package**: `pnpm turbo run test:vitest:run --filter=@blueprintjs/core` or `cd packages/core && pnpm test:vitest:run`
- **Distribute**: `pnpm dist`, `pnpm turbo run dist --filter=@blueprintjs/core` (single package)
- **Lint**: `pnpm lint`, `pnpm lint-fix` (auto-fix), `pnpm turbo run lint --filter=@blueprintjs/core` (single package)
- **Format**: `pnpm format`, `pnpm format-check`
- **Pre-commit hook**: `pnpm exec lint-staged` (via `.husky/pre-commit`)
- **Verify all**: `pnpm verify` (compile + dist + test + lint + format-check)

## Architecture

- **Monorepo** using pnpm workspaces + Turborepo task runner (cached, see `turbo.json`)
- **Package manager**: pnpm v10.29.3 (strict dependency resolution)
- **Packages**: Core UI components in `packages/` - core, datetime, select, table, icons, colors
- **Apps**: docs-app (blueprintjs.com), demo-app, table-dev-app for development
- **Build tools**: node-build-scripts, webpack-build-scripts
- **Testing**: Vitest (components), Jest (build scripts), Enzyme + Chai + Sinon
    - New tests should be written with React Testing Library (RTL)

## Code Style

- **Prettier**: 120 char width, 4-space tabs (2 for SCSS/YAML), trailing commas
- **ESLint**: TypeScript-ESLint + custom @blueprintjs rules, no console.log
- **Imports**: Use workspace: deps
- **Types**: Strict TypeScript, React 18 peer deps
- **Components**: Follow existing patterns in packages/core/src/components/
- **Styling**: SCSS in src/, compiled to lib/css/
