# Design decisions

## 2026-10-07: Functional neutral color palette

**Status:** Light palette implemented. Dark Button steps 3–5 are also emitted; the remaining dark mapping below is
recorded for later work.

Introduce a usage-based color palette before renaming semantic tokens or migrating components. Start with the gray family
that will support the neutral intent, selecting values from current background, border, and foreground usage rather than
trying to fit every existing gray swatch into the new scale.

### Naming and scope

- Use `color.grey.1` through `color.grey.13`, emitted as `--bp-color-grey-1` through `--bp-color-grey-13`.
- Numbers identify functional roles, not increasing or decreasing lightness. Do not use a `100–1000` ramp.
- Keep the existing `palette.*` namespace and its values unchanged. The new `color.*` namespace avoids collisions with the
  existing numbered palettes.
- Add the palette without changing existing component styles. Semantic aliases, token renaming, complete dark palettes, and
  component migrations are separate work.
- Store evaluated literal colors, not references to legacy tokens or runtime expressions. Preserve alpha and computed
  precision rather than reducing derived colors to rounded hex values. The formulas below document provenance only.
- Use the same role numbering across all families: solid rest/hover/active at 9–11, foregrounds at 12–13. The explicit
  solid-active step extends the Radix-style 12-step structure; it is not a foreground color repurposed as an active fill.

### Neutral mapping

Names such as `gray1` below refer to the existing Blueprint palette. Percentages in this table indicate alpha, not a color
flattened onto an assumed background.

| Step | Role                                | Light                                  | Dark                                  |
| ---- | ----------------------------------- | -------------------------------------- | ------------------------------------- |
| 1    | Application background              | `light-gray5`                          | `dark-gray1`                          |
| 2    | Subtle background / neutral Callout | `gray3` at 15% alpha                   | `gray3` at 20% alpha                  |
| 3    | Component background: rest          | Default Button light rest expression   | Default Button dark rest expression   |
| 4    | Component background: hover         | Default Button light hover expression  | Default Button dark hover expression  |
| 5    | Component background: active        | Default Button light active expression | Default Button dark active expression |
| 6    | Subtle border                       | `gray1` at 12% alpha                   | White at 20% alpha                    |
| 7    | Border                              | `gray1` at 25% alpha                   | White at 30% alpha                    |
| 8    | Strong opaque control border        | `gray2`                                | `gray3`                               |
| 9    | Solid background: rest              | `gray1`                                | `gray1`                               |
| 10   | Solid background: hover             | `dark-gray5`                           | `dark-gray5`                          |
| 11   | Solid background: active            | `dark-gray4`                           | Not yet mapped                        |
| 12   | Muted foreground                    | `gray1`                                | `gray4`                               |
| 13   | Foreground                          | `dark-gray1`                           | `light-gray5`                         |

The values come from existing styles; assigning them to these numbered steps is the decision recorded here:

