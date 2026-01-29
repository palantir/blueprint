# [RFC] Migrating Docs Frameworks pt3

**Author:** Cameron Joyner
**Last Update:** Tuesday, January 27
**Prior documents:** [RFC] Migrating Docs Frameworks pt1 && [RFC] Migrating Docs Frameworks pt2

## Overview and goals

As we now have consensus that we won't replatform our docs onto a headless library

---

## Considerations & Outcomes

1. How can we **reduce support and maintenance burden** for ourselves moving forward?
2. How can we **meet the standards of our peers** in the world of open source component libraries?
3. By accomplishing 1 & 2, how can we **provide users a more joyful, intuitive experience** with our products?

---

## High level implementation

**Phase 1 - migrate docs frameworks**

1. Remove `Documentalist` while retaining current UI
    1. Migrate Navigation from `@page` annotations to `nav.config.ts`
    2. Update Compilation Script at `packages/docs-data/compile-docs-data.mjs`
    3. Remove `@page` Annotations from Markdown Files
    4. Update docs-theme Components to Use New Nav Types
2. Extract TypeScript Data with react-docgen-typescript
3. Migrate `.md` files to `.mdx` format
4. Remove `Documentalist` dependencies

**Phase 2 - integrate `react-live` components**

1. Simple code example components
2. "Kitchen sink" code example components

**Phase 3 - integrate `storybook`**

This is meant to be useful for our team, for Palantirians, and developers using or contributing to Blueprint. It won't be exposed within the public docs.

**Phase 4 - overall UI refresh**

1. build new homepage
2. offer an interactive theming playground
3. compose components/examples page

**Phase 5 - build deeper AI integrations**

1. `copy as markdown` button
2. `open in ChatGPT/Claude` button
3. `LLMs.txt` file
4. `SKILL.md` file
5. `AGENT.md` file
6. `INSTALL.md` file

**Phase 6 - analytics and feedback**

**Phase 7 - //pt-internal Blueprint**

---

## Phase 1 - Remove Documentalist, retain current UI

We will move from the once-supported, Palantir-built framework, `Documentalist` to `react-docgen-typescript`, the framework that underlies `Storybook`. This will allow us to extract `props` from react components and save as static json.

### PR 1: Migrate Navigation from @page annotations to nav.config.ts

**Goal:** Replace `_nav.md` AND all `@page` annotations with a complete TypeScript navigation tree. Documentalist no longer builds the nav structure - we define it explicitly. The docs site works identically - users see no difference.

At present our left nav [`_nav.md`] is rendered like this [below]. We'll need to move to either JSON or TSX to keep track.

**Current State**

- `packages/docs-app/src/_nav.md` defines root navigation via `@page` annotations
- `MarkdownPlugin({ navPage: "_nav" })` parses this + all `@page` annotations in .md files
- Documentalist builds the full nav tree by crawling `@page` references
- Output `docs.json` contains a `nav` array used by `NavMenu` component
- **124 total pages** across 7 root sections

#### PR 1.1: Create `packages/docs-data/src/navTypes.ts`

**First Create:** `packages/docs-data/src/navTypes.ts`

```typescript
/**
 * Navigation item configuration (input format before build-time processing).
 * Used in nav.config.ts to define the navigation structure.
 */
export interface NavItemConfig {
  /** Route/page ID (must match route defined in page content) */
  route: string;
  /** Display title for navigation */
  title: string;
  /** Nested child pages */
  children?: NavItemConfig[];
  /** NPM package name - version and npmLink are resolved at build time */
  packageName?: string;
}

/**
 * Navigation item in the documentation tree (output format after build-time processing).
 * Replaces HeadingNode and PageNode from @documentalist/client.
 */
export interface NavItem {
  /** Route/page ID */
  route: string;
  /** Display title for navigation */
  title: string;
  /** Nesting level (0 = root) */
  level: number;
  /** Nested child pages (empty array if leaf node) */
  children: NavItem[];
  /** Package version (resolved at build time from packageName) */
  version?: string;
  /** Link to npm package page (resolved at build time from packageName) */
  npmLink?: string;
}

/**
 * Type guard to check if a nav item has children.
 * Replaces isPageNode() from @documentalist/client.
 */
export function hasChildren(item: NavItem): boolean {
  return item.children.length > 0;
}
```

Then we can use that type to create `packages/docs-app/src/nav.config.ts`:

```typescript
/**
 * Navigation configuration for Blueprint documentation site.
 * This replaces _nav.md and all @page annotations previously parsed by Documentalist.
 */
export const navigationConfig: NavItemConfig[] = [
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
    packageName: "@blueprintjs/core",
    children: [
      { route: "core/button", title: "button" },
      // ...
    ],
  },
  // ...
];
```

