# Plan: Replace `@page` with `nav.json`

## Goal
Remove all `@page` tags from source markdown files. Define the page hierarchy in a single `nav.json` config file. Add a post-processing step to `compile-docs-data.mjs` that builds the nav tree and fixes routes.

## Approach: Post-process documentalist output

Run documentalist as usual (it still compiles all markdown content — headings, `@reactExample`, `@interface`, etc.). After it returns, **replace** `docs.nav` with a nav tree built from `nav.json`, and **fix routes** in `docs.pages` to match.

This keeps all content compilation working while removing the `@page` mechanism.

---

## Step 1: Create `packages/docs-data/nav.json`

A flat adjacency list. Keys are page references, values are ordered arrays of children (strings = page refs, objects = heading group markers).

```json
{
  "_nav": ["blueprint", "core", "datetime", "icons", "select", "table", "labs"],
  "blueprint": ["getting-started", "reading-the-docs", "principles"],
  "core": ["accessibility", "classes", "colors", "typography", "variables", "components", "context", "hooks"],
  "components": [
    "breadcrumbs", "buttons", "button-group", "callout", "card", "card-list",
    "control-card", "collapse", "divider", "editable-text", "entity-title",
    "html", "html-table", "hotkeys-target", "icon", "link", "menu", "navbar",
    "non-ideal-state", "overflow-list", "panel-stack", "progress-bar",
    "resize-sensor", "section", "skeleton", "spinner", "tabs", "tag",
    "compound-tag", "text", "tree",
    { "heading": "Form controls" },
    "form-group", "control-group", "label", "checkbox", "radio",
    "html-select", "segmented-control", "sliders", "switch",
    { "heading": "Form inputs" },
    "input-group", "text-area", "file-input", "numeric-input", "tag-input",
    { "heading": "Overlays" },
    "overlay", "overlay2", "portal", "alert", "context-menu",
    "context-menu-popover", "dialog", "drawer", "popover", "popover-next",
    "toast", "tooltip"
  ],
  "context": ["blueprint-provider", "hotkeys-provider", "overlays-provider", "portal-provider"],
  "hooks": ["use-hotkeys", "use-overlay-stack"],
  "datetime": ["date-picker", "date-input", "date-range-picker", "date-range-input", "timepicker", "timezone-select"],
  "icons": ["loading-icons", "icons-list"],
  "select": ["select-component", "suggest", "multi-select", "omnibar", "query-list"],
  "table": ["features", "api"],
  "labs": ["box", "flex"]
}
```

Only `components` uses heading markers (the only aggregator with interleaved headings). All other entries are flat page-ref arrays.

---

## Step 2: Modify `packages/docs-data/compile-docs-data.mjs`

After `const docs = await documentalist.documentGlobs(...)`, add a call to a new function that:

### 2a. Build route map from nav.json

Walk the nav config tree to compute the correct route for every page reference:

```
_nav children at depth 0:
  "blueprint" → route "blueprint"
    "getting-started" → route "blueprint/getting-started"
  "core" → route "core"
    "components" → route "core/components"
      "buttons" → route "core/components/buttons"
```

### 2b. Fix routes in `docs.pages`

For each page in `docs.pages`:
1. Look up the correct route from the route map
2. Replace `page.route` with the correct route
3. Walk `page.contents` — for any tag object with a `route` field (heading tags), fix the route prefix:
   - Old: `"buttons.props"` (bare reference prefix)
   - New: `"core/components/buttons.props"` (full route prefix)

### 2c. Build nav tree from nav.json + page data

For each entry in `nav.json["_nav"]`, recursively build a PageNode:

```
{
  title: pages[ref].title,     // from documentalist output
  level: depth + 1,            // computed from tree position
  route: routeMap[ref],        // computed in step 2a
  reference: ref,
  children: [
    ...headingChildren,        // extracted from page contents
    ...pageChildren            // recursively built from nav.json
  ]
}
```

**Heading extraction**: Walk `page.contents`, collect all `{ tag: "heading" }` entries as HeadingNode children (with fixed routes from step 2b).

**Interleaving rule**:
- If nav.json entry contains **any** `{ "heading": "..." }` markers → use nav.json ordering exclusively (heading markers matched by title against headings from content)
- If nav.json entry is **all strings** → prepend heading children from content, then page children from nav.json

This handles `components.md` (explicit interleaving) and all other pages (headings first, then pages) correctly.

### 2d. Replace `docs.nav`

Set `docs.nav = builtNavTree` before JSON serialization.

---

## Step 3: Strip `@page` from 11 source markdown files

Remove all lines matching `/^\s*@page\s+/` from:

1. `packages/docs-app/src/_nav.md`
2. `packages/docs-app/src/blueprint.md`
3. `packages/core/src/docs/index.md`
4. `packages/core/src/components/components.md`
5. `packages/core/src/context/context.md`
6. `packages/core/src/hooks/hooks.md`
7. `packages/datetime/src/index.md`
8. `packages/icons/src/index.md`
9. `packages/labs/src/index.md`
10. `packages/select/src/index.md`
11. `packages/table/src/docs/table.md`

Note: `_nav.md` will become effectively empty (just an HTML comment). It still needs to exist because `MarkdownPlugin({ navPage: "_nav" })` requires it — but its nav output will be discarded.

---

## Step 4: Verify

Run the docs-data compilation and diff `docs.json` output against the original to confirm the nav tree and page routes are identical.

---

## Known trade-offs

1. **MarkdownPlugin still runs** — it still sees all the markdown files and compiles content. It will produce an empty/broken nav tree (because no @page tags), but we throw that away. This is fine for now and aligns with the incremental approach to removing documentalist.

2. **`_nav.md` must still exist** — MarkdownPlugin will error if its `navPage` file is missing. Keep it as an empty/minimal file.

3. **Heading changes in components.md** — if the heading text changes (e.g., "Form controls" → "Form Controls"), `nav.json` heading markers must be updated to match. Other pages derive headings from content automatically.

4. **New pages** — adding a new page requires updating `nav.json` (same workflow as adding `@page` before, just a different file).

---

## Files to modify

| File | Change |
|---|---|
| `packages/docs-data/nav.json` | **New** — page hierarchy config |
| `packages/docs-data/compile-docs-data.mjs` | Add post-processing functions (route fixing, nav building) |
| 11 markdown files listed above | Strip `@page` lines |
