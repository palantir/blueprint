# Documentalist Removal Plan - Migration to react-docgen-typescript

## Overview

This migration is broken into multiple PRs to reduce risk and allow incremental progress.

---

# PR 1: Migrate Navigation from @page annotations to nav.config.ts

**Goal:** Replace `_nav.md` AND all `@page` annotations with a complete TypeScript navigation tree. Documentalist no longer builds the nav structure - we define it explicitly. The docs site works identically - users see no difference.

## Current State

- `packages/docs-app/src/_nav.md` defines root navigation via `@page` annotations
- `MarkdownPlugin({ navPage: "_nav" })` parses this + all `@page` annotations in .md files
- Documentalist builds the full nav tree by crawling `@page` references
- Output `docs.json` contains a `nav` array used by `NavMenu` component
- **124 total pages** across 7 root sections

## Changes Required

### 1. Create TypeScript Navigation Config

**Create:** `packages/docs-data/src/nav.config.ts`

```typescript
/**
 * Navigation configuration for Blueprint documentation site.
 * This replaces _nav.md and all @page annotations previously parsed by Documentalist.
 */
export interface NavItem {
  /** Route/page ID (must match route defined in page content) */
  route: string;
  /** Display title for navigation */
  title: string;
  /** Nested child pages */
  children?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  {
    route: "blueprint",
    title: "Blueprint",
    children: [
      { route: "blueprint/getting-started", title: "Getting Started" },
      { route: "blueprint/reading-the-docs", title: "Reading the Docs" },
      { route: "blueprint/principles", title: "Principles" },
    ],
  },
  {
    route: "core",
    title: "Core",
    children: [
      { route: "core/accessibility", title: "Accessibility" },
      { route: "core/classes", title: "Classes" },
      { route: "core/colors", title: "Colors" },
      { route: "core/typography", title: "Typography" },
      { route: "core/variables", title: "Variables" },
      {
        route: "core/components",
        title: "Components",
        children: [
          { route: "core/components/breadcrumbs", title: "Breadcrumbs" },
          { route: "core/components/buttons", title: "Buttons" },
          { route: "core/components/button-group", title: "Button Group" },
          { route: "core/components/callout", title: "Callout" },
          { route: "core/components/card", title: "Card" },
          { route: "core/components/card-list", title: "Card List" },
          { route: "core/components/control-card", title: "Control Card" },
          { route: "core/components/collapse", title: "Collapse" },
          { route: "core/components/divider", title: "Divider" },
          { route: "core/components/editable-text", title: "Editable Text" },
          { route: "core/components/entity-title", title: "Entity Title" },
          { route: "core/components/html", title: "HTML" },
          { route: "core/components/html-table", title: "HTML Table" },
          { route: "core/components/hotkeys-target", title: "Hotkeys Target" },
          { route: "core/components/icon", title: "Icon" },
          { route: "core/components/link", title: "Link" },
          { route: "core/components/menu", title: "Menu" },
          { route: "core/components/navbar", title: "Navbar" },
          { route: "core/components/non-ideal-state", title: "Non-Ideal State" },
          { route: "core/components/overflow-list", title: "Overflow List" },
          { route: "core/components/panel-stack", title: "Panel Stack" },
          { route: "core/components/progress-bar", title: "Progress Bar" },
          { route: "core/components/resize-sensor", title: "Resize Sensor" },
          { route: "core/components/section", title: "Section" },
          { route: "core/components/skeleton", title: "Skeleton" },
          { route: "core/components/spinner", title: "Spinner" },
          { route: "core/components/tabs", title: "Tabs" },
          { route: "core/components/tag", title: "Tag" },
          { route: "core/components/compound-tag", title: "Compound Tag" },
          { route: "core/components/text", title: "Text" },
          { route: "core/components/tree", title: "Tree" },
          // Form controls
          { route: "core/components/form-group", title: "Form Group" },
          { route: "core/components/control-group", title: "Control Group" },
          { route: "core/components/label", title: "Label" },
          { route: "core/components/checkbox", title: "Checkbox" },
          { route: "core/components/radio", title: "Radio" },
          { route: "core/components/html-select", title: "HTML Select" },
          { route: "core/components/segmented-control", title: "Segmented Control" },
          { route: "core/components/sliders", title: "Sliders" },
          { route: "core/components/switch", title: "Switch" },
          // Form inputs
          { route: "core/components/input-group", title: "Input Group" },
          { route: "core/components/text-area", title: "Text Area" },
          { route: "core/components/file-input", title: "File Input" },
          { route: "core/components/numeric-input", title: "Numeric Input" },
          { route: "core/components/tag-input", title: "Tag Input" },
          // Overlays
          { route: "core/components/overlay", title: "Overlay" },
          { route: "core/components/overlay2", title: "Overlay2" },
          { route: "core/components/portal", title: "Portal" },
          { route: "core/components/alert", title: "Alert" },
          { route: "core/components/context-menu", title: "Context Menu" },
          { route: "core/components/context-menu-popover", title: "Context Menu Popover" },
          { route: "core/components/dialog", title: "Dialog" },
          { route: "core/components/drawer", title: "Drawer" },
          { route: "core/components/popover", title: "Popover" },
          { route: "core/components/toast", title: "Toast" },
          { route: "core/components/tooltip", title: "Tooltip" },
        ],
      },
      {
        route: "core/context",
        title: "Context",
        children: [
          { route: "core/context/blueprint-provider", title: "Blueprint Provider" },
          { route: "core/context/hotkeys-provider", title: "Hotkeys Provider" },
          { route: "core/context/overlays-provider", title: "Overlays Provider" },
          { route: "core/context/portal-provider", title: "Portal Provider" },
        ],
      },
      {
        route: "core/hooks",
        title: "Hooks",
        children: [
          { route: "core/hooks/use-hotkeys", title: "useHotkeys" },
          { route: "core/hooks/use-overlay-stack", title: "useOverlayStack" },
        ],
      },
    ],
  },
  {
    route: "datetime",
    title: "Datetime",
    children: [
      { route: "datetime/date-picker", title: "Date Picker" },
      { route: "datetime/date-input", title: "Date Input" },
      { route: "datetime/date-range-picker", title: "Date Range Picker" },
      { route: "datetime/date-range-input", title: "Date Range Input" },
      { route: "datetime/timepicker", title: "Time Picker" },
      { route: "datetime/timezone-select", title: "Timezone Select" },
    ],
  },
  {
    route: "icons",
    title: "Icons",
    children: [
      { route: "icons/loading-icons", title: "Loading Icons" },
      { route: "icons/icons-list", title: "Icons List" },
    ],
  },
  {
    route: "select",
    title: "Select",
    children: [
      { route: "select/select-component", title: "Select" },
      { route: "select/suggest", title: "Suggest" },
      { route: "select/multi-select", title: "Multi Select" },
      { route: "select/omnibar", title: "Omnibar" },
      { route: "select/query-list", title: "Query List" },
    ],
  },
  {
    route: "table",
    title: "Table",
    children: [
      { route: "table/features", title: "Features" },
      { route: "table/api", title: "API" },
    ],
  },
  {
    route: "labs",
    title: "Labs",
    children: [
      { route: "labs/box", title: "Box" },
      { route: "labs/flex", title: "Flex" },
    ],
  },
];
```