#### PR 1.2: Update Compilation Script at `packages/docs-data/compile-docs-data.mjs`

```javascript
import { navigationConfig } from "./src/nav.config.js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

// Remove navPage option from MarkdownPlugin - no longer building tree from @page
.use(".md", new MarkdownPlugin())  // was: new MarkdownPlugin({ navPage: "_nav" })

// After documentalist.documentGlobs():
const docs = await documentalist.documentGlobs(...);

// Replace Documentalist's nav with our explicit tree
// Add level numbers and resolve package metadata
docs.nav = processNavConfig(navigationConfig, 0);

/**
 * Recursively process nav config: add levels and resolve package metadata.
 */
function processNavConfig(items, level) {
  return items.map(item => {
    const processed = {
      route: item.route,
      title: item.title,
      level,
      children: item.children ? processNavConfig(item.children, level + 1) : [],
    };

    // Resolve package metadata if packageName is specified
    if (item.packageName) {
      const { version, npmLink } = resolvePackageMetadata(item.packageName);
      processed.version = version;
      processed.npmLink = npmLink;
    }

    return processed;
  });
}

/**
 * Read version from package.json and derive npm link.
 */
function resolvePackageMetadata(packageName) {
  // Convert @blueprintjs/datetime -> packages/datetime/package.json
  const shortName = packageName.replace("@blueprintjs/", "");
  const packageJsonPath = resolve(
    dirname(import.meta.url).replace("file://", ""),
    `../../${shortName}/package.json`
  );

  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    return {
      version: pkg.version,
      npmLink: `https://www.npmjs.com/package/${packageName}`,
    };
  } catch (e) {
    console.warn(`Could not resolve package metadata for ${packageName}:`, e.message);
    return { version: undefined, npmLink: undefined };
  }
}
```

#### PR 1.3: Remove @page Annotations from Markdown Files

**Modify:** ~15 files that define page hierarchy via `@page`:

| File | Action |
|------|--------|
| `docs-app/src/_nav.md` | DELETE |
| `docs-app/src/blueprint.md` | Remove `@page` lines |
| `core/src/docs/index.md` | Remove `@page` lines |
| `core/src/components/components.md` | Remove `@page` lines |
| `core/src/context/context.md` | Remove `@page` lines |
| `core/src/hooks/hooks.md` | Remove `@page` lines |
| `datetime/src/index.md` | Remove `@page` lines |
| `icons/src/index.md` | Remove `@page` lines |
| `select/src/index.md` | Remove `@page` lines |
| `table/src/docs/table.md` | Remove `@page` lines |
| `labs/src/index.md` | Remove `@page` lines |

#### PR 1.4: Update docs-theme Components to Use New Nav Types

**Modify:** `packages/docs-theme/src/common/documentalistUtils.ts`

```typescript
// BEFORE:
import { type HeadingNode, isPageNode, type PageNode } from "@documentalist/client";

export function eachLayoutNode(
    layout: Array<HeadingNode | PageNode>,
    callback: (node: HeadingNode | PageNode, parents: PageNode[]) => void,
    parents: PageNode[] = [],
) { ... }

// AFTER:
import { hasChildren, type NavItem } from "@blueprintjs/docs-data";

export function eachLayoutNode(
    layout: NavItem[],
    callback: (node: NavItem, parents: NavItem[]) => void,
    parents: NavItem[] = [],
) {
    layout.forEach(node => {
        callback(node, parents);
        if (hasChildren(node)) {
            eachLayoutNode(node.children, callback, [node, ...parents]);
        }
    });
}
```

**Modify:** `packages/docs-theme/src/components/navMenu.tsx`

```typescript
// BEFORE:
import { type HeadingNode, isPageNode, type PageNode } from "@documentalist/client";
...
items: Array<PageNode | HeadingNode>;
...
{isPageNode(section) ? <NavMenu {...props} level={section.level} items={section.children} /> : null}

// AFTER:
import { hasChildren, type NavItem } from "@blueprintjs/docs-data";
...
items: NavItem[];
...
{hasChildren(section) ? <NavMenu {...props} level={section.level} items={section.children} /> : null}
```

**Modify:** `packages/docs-theme/src/components/navMenuItem.tsx`

```typescript
// BEFORE:
import type { HeadingNode, PageNode } from "@documentalist/client";
...
section: PageNode | HeadingNode;

