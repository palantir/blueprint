# Design tokens -- EXPERIMENTAL

Blueprint's package-owned design tokens are authored in the
[DTCG format](https://tr.designtokens.org/format/) and compiled to CSS custom properties by the shared
`build-design-tokens` command from `@blueprintjs/node-build-scripts`.

The Blueprint 6 migration is an exact-parity layer. Runtime component tokens use the resolved sRGB, alpha, shadow,
and dimension values produced by the existing Sass defaults. They do not use relative-color approximations.

See [USAGE.md](./USAGE.md) for loading token-only entrypoints, scoping themes, compatibility aliases, Sass behavior,
and portals.

## Ownership

Core owns shared palette, intent, typography, spacing, radius, elevation, and Core-component tokens. Addon packages
own their package-prefixed tokens, including `--bp-datetime-*`, `--bp-select-*`, and `--bp-table-*`. Core CSS remains
a prerequisite for addon CSS.

Token sources live under `tokens/base/`, with dark overrides under `tokens/themes/dark/`. Generated files under
`design-tokens/build/` are ignored build artifacts; edit the DTCG sources instead.

## Canonical tokens

Use concise shared names and component-specific names when customizing Blueprint:

```css
:root {
    --bp-spacing: 5px;
    --bp-border-radius: 6px;
    --bp-button-background-color: #e7f0ff;
}
```

The earlier experimental names `--bp-surface-spacing` and `--bp-surface-border-radius` remain compatibility aliases.
New code should use the canonical names.

The experimental `--bp-surface-shadow-0..4` defaults are also preserved. They differ from Blueprint 6's actual Sass
shadows, so runtime styles use exact `--bp-elevation-shadow-0..4` tokens instead of aliasing the incompatible values.

## Token structure

Tokens use standard DTCG properties:

| Property       | Purpose                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `$type`        | Data type: `color`, `dimension`, `shadow`, `fontFamily`, `fontWeight`, `number`, `duration`, `cubicBezier` |
| `$value`       | A literal, a reference such as `"{palette.blue.3}"`, or a structured DTCG value                            |
| `$description` | Optional human-readable explanation                                                                        |
| `$extensions`  | Blueprint-specific build metadata                                                                          |

DTCG references remain references in generated CSS:

```json
{ "$type": "color", "$value": "{palette.blue.3}" }
```

```css
--bp-example-color: var(--bp-palette-blue-3);
```

Two extensions support the pre-existing experimental token set:

- `com.blueprint.derive` creates a static fallback and a guarded relative-color value.
- `com.blueprint.role: "stackable-layer"` wraps a color in `linear-gradient(... 0 0)` for background stacking.

Parity component tokens must store exact values instead of introducing either extension.

## Theme output

Every generated token sheet emits selectors in this order:

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

Explicit color-scheme attributes therefore override `.bp6-dark` on the same element and support nested theme scopes
in either direction.

## Development

```bash
pnpm --filter @blueprintjs/core build:tokens
```
