# @blueprintjs/design-tokens

Blueprint design tokens generated with [Style Dictionary 5](https://styledictionary.com/).

## Usage

### TypeScript

```typescript
import { palette } from '@blueprintjs/design-tokens/palette';

palette.blue.$root[500];  // Base color (same as light)
palette.blue.light[500]; // Light mode
palette.blue.dark[500];  // Dark mode
```

### CSS

```css
@import '@blueprintjs/design-tokens/lib/css/palette.css';

.element {
  color: var(--bp-palette-blue-500);
}

[data-theme="dark"] .element {
  color: var(--bp-palette-blue-500); /* Automatically uses dark value */
}
```

### SCSS / Less

```scss
@import '@blueprintjs/design-tokens/lib/scss/palette';

.light { color: $bp-palette-blue-500; }
.dark { color: $bp-palette-blue-500-dark; }
```

## Development

```bash
pnpm run build         # Generate tokens
pnpm run lint:tokens   # Validate tokens
```

## Token Structure

Palette tokens use the [DTCG format](https://www.designtokens.org/tr/drafts/format/) with color families (grey, blue, red, etc.) organized into levels 100-1000.

**Source:** `src/tokens/palette/*.json`

```json
{
  "palette": {
    "blue": {
      "$type": "color",
      "$root": {
        "100": { "$value": "#D6E4F8", "colorSpace": "oklch" },
        "200": { "$value": "#A7CAFC", "colorSpace": "oklch" }
      },
      "dark": {
        "100": { "$value": "#1A2A3A" }
      }
    }
  }
}
```

- `$root` - Shared values (used in both themes)
- `light` - Light theme overrides
- `dark` - Dark theme overrides

## License

Apache-2.0 © [Palantir Technologies](https://palantir.com)