// AFTER:
import type { NavItem } from "@blueprintjs/docs-data";
...
section: NavItem;
```

**Modify:** `packages/docs-theme/src/components/navigator.tsx`

```typescript
// BEFORE:
import type { HeadingNode, PageNode } from "@documentalist/client";
...
items: Array<PageNode | HeadingNode>;
itemExclude?: (node: PageNode | HeadingNode) => boolean;

// AFTER:
import type { NavItem } from "@blueprintjs/docs-data";
...
items: NavItem[];
itemExclude?: (node: NavItem) => boolean;
```

**Modify:** `packages/docs-theme/src/components/documentation.tsx`

```typescript
// BEFORE:
import {
    type HeadingNode,
    isPageNode,
    linkify,
    type PageData,
    type PageNode,
    type TsDocBase,
} from "@documentalist/client";
...
navigatorExclude?: (node: PageNode | HeadingNode) => boolean;
...
if (isPageNode(node)) {

// AFTER:
import { hasChildren, type NavItem } from "@blueprintjs/docs-data";
import { linkify, type PageData, type TsDocBase } from "@documentalist/client"; // Keep non-nav types for now
...
navigatorExclude?: (node: NavItem) => boolean;
...
if (hasChildren(node)) {
```

---

### PR 2: Extract TypeScript Data with react-docgen-typescript

**Goal:** Replace Documentalist's `TypescriptPlugin` with `react-docgen-typescript`. Props tables continue to render identically.

#### PR 2.1: Create New Extraction Script

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

#### PR 2.2: Create Data Adapter

**Create:** `packages/docs-data/src/adapters/typescriptAdapter.ts`

Transform `react-docgen-typescript` output to match existing `TsInterface`, `TsClass`, etc. structures that `InterfaceTable` expects.

#### PR 2.3: Update Main Compilation

**Modify:** `packages/docs-data/compile-docs-data.mjs`

- Remove `TypescriptPlugin` usage
- Import generated typescript.json
- Merge into final docs.json

#### PR 2.4: Update Dependencies

**Modify:** `packages/docs-data/package.json`

```json
{
  "dependencies": {
    "react-docgen-typescript": "^2.2.2"
  }
}
```

---

### PR 3: Migrate to `.mdx` files

The actual .md files that house our docs read like this. You'll notice the `Documentalist` specific syntax like `@# Callout`, `@## Import`, and `@reactCodeExample`. Migrating to `.mdx` will allow us to (A) move closer to industry standard and (B) inject react components more easily.

```markdown
@# Callout
**Callouts** visually highlight important content for the user. They may contain
a title, an icon and content. Each intent has a default icon associated with it.

@## Import
\`\`\`tsx
import { Callout } from "@blueprintjs/core";
\`\`\`

@## Usage
A **Callout** highlights important content with an optional title and body text.

@reactCodeExample CalloutBasicExample

@## Intent
The `intent` prop sets the visual style of the **Callout**, reflecting its purpose or severity. Each intent applies a unique color and includes a default icon.

@reactCodeExample CalloutIntentExample
```

Tactically this will mean removing the following **annotations**:

| Annotation | Count | Purpose |
|------------|-------|---------|
| `@interface` | 118 | Reference TypeScript interface for props table |
| `@reactExample` | 81 | Interactive React example with playground |
| `@reactCodeExample` | 72 | Static code example without playground |
| `@page` | 97 | Define documentation page in hierarchy |
| `@#` | 938 | Heading annotations |
| `@method` | 6 | Document method signatures |
| `@import` | 15 | CSS/SCSS import references |
| `@css` | 8 | CSS class documentation |
| `@reactDocs` | 9 | Custom React doc components |

---

### PR 4: Remove Documentalist Dependencies

**Goal:** Final cleanup - remove all `@documentalist/*` packages and update types.

| Package | Dependency | Version |
|---------|------------|---------|
| `@blueprintjs/docs-data` | `@documentalist/compiler` | ^5.0.0 |
| `@blueprintjs/docs-app` | `@documentalist/client` | ^5.0.0 |
| `@blueprintjs/docs-theme` | `@documentalist/client` | ^5.0.0 |

---

## Appendix: Current Documentalist Usage

### Package Dependencies

| Package | Dependency | Version |
|---------|------------|---------|
| `@blueprintjs/docs-data` | `@documentalist/compiler` | ^5.0.0 |
| `@blueprintjs/docs-app` | `@documentalist/client` | ^5.0.0 |
| `@blueprintjs/docs-theme` | `@documentalist/client` | ^5.0.0 |

### Annotation Counts (~1,347 total)

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

### Files with @documentalist/client Imports (31 total)

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