### 2. Update Compilation Script

**Modify:** `packages/docs-data/compile-docs-data.mjs`

```javascript
import { navigationConfig } from "./src/nav.config.js";

// Remove navPage option from MarkdownPlugin - no longer building tree from @page
.use(".md", new MarkdownPlugin())  // was: new MarkdownPlugin({ navPage: "_nav" })

// After documentalist.documentGlobs():
const docs = await documentalist.documentGlobs(...);

// Replace Documentalist's nav with our explicit tree
// Add level numbers to match expected structure
docs.nav = addLevelsToNav(navigationConfig, 0);

function addLevelsToNav(items, level) {
  return items.map(item => ({
    ...item,
    level,
    children: item.children ? addLevelsToNav(item.children, level + 1) : [],
  }));
}
```

### 3. Remove @page Annotations from Markdown Files

**Modify:** ~15 files that define page hierarchy via `@page`:

| File | Action |
|------|--------|
| `packages/docs-app/src/_nav.md` | DELETE |
| `packages/docs-app/src/blueprint.md` | Remove `@page` lines |
| `packages/core/src/docs/index.md` | Remove `@page` lines |
| `packages/core/src/components/components.md` | Remove `@page` lines |
| `packages/core/src/context/context.md` | Remove `@page` lines |
| `packages/core/src/hooks/hooks.md` | Remove `@page` lines |
| `packages/datetime/src/index.md` | Remove `@page` lines |
| `packages/icons/src/index.md` | Remove `@page` lines |
| `packages/select/src/index.md` | Remove `@page` lines |
| `packages/table/src/docs/table.md` | Remove `@page` lines |
| `packages/labs/src/index.md` | Remove `@page` lines |

