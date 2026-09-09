# BP7 style migration review decisions

This document records questions, resolutions, and decisions from the per-file BP6-versus-next stylesheet audit.
It is not a replacement for the migration plan.

## Cross-file decisions

### Keep generated diffs beside the next stylesheets

`pnpm diff:next-styles` writes each `*-next.diff` beside its corresponding `*-next.scss` file. Do not recreate the
`next-style-diffs/` directory.

### Preserve comments

**Question:** Should comments from BP6 stylesheets be retained in their next-style counterparts?

**Decision:** Yes. Preserve all explanatory comments while reviewing each file. Do not bulk-edit unaudited files; restore
comments as each stylesheet is audited. A new file's existing copyright year is not treated as a dropped comment.

### Preserve property forms

**Question:** Should physical or shorthand properties be converted to logical properties during this migration?

**Decision:** No. Preserve the BP6 property form unless a separate, explicitly approved RTL change requires otherwise.
Token migration alone does not justify changing `padding` to `padding-block`/`padding-inline` or `margin-right` to a logical
property.

### Preserve reusable dimensions as next-style Sass aliases

**Question:** How should reusable BP6 Sass dimensions be represented when their values must remain runtime-customizable?

**Decision:** Add next-suffixed Sass aliases whose values are CSS custom-property expressions. Keep BP6 aliases unchanged.
Current shared aliases are `$pt-icon-size-standard-next`, `$pt-icon-size-large-next`, and `$pt-input-height-next` in
`packages/core/src/common/_variables-next.scss`.

### Preserve semantic z-index aliases

**Question:** How should BP6's semantic z-index variables map to BP7's numbered surface z-index tokens?

**Resolution:** BP7 exposes only numbered levels (`--bp-surface-z-index-0` through `--bp-surface-z-index-4`). Using those
tokens directly loses the semantic intent expressed by BP6's `base`, `content`, `overlay`, and `dialog-header` names.

**Decision:** Add next-suffixed semantic Sass aliases in `_variables-next.scss`, backed respectively by BP7 surface z-index
levels 0 through 3. Use the aliases in next component styles so the role remains explicit while the value stays
runtime-customizable.

### Preserve reusable mixins as next-style Sass mixins

**Question:** Should a BP6 mixin's declaration group be inlined when its values move to BP7 tokens?

**Decision:** No. Preserve the abstraction with an additive, next-suffixed mixin in a next-only partial. For example,
Callout uses `running-typography-next` from `_mixins-next.scss`. Keep the BP6 mixin unchanged.

### Typography weight token range

**Question:** Why does BP7 expose only `--bp-typography-weight-default` and
`--bp-typography-weight-strong` instead of a numeric or named weight scale? How should a consumer request another weight?

**Resolution:** Open. The token sources confirm that the public API currently contains only the two semantic roles, but the
reviewed migration and customization guides do not explain why the range is restricted. A two-role API encourages components
to express ordinary versus emphasized text, but it cannot represent every supported font weight or preserve BP6 values such
as `600` without either using a raw number or adding another semantic token.

**Decision:** Do not invent a new weight token during the component migration. Escalate components that genuinely require a
third weight to the typography-token API review; until that decision is made, explicitly record whether the component chooses
the BP7 `strong` role or preserves a raw BP6 weight.

### Running line-height token naming and discoverability

**Question:** Why is the public token named `--bp-typography-line-height-running-factor`, how should it be used, and how is a
consumer supposed to discover the required formula?

**Resolution:** The token was introduced as a `1.105` multiplier while BP7 still exposed composite typography styles with
their own standard line heights. Those composite styles were later removed, but the multiplier remained. Its source
description says that consumers must multiply it by a style's standard line height; the current public token set does not
provide that baseline. The token is not explained in the design-token README, usage guide, or customization guide. Its only
current component use is Callout, where it is incorrectly assigned directly to `line-height`.

