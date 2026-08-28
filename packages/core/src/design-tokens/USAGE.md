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

| Token                                            | Light mode | Dark mode                            |
| ------------------------------------------------ | ---------- | ------------------------------------ |
| `--bp-surface-background-color-default-rest`     | `#ffffff`  | Derived with `lightnessScale: 0.248` |
| `--bp-surface-background-color-default-hover`    | `#f6f7f9`  | Darker gray                          |
| `--bp-surface-background-color-default-active`   | `#edeff2`  | Darker gray                          |
| `--bp-surface-background-color-default-disabled` | `#ffffff`  | Derived with `lightnessScale: 0.319` |

For **non-default** intents (primary, success, warning, danger), background colors pass through directly from the intent tokens with no derivation — the same blue works in both themes.

Dark mode overrides in `tokens/themes/dark/surface.tokens.json` only redefine the `default` background colors with different scaling factors. Non-default intents need no dark override.

#### Layer colors

`--bp-surface-layer-color-{intent}`

These are semi-transparent tints of each intent color, controlled by a shared opacity token:

| Token                              | Value                             |
| ---------------------------------- | --------------------------------- |
| `--bp-surface-layer-opacity`       | `0.05` (5%)                       |
| `--bp-surface-layer-color-default` | `intent.default.rest` at 5% alpha |
| `--bp-surface-layer-color-primary` | `intent.primary.rest` at 5% alpha |
| `--bp-surface-layer-color-success` | `intent.success.rest` at 5% alpha |
| `--bp-surface-layer-color-warning` | `intent.warning.rest` at 5% alpha |
| `--bp-surface-layer-color-danger`  | `intent.danger.rest` at 5% alpha  |

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

> [!NOTE]
> The Button component in dark mode currently derives the `active` and `hover` states for minimal and outline buttons from the `rest` token. This is expected to be updated with an updated palette.

### Button recipe tokens

Public Button tokens define the default-size component recipe. Their default values alias the shared surface and
typography roles where those roles match, while allowing a component theme to change Button decisions independently:

```scss
box-sizing: border-box;
min-block-size: var(--bp-button-min-block-size);
padding-block: var(--bp-button-padding-block);
padding-inline: var(--bp-button-padding-inline);
border-radius: var(--bp-button-border-radius);
font-family: var(--bp-button-font-family);
font-size: var(--bp-button-font-size);
font-weight: var(--bp-button-font-weight);
line-height: var(--bp-button-line-height);
box-shadow: var(--bp-button-shadow-rest);
```

`min-block-size` is a floor rather than a fixed height, so padding, borders, and line height can define the normal size
without clipping larger content. Solid and outlined variants have separate border-width tokens. Small and large Button
geometry remains spacing-based until size-specific recipe tokens are introduced.

Dimension tokens retain their authored units. A theme may use values such as `0.875rem`; Blueprint emits and consumes
that value without converting it to pixels. As with ordinary CSS, `rem` resolves against the current document's root font
size.

### Intent tokens in Button

Button component tokens are the CSS consumption points for every interaction state. Their defaults alias the global
intent roles, so a semantic intent override still propagates while a component theme can override Button alone:

```scss
$button-intent-states: (
    "primary": (
        var(--bp-button-background-intent-primary-rest),
        // background
        var(--bp-button-background-intent-primary-hover),
        // background on hover
        var(--bp-button-background-intent-primary-active),
        // background on active
        var(--bp-button-background-intent-primary-disabled),
        // disabled background
        var(--bp-button-foreground-intent-primary-rest),
        // text color
        var(--bp-button-foreground-intent-primary-disabled),
        // disabled text color
    ), // success, warning, danger follow the same pattern
);
```

Minimal variants consume their own `--bp-button-foreground-minimal-intent-*` state tokens. Intent outlined borders derive
from those foreground values; the non-intent outlined border defaults to the shared surface border color.
