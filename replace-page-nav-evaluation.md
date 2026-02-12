# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# Evaluation: Replace @page Navigation Plan

## Verdict: The plan is viable but has significant underestimated complexity in Step 6 and a missing critical constraint. Below is a detailed analysis.

---

## What the Plan Gets Right

### 1. Correct scope isolation

Nav is genuinely the most isolated Documentalist concern. The `@page` tags exist in only **11 files** and the `@#+` heading tags exist in **99 files**, but the heading tags serve double duty (nav structure AND rendered content), which the plan needs to account for more carefully (see issues below).

### 2. Correct starting point

`_nav.md` is the root of the nav tree (`MarkdownPlugin({ navPage: "_nav" })`). The hierarchy is well-defined and mostly flat (2-3 levels deep). The total scope is manageable.

### 3. Parity validation step is essential

Running both systems side-by-side and diffing is the right approach. The nav tree is deterministic, so structural comparison is straightforward.

### 4. gray-matter is the right tool

18 files already use YAML front matter (`reference:` and `tag:` keys). The pattern exists in the codebase. gray-matter is a mature, minimal dependency.

---

## Issues and Risks

### Issue 1: `@#` heading tags are NOT just nav — they're content structure too

**This is the biggest problem with the plan.**

The plan says it will "remove @page and @#+ tags" but conflates two distinct Documentalist features:

- **`@page reference`** in hub files (11 files) — these are purely nav declarations. Safe to replace with front matter. This is what the plan should focus on.
- **`@# Title`, `@## Subtitle`, `@### Subsection`** in 99 content files — these are NOT just nav. They are **rendered headings** that Documentalist's MarkdownPlugin processes into `Block` objects with `tag: "heading"`, route-based anchors, and the scroll/navigation anchor system (`data-route` attributes). These headings appear in the rendered page content AND in the nav tree simultaneously.

The plan cannot remove `@#` heading tags without also replacing Documentalist's markdown rendering, which is explicitly out of scope. The heading tags serve the rendered content system, not just the nav tree.

**Recommendation:** Scope Phase 1 strictly to `@page` declarations in hub files. Leave `@#` / `@##` / etc. heading tags completely untouched — they belong to the markdown rendering phase, not the nav phase.

### Issue 2: The front matter schema doesn't capture the actual structure

The proposed front matter:

```yaml
reference: getting-started
title: Getting Started
parent: overview
order: 1
```

This is mostly right for leaf pages, but the current system has a structure the plan doesn't address:

**Hub files with inline content.** Files like `packages/core/src/docs/index.md` have both a `reference: core` front matter AND body content (description paragraph) that gets rendered as a page. The `@page` directives inside them declare children. Your nav-builder needs to understand this dual role — a file can be both a page AND a nav-tree parent.

