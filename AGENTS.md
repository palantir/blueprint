# Blueprint.js Agentic Development Guide

## Build/Test Commands

-   **Build**: `yarn compile` (all packages), `yarn nx compile @blueprintjs/core` (single package)
-   **Test all**: `yarn test`, `nx run-many -t test`
-   **Test single package**: `yarn nx test:karma @blueprintjs/core` or `cd packages/core && yarn test:karma`
-   **Distribute**: `yarn dist`, `yarn nx dist @blueprintjs/core` (single package)
-   **Lint**: `yarn lint`, `yarn lint-fix` (auto-fix), `yarn nx lint @blueprintjs/core` (single package)
-   **Format**: `yarn format`, `yarn format-check`
-   **Verify all**: `yarn verify` (compile + dist + test + lint + format-check)

## Architecture

-   **Monorepo** using Yarn workspaces + Nx task runner
-   **Packages**: Core UI components in `packages/` - core, datetime, select, table, icons, colors
-   **Apps**: docs-app (blueprintjs.com), demo-app, table-dev-app for development
-   **Build tools**: karma-build-scripts, node-build-scripts, webpack-build-scripts
-   **Testing**: Mocha + Karma (components), Jest (build scripts), Enzyme + Chai + Sinon
    -   New tests should be written with React Testing Library (RTL)

## Code Style

-   **Prettier**: 120 char width, 4-space tabs (2 for SCSS/YAML), trailing commas
-   **ESLint**: TypeScript-ESLint + custom @blueprintjs rules, no console.log
-   **Imports**: Use workspace: deps, no lodash-es (use lodash submodules)
-   **Types**: Strict TypeScript, React 18 peer deps
-   **Components**: Follow existing patterns in packages/core/src/components/
-   **Styling**: SCSS in src/, compiled to lib/css/
