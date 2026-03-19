# Blueprint.js Agentic Development Guide

## Build/Test Commands

- **Build**: `pnpm compile` (all packages), `pnpm nx compile @blueprintjs/core` (single package)
- **Test all**: `pnpm test`, `pnpm nx run-many -t test`
- **Test single package**: `pnpm nx test:karma @blueprintjs/core` or `cd packages/core && pnpm test:karma`
- **Distribute**: `pnpm dist`, `pnpm nx dist @blueprintjs/core` (single package)
- **Lint**: `pnpm lint`, `pnpm lint-fix` (auto-fix), `pnpm nx lint @blueprintjs/core` (single package)
- **Format**: `pnpm format`, `pnpm format-check`
- **Verify all**: `pnpm verify` (compile + dist + test + lint + format-check)

## Architecture

- **Monorepo** using pnpm workspaces + Nx task runner
- **Package manager**: pnpm v10.29.3 (strict dependency resolution)
- **Packages**: Core UI components in `packages/` - core, datetime, select, table, icons, colors
- **Apps**: docs-app (blueprintjs.com), demo-app, table-dev-app for development
- **Build tools**: karma-build-scripts, node-build-scripts, webpack-build-scripts
- **Testing**: Mocha + Karma (components), Jest (build scripts), Enzyme + Chai + Sinon
    - New tests should be written with React Testing Library (RTL)

## Code Style

- **Prettier**: 120 char width, 4-space tabs (2 for SCSS/YAML), trailing commas
- **ESLint**: TypeScript-ESLint + custom @blueprintjs rules, no console.log
- **Imports**: Use workspace: deps, no lodash-es (use lodash submodules)
- **Types**: Strict TypeScript, React 18 peer deps
- **Components**: Follow existing patterns in packages/core/src/components/
- **Styling**: SCSS in src/, compiled to lib/css/

## Common Build Issues

### CSS Modules with css-loader 7.x

**Issue**: Runtime error "Cannot read properties of undefined (reading 'className')" when importing CSS Modules.

**Cause**: css-loader 7.x changed from CommonJS to ES Module exports. With ES Modules, class names are exported as named exports instead of on the default export, breaking `import styles from './styles.module.scss'`.

**Solution**: Add `esModule: false` to css-loader options in webpack config:
```javascript
{
  loader: 'css-loader',
  options: {
    esModule: false,  // Use CommonJS exports
    modules: { localIdentName: '[name]__[local]--[hash:base64:5]' }
  }
}
```

**Reference**: See `packages/demo-icon-comparison/webpack.config.js` for implementation example.
