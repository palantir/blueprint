# Design Tokens -- EXPERIMENTAL

Blueprint design tokens generated with [Style Dictionary](https://styledictionary.com/).

## Configuration

Tokens are available as CSS custom properties on `:root`:

```css
.element {
    color: var(--bp-typography-color-default-rest);
    background: var(--bp-surface-background-color-default-rest);
    border-radius: var(--bp-surface-border-radius);
    padding: calc(var(--bp-surface-spacing) * 2);
}
```

## Token Categories

| Category    | Prefix                                                           | Description                                         |
| ----------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| Palette     | `--bp-palette-*`                                                 | Raw color values (gray, blue, green, etc.)          |
| Intent      | `--bp-intent-*`                                                  | Semantic colors (primary, success, warning, danger) |
| Surface     | `--bp-surface-*`                                                 | Backgrounds, borders, shadows, spacing, z-index     |
| Typography  | `--bp-typography-*`                                              | Font families, sizes, weights, line heights, colors |
| Iconography | `--bp-iconography-*`                                             | Icon sizes and colors                               |
| Emphasis    | `--bp-emphasis-*`                                                | Focus rings, transitions, easing                    |
| Component   | `--bp-button-*`, `--bp-input-*`, `--bp-menu-*`, `--bp-popover-*` | Public overrides for one component                  |

Raw palette tokens are inputs to semantic tokens; supported component styles do not consume `--bp-palette-*` directly.
Components consume their public component tokens, whose defaults reference intent, surface, and typography tokens. Apply
semantic overrides on the same token scope (`.bp-next` for BP7) so those aliases resolve against the override:

```css
.bp-next.product-theme {
    /* Changes every component which uses the primary semantic role. */
    --bp-intent-primary-rest: #005bbb;

    /* Changes only solid primary Buttons. */
    --bp-button-background-intent-primary-rest: #005bbb;
}
```

Default-size Button geometry and typography form a component recipe because the global spacing and body typography
tokens cannot express independent component decisions:

```css
.bp-next.product-theme {
    --bp-button-min-block-size: 2.75rem;
    --bp-button-padding-block: 0.625rem;
    --bp-button-padding-inline: 1.25rem;
    --bp-button-border-radius: 9999px;
    --bp-button-border-width-solid: 2px;
    --bp-button-border-width-outlined: 2px;
    --bp-button-font-family: var(--bp-typography-family-body);
    --bp-button-font-size: 0.875rem;
    --bp-button-font-weight: 600;
    --bp-button-line-height: 1.25rem;
}
```

`--bp-surface-spacing` remains the global base unit used across components. A single value cannot produce a 44px Button
height and 20px inline padding from Button's existing `7.5 × spacing` and `2 × spacing` ratios, and changing it also
resizes unrelated components. Component geometry tokens avoid that coupling. As a consequence, an existing theme which
changes only `--bp-surface-spacing` must also set the new default-size Button height and padding tokens to keep scaling
those properties. Small and large Button sizes retain their existing size-specific geometry in this initial API.
`min-block-size` is intentionally a floor rather than a fixed height: with the example recipe, the 20px line box, two
10px paddings, and two 2px borders naturally produce 44px, while larger content can still expand. The default minimum
width and icon-only centering calculation remain spacing-based and are not covered by these initial tokens.

Dimension tokens preserve their authored CSS units. For example, the recipe above stays in `rem`; Blueprint does not
convert it to pixels or modify the document root font size. Consequently, the same `rem` value may have different
computed pixel sizes in a host application and a widget iframe when those documents use different root font sizes.

`--bp-private-*` values are not a theming API. Button, InputGroup, Menu, and Popover do not require them for supported
appearance overrides, including compound shadows and Popover arrow styling.

## Development

```bash
pnpm run build:tokens  # Generate tokens
```

## Additional Notes

### Token Structure

Tokens follow the [DTCG](https://tr.designtokens.org/format/) specification. Source files live in `tokens/base/`, with
BP7 sources in `tokens/next/` and dark overrides in `tokens/themes/dark/`.

Each token uses these standard DTCG properties:

| Property       | Purpose                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| `$type`        | Data type: `color`, `dimension`, `shadow`, `string`, `fontFamily`, `fontWeight`, `number`, `duration`, `cubicBezier` |
| `$value`       | The token value — a literal, a reference like `"{palette.blue.3}"`, or a complex object                              |
| `$description` | Human-readable explanation                                                                                           |
| `$extensions`  | Custom Blueprint metadata                                                                                            |

#### Custom extensions

**`com.blueprint.derive`** — derives a new color from the referenced `$value` using OKLCH color space transforms:

```json
{
    "$value": "{intent.default.rest}",
    "$extensions": {
        "com.blueprint.derive": {
            "alpha": 0.25
        }
    }
}
```

Available derivation properties: `alpha`, `lightnessScale`, `chromaScale`, `lightnessOffset`, `chromaOffset`, `hueOffset`. These are applied during build to produce both a static hex fallback and a relative color syntax expression (`oklch(from ...)`).

**`com.blueprint.role`** — assigns special build handling to a token. Currently one role exists:

- `"stackable-layer"` — wraps the compiled color in `linear-gradient(color 0 0)` so it can be composited as a `background-image` layer.

#### Theme overrides

Dark mode files in `tokens/themes/dark/` override base tokens by redefining `$value` and/or `$extensions`. For example, `surface.border-color.strong` changes from gray-based in light mode to white-based in dark mode:

```json
// base/surface.tokens.json
"strong": { "$value": "{intent.default.rest}", "$extensions": { "com.blueprint.derive": { "alpha": 0.25 } } }

// themes/dark/surface.tokens.json
"strong": { "$value": "{palette.white}", "$extensions": { "com.blueprint.derive": { "alpha": 0.3 } } }
```

### Browser Compatibility

Some tokens use the CSS [relative color syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors) (`oklch(from ...)`) for deriving hover, active, and alpha-modified colors. This requires:

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 122+            |
| Safari  | 18+             |
| Firefox | 128+            |
| Edge    | 122+            |

Older browsers will ignore these property values. Within Blueprint components, there will be fallback values provided. Outside of Blueprint, you may need to provide your own fallbacks.
