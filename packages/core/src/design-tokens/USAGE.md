# Design Tokens Usage

Design tokens are a single source of truth for Blueprint's visual language. They are defined as JSON in `tokens/base/` and compiled to CSS custom properties (prefixed `--bp-`), enabling consistent theming across different color schemes without duplicating style logic in each component.

## Intent tokens

Intent tokens map semantic meaning to colors. Rather than referencing a raw palette value like `--bp-palette-blue-3`, components use `--bp-intent-primary-rest`, which can be remapped per theme or brand.

Five intent types are defined in `tokens/base/intent.tokens.json`, each with interaction states:

| Token pattern           | States                                | Example resolution          |
| ----------------------- | ------------------------------------- | --------------------------- |
| `--bp-intent-default-*` | `rest`, `hover`, `active`, `disabled` | `rest` → `palette.gray.1`   |
| `--bp-intent-primary-*` | same                                  | `rest` → `palette.blue.3`   |
| `--bp-intent-success-*` | same                                  | `rest` → `palette.green.3`  |
| `--bp-intent-warning-*` | same                                  | `rest` → `palette.orange.3` |
| `--bp-intent-danger-*`  | same                                  | `rest` → `palette.red.3`    |

Intent tokens do not change between light and dark themes — the same blue is used for `primary` in both modes. Theme-specific adjustments happen at the surface layer (e.g. `--bp-surface-background-color-primary-rest`) which derives from intent tokens but applies lightness/chroma scaling per theme.

## Surface tokens

Surface tokens control the structural and spatial properties shared across components: borders, border-radius, shadows, spacing, and background colors. They are defined in `tokens/base/surface.tokens.json` with dark-mode overrides in `tokens/themes/dark/surface.tokens.json`.

Key surface tokens used throughout components:

| Token                                                   | Value                              | Purpose                                                                                                   |
| ------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `--bp-surface-spacing`                                  | `4px`                              | Base spacing unit. Components multiply this (e.g. `calc(var(--bp-surface-spacing) * 2)` for 8px padding). |
| `--bp-surface-border-width`                             | `1px`                              | Consistent border width for all bordered elements.                                                        |
| `--bp-surface-border-radius`                            | `4px`                              | Shared corner radius.                                                                                     |
| `--bp-surface-border-color-default`                     | `intent.default.rest` at 12% alpha | Subtle border for default states.                                                                         |
| `--bp-surface-border-color-strong`                      | `intent.default.rest` at 25% alpha | More prominent border for outlined elements.                                                              |
| `--bp-surface-shadow-0` through `--bp-surface-shadow-4` | Multi-layer box shadows            | Five elevation levels, from flat (0) to maximum depth (4).                                                |

Surface tokens adapt automatically by theme. In light mode, borders derive from the default intent color with low opacity over a light background. In dark mode, the same tokens switch to white-based borders with inset highlights and deeper black shadows — without any component code changing.

### Surface background colors, layers, and layer overrides

Beyond structural properties, surface tokens provide a three-tier system for background color and compositing. Each tier builds on the one below it.

#### Background colors

`--bp-surface-background-color-{intent}-{state}`

These are fully resolved, ready-to-use background colors for each intent and interaction state. For the **default** intent, they are derived from intent colors with lightness/chroma scaling — `default-rest` compiles to white in light mode despite deriving from gray, because the token applies `lightnessScale: 1.909`:

| Token | Light mode | Dark mode |
| ----- | ---------- | --------- |
| `--bp-surface-background-color-default-rest` | `#ffffff` | Derived with `lightnessScale: 0.248` |
| `--bp-surface-background-color-default-hover` | `#f6f7f9` | Darker gray |
| `--bp-surface-background-color-default-active` | `#edeff2` | Darker gray |
| `--bp-surface-background-color-default-disabled` | `#ffffff` | Derived with `lightnessScale: 0.319` |

For **non-default** intents (primary, success, warning, danger), background colors pass through directly from the intent tokens with no derivation — the same blue works in both themes.

Dark mode overrides in `tokens/themes/dark/surface.tokens.json` only redefine the `default` background colors with different scaling factors. Non-default intents need no dark override.

#### Layer colors

`--bp-surface-layer-color-{intent}`

These are semi-transparent tints of each intent color, controlled by a shared opacity token:

| Token | Value |
| ----- | ----- |
| `--bp-surface-layer-opacity` | `0.05` (5%) |
| `--bp-surface-layer-color-default` | `intent.default.rest` at 5% alpha |
| `--bp-surface-layer-color-primary` | `intent.primary.rest` at 5% alpha |
| `--bp-surface-layer-color-success` | `intent.success.rest` at 5% alpha |
| `--bp-surface-layer-color-warning` | `intent.warning.rest` at 5% alpha |
| `--bp-surface-layer-color-danger` | `intent.danger.rest` at 5% alpha |

In browsers supporting relative color syntax, each layer-color reactively references the opacity token:

```css
--bp-surface-layer-color-primary: oklch(from var(--bp-intent-primary-rest) l c h / var(--bp-surface-layer-opacity));
```

`--bp-surface-layer-opacity` acts as a shared control knob — changing it from `0.05` to `0.1` makes every layer-color denser at once.

#### Stackable layers

`--bp-surface-layer-{intent}`

These wrap each layer-color in `linear-gradient()` so they can be composited as background images:

```css
--bp-surface-layer-primary: linear-gradient(#2d72d20d 0 0);
```

This exists because CSS `background-color` only accepts one value, but `background-image` supports stacking multiple layers. The `linear-gradient(color 0 0)` trick creates a solid-color gradient that can be layered on top of a background:

```scss
// Stack a primary tint on top of the default surface
background-color: var(--bp-surface-background-color-default-rest);
background-image: var(--bp-surface-layer-primary);
```

The wrapping is triggered by the `com.blueprint.role: "stackable-layer"` annotation in the token JSON. The build system in `sd.config.ts` detects this role and applies the `linear-gradient()` wrapper during compilation.

## Example: Button component

The Button component (`src/components/button/`) demonstrates how surface and intent tokens work together. The key files are `_common.scss` (shared mixins) and `_button.scss` (component styles).

### Surface tokens in Button

Surface tokens control the button's dimensions and structural properties:

```scss
// Layout — spacing token used as a multiplier base
@include pt-button-height(calc(var(--bp-surface-spacing) * 7.5)); // 30px default height
padding: var(--bp-surface-spacing) calc(var(--bp-surface-spacing) * 2); // 4px 8px
border-radius: var(--bp-surface-border-radius); // 4px

// Box shadow — border-width token for inset border simulation
box-shadow:
    inset 0 0 0 var(--bp-surface-border-width) color-mix(in oklch, var(--bp-palette-black) 20%, transparent),
    0 1px 2px color-mix(in oklch, var(--bp-palette-black) 10%, transparent);
```

The large button variant simply scales the multiplier: `calc(var(--bp-surface-spacing) * 10)` for height and `calc(var(--bp-surface-spacing) * 4)` for horizontal padding.

### Intent tokens in Button

Intent tokens drive the button's color across every interaction state. For non-default intents (primary, success, warning, danger), a Sass map wires each intent to its tokens:

```scss
$button-intents: (
    "primary": (
        var(--bp-intent-primary-rest),
        // background
        var(--bp-intent-primary-hover),
        // background on hover
        var(--bp-intent-primary-active),
        // background on active
        var(--bp-intent-primary-foreground),
        // text color
    ), // success, warning, danger follow the same pattern
);
```

Disabled states reference `--bp-intent-default-disabled` at reduced opacity, and minimal/outlined variants use `--bp-surface-border-color-strong` for their borders.
