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
| Surface     | `--bp-surface-*`     | Backgrounds, borders, shadows, spacing, z-index     |
| Typography  | `--bp-typography-*`  | Font families, sizes, weights, line heights, colors |
| Iconography | `--bp-iconography-*` | Icon sizes and colors                               |
| Emphasis    | `--bp-emphasis-*`    | Focus rings, transitions, easing                    |

## Development

```bash
pnpm run build:tokens  # Generate tokens
```

## Additional Notes

### Token Structure

Tokens use the [DTCG](https://tr.designtokens.org/format/) structure, with the Blueprint-specific exception below. Source files live in `tokens/base/` (5 files: palette, intent, surface, typography, emphasis) with theme overrides in `tokens/themes/` (which currently includes only dark tokens).

Each token uses these standard DTCG properties:

| Property       | Purpose                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `$type`        | Data type: `color`, `dimension`, `shadow`, `fontFamily`, `fontWeight`, `number`, `duration`, `cubicBezier` |
| `$value`       | The token value — a literal, a reference like `"{palette.blue.3}"`, or a complex object                    |
| `$description` | Human-readable explanation                                                                                 |
| `$extensions`  | Custom Blueprint metadata                                                                                  |

**CSS expression exception:** The next `surface.icon-size.*` and `surface.input-height.*` values use raw CSS `calc(var(--bp-surface-spacing) * ...)` strings to retain runtime spacing defaults. Blueprint's CSS generator passes these strings through. They are not standard DTCG dimension values and require adaptation for tools that expect portable dimension objects.

The next `--bp-surface-input-height-standard`, `--bp-surface-input-height-large`, and `--bp-surface-input-height-small` tokens default to 7.5, 10, and 6 spacing units, respectively. They also drive existing shared layout dimensions such as breadcrumb height, CardList minimum heights, and dialog header minimum height. Like the icon-size tokens, they resolve spacing where they are declared; overriding spacing only on a descendant does not recompute inherited heights. Override the height tokens directly to customize those sizes independently.

#### Custom extensions

The next `--bp-typography-color-disabled` token derives the base text color at `--bp-emphasis-disabled-opacity` using the extension below. It is declared in both light and dark next scopes so nested dark themes recompute it from their own base color. Descendant-only base-color or opacity overrides do not recompute the inherited disabled color; override the disabled-color token directly in that scope.

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