Note: Individual component .md files may still have `@page component-name` at the top to define their route - those can stay for now (they become the page identifier, not nav structure).

## Files Changed

| File | Action |
|------|--------|
| `packages/docs-data/src/nav.config.ts` | CREATE |
| `packages/docs-data/compile-docs-data.mjs` | MODIFY |
| `packages/docs-app/src/_nav.md` | DELETE |
| `packages/docs-app/src/blueprint.md` | MODIFY (remove @page children) |
| `packages/core/src/docs/index.md` | MODIFY |
| `packages/core/src/components/components.md` | MODIFY |
| `packages/core/src/context/context.md` | MODIFY |
| `packages/core/src/hooks/hooks.md` | MODIFY |
| `packages/datetime/src/index.md` | MODIFY |
| `packages/icons/src/index.md` | MODIFY |
| `packages/select/src/index.md` | MODIFY |
| `packages/table/src/docs/table.md` | MODIFY |
| `packages/labs/src/index.md` | MODIFY |

## Testing

1. Run `pnpm compile` in docs-data
2. Compare `docs.json` nav structure to previous output (should match)
3. Run docs-app dev server
4. Verify navigation sidebar renders correctly with all 124 pages
5. Verify all navigation links work
6. Verify deep links (e.g., `/core/components/button`) resolve correctly

---

# PR 2: Extract TypeScript Data with react-docgen-typescript

**Goal:** Replace Documentalist's `TypescriptPlugin` with `react-docgen-typescript`. Props tables continue to render identically.

## Changes Required

### 1. Create New Extraction Script

**Create:** `packages/docs-data/compile-typescript-data.mjs`

```javascript
import { withCustomConfig } from "react-docgen-typescript";
import { writeFileSync } from "node:fs";
import { glob } from "glob";

const parser = withCustomConfig("./tsconfig.json", {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    // Exclude props from node_modules
    if (prop.declarations?.some(d => d.fileName.includes("node_modules"))) {
      return false;
    }
    // Exclude internal props
    if (prop.name.startsWith("_")) return false;
    return true;
  },
});

const files = glob.sync("packages/{core,datetime,datetime2,icons,select,table,labs}/src/**/*.tsx");
const docs = parser.parse(files);

// Transform to match existing TypescriptPluginData structure
const typescript = {};
for (const component of docs) {
  typescript[component.displayName] = transformToDocumentalistFormat(component);
}

writeFileSync("src/generated/typescript.json", JSON.stringify(typescript, null, 2));
```

### 2. Create Data Adapter

**Create:** `packages/docs-data/src/adapters/typescriptAdapter.ts`

Transform `react-docgen-typescript` output to match existing `TsInterface`, `TsClass`, etc. structures that `InterfaceTable` expects.

### 3. Update Main Compilation

**Modify:** `packages/docs-data/compile-docs-data.mjs`

- Remove `TypescriptPlugin` usage
- Import generated typescript.json
- Merge into final docs.json