The generated name describes an implementation detail rather than a usable semantic role. Even a consumer who discovers the
custom property cannot infer which baseline to combine it with or which formula Blueprint expects.

**Decision:** Treat the standalone Callout usage as a bug. Do not use the factor by itself. Preserve Callout's BP6
`line-height: 1.5` through `running-typography-next`, with a TODO at the declaration to resolve the incomplete token API. The
token's name, API shape, and documentation remain open for typography-token review.

## Dialog and Overlay

### Overlay backdrop opacity

**Question:** Why did the BP6 overlay backdrop's 70% black become neutral-1000 at
`--bp-emphasis-translucence-opacity`, which currently resolves to 95%?

**Resolution:** The translucence token is not documented as an overlay-backdrop role. Its 95% value makes the backdrop
materially darker than BP6, and no reviewed migration artifact records a designer-approved reason for that change.

**Decision:** Preserve BP6's 70% opacity while sourcing the backdrop color from runtime-customizable
`--bp-intent-neutral-1000`. Do not use the generic translucence token for the backdrop.

### Dialog Sass aliases

**Question:** Can the dialog keep its reusable Sass variables while their values remain runtime-customizable, and should
those variables live in common `_variables-next.scss` or a separate dialog variables partial?

**Resolution:** A Sass variable can retain an unresolved CSS custom property or `calc()` expression. Dialog background,
radius, margin, and padding are component-local values, not shared core primitives. BP6 declares them in `_dialog.scss`, and
the dialog partials rely on their import order in the component index.

**Decision:** Keep next-suffixed aliases in the same component partials as BP6: shared Dialog aliases in `_dialog-next.scss`
and the MultistepDialog-only `$step-radius-next` in `_multistep-dialog-next.scss`. Document that subsequently imported Dialog
partials reuse the shared aliases. Do not move dialog-specific aliases into common variables or a separate dialog variables
partial. Use a plain CSS custom-property alias when no arithmetic is needed and `calc()` when arithmetic is needed; do not add
a redundant `* 1`.

### Unused Sass imports

**Question:** Why are `sass:math` and `@blueprintjs/icons/lib/scss/variables` absent from `_dialog-next.scss`?

**Resolution:** Neither import supplies a symbol used by the next stylesheet. Removing them does not change its generated
CSS.

**Decision:** Do not copy the unused imports into `_dialog-next.scss`.

### Dialog transition duration

**Question:** Why does the BP7 dialog transition multiply `--bp-emphasis-transition-duration` by three?

**Resolution:** BP6 used `$pt-transition-duration * 3`; the base duration was 100ms. Using the BP7 base token without the
multiplier reduced the dialog transition from three times the base duration to one times the base duration.

**Decision:** Preserve the three-times-base relationship with `calc(var(--bp-emphasis-transition-duration) * 3)`. Describe
the relationship rather than hard-coding `300ms` in the code comment because the token remains runtime-customizable.

### Dialog elevation shadow

**Question:** How should `$pt-dialog-box-shadow` map to a BP7 surface shadow, and how is a component developer expected to
discover the correct numbered token?

**Resolution:** `$pt-dialog-box-shadow` aliases `$pt-elevation-shadow-3`. BP7 `--bp-surface-shadow-3` has the same light-mode
shadow values and its token-source description identifies level 3 as popover/dialog elevation. Shadow 4 is maximum elevation
and is not the value-preserving mapping.

**Decision:** Use `--bp-surface-shadow-3` for Dialog.

TODO: Validate with design whether popover/dialog elevation should have a semantic token alias or clearer public
documentation; the numbered custom-property name does not expose the component role recorded in the token source.

### Dialog surface backgrounds

**Question:** Why does the BP6 dialog header's `$white` become `--bp-surface-background-color-base-rest`?

**Resolution:** The BP7 token resolves to white in light mode and changes at runtime for dark mode. This is a semantic
runtime-theme mapping. The dialog body also uses the same base token, so BP7 does not preserve BP6's light-mode contrast
between the light-gray body and white header.

