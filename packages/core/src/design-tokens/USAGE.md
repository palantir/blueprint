# Design tokens and runtime theming

Blueprint's runtime visual values are exposed as CSS custom properties. Token sources use the DTCG JSON format and
are compiled by `build-design-tokens` before Sass runs.

The migration is deliberately a parity layer: default token values reproduce Blueprint 6's Sass output. Color and
shadow defaults are stored as exact sRGB values rather than browser-derived approximations.

## Loading tokens

The normal package CSS entrypoint includes that package's generated token defaults. Source-Sass consumers can import
the package's token-only entrypoint instead:

```scss
@import "@blueprintjs/core/src/blueprint-design-tokens";
@import "@blueprintjs/datetime/src/blueprint-datetime-design-tokens";
```

Core CSS remains a prerequisite for addon CSS. Core owns shared palette, typography, intent, spacing, radius, and Core
component tokens. Addons own their package-prefixed tokens, such as `--bp-datetime-*`, `--bp-select-*`, and
`--bp-table-*`.

DateTime2 includes DateTime's token-only output, so Core plus DateTime2 CSS is sufficient; loading DateTime's component
CSS separately is not required.

Generated files under `design-tokens/build/` are build artifacts. Edit the DTCG JSON sources, not generated CSS.

## Customizing components

Override canonical tokens on `:root` for an application-wide theme or on a container for a scoped theme:

```css
:root {
    --bp-spacing: 5px;
    --bp-border-radius: 6px;
}

.editor-theme {
    --bp-button-background-color: #e7f0ff;
    --bp-button-background-color-hover: #d5e5ff;
    --bp-datetime-datepicker-selected-day-background-color: #1456a0;
}
```

Named component dimensions have independent defaults. A component uses `calc()` only where the relationship is
intentionally proportional, such as padding derived from `--bp-spacing`.

## Light and dark scopes

Every generated token sheet emits theme blocks in this order:

```css
:root {
    /* invariant and light defaults */
}
.bp6-dark {
    /* compatibility dark overrides */
}
[data-bp-color-scheme="light"] {
    /* explicit light boundary */
}
[data-bp-color-scheme="dark"] {
    /* explicit dark boundary */
}
```

An explicit color-scheme attribute therefore wins over `.bp6-dark` on the same element. Explicit boundaries can also
be nested in either direction:

```html
<section data-bp-color-scheme="dark">
    <div data-bp-color-scheme="light">...</div>
</section>
```

Blueprint's old value-bearing dark selectors have been removed where they would override a nested explicit light
scope. `.bp6-dark` remains supported as a compatibility theme boundary.

## Legacy experimental aliases

The canonical shared names are `--bp-spacing` and `--bp-border-radius`. The earlier experimental names
`--bp-surface-spacing` and `--bp-surface-border-radius` retain literal Blueprint defaults, and the canonical names
reference them at `:root` and explicit theme boundaries.

This preserves legacy overrides made on those boundary elements. CSS custom properties are resolved where they are
declared, however, so changing a legacy alias on an arbitrary descendant cannot update an inherited canonical token.
Use canonical names for arbitrary subtree overrides.

The historic `--bp-surface-shadow-0..4` defaults are preserved too, but they do not exactly match Blueprint 6's Sass
elevation shadows. Runtime styles therefore consume independent `--bp-elevation-shadow-0..4` tokens (except where a
legacy value is already exact). Legacy shadow overrides cannot retarget those canonical values; customize the
`--bp-elevation-shadow-*` names directly.

## Sass compatibility

Existing documented Sass and LESS variables, initializers, types, `!default` behavior, mixins, and generated exports
remain available. They are still useful in consumer-authored Sass, but Sass overrides no longer theme Blueprint's
compiled component internals; override the corresponding CSS token for runtime theming.

Some values intentionally remain compile-time Sass: namespace interpolation, generated icon codepoint maps,
selector/control-flow maps, media-query inputs, mixin parameters, and geometry that Sass must calculate before CSS is
emitted. The migration ledger in `migration/sass-variable-ledger.json` records every declaration and its disposition.

## Portals

CSS variables inherit through the DOM, not the React tree. A token override on a component subtree does not
automatically cross a Portal rendered under `document.body`. Put the portal container inside the themed scope and pass
it through Blueprint's `portalContainer` support:

```tsx
const portalContainer = document.querySelector<HTMLElement>(".editor-theme .portal-root");

<BlueprintProvider portalContainer={portalContainer}>
    <App />
</BlueprintProvider>;
```

No runtime token propagation is added by this migration.