### 4. Update Dependencies

**Modify:** `packages/docs-data/package.json`

```json
{
  "dependencies": {
    "react-docgen-typescript": "^2.2.2"
  }
}
```

## Files Changed

| File | Action |
|------|--------|
| `packages/docs-data/compile-typescript-data.mjs` | CREATE |
| `packages/docs-data/src/adapters/typescriptAdapter.ts` | CREATE |
| `packages/docs-data/compile-docs-data.mjs` | MODIFY |
| `packages/docs-data/package.json` | MODIFY |

---

# PR 3: Convert Markdown Annotations to MDX

**Goal:** Convert `.md` files with `@interface`, `@reactExample`, etc. to `.mdx` with JSX components.

## Annotation Conversion Table

| Old Annotation | New MDX Syntax |
|----------------|----------------|
| `@# Title` | `# Title` |
| `@## Section` | `## Section` |
| `@interface ButtonProps` | `<PropsTable name="ButtonProps" />` |
| `@reactExample AlertExample` | `<Example name="AlertExample" />` |
| `@reactCodeExample ButtonExample` | `<CodeExample name="ButtonExample" />` |
| `@method useHotkeys` | `<MethodDoc name="useHotkeys" />` |
| `@css skeleton` | `<CssDoc name="skeleton" />` |
| `@page buttons` | Remove (navigation handled separately) |

## Changes Required

### 1. Create MDX Components

**Create:** `packages/docs-theme/src/mdx-components/`

```
PropsTable.tsx      - Wraps InterfaceTable
MethodDoc.tsx       - Wraps MethodTable
CssDoc.tsx          - Wraps CssExample
Example.tsx         - Wraps ReactExampleTagRenderer
CodeExample.tsx     - Wraps ReactCodeExampleTagRenderer
```

### 2. Convert Files (~99 files)

- `packages/core/src/components/**/*.md` → `.mdx`
- `packages/core/src/docs/**/*.md` → `.mdx`
- `packages/core/src/hooks/**/*.md` → `.mdx`
- `packages/select/src/**/*.md` → `.mdx`
- `packages/datetime/src/**/*.md` → `.mdx`
- `packages/table/src/docs/**/*.md` → `.mdx`
- `packages/icons/src/**/*.md` → `.mdx`
- `packages/labs/src/**/*.md` → `.mdx`
- `packages/docs-app/src/**/*.md` → `.mdx`

### 3. Update Build System

- Add MDX loader/plugin to bundler
- Configure MDX provider with custom components

## Files Changed

| Category | Count |
|----------|-------|
| MDX components created | ~6 |
| Markdown files converted | ~99 |
| Build config files | 2-3 |

---

# PR 4: Remove Documentalist Dependencies

**Goal:** Final cleanup - remove all `@documentalist/*` packages and update types.

## Changes Required

### 1. Update docs-theme Types

Replace all `@documentalist/client` imports with local type definitions:

**Files to modify:**
- `src/common/context.ts`
- `src/common/documentalistUtils.ts`
- `src/tags/*.tsx` (8 files)
- `src/components/typescript/*.tsx` (5 files)
- `src/components/block.tsx`
- `src/components/page.tsx`
- `src/components/navMenu.tsx`
- `src/components/navMenuItem.tsx`
- `src/components/navigator.tsx`
- `src/components/documentation.tsx`

### 2. Create Local Type Definitions

**Create:** `packages/docs-data/src/types.ts`

```typescript
// Navigation
export interface NavItem {
  route: string;
  title: string;
  level: number;
  children?: NavItem[];
}

// TypeScript API
export interface TsProperty {
  name: string;
  type: string;
  documentation?: Block;
  flags?: { isOptional?: boolean; isDeprecated?: boolean | string };
  defaultValue?: string;
  inheritedFrom?: string;
}

export interface TsInterface {
  kind: "interface";
  name: string;
  properties: TsProperty[];
  methods: TsMethod[];
  documentation?: Block;
}

// ... etc for TsClass, TsEnum, TsTypeAlias, Block, Tag, PageData
```