**Decision:** Keep the base surface token for the BP7 dialog and header. Treat any restoration of separate body/header
surface levels as a designer-approved BP7 visual change rather than guessing another token during migration.

### One-pixel borders and dividers

**Question:** Should BP6's literal `1px` dialog borders and divider offsets become
`--bp-surface-border-width`?

**Resolution:** The token currently resolves to `1px`, but it is runtime-customizable. Substitution therefore changes
geometry for consumers who customize border width, including forced-colors outlines and the header divider offset.

**Decision:** Preserve literal `1px` in the migrated dialog styles.

TODO: Validate with design whether future BP7-native dialog borders and dividers should use the customizable border-width
token.

### Default dialog-header icon color

**Question:** How should `$pt-icon-color` map to BP7, how is a developer supposed to discover that mapping, and should BP7
provide a dedicated default-icon-color token?

**Resolution:** `$pt-icon-color` aliases BP6's muted text color. `--bp-typography-color-intent-neutral`, rather than the base
text token, represents the secondary neutral foreground role across light and dark modes. Neither the current custom-property
name nor the migration plan makes the icon mapping explicit.

**Decision:** Use `--bp-typography-color-intent-neutral` for non-intent dialog-header icons and document the BP6 alias
relationship at the declaration.

TODO: Validate with design whether BP7 needs a semantic default-icon-color token or public mapping guidance instead of
requiring component authors to infer the typography token.

### Dialog title font size

**Question:** Which BP7 typography size preserves the dialog title's BP6 `14px`?

**Resolution:** `--bp-typography-size-md` is 13px; `--bp-typography-size-lg` is 14px.

**Decision:** Use `--bp-typography-size-lg` unless design explicitly approves a dialog title size change.

## Breadcrumbs

### `$pt-font-size-large` to a BP7 typography size

**Question:** How does `$pt-font-size-large` translate to a `--bp-typography-size-*` token?

**Resolution:** There is no documented or mechanical mapping in the migration plan. `$pt-font-size-large` is `16px`; BP7
`--bp-typography-size-xl` is `15px`, while `--bp-typography-size-2xl` is `16px`. The branch is also inconsistent: migrated
components currently use both `lg` and `xl` for BP6 large text.

**Decision:** Open. Keep the existing Breadcrumbs `--bp-typography-size-xl` mapping until the intended BP7 component type
scale is confirmed. Use `2xl` only if exact BP6 sizing, rather than the BP7 redesign, is the requirement.

### `$pt-text-color-muted` to neutral typography

**Question:** Why does `$pt-text-color-muted` become `--bp-typography-color-intent-neutral`?

**Resolution:** This is a semantic mapping, not a value-preserving conversion. Both represent secondary neutral text/icon
color, and the BP7 token selects the appropriate neutral ramp value for light and dark schemes.

**Decision:** Keep `--bp-typography-color-intent-neutral` for non-current breadcrumbs, separators, and the collapsed item.

### `$pt-text-color-disabled`

**Question:** Why was `$pt-text-color-disabled` removed, and is there a CSS custom-property equivalent?

**Resolution:** BP7 has no dedicated disabled-color token. The migration plan requires deriving disabled leaf colors from a
semantic foreground plus `--bp-emphasis-disabled-opacity`. This is an intentional BP7 visual change: the BP6 value used
muted text at 60% alpha, while BP7 currently uses base text at the configured 40% disabled opacity.

**Decision:** Keep the relative-color expression based on `--bp-typography-color-base` and
`--bp-emphasis-disabled-opacity`.

### `600` to strong typography weight

**Question:** Why does `font-weight: 600` become `--bp-typography-weight-strong`?

**Resolution:** This is a semantic mapping to the BP7 strong-emphasis role. It is not numerically equivalent: the current
strong token resolves to `500`.

