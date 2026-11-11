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
pnpm run build:tokens        # Generate tokens
pnpm run build:palette-ramp  # Regenerate tokens/base/palette/ramp.tokens.json
```

## Palette Ramp

Each BP6 color family also has a 100–900 ramp, `--bp-palette-{family}-{step}`, plus a single `gray` ramp that covers the BP6 light-gray, gray, and dark-gray scales. Step 100 is the lightest and 900 the darkest, the reverse of the BP6 1–5 scales, where 1 is the darkest.

```css
.element {
    background: var(--bp-palette-blue-100);
    color: var(--bp-palette-blue-900);
}
```

The ramp tokens live in `tokens/base/palette/ramp.tokens.json`, which is generated from `tokens/base/palette.tokens.json` by `paletteRamp.ts`. Don't edit it by hand: change the BP6 palette or `DEFAULT_RAMP_CONFIG`, then run `pnpm run build:palette-ramp`. A test fails if the committed file is out of date.

### How the ramp is built

- **Target lightness.** Every ramp shares one target curve: OKLCH lightness evenly spaced from 0.95 at step 100 to 0.25 at step 900.
- **BP6 colors are kept exactly.** Each BP6 chromatic color is reused verbatim at the step whose target lightness it matches best, keeping the five colors in order. Its token references the BP6 token, and its CSS comment names it (`/** Same as --bp-palette-blue-3 */`).
- **Other steps are generated** in OKLCH. Lightness follows the target curve, bent smoothly to pass through the BP6 colors. Hue and chroma are interpolated from the BP6 colors, and chroma tapers past the lightest and darkest BP6 color so tints and shades don't become neon.
- **Grays.** A BP6 gray is reused only where it sits within 0.02 of a step's target lightness (about one just-noticeable difference). Other gray steps are generated, and BP6 grays without a step keep only their BP6 names.

Because placement follows lightness, the same BP6 shade can land on different steps in different families:

| Family                                                             | 5 → | 4 → | 3 → | 2 → | 1 → |
| ------------------------------------------------------------------ | --- | --- | --- | --- | --- |
| blue, green, red, vermilion, rose, indigo, cerulean, forest, sepia | 300 | 400 | 500 | 600 | 700 |
| orange                                                             | 200 | 300 | 500 | 600 | 700 |
| turquoise                                                          | 200 | 300 | 500 | 600 | 800 |
| gold                                                               | 200 | 300 | 400 | 600 | 700 |
| lime                                                               | 100 | 200 | 400 | 600 | 700 |
| violet                                                             | 300 | 400 | 600 | 700 | 800 |

| `gray` step | 100            | 200            | 300      | 400      | 500      | 600      | 700       | 800           | 900           |
| ----------- | -------------- | -------------- | -------- | -------- | -------- | -------- | --------- | ------------- | ------------- |
| BP6 gray    | `$light-gray4` | `$light-gray1` | `$gray4` | `$gray3` | `$gray2` | `$gray1` | generated | `$dark-gray3` | `$dark-gray1` |

Not in the `gray` ramp: `$light-gray5`, `$light-gray3`, `$light-gray2`, `$gray5`, `$dark-gray5`, `$dark-gray4`, `$dark-gray2`.

The Storybook story **Core/Styles/Palette Ramp** shows each ramp next to the BP6 colors it reuses, the lightness curves, and the full migration map. Its Playground story regenerates the ramps live with adjustable settings.

## Additional Notes

### Token Structure

Tokens follow the [DTCG](https://tr.designtokens.org/format/) specification. Source files live in `tokens/base/` (palette, intent, surface, typography, emphasis, and the generated palette ramp) with theme overrides in `tokens/themes/` (which currently includes only dark tokens).

Each token uses these standard DTCG properties:

| Property       | Purpose                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `$type`        | Data type: `color`, `dimension`, `shadow`, `fontFamily`, `fontWeight`, `number`, `duration`, `cubicBezier` |
| `$value`       | The token value — a literal, a reference like `"{palette.blue.3}"`, or a complex object                    |
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
