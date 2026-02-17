# Plan: .md to .mdx Migration Script

## Goal
Create a Node.js script that automatically converts all documentation `.md` files to `.mdx` by replacing Documentalist `@tag` syntax with standard markdown headings and JSX components, then renames each file from `.md` to `.mdx`.

## Script Location
`scripts/migrate-md-to-mdx.mjs`

## Tag Replacements

The script processes each `.md` file line-by-line, applying these transformations in order:

### 1. Headings: `@#` / `@##` / `@###` / `@####` -> `#` / `##` / `###` / `####`
```
@# Card           ->  # Card
@## Import        ->  ## Import
@### Subsection   ->  ### Subsection
@#### Deep        ->  #### Deep
```
Regex: `/^@(#{1,6})\s/` -> `$1 `

### 2. `@reactCodeExample Name` -> `<Name />`
```
@reactCodeExample CardBasicExample  ->  <CardBasicExample />
```
Regex: `/^@reactCodeExample\s+(\S+)\s*$/` -> `<$1 />`

### 3. `@reactExample Name` -> `<Name />`
```
@reactExample CardPlaygroundExample  ->  <CardPlaygroundExample />
```
Regex: `/^@reactExample\s+(\S+)\s*$/` -> `<$1 />`

### 4. `@reactDocs Name` -> `<Name />`
```
@reactDocs BlackWhitePalette  ->  <BlackWhitePalette />
```
Regex: `/^@reactDocs\s+(\S+)\s*$/` -> `<$1 />`

### 5. `@interface Name` -> `<InterfaceTable name="Name" />`
```
@interface CardProps  ->  <InterfaceTable name="CardProps" />
```
Regex: `/^@interface\s+(\S+)\s*$/` -> `<InterfaceTable name="$1" />`

### 6. `@method Name` -> `<MethodTable name="Name" />`
```
@method Table.resizeRowsByTallestCell  ->  <MethodTable name="Table.resizeRowsByTallestCell" />
@method useHotkeys                     ->  <MethodTable name="useHotkeys" />
```
Regex: `/^@method\s+(\S+)\s*$/` -> `<MethodTable name="$1" />`

### 7. `@css reference` -> `<CssExample reference="reference" />`
```
@css skeleton  ->  <CssExample reference="skeleton" />
```
Regex: `/^@css\s+(\S+)\s*$/` -> `<CssExample reference="$1" />`

### 8. `@ns-` -> `bp6-` (namespace macro replacement)
```
class="@ns-callout @ns-intent-warning"  ->  class="bp6-callout bp6-intent-warning"
```
Regex: `/@ns-/g` -> `bp6-` (global, all occurrences on each line)

### 9. Rename `.md` -> `.mdx`
After all content transformations, rename the file.

## Files to Process

All `.md` files under these directories (excluding `_nav.md`, `node_modules`, `CHANGELOG.md`, `README.md`, planning docs):
- `packages/core/src/**/*.md`
- `packages/datetime/src/**/*.md`
- `packages/select/src/**/*.md`
- `packages/table/src/**/*.md`
- `packages/icons/src/**/*.md`
- `packages/labs/src/**/*.md`
- `packages/docs-app/src/**/*.md`

Exclude:
- `**/node_modules/**`
- `**/_nav.md` (navigation config file, not a content page)
- `**/CHANGELOG.md`, `**/README.md`
- Any `.md` files outside `src/` directories

## Edge Cases to Handle

1. **Front matter** (`---` blocks at top of file) - preserve as-is, these are valid in MDX too
2. **`@ns-` inside code fences** - the script should still replace these (Documentalist does too)
3. **Lines that start with `@` inside code fences** - should NOT be transformed (e.g. `@import` in SCSS code blocks). The script must track whether we're inside a ``` block and skip tag transformations (but still apply `@ns-` replacement) for fenced content.
4. **Multiple `@ns-` on one line** - use global replace
5. **The `@page` tag** - no longer exists in any files, no handling needed

## Verification

After running the script:
1. Print count of each transformation type applied
2. Print list of all renamed files
3. Grep for any remaining `@#`, `@reactCodeExample`, `@reactExample`, `@interface`, `@method`, `@css`, `@reactDocs` in `.mdx` files to catch misses