**Decision:** Keep the semantic strong token unless Breadcrumbs is required to preserve the BP6 numeric weight exactly.

### Current breadcrumb color

**Question:** Why was `color: inherit` changed to `--bp-typography-color-base`?

**Resolution:** Browser verification showed that using only `data-bp-color-scheme="dark"` updates the token but does not set
the inherited `color` property. The current breadcrumb therefore inherited the BP6 light body color on a dark background.

**Decision:** Preserve `color: inherit` on the current breadcrumb and set `--bp-typography-color-base` on the Breadcrumbs
root. This retains the BP6 inheritance relationship while making the component root respond to BP7 light/dark tokens.

### Collapsed-item padding

**Question:** Why was `padding: 1px $pt-spacing` changed to logical properties, and why was `1px` replaced with
`--bp-surface-border-width`?

**Resolution:** Neither change was required. Border width happens to default to `1px`, but coupling padding to a customizable
border-width token changes layout for consumers who customize borders.

**Decision:** Preserve the shorthand and literal: `padding: 1px var(--bp-surface-spacing)`.

### Themeable SVG icons

**Question:** Why replace a background SVG with `background-color` plus `mask`?

**Resolution:** `svg-icon()` embeds its fill into a data URL at Sass compile time. A runtime CSS custom property cannot be
reliably resolved inside that standalone SVG document. The mask retains the SVG shape, while `background-color` supplies a
runtime-themeable token color.

**Decision:** Keep the mask approach for Breadcrumbs separators and the collapsed-item icon.

TODO: Check the UI

### Collapsed-item hover background

**Question:** Why does `background: rgba($gray3, 0.3)` become
`--bp-surface-layer-color-neutral-hover`?

**Resolution:** This is a semantic mapping from a translucent neutral hover overlay to BP7's stateful neutral layer color.
It is intentionally not value-equivalent; the token has different light and dark values and remains customizable at runtime.

**Decision:** Keep `--bp-surface-layer-color-neutral-hover` on `background-color`.

### `$pt-text-color` to base typography

**Question:** Why does `$pt-text-color` become `--bp-typography-color-base`?

**Resolution:** Both represent the primary text foreground for the active color scheme. Unlike the compiled Sass color, the
BP7 token changes at runtime when `data-bp-color-scheme` changes.

**Decision:** Use `--bp-typography-color-base` for primary Breadcrumbs text and hover foregrounds.

### Dark-mode rules

**Question:** Why is a dark section still needed if tokens change with the color scheme?

**Resolution:** The BP6 stylesheet still needs `.bp6-dark` branches because its Sass colors are compiled constants. The
next stylesheet does not need a dark branch; BP7 token values change through `data-bp-color-scheme="dark"`.

**Decision:** Retain the BP6 dark section and do not add one to `_breadcrumbs-next.scss`.

### Forced-colors media query

**Question:** Why is `@media (forced-colors: active)` needed?

**Resolution:** BP6 did not explicitly adapt the Breadcrumb icons to forced colors. Their Sass colors were baked into SVG
background images, which remained visible in the tested Chromium configuration but did not adapt to the user's system palette.
BP7 masks instead take their visible color from `background-color`; without an explicit high-contrast foreground, a masked icon
can become indistinguishable from its background.

`develop` keeps system-color keywords behind `$pt-high-contrast-mode-*` Sass variables. None of the existing border, active, or
disabled variables represents an enabled icon foreground, so reusing one would give it the wrong semantics.

**Decision:** Add `$pt-high-contrast-mode-icon-color`, backed by the `CanvasText` system color, to `_variables-next.scss` so BP6
remains unchanged. Use it for masked shapes in forced-colors mode, including the collapsed item's hover state. Comments at the
usage sites should explain the durable visibility problem rather than mention the alias's current system-color implementation.

TODO: Re-run the Breadcrumbs Storybook forced-colors checks after confirming that it serves freshly compiled CSS.
