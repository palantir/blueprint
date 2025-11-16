# @blueprintjs/tokens

DTCG design tokens for Blueprint UI toolkit, implementing the [W3C Design Tokens Community Group Format Module v2025.10](https://www.designtokens.org/tr/2025.10/format/) specification.

## Overview

This package contains Blueprint's design tokens in DTCG (Design Tokens Community Group) format, providing a standardized, platform-agnostic way to define and consume design system values.

### Key Features

- **DTCG v2025.10 Compliance**: Follows the latest W3C Design Tokens specification
- **Dual Distribution Strategy**: Independent CSS (OKLCH colors) and SCSS (hex/rgba colors) outputs
- **Theme Support**: Light and dark themes with proper token resolution
- **Type Safety**: Strongly typed tokens with explicit `$type` declarations
- **SCSS Arithmetic Support**: Static SCSS values support compile-time arithmetic operations
- **Build Pipeline Integration**: Seamless integration with Blueprint's existing NX monorepo

## Token Architecture

### Directory Structure

```
packages/tokens/
├── src/                   # Source files
│   ├── tokens/
│   │   ├── base/              # Foundation tokens (context-free primitives)
│   │   │   ├── color.tokens.json       # 72 colors in OKLCH + hex
│   │   │   ├── dimension.tokens.json   # Spacing, sizing, borders
│   │   │   ├── typography.tokens.json  # Font families, sizes, line heights
│   │   │   ├── animation.tokens.json   # Transition durations, easing
│   │   │   └── layout.tokens.json      # Z-indexes
│   │   └── semantic/          # Semantic tokens (theme-aware with .light/.dark variants)
│   │       ├── intent.tokens.json      # Primary, success, warning, danger
│   │       ├── ui.tokens.json          # Text, background, divider, focus, icon, etc.
│   │       └── shadow.tokens.json      # Elevation shadows, component shadows, opacity
│   ├── style-dictionary.ts    # Style Dictionary configuration
│   └── build.ts               # Build script
└── dist/                  # Generated output
    ├── tokens.css             # CSS custom properties (hex/rgba colors)
    └── tokens.scss            # SCSS variables (hex/rgba colors, static values)
```

### Token Hierarchy

1. **Base Tokens**: Foundation design values (colors, dimensions, typography)
2. **Semantic Tokens**: Context-specific tokens that reference base tokens
3. **Theme Tokens**: Theme-specific overrides for light/dark modes

## Token Types

### Color Tokens

All colors use OKLCH color space for perceptual uniformity:

```json
{
    "color": {
        "$type": "color",
        "blue": {
            "3": {
                "$value": {
                    "colorSpace": "oklch",
                    "components": [0.5676, 0.1314, 258.14],
                    "hex": "#2d72d2"
                },
                "$description": "Blue scale - medium blue"
            }
        }
    }
}
```

**Color Scales**: Each color has a scale from light (1-5) to dark (1-5), plus gray scale from white to black.

### Dimension Tokens

Dimensions use explicit value/unit objects:

```json
{
    "dimension": {
        "$type": "dimension",
        "spacing": {
            "base": {
                "$value": { "value": 4, "unit": "px" },
                "$description": "Primary spacing unit for Blueprint's 4px-based spacing system"
            }
        }
    }
}
```

### Shadow Tokens

Shadows use composite type with arrays for layered shadows:

```json
{
  "shadow": {
    "$type": "shadow",
    "elevation": {
      "1": {
        "$value": [
          {
            "color": { "colorSpace": "oklch", "components": [...], "alpha": 0.1 },
            "offsetX": { "value": 0, "unit": "px" },
            "offsetY": { "value": 0, "unit": "px" },
            "blur": { "value": 0, "unit": "px" },
            "spread": { "value": 1, "unit": "px" }
          },
          {
            "color": { "colorSpace": "oklch", "components": [...], "alpha": 0.2 },
            "offsetX": { "value": 0, "unit": "px" },
            "offsetY": { "value": 1, "unit": "px" },
            "blur": { "value": 1, "unit": "px" },
            "spread": { "value": 0, "unit": "px" }
          }
        ],
        "$description": "Elevation 1: Border + subtle drop shadow"
      }
    }
  }
}
```

### Typography Tokens

```json
{
  "typography": {
    "font-family": {
      "$type": "fontFamily",
      "default": {
        "$value": ["-apple-system", "BlinkMacSystemFont", "Segoe UI", ...]
      }
    },
    "font-size": {
      "$type": "dimension",
      "default": {
        "$value": { "value": 14, "unit": "px" }
      }
    }
  }
}
```

## Semantic Tokens

Semantic tokens provide meaningful names that reference base tokens:

### Intent Colors

```json
{
    "intent": {
        "$type": "color",
        "primary": {
            "$value": "{color.blue.3}",
            "$description": "Primary intent color (informational actions)"
        },
        "success": {
            "$value": "{color.green.3}"
        },
        "warning": {
            "$value": "{color.orange.3}"
        },
        "danger": {
            "$value": "{color.red.3}"
        }
    }
}
```

### UI Tokens

```json
{
    "ui": {
        "$type": "color",
        "text": {
            "default": {
                "$value": "{color.gray.dark-1}",
                "$description": "Default text color (primary body text)"
            }
        },
        "background": {
            "app": {
                "$value": "{color.gray.light-5}",
                "$description": "Application background color"
            }
        }
    }
}
```

## Theme Management

Light and dark themes are supported through semantic token variants. Each semantic token can have `.light` and `.dark` variants that are resolved during the build process.

The build system generates separate outputs for each theme, with dark theme tokens overriding their light theme counterparts when the `.bp6-dark` class is applied.

## Build System

### Scripts

- `pnpm compile`: Build tokens to CSS and SCSS
- `pnpm dev`: Build tokens in watch mode
- `pnpm clean`: Remove generated files
- `pnpm dist`: Production build (alias for compile)

### Style Dictionary

Tokens are transformed using Style Dictionary v5 with custom transforms:

**Common Transforms (used by both CSS and SCSS):**

- **color/oklch-to-css**: OKLCH → hex/rgba format for maximum compatibility
- **dimension/standard-css**: Dimension objects → CSS values (e.g., `4px`)
- **duration/standard-css**: Duration objects → CSS values (e.g., `100ms`)
- **cubicBezier/standard-css**: Arrays → `cubic-bezier()` functions
- **fontFamily/standard-css**: Font arrays → CSS font stacks
- **shadow/standard-css**: Shadow composites → CSS `box-shadow` with hex/rgba colors

**Platform-Specific Name Transforms:**

- **name/css-custom-property**: Token path → CSS custom property name (e.g., `color-blue-3`)
- **name/scss-blueprint**: Token path → Blueprint SCSS variable name (e.g., `color.blue.3` → `$blue3`)

### Generated Output

```
dist/
├── tokens.css              # CSS custom properties with hex/rgba colors
└── tokens.scss             # SCSS variables with static hex/rgba values
```

**CSS Output (`tokens.css`)**:

- CSS custom properties with hex/rgba colors
- Supports runtime theming (future CSS-only Blueprint distribution)
- Example: `--color-blue-3: #2d72d2;`

**SCSS Output (`tokens.scss`)**:

- Static SCSS variables with hex/rgba color format
- Supports compile-time arithmetic operations (e.g., `$pt-spacing * 2`)
- Compatible with SCSS color functions (`rgba()`, `lighten()`, `darken()`, etc.)
- Example: `$blue3: #2d72d2;`

**Dual Distribution Strategy**:
The two outputs are **independent and serve different purposes**:

- **SCSS version** (`tokens.scss`): For current Blueprint usage, supports backward compatibility and arithmetic
- **CSS version** (`tokens.css`): For future CSS-only Blueprint distribution with runtime theming

## Usage

### In CSS

```css
@import "@blueprintjs/tokens/dist/tokens.css";

.my-component {
    color: var(--ui-text-default-light);
    background: var(--ui-background-elevated-light);
    box-shadow: var(--shadow-elevation-2-light);
}
```

### In SCSS

```scss
@import "@blueprintjs/tokens/dist/tokens.scss";

.my-component {
    // SCSS variables are static values, support arithmetic
    color: $pt-text-color; // → #1c2127
    background: $pt-app-elevated-background-color; // → #ffffff
    padding: $pt-spacing * 2; // → 8px (compile-time arithmetic works!)
    box-shadow: $pt-elevation-shadow-2; // → 0 0 0 1px rgba(#111418, 0.1), ...

    // Dark theme variants
    .#{$ns}-dark & {
        color: $pt-dark-text-color; // → #abb3bf
        background: $pt-dark-app-elevated-background-color; // → #252a31
        box-shadow: $pt-dark-elevation-shadow-2; // → inset 0 0 0 1px rgba(#ffffff, 0.2), ...
    }
}
```

**Note**: SCSS variables are **static values** (not `var()` references). This allows:

- Compile-time arithmetic: `$pt-spacing * 2` works
- SCSS color functions: `rgba($blue3, 0.5)` works
- Backward compatibility with existing Blueprint SCSS code

### Dark Theme

Blueprint uses the `.bp6-dark` class for dark theme:

```html
<body class="bp6-dark">
    <!-- All components render in dark theme -->
</body>
```

## Authoring New Tokens

### Guidelines

1. **Use DTCG Format**: Follow the v2025.10 specification exactly
2. **Declare $type**: Always specify `$type` at the group level
3. **Add $description**: Provide clear descriptions for all tokens
4. **Use References**: Semantic tokens should reference base tokens using `{group.token}` syntax
5. **OKLCH for Colors**: All colors must use OKLCH color space
6. **Explicit Dimensions**: Use `{value, unit}` objects for all dimensional values

### Example: Adding a New Color

```json
{
    "color": {
        "$type": "color",
        "purple": {
            "3": {
                "$value": {
                    "colorSpace": "oklch",
                    "components": [0.5234, 0.1567, 289.45],
                    "hex": "#7c3aed"
                },
                "$description": "Purple scale - medium purple"
            }
        }
    }
}
```

### Example: Adding a Semantic Token

```json
{
    "ui": {
        "$type": "color",
        "link": {
            "$value": "{color.blue.3}",
            "$description": "Link text color"
        }
    }
}
```

## Migration Strategy

This token system is designed for gradual migration from SCSS to DTCG:

1. **Phase 1**: Base tokens + build system (✅ Complete)
2. **Phase 2**: Semantic tokens + theme support (✅ Complete)
3. **Phase 3**: Component integration (update components to use token CSS variables)
4. **Phase 4**: SCSS deprecation (remove old SCSS variables, use only tokens)

## DTCG Specification

This package implements:

- [Format Module v2025.10](https://www.designtokens.org/tr/2025.10/format/)
- [Color Type Specification](https://www.designtokens.org/tr/2025.10/color/)

## Development

### Adding Dependencies

```bash
cd packages/tokens
pnpm add <package-name>
```

### Running Build

```bash
pnpm compile
```

## Resources

- [DTCG Format Specification](https://www.designtokens.org/tr/2025.10/format/)
- [Style Dictionary Documentation](https://styledictionary.com/)
- [OKLCH Color Space](https://bottosson.github.io/posts/oklab/)
- [Blueprint Design System](https://blueprintjs.com/)

## License

Apache-2.0 © Palantir Technologies
