# Sass-to-CSS-variable migration report

## Scope and baseline

This spike audits every Sass declaration present at rollback baseline `643ec05ce` in Core, Icons, DateTime,
DateTime2, Select, Table, docs-theme, and docs-app, plus every source-controlled Sass helper introduced by the
migration. Docs-theme and docs-app remain Sass-backed supporting applications and are excluded from CSS-token
migration. Labs, demo-app, landing-app, and table-dev-app are also inventoried, but only their shared spacing and
radius conversions are in migration scope.

The goal is runtime parity with Blueprint 6, not a token redesign. Existing Sass and LESS contracts remain available
for consumer-authored styles, while Blueprint's compiled declarations consume package-owned CSS custom properties.
Direct CSS literals that were never backed by Sass are excluded.

The exhaustive machine-readable analysis is in [sass-variable-ledger.json](./sass-variable-ledger.json). The committed
ledger is regenerated from the union of the baseline and current source trees; it is not maintained by hand. Ignored
generated Sass output is intentionally excluded from that source inventory.

## Accounting model

Every baseline declaration receives a stable ID with this shape:

```text
package:path:scope:name:ordinal
```

The deterministic schema-v4 ledger records each baseline declaration's original and current initializer, declaration
hash, syntactic initializer category, `!default` status, visibility, grouped source/remaining use counts, and
original/remaining emitted-declaration sites. Declarations introduced by the migration record `original: null`, their
first current initializer, and explicit `introducedAfterBaseline` metadata. Each entry also has an independent
`sassResolution` produced by declaration-site Dart Sass `meta.type-of()` and `meta.inspect()` instrumentation; it
records resolved light/dark values, typed contextual observations, or an explicit generated-metadata exception
without substituting token defaults for Sass evidence. Each `migration.targets[]` item separately records a CSS
variable, owning package, and resolved light/dark token default. Fan-out and reconstructed mappings also record how
the original Sass value contributes to each target. Compatibility names, resolution status, disposition, and a
structured rationale make every decision inspectable.

The validator accepts these dispositions:

| Disposition                   | Count | Meaning                                                                                    |
| ----------------------------- | ----: | ------------------------------------------------------------------------------------------ |
| `migrated`                    |   367 | Blueprint runtime declarations now consume the recorded CSS token.                         |
| `retained-public-api`         |    81 | A documented or overrideable Sass contract remains unchanged.                              |
| `retained-compile-time`       |    27 | Sass is required for selectors, control flow, media inputs, mixin parameters, or geometry. |
| `retained-local`              |    55 | Lexical Sass state supports compilation and does not represent a themeable runtime value.  |
| `retained-generated-metadata` |     1 | Generated icon names, font families, and codepoint maps remain build-time metadata.        |
| `excluded`                    |    72 | The declaration belongs to an audited supporting app or does not feed an in-scope visual.  |

The ledger contains 603 declarations and 659 explicit target records: 588 declarations from the rollback baseline
and 15 compile-time helpers introduced by this migration. Of the non-migrated declarations, 52 public API entries,
three compile-time collections, and 19 retained locals still record the tokens which replace their runtime
contribution while the Sass declaration itself remains intact. Resolution is deterministic: 143 entries use
reviewed stable-ID mappings, 298 are unambiguous inferences, and 162 need no token resolution. Dart Sass resolves
510 declaration values directly; 92 lexical entries are explicitly contextual, including 34 with captured execution
observations; and the generated Icons metadata entry is explicitly not applicable to light/dark runtime values. No
entry is unclassified or ambiguous.

| Audited owner             | Declarations | `migrated` |
| ------------------------- | -----------: | ---------: |
| `@blueprintjs/core`       |          421 |        274 |
| `@blueprintjs/icons`      |            1 |          0 |
| `@blueprintjs/datetime`   |           22 |         19 |
| `@blueprintjs/datetime2`  |            0 |          0 |
| `@blueprintjs/select`     |            8 |          7 |
| `@blueprintjs/table`      |           81 |         67 |
| `@blueprintjs/docs-theme` |           24 |          0 |
| `@blueprintjs/docs-app`   |           29 |          0 |

