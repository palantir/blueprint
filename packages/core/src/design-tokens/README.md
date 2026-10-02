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

| Category    | Prefix               | Description                                         |
| ----------- | -------------------- | --------------------------------------------------- |
| Palette     | `--bp-palette-*`     | Raw color values (gray, blue, green, etc.)          |
| Intent      | `--bp-intent-*`      | Semantic colors (primary, success, warning, danger) |
| Border      | `--bp-border-*`      | Independent intent border colors                    |
| Surface     | `--bp-surface-*`     | Backgrounds, borders, shadows, spacing, z-index     |
| Typography  | `--bp-typography-*`  | Font families, sizes, weights, line heights, colors |
| Iconography | `--bp-iconography-*` | Icon sizes and colors                               |
| Emphasis    | `--bp-emphasis-*`    | Focus rings, transitions, easing                    |

## Development

```bash
pnpm run build:tokens  # Generate tokens
```

### Palette scales

The CSS palette has fourteen chromatic families and one gray family, each with ten stops from `100` (lightest) to `1000` (darkest). Standalone `--bp-palette-black` and `--bp-palette-white` retain their BP6 values.

Chromatic stops `300` through `700` preserve the five BP6 colors exactly: old `5`, `4`, `3`, `2`, `1` map to `300`, `400`, `500`, `600`, `700`. The new stops are provisional OKLCH mixes: `100` and `200` mix `300` at 25% and 60% with white; `800`, `900`, and `1000` mix `700` at 80%, 60%, and 40% with black. Existing components do not use these new stops.

Gray stops preserve ten selected BP6 anchors: light gray `5`, `4`, `1`; gray `5`, `3`, `1`; dark gray `5`, `4`, `3`, `1`, in that order. The other five gray shades are not exported as CSS tokens. Legacy `@blueprintjs/colors` Sass and TypeScript constants are unchanged.

### Runtime overrides

Filled primary, success, warning, and danger Buttons reuse `--bp-surface-background-color-{intent}-{state}`. Primary, success, and danger alias their generic intent colors. Warning has a brighter derived rest color (approximately `#fbb360`) and preserves its existing hover/active mixes; `--bp-intent-warning-rest` remains the orange-500 semantic color. Legacy default-intent Buttons retain generic intent backgrounds rather than the distinct default surface colors.

Plain token references are emitted as CSS `var()` aliases. Base palette and generic intent aliases resolve on `:root`, so override chromatic palette anchors there to update filled backgrounds. A palette override only on `body` or a dark-theme container does not recompute inherited root aliases. Dark text and border recipes resolve on `[data-bp-color-scheme="dark"]` or `.bp6-dark`, using those already-resolved intent colors. To customize a local component subtree, override its semantic roles directly.

`--bp-disabled-opacity` defaults to `0.5` for matching unfilled disabled intent text. Existing warning and filled-foreground opacity exceptions remain unchanged; it is not a global disabled-component opacity.

## Additional Notes

### Token Structure

Tokens follow the [DTCG](https://tr.designtokens.org/format/) specification. Source files live in `tokens/base/` (5 files: palette, intent, surface, typography, emphasis) with theme overrides in `tokens/themes/` (which currently includes only dark tokens).

Each token uses these standard DTCG properties:

| Property       | Purpose                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `$type`        | Data type: `color`, `dimension`, `shadow`, `fontFamily`, `fontWeight`, `number`, `duration`, `cubicBezier` |
| `$value`       | The token value — a literal, a reference like `"{palette.blue.500}"`, or a complex object                  |
| `$description` | Human-readable explanation                                                                                 |
| `$extensions`  | Custom Blueprint metadata                                                                                  |

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
