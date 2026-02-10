# Design Tokens -- EXPERIMENTAL

Blueprint design tokens generated with [Style Dictionary](https://styledictionary.com/).

## Output

The tokens are compiled to `dist/_tokens.scss`, a SCSS partial that gets inlined into `blueprint.css` during compilation.

## Usage

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

| Category | Prefix | Description |
|----------|--------|-------------|
| Palette | `--bp-palette-*` | Raw color values (gray, blue, green, etc.) |
| Intent | `--bp-intent-*` | Semantic colors (primary, success, warning, danger) |
| Surface | `--bp-surface-*` | Backgrounds, borders, shadows, spacing, z-index |
| Typography | `--bp-typography-*` | Font families, sizes, weights, line heights, colors |
| Iconography | `--bp-iconography-*` | Icon sizes and colors |
| Emphasis | `--bp-emphasis-*` | Focus rings, transitions, easing |

## Development

```bash
pnpm run build:tokens  # Generate tokens
```

## Additional Notes

### Distribution

The output is named with an underscore prefix (`_tokens.scss`) to follow the SCSS partial convention. This ensures the token definitions are **inlined** during SCSS compilation rather than left as a CSS `@import` statement (which would cause path resolution issues in the compiled output).

**Source:** `src/design-tokens/tokens/*.json`

### Browser Compatibility

Some tokens use the CSS [relative color syntax(https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors) (`oklch(from ...)`) for deriving hover, active, and alpha-modified colors. This requires:

| Browser | Minimum Version |
|---------|-----------------|
| Chrome  | 122+ |
| Safari  | 18+ |
| Firefox | 128+ |
| Edge    | 122+ |

Older browsers will ignore these property values. Within Blueprint components, there will be fallback values provided. Outside of Blueprint, you may need to provide your own fallbacks.