DateTime2 declares no Sass variables of its own at the rollback baseline. Its runtime uses are still migrated and
its standalone CSS includes DateTime's token-only defaults. Icons' single tracked declaration is generated font
metadata, so it correctly produces no runtime visual token.

Validation fails for duplicate IDs or tokens, unclassified baseline or current declarations, stale configuration
references, unresolved or cyclic token references, missing dark bases, protected Sass/API changes, stale ledger
data, unavailable resolved defaults, missing Sass-resolution evidence, and eligible Sass values that still reach
emitted declarations without an explicit exception.

## Token ownership and mapping

Core owns shared palette, intent, typography, spacing, radius, elevation, and Core-component tokens. Addons own
package-prefixed tokens such as `--bp-datetime-*`, `--bp-select-*`, and `--bp-table-*`. Docs-theme and docs-app own no
runtime CSS tokens; their application-specific values remain in Sass. Core CSS remains the prerequisite for addon
CSS.

Mappings favor direct semantic equivalence:

- Existing useful names, such as `--bp-palette-blue-3` and `--bp-intent-primary-rest`, are reused.
- Shared values use concise canonical names, including `--bp-spacing` and `--bp-border-radius`.
- Independent component values use `--bp-{component}-*`; addon values include the package prefix.
- Equivalent light and dark Sass variables map to one theme-aware token.
- Equal literals are not deduplicated when their meanings differ.
- Named dimensions have independent resolved defaults. `calc()` is reserved for intentionally proportional layout.
- Parity colors and shadows store exact sRGB and alpha values; they do not introduce `oklch(from ...)` or
  `color-mix()` derivations.

DTCG references are preserved in generated CSS as `var()` aliases. Each token-owning package builds tokens before
Sass and exposes a token-only Sass entrypoint for source-partial consumers. DateTime2 includes the DateTime token
defaults it consumes so DateTime2 does not silently require DateTime component CSS.

## Theme contract

Generated token sheets emit selectors in this order:

```css
:root {
    /* invariant and light defaults */
}
.bp6-dark {
    /* compatibility dark overrides */
}
[data-bp-color-scheme="light"] {
    /* explicit light overrides */
}
[data-bp-color-scheme="dark"] {
    /* explicit dark overrides */
}
```

Explicit attributes override `.bp6-dark` on the same element, and nested theme scopes work in either direction.
Value-bearing legacy dark selectors are removed where they would override an explicit nested light boundary.

Experimental tokens which already hold exact Blueprint 6 values retain their literal defaults. Canonical spacing,
radius, typography, and transition tokens reference the existing `--bp-surface-*`, `--bp-typography-*`, and
`--bp-emphasis-*` names at root and every theme boundary. The ledger records each compatibility name. This preserves
boundary overrides, but a legacy alias changed on an arbitrary descendant cannot recompute an inherited canonical
token; subtree customization must use canonical names.

Elevation is the parity exception to that alias strategy. The existing `--bp-surface-shadow-0..4` tokens retain their
literal pre-spike defaults. Runtime styles consume exact `--bp-elevation-shadow-0..4` tokens instead: dark level 0
can reference its identical surface-shadow value, while the other defaults remain independent because the legacy
values do not reproduce the Sass shadows. The ledger records `--bp-surface-shadow-*` as compatibility names, not as
false aliases for the independent canonical values. Legacy shadow overrides therefore do not retarget canonical
shadows; customize the canonical names.

CSS variables follow the DOM, not the React tree. A scoped theme does not automatically cross a Portal mounted under
`document.body`; use a portal container inside the themed scope. This spike adds no React propagation layer.

## Exact-parity findings and exceptions

### Breadcrumb SVG masks