### 3. Remove Dependencies

**Modify package.json files:**

```json
// docs-data - REMOVE:
"@documentalist/compiler": "^5.0.0"

// docs-app - REMOVE:
"@documentalist/client": "^5.0.0"

// docs-theme - REMOVE:
"@documentalist/client": "^5.0.0"
```

### 4. Delete Old Files

- `packages/docs-data/compile-docs-data.mjs` (replaced in PR 2)
- `packages/docs-data/markdownRenderer.mjs`

## Files Changed

| File | Action |
|------|--------|
| `packages/docs-data/src/types.ts` | CREATE |
| `packages/docs-theme/src/**/*.tsx` | MODIFY (~17 files) |
| `packages/docs-data/package.json` | MODIFY |
| `packages/docs-app/package.json` | MODIFY |
| `packages/docs-theme/package.json` | MODIFY |
| `packages/docs-data/compile-docs-data.mjs` | DELETE |
| `packages/docs-data/markdownRenderer.mjs` | DELETE |

---

# Summary: Full Migration Path

| PR | Description | Risk | Files Changed |
|----|-------------|------|---------------|
| **PR 1** | Full nav tree in TypeScript (replace @page annotations) | Low-Medium | ~14 |
| **PR 2** | TypeScript extraction (react-docgen-typescript) | Medium | 4 |
| **PR 3** | MDX conversion | Medium | ~105 |
| **PR 4** | Remove documentalist deps | Low | ~22 |

**Total:** ~145 files across 4 PRs

---

# Appendix: Current Documentalist Usage

## Package Dependencies

| Package | Dependency | Version |
|---------|------------|---------|
| `@blueprintjs/docs-data` | `@documentalist/compiler` | ^5.0.0 |
| `@blueprintjs/docs-app` | `@documentalist/client` | ^5.0.0 |
| `@blueprintjs/docs-theme` | `@documentalist/client` | ^5.0.0 |

## Annotation Counts (~1,347 total)

| Annotation | Count |
|------------|-------|
| `@interface` | 118 |
| `@reactExample` | 81 |
| `@reactCodeExample` | 72 |
| `@page` | 97 |
| `@#` / `@##` | 938 |
| `@method` | 6 |
| `@import` | 15 |
| `@css` | 8 |
| `@reactDocs` | 9 |

## Files with @documentalist/client Imports (31 total)

```
packages/docs-theme/src/common/context.ts
packages/docs-theme/src/common/documentalistUtils.ts
packages/docs-theme/src/tags/defaults.ts
packages/docs-theme/src/tags/typescript.tsx
packages/docs-theme/src/tags/css.tsx
packages/docs-theme/src/tags/heading.tsx
packages/docs-theme/src/tags/method.tsx
packages/docs-theme/src/tags/see.tsx
packages/docs-theme/src/tags/reactExample.tsx
packages/docs-theme/src/tags/reactCodeExample.tsx
packages/docs-theme/src/tags/reactDocs.tsx
packages/docs-theme/src/tags/index.ts
packages/docs-theme/src/components/typescript/interfaceTable.tsx
packages/docs-theme/src/components/typescript/enumTable.tsx
packages/docs-theme/src/components/typescript/typeAliasTable.tsx
packages/docs-theme/src/components/typescript/methodTable.tsx
packages/docs-theme/src/components/typescript/apiHeader.tsx
packages/docs-theme/src/components/block.tsx
packages/docs-theme/src/components/page.tsx
packages/docs-theme/src/components/navMenu.tsx
packages/docs-theme/src/components/navMenuItem.tsx
packages/docs-theme/src/components/navigator.tsx
packages/docs-theme/src/components/documentation.tsx
packages/docs-app/src/index.tsx
packages/docs-app/src/components/blueprintDocs.tsx
packages/docs-app/src/components/navHeader.tsx
packages/docs-data/compile-docs-data.mjs
packages/docs-data/src/index.d.ts
```