**Section headings without pages.** In `components.md`, `@## Form controls` creates a heading node in the nav tree that is NOT a page (no `reference`, no `children` in the PageNode sense — it's a `HeadingNode`). The proposed front matter schema has no way to represent these section headings. They exist only in hub files and create non-clickable grouping headers in the sidebar.

**Recommendation:** The front matter needs to handle these cases:

1. Leaf pages: `reference`, `title`, `parent`, `order` (as proposed)
2. Hub pages: same as above, but also contain ordered child declarations (currently `@page` lines)
3. Section headings within hubs: `@## Form controls` creates HeadingNode entries inside a parent's children array. These have no standalone file. They need representation in the hub file's front matter or child declarations.

### Issue 3: Step 6 ("Wire up the new nav") is larger than described

The plan says this "may be a straight swap." It won't be. Here's why:

The nav tree consumers use **Documentalist-specific types pervasively**:

- `PageNode`, `HeadingNode`, `isPageNode()` — imported from `@documentalist/client` in **8 files** across docs-theme
- `MarkdownPluginData` — defines the `{ nav, pages }` shape used by `DocsData` in `context.ts`
- The `Documentation` component builds `routeToPage` by traversing the nav using `isPageNode()` type guard
- `NavMenu` recursively renders using `isPageNode()` to decide whether to recurse into children
- `Navigator` (search) flattens the tree using `eachLayoutNode()` which depends on `isPageNode()`

To consume `nav.json` instead of Documentalist's output, you need to either:

- **(a)** Produce JSON that exactly matches Documentalist's `PageNode`/`HeadingNode` interfaces, so all existing consumers work unchanged. This is the cleanest path.
- **(b)** Define your own types and update all 8+ consumer files. This is a much larger change.

**Recommendation:** Option (a). Make `nav-builder.ts` output JSON conforming to `PageNode[]` / `HeadingNode[]` exactly. Then you can swap the data source without touching any rendering code. Define the types yourself (they're simple — `{ reference, route, title, level, children }` for PageNode, `{ title, route, level }` for HeadingNode) rather than importing from `@documentalist/client`.

### Issue 4: Route construction logic is implicit in Documentalist

The `route` field on each node is constructed by Documentalist's MarkdownPlugin using conventions:

- Page routes use `/` separator: `core/components`
- Heading routes use `.` separator: `core/components.button`
- Routes are built by joining parent routes with the appropriate separator

Your nav-builder must replicate this exact route-building logic. The routing system (`location.hash`, `routeToPage` map, `isParentOfRoute()` check using `/` and `.`) depends on it. If your routes don't match exactly, every internal link in every markdown file breaks.

**Recommendation:** Audit `MarkdownPlugin`'s route construction and replicate it precisely. Add route format assertions to the parity validation.

### Issue 5: The `pages` map coupling

The plan mentions `nav.json` and a "pages map" but doesn't detail the `pages` map. Currently, Documentalist produces `{ nav, pages }` as a unit — the `pages` map is keyed by `reference` and contains `PageData` objects with rendered markdown content (`contents`, `contentsRaw`, `metadata`, etc.).

If you only replace the nav tree but Documentalist still produces the `pages` map, you need to ensure that every `reference` in your nav tree exactly matches a key in the Documentalist-produced pages map. They must stay in sync.

**Recommendation:** Make this coupling explicit in the validation step. The parity check should verify: `for every PageNode in nav.json, pages[node.reference] exists`.

### Issue 6: Missing `tag` metadata

Several files use `tag: new` or `tag: deprecated` in front matter. The docs-app's `renderNavMenuItem` reads `page.metadata.tag` from the pages map to render status badges in the nav. Your nav-builder doesn't need to handle this directly (it comes from the pages map), but if you're adding front matter to files that already have it, you need to preserve existing keys.

---

## Assessment Summary

| Plan Step                  | Viability         | Notes                                                                                                                                                                                    |
| -------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Audit @page usage       | Good              | Straightforward grep. 11 files with @page, 99 with @# headings.                                                                                                                          |
| 2. Add front matter        | Good with caveats | Need to handle hub files and section headings, not just leaf pages. Must preserve existing front matter.                                                                                 |
| 3. Nav builder script      | Good with caveats | Must replicate Documentalist's exact route construction. Must output `PageNode[]`/`HeadingNode[]` compatible shapes. Must handle `HeadingNode` entries from `@##` sections in hub files. |
| 4. Validate parity         | Good              | Critical step. Must also validate route formats and pages-map alignment.                                                                                                                 |
| 5. Front matter validation | Good              | Standard build-time checks.                                                                                                                                                              |
| 6. Wire up new nav         | Underestimated    | If nav-builder outputs Documentalist-compatible shapes, this is a data-source swap in `compile-docs-data.mjs`. If not, it's an 8+ file refactor in docs-theme.                           |
| 7. Remove @page tags       | Partially wrong   | Can remove `@page` declarations from hub files. CANNOT remove `@#` heading tags — those are rendered content, not just nav.                                                              |

## Revised Scope Recommendation

Narrow Phase 1 to strictly mean:

- Replace the `@page` directive system (child declarations in hub files) and the `_nav.md` root ordering file
- Generate the `nav` array independently of Documentalist's MarkdownPlugin
- Output `PageNode[]`/`HeadingNode[]`-compatible JSON so rendering code is untouched
- Leave `@#` heading tags untouched — they're a markdown rendering concern, not a nav concern
- Leave the `pages` map generation in Documentalist — that requires replacing markdown rendering
- Keep `@documentalist/client` types in docs-theme for now (they're just interfaces, zero runtime cost)

This gives you a clean, achievable deliverable: the nav tree is owned by your build, Documentalist is no longer involved in navigation, and you haven't touched anything that could break content rendering.

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE

# IGNORE THIS PAGE