Breadcrumb separators and collapsed indicators previously used Sass to encode the light or dark icon color directly
into an inline SVG `background-image`. A CSS variable cannot change a color already serialized inside that data URI,
so the runtime implementation keeps the same SVG view box and path as a monochrome `mask-image` and paints it with
`background-color: var(--bp-icon-color)`. The default light and dark colors, 16px geometry, centering, and no-repeat
behavior remain identical, while scoped `--bp-icon-color` overrides can now recolor both glyphs.

This implementation depends on unprefixed CSS masking, which is consistent with Blueprint's current modern-browser
matrix. A browser without CSS mask support would retain the pseudo-element's layout but omit its glyph; adding the
old colored background as a fallback would make runtime recoloring unreliable. The computed-style parity harness
therefore treats this as an intentional representation change instead of comparing `background-image` literally. Its
four dedicated light/dark separator/collapsed checks compare the original and masked SVG paths, dimensions, placement,
repeat behavior, and resolved paint color.

### Duplicate application-background aliases

`packages/core/src/common/_color-aliases.scss` declares the secondary and elevated application aliases twice with
`!default`. Sass keeps the first initialized value, so the actual compiled dark defaults are:

- `$pt-dark-app-secondary-background-color`: `$black`
- `$pt-dark-app-elevated-background-color`: `$dark-gray2`

The CSS tokens follow those effective values. The duplicate Sass declarations and generated Sass/LESS artifacts stay
unchanged for compatibility, even though the later source initializers name `$dark-gray1` and `$dark-gray3`.

### Elevation shadows

The first layer of each light elevation shadow uses Blueprint `$black` (`#111418`), while its remaining drop-shadow
layers use literal CSS black. The DTCG shadow values preserve that distinction and compile the border layers to
`rgba(17, 20, 24, alpha)`. The canonical elevation tokens resolve to the exact Sass light/dark values; the older
surface-shadow tokens remain unchanged even where their historic dark values differ.

### Compile-time Sass

The retained exceptions are intentional and individually represented in the ledger:

- namespace interpolation and generated selector maps;
- icon font names, codepoints, and generated metadata;
- selector/control-flow maps and consumer-facing mixin parameters;
- media-query inputs;
- Popover arrow geometry that requires Sass `math.floor()` and `math.ceil()`;
- local compile-time state that does not feed a themeable emitted value.

CSS custom properties cannot participate in Sass numeric functions. Moving those cases to tokens would change the
public API or geometry rather than provide a straightforward parity migration.

`@blueprintjs/colors` is unchanged. The Icons package may legitimately own no runtime visual token because its tracked
Sass declarations are generated codepoint and font metadata.

## Verification contract

`pnpm verify:sass-variable-migration` first compiles the packages which own protected compatibility artifacts and
regenerates every token-owning package's ignored output. Its check then regenerates the ledger facts, resolves
generated light/dark defaults, protects Sass and LESS compatibility artifacts by hash, validates the token graph,
and requires zero unclassified entries. It passes for all 603 declarations, and the protected Core SCSS and LESS
export hashes match the rollback baseline. `pnpm verify` calls the check directly after its normal compile and dist
phases so it does not rebuild those prerequisites twice.

The theming kitchen sink covers Core, Icons, DateTime, DateTime2, Select, and Table under global, scoped, nested,
legacy-boundary, and scoped-portal themes. The committed browser report records 8,040 computed-style checks and
2,460 pre-existing token-default checks with zero mismatches, missing tokens, or unresolved references. It covers
light/dark rest, hover, active, focus, disabled, pseudo-element, nested-theme, addon-independence, ownership, and
portal states against the rollback baseline, plus four passing Breadcrumb mask implementation checks.

The completed spike validation ran independent compile, dist, test, and lint tasks for every published package in
scope; production docs-app, demo-app, landing-app, and table-dev-app builds; all seven package-layout checks; the
node-build-scripts test suite; the production Storybook build; `pnpm format-check`; `pnpm verify`; and
`git diff --check`. The Sass/LESS artifact hashes and browser-parity reports above also passed. A full Chromatic run
remains a draft-PR follow-up.