- **1, 12, 13:** Application backgrounds and text colors in
  [`common/_color-aliases.scss`](packages/core/src/common/_color-aliases.scss#L18-L46).
- **2:** Neutral Callout background definitions in
  [`components/callout/_callout.scss`](packages/core/src/components/callout/_callout.scss#L18-L19).
- **3–5:** Default Button backgrounds in
  [`components/button/_common.scss`](packages/core/src/components/button/_common.scss#L288-L314) and its
  [dark-theme mixins](packages/core/src/components/button/_common.scss#L437-L462).
- **6–7:** Existing `surface.border-color.default` and `surface.border-color.strong` tokens in the
  [base definitions](packages/core/src/design-tokens/tokens/base/surface.tokens.json#L3-L18) and
  [dark overrides](packages/core/src/design-tokens/tokens/themes/dark/surface.tokens.json#L3-L18).
- **8:** Checkbox/radio border definitions in
  [`components/forms/_controls.scss`](packages/core/src/components/forms/_controls.scss#L25-L27).
- **9–11:** Default Tag solid backgrounds in
  [`components/tag/_common.scss`](packages/core/src/components/tag/_common.scss#L105-L140).

### Exact default Button backgrounds

Steps 3–5 must represent the current default Button backgrounds, not its retained, unused Sass defaults. These expressions
were checked against the unchanged compiled stylesheet in Chrome for rest, hover, and pointer-down states in both themes.

Light:

```css
--bp-color-grey-3: color-mix(in srgb, var(--bp-palette-gray-1) 5%, var(--bp-palette-white));
--bp-color-grey-4: color-mix(in srgb, var(--bp-palette-dark-gray-5) 9%, var(--bp-palette-white));
--bp-color-grey-5: color-mix(in srgb, var(--bp-palette-dark-gray-4) 16%, var(--bp-palette-white));
```

Dark:

```css
--bp-color-grey-3: color-mix(in srgb, var(--bp-palette-gray-1) 40%, var(--bp-palette-black));
--bp-color-grey-4: color-mix(in srgb, var(--bp-palette-dark-gray-5) 42%, var(--bp-palette-black));
--bp-color-grey-5: color-mix(in srgb, var(--bp-palette-dark-gray-4) 30%, var(--bp-palette-black));
```

Blueprint's black is `#111418`, not `#000000`. The light expressions are evaluated into absolute `color(srgb …)` literals.
These snapshots do not respond to legacy palette or intent overrides. A future component migration must consider that
current Button expressions reference runtime intent tokens rather than these fixed values.

### Compatibility limits

- This is a set of shared building blocks, not proof that every component can adopt the same recipe without visual changes.
  Steps 3–5 prioritize the default Button; Minimal Tag, CardList, Slider, and Table-header backgrounds differ.
- Step 2 preserves the neutral Callout's translucent background. It is not a replacement for opaque secondary or elevated
  surfaces such as white or `dark-gray2`. Steps 6–7 also retain transparency; their visible colors depend on the surface
  underneath. They do not represent the Button's complete inset border-shadow formula.
- Steps 12–13 follow common Sass text aliases. Current Button and generated typography colors differ: the dark Button uses
  white, and the generated dark muted token remains `gray1`, unlike the Sass alias `gray4`. Do not silently migrate these
  consumers to the new foreground steps.
- The scale does not allocate a separate disabled-state step. Preserve disabled and forced-colors behavior during later
  component migrations.
- Do not retain a gray solely because it exists in the old palette. The usage audit found no current component consumer for
  `light-gray2`; its retained Button default is explicitly unused. `light-gray1` was found as a translucent Skeleton source,
  and `gray5` as a disabled Slider color. Those specialized roles do not require placing them in the normal-state scale.

## 2026-10-07: Chromatic scales and literal values

**Status:** Light palettes implemented alongside the unchanged legacy palette.

Add blue, green, orange, red, vermilion, rose, violet, indigo, cerulean, turquoise, forest, lime, gold, and sepia. Together
with grey, this provides 15 families of 13 functional steps (195 numbered tokens). Each chromatic scale uses its own hue throughout,
including its near-white application background; a green background must not alias neutral grey.

### Shared placement

The following recipes describe how the stored literals were obtained. `hue1`, `hue2`, and `hue3` refer to the corresponding
legacy family. Alpha is retained, not flattened onto white. Repeated values are intentional.

| Steps | Role                        | Source recipe                           |
| ----- | --------------------------- | --------------------------------------- |
| 1     | Application background      | 2% hue3 + 98% white, mixed in OKLCH     |
| 2     | Subtle background           | hue3 at 10% alpha                       |
| 3–5   | Component rest/hover/active | hue3 at 10% / 20% / 30% alpha           |
| 6     | Subtle border               | hue2 at 20% alpha                       |
| 7–8   | Border / hover border       | hue2 at 60% alpha                       |
| 9–11  | Solid rest/hover/active     | hue3 / hue2 / hue1, except orange below |
| 12–13 | Muted / stronger foreground | hue2 / hue1                             |

Core intent placements follow existing Callout, minimal Tag, and outlined Button treatments. Application tints and
extended-family placements are inferred additions, not verified component recipes or contrast guarantees. Functional
numbers do not imply a monotonic ramp or universal interchangeability across components.

Solid active values match the primary, success, and danger Buttons' direct `intent.*.active` values. For extended
families, using hue1 as the active step is an inferred continuation of the hue3/hue2 rest/hover pattern.

### Warning Button exception

Use exact legacy orange5 for solid warning rest and the standalone warning Button's modern hover/active colors. Do not
substitute the Toast action buttons' orange4/orange3 hover/active values:

- `color.orange.9`: `#fbb360`, exactly the legacy orange5 value and warning Button fallback rest color.
- `color.orange.10`: `oklch(0.748641 0.125922 66.762)`, evaluated from 77% modern Button rest + 23% orange2 in OKLCH.
- `color.orange.11`: `oklch(0.614901 0.111016 64.9146)`, browser-verified active color from 46% modern Button rest +
  54% orange1 in OKLCH.
- The Button foreground remains Blueprint black, not orange12 or orange13.

Sources: [warning rest definition](packages/core/src/components/button/_common.scss#L71-L82) and
[intent Button states](packages/core/src/components/button/_button.scss#L198-L224).

The modern Button rest color is evaluated from orange3 with relative OKLCH offsets `L + 0.177`, `C − 0.01`, `H + 6.26`.
It rounds to orange5 but is not numerically identical to it. Orange9 deliberately uses exact orange5; orange10/11 snapshot
the existing modern mixes, not mixes recalculated from the new orange9 literal. Those snapshots do not respond to runtime
overrides or reproduce every older-browser fallback. Existing component styles and their fallbacks remain untouched;
removing the warning-only rest variable is deferred to a later component migration.

### Reference and migration aids

- [Legacy palette mapping](packages/core/src/design-tokens/PALETTE_MAPPING.md) lists every previous swatch, distinguishing
  exact matches from rounded-only previews and missing values. Transparency participates in the comparison.
- Storybook's **Design Tokens / Functional Colors** page selects the light or dark literals using the existing theme
  selector, keeping sparse dark steps aligned with their numbered columns.

### Partial dark Button palette

`tokens/themes/dark/palette.dark.tokens.json` adds 15 literal Button background snapshots: default grey3–5 and
primary blue9–11, success green9–11, warning orange9–11, and danger red9–11. Each triplet is rest, hover, active.
The intent values match the light palette; the default Button has separate dark values. Orange9 retains exact legacy
orange5, with the same rounding caveat as the light anchor.

No other dark steps or families are mapped yet. Storybook displays only these dark tokens, not light fallbacks.
The generated dark CSS overrides these 15 background properties and four contrast foregrounds; unmapped properties still
inherit their base values.
This is not a complete dark palette, and no component consumers are migrated.

### Solid contrast foregrounds

Blue, green, orange, and red each have a `color.<family>.contrast` token alongside their numbered steps, in both palettes.
Blue, green, and red reference `{color.white}`; orange references `{color.black}`. These shared tokens match legacy
white (`#ffffff`) and Blueprint black (`#111418`) in both themes. They preserve the existing solid
Button foregrounds. Storybook previews them as text on steps 9–11. Neutral Button text remains separate because its
backgrounds use grey3–5 rather than solid grey9–11.

## 2026-10-07: Semantic text color aliases

Use `text.color.<intent>.default` and `text.color.<intent>.muted`, emitted as
`--bp-text-color-<intent>-default` and `--bp-text-color-<intent>-muted`. The intent-to-family mappings are
neutral → grey, primary → blue, success → green, warning → orange, and danger → red.

Default text references step 13; muted text references step 12. Step 11 remains solid active, preserving the
13-step palette. Explicit `default` and `muted` children avoid a token also needing to be a group; no `$root` or
generator change is needed.

These aliases do not replace the existing `intent.*.foreground` tokens or migrate component styles. Dark text
primitives are not mapped yet, so these aliases currently inherit light values in dark mode.

## 2026-10-07: Semantic intent background, border, and solid aliases

Add the same ten roles to neutral, primary, success, warning, and danger, using the text aliases' intent-to-family
mapping:

- `intent.<intent>.background.subtle/rest/hover/active` → steps 2/3/4/5.
- `intent.<intent>.border.subtle/rest/hover` → steps 6/7/8.
- `intent.<intent>.solid.rest/hover/active` → steps 9/10/11.

Keep the existing flat `intent.default` and chromatic rest/hover/active/disabled/foreground tokens unchanged. This
addition does not migrate components or introduce solid foreground tokens.

Re-declare aliases for the mapped dark primitives in the dark scope: neutral background rest/hover/active and the
four chromatic intents' solid rest/hover/active. An alias inherited from `:root` otherwise retains its root-resolved
value when a primitive is overridden on a nested dark container. Remaining dark roles still inherit light values;
this is not a complete dark semantic palette.

## 2026-10-07: Button semantic recipes

`pt-button-variant($intent: null, $variant: solid)` selects enabled-state colors for solid, minimal, and outlined
Buttons, including variants applied through ButtonGroup. Absent intent resolves to neutral.

- Solid neutral uses `intent.neutral.background.rest/hover/active` and `text.color.neutral.default`.
- Solid chromatic intents use `intent.<intent>.solid.rest/hover/active` and the new `solid.foreground` alias to the
  family's contrast primitive.
- Minimal and outlined use transparent rest backgrounds, `background.hover/active`, and `text.color.<intent>.default`.
- Outlined borders use `border.rest` at rest and `border.hover` at hover/active.

Disabled states retain the legacy recipes because disabled semantic roles have not been defined. This includes
the existing native-disabled warning hover/active behavior, which differs from class-disabled warning Buttons.
Shared legacy mixins remain available to HTMLSelect, file-input, and slider without migrating those components.

Dark primitives required by these recipes were captured from the pre-migration rendered Buttons: chromatic
background hover/active (4/5), outlined border rest/hover (7/8), and default text (13). Neutral backgrounds keep the
already-approved steps 3–5. Dark aliases are declared in the dark scope, including text and solid foreground aliases.
Muted text and other unused dark roles remain unmapped; the broader dark palette is still incomplete.

Using the shared roles intentionally makes neutral minimal/outlined hover/active fills match neutral solid Buttons,
and gives minimal/outlined a single default text color across enabled states. Warning solid rest now uses the
approved exact orange9 literal, rather than the older relative-color expression that only rounds to that color.
Captured source values and migration checks are in `/private/tmp/blueprint-button-recipes.aoaVA5/`.
