# Blueprint Design Tokens

The color system that lets Blueprint components look cohesive and be re-themed: raw colors are organized into scales, and components consume semantic roles instead of colors.

**Goal: a predictable design system.** The same step, role name and rule mean the same thing in every hue, theme and component. Visual stability is a tiebreaker, not the goal; a hack that keeps a value but breaks a rule is a debt (see Hacks to revisit). Sections marked **Best bet (unreviewed)** were settled in one pass on 2026-10-08 toward this goal and need review.

## Language

### Color scales

**Scale**:
An ordered set of colors for one hue (e.g. blue, gray) where each step is a distinct color with a fixed meaning.
_Avoid_: Palette, ramp, shades

**Step**:
A numbered position on a scale that denotes a usage slot (e.g. "subtle border", "solid hover"); no two steps on a scale hold the same value, except the duplicates documented as H1 (blue, green and red), gray 9 = 12 (gray1) in light and orange 9 = 12 (orange5) in dark.
_Avoid_: Shade, level, tone

**Solid steps**:
Steps 9, 10 and 11 of a scale: the filled rest, hover and active colors of a solid control (e.g. orange 9 is the filled warning Button).
_Avoid_: Brand color, base color

**Solid text color**:
The color each scale defines for text and icons placed on its solid steps (white for most scales, `#111418` for light-solid scales such as orange); it must meet WCAG 2.2 AA against all three solid steps. Its role is `text-color-{intent}-solid`, mirroring `background-color-{intent}-solid-*`. Best bet (unreviewed): renamed from "Contrast color", which did not read as a text color.
_Avoid_: Contrast color, foreground, on-color, inverse

**Alpha scale**:
A scale whose steps are translucent, so they read correctly over any surface (e.g. gray-alpha, black-alpha, white-alpha, blue-alpha).
_Avoid_: Transparent palette, rgba colors

**Track**:
The unfilled rail a progress indicator moves along (ProgressBar, Spinner, Slider); its background is the Sunken layer. The filled part drawn on it is the **Head**.
_Avoid_: Rail, groove (for the role); indicator, range (for the Head)

**Indicator color**:
A named per-scale value, like the Solid text color, for marks drawn on a surface such as a progress Head; it defaults to step 9 but can point elsewhere when step 9 is a light solid (orange, gray). Best bet (unreviewed): keep "Indicator"; see "Indicator and track naming".
_Avoid_: Solid (for marks), head color

**Legacy palette**:
The BP6 five-step hue colors (`$blue3`, `$gray1`, `$pt-divider-black`, …) that components referenced directly before scales existed.
_Avoid_: Palette (unqualified)

### Semantics

**Role**:
A named use of color that components consume (e.g. `primary.solid.rest`, `surface.app`); each color role points at exactly one step of one scale. Components consume roles only, never scale steps.
_Avoid_: Semantic color, alias, functional color, intent scale, accent

**Emphasis**:
How strongly a role carries its Intent: `subtle` (tinted, low contrast), the plain role (default emphasis), or `solid` (filled, uses the solid steps).
_Avoid_: Variant, weight, prominence

**Border strength**:
How visible a border is: `subtle`, `default` or `strong`, matching scale steps 6, 7 and 8 for every Intent including Neutral. Here `default` means the middle strength, never "no Intent" (that is Neutral).
_Avoid_: Base, normal, rest (for the middle strength)

**Variant**:
A component's visual treatment, composed from roles; it is orthogonal to Intent, so every Intent × Variant pair is valid. Each component has its own default Variant, and a Variant can exist in styles before it is exposed as a prop. A token-level Emphasis is not a Variant.
_Avoid_: Emphasis, style, appearance

**Soft**:
The Variant with a subtle, tinted background and Intent-colored text, and no border. The same subtle background is shared by every component that uses it. Not called "minimal" because the public `minimal` prop means Soft on Tag but Transparent on Button and Callout.
_Avoid_: Surface, light, neutral light, minimal

**Transparent**:
The Variant with no background and Intent-colored text, and no border; when interactive, it shows the Soft background on hover and active. Button and Callout `minimal` resolve to it.
_Avoid_: Minimal, ghost, subtle

### Layers

Names pending team review.

**Sunken**:
The layer below Base: a recessed background that tints the surface in the light theme and is darker than Base in the dark theme, such as a progress Track.
_Avoid_: Well, inset, groove, track (for the layer)

**Base**:
The lowest layer: the page background everything else sits on.
_Avoid_: App, body, background, surface

**Content**:
The layer of containers that sit on Base, such as Card and Navbar; its background differs from Base in the dark theme.
_Avoid_: Raised, panel, card

**Overlay**:
The layer of UI that floats above Content, such as Popover, Dialog and Toast. It is not the dimming backdrop behind a Dialog.
_Avoid_: Popover, modal, backdrop

**Backdrop**:
The dimming layer behind a Dialog or Drawer (`background-color-backdrop`, black 70% in both themes).
_Avoid_: Overlay (for the dimming layer), scrim

**Inverse**:
A surface that takes the opposite theme's lightness, with its own text color: Tooltip (`background-color-inverse` dark-gray5 / light-gray3, `text-color-inverse` light-gray5 / dark-gray5).
_Avoid_: Dark surface, contrast surface

### Intent × Variant matrix

Any Intent (neutral, primary, success, warning, danger) combines with any Variant:

| Variant     | Background                      | Text              |
| ----------- | ------------------------------- | ----------------- |
| solid       | the Intent's solid steps        | text on solid     |
| soft        | the Intent's subtle background  | the Intent's text |
| outlined    | none, with an Intent border     | the Intent's text |
| transparent | none (Soft on hover and active) | the Intent's text |

Default Variant per component: a Button is solid when it has an Intent and soft (with its own border) when it has none; a Tag is solid; a Callout is soft.

**Neutral**:
The intent-less role family used when a component has no Intent; maps to the gray scale.
_Avoid_: Default, none

**Seed color**:
A single color a consumer supplies, from which a full scale is generated for them.
_Avoid_: Base color, brand color

## Reference: interactive tints in Blueprint today

How components outside the experiment tint their backgrounds today, and which Variant they correspond to. HTMLTable, Breadcrumbs and DateRangePicker are **exceptions**: they adopt the shared roles when migrated rather than shaping them.

| Component                      | Today (light · dark)                 | Corresponds to                   |
| ------------------------------ | ------------------------------------ | -------------------------------- |
| DatePicker day hover           | gray3 15% · 15%                      | Transparent, Neutral             |
| Tree node                      | hover gray3 15%, active 30%          | Transparent, Neutral             |
| Menu item with Intent          | hover 10%, active 20% · 20%, 30%     | Transparent, Intent              |
| HTMLTable interactive row      | hover gray3 30%, active gray1 30%    | Transparent, Neutral (exception) |
| Breadcrumbs hover              | gray3 30%                            | Transparent, Neutral (exception) |
| DateRangePicker selected range | rest blue3 10%, hover 20% · 20%, 40% | Soft, Primary (exception)        |
| Toast button                   | Button's hover color                 | follows Button                   |

## Decision: hover and active of Transparent items

**Chosen: Option C** (see ADR 0002). The other options are kept for reference. Transparent items are Button `minimal`/`outlined`, ButtonGroup, HTMLSelect `minimal`, Menu item, Tree, DatePicker day, HTMLTable row and Breadcrumbs. Values are primary, light theme; ΔE is OKLab ×100 against today's Button `minimal` (15% / 30%, dark 20% / 30%).

**Option A — borrow Soft, one state earlier:** hover = `soft-rest`, active = `soft-hover`.

- Pro: Menu, Tree and DatePicker unchanged; a hovered ghost looks like a resting Soft Tag.
- Con: Button `minimal` light active 30% → 20% (ΔE ≈ 4.7, clearly visible); hover 15% → 10% (ΔE ≈ 2.3).

**Option C (chosen) — borrow Soft, hover early, active matched:** hover = `soft-rest`, active = `soft-active`.

- Pro: Button `minimal` within ΔE 2.3; pressing a ghost looks like pressing a Soft Tag.
- Con: Menu item active changes when migrated (ΔE ≈ 4.7).

**Option D(ii) — dedicated state roles, one color per state:** `background-color-{intent}-hover` / `-active`, shared by every Transparent item, set to Button `minimal`'s current values.

```scss
@mixin bp-transparent($intent) {
    background-color: transparent;
    color: var(--bp-text-color-#{$intent}-rest);
    &:hover {
        background-color: var(--bp-background-color-#{$intent}-hover);
    }
    &:active,
    &.#{$ns}-active {
        background-color: var(--bp-background-color-#{$intent}-active);
        color: var(--bp-text-color-#{$intent}-active);
    }
}
```

- Pro: Button unchanged; one shared treatment for all Transparent items; each state is one designed color, directly contrast-checkable; solid steps 9/10/11 keep their meaning.
- Con: two extra roles per Intent (`-hover`, `-active`, i.e. 10 roles) and two extra alpha steps per hue, because 15% and 30% are not on the Soft scale; Menu, Tree and DatePicker hover change when migrated (10% → 15%); a hovered ghost no longer equals a resting Soft Tag.

**Option D(i) — base color plus at most one overlay:** every Variant keeps its base `background-color` and states add one `linear-gradient` overlay; never more than one layer.

```scss
@mixin bp-state-overlay($hover, $active) {
    &:hover {
        background-image: linear-gradient(var(#{$hover}), var(#{$hover}));
    }
    &:active,
    &.#{$ns}-active {
        background-image: linear-gradient(var(#{$active}), var(#{$active}));
    }
}

.#{$ns}-button.#{$ns}-intent-primary {
    // solid: blue3 + black 18% / 33%
    background-color: var(--bp-background-color-primary-solid-rest);
    @include bp-state-overlay(--bp-overlay-color-hover, --bp-overlay-color-active);
}
.#{$ns}-button.#{$ns}-minimal.#{$ns}-intent-primary {
    // transparent: overlay is the only color
    background-color: transparent;
    @include bp-state-overlay(--bp-overlay-color-primary-hover, --bp-overlay-color-primary-active);
}
```

- Pro: one hover/active mechanism for every Variant; solid hover/active reproduce today within ΔE ≤ 1.0 (primary, light only); matches #8236's single-layer hover.
- Con: solid steps 10/11 go unused, conflicting with reserving 9/10/11 for solid states; one tinted overlay cannot give both Tag hover (20%) and Button `minimal` hover (15%); visible color depends on what is underneath; overrides consumers' `background` shorthands; background images are dropped in forced-colors mode.

## Decision: focus ring and input borders

- **Focus color**: a named per-scale `focus` value (like Solid text color and Indicator), kept separate from the border steps so an Intent input's focus differs from its rest border. One focus color per Intent, used by the global `:focus` outline and the input ring alike. Neutral focuses with the Primary (accent) focus color, so retargeting Primary retargets Neutral too (H5 resolved). Only the input rings, Tag and Card selected use the focus roles so far; the global `:focus` outline does not (Known issues #32).
- Values: blue2 @ 75% light / blue5 @ 75% dark for Primary and Neutral; Success, Warning and Danger keep today's input focus (their mid tone @ 75%).
- Visual change: only a Primary InputGroup's focus, blue3 @ 75% → blue2 @ 75% (ΔE 5.4, contrast 3.07 → 3.77:1).
- **Focus ring width** stays split, as Blueprint has always done: 2px for Neutral inputs, 3px for Intent inputs (outer ring `$pt-spacing * 0.5`). Kept as a Sass value in the input mixin, not a role.
- **Every Intent, Neutral included, goes through one input mixin**: rest border `{intent}.border.strong`, with each Intent's step 8 set to its opaque mid tone (blue3, green3, orange3, red3) so Intent inputs do not change.
- **Exception to distinct steps**: for blue, green and red, step 8 and step 9 both hold the mid tone (e.g. blue 8 = blue 9 = blue3). Orange avoids it because its step 9 is the light fill (orange5) and its step 8 is orange3; the orange Indicator color is therefore step 8, and every other Indicator is step 9.
- **Readonly input**: a ring in `border.subtle` and no inner shadow (see Known issues #17).
- **Button `outlined`**: Neutral uses `border.strong`, Intents use `border.default` (step 7 = today's text @ 60%), selected by a strength map in a `bp-outlined($intent)` mixin. Known inconsistency, kept to avoid a ΔE 15.4 change.

## Decision: text steps

- Step 12 = low-contrast text: Neutral muted (gray1 / gray4) and Intent text at rest (e.g. blue2 / blue5). Step 13 = high-contrast text: Neutral text (dark-gray1 / light-gray5) and Intent text while pressed (e.g. blue1 / blue6).
- Soft and Transparent elements use opaque step 12 at rest and step 13 when pressed (Tag `minimal`, Callout, Menu item, Button `minimal`). Opaque, not alpha, because all Blueprint text except disabled is opaque and opaque text is contrast-checkable on any surface.
- Callout text moves from step 13 to step 12 in the light theme (see Known issues #20).

## Shadows

**Best bet (unreviewed):**

- One outer ramp named by size: `2xs` (ring only: Card elevation 0), `xs` (Button: inset ring + drop), `sm`, `lg`, `xl`, `2xl` (Card elevation 1–4). Card maps `elevation-N` to a level in one table.
- State rule: a hovered or pressed element uses the next level up (resolves H8; not yet measured).
- Rings and `inset` live inside levels (H10 stays); each level has a light and a dark composite value, emitted per theme.
- Output: `sd.config.ts` already turns a shadow array into one `box-shadow` string (`dtcg/shadow/css`, layers joined with ", ") and emits dark values into `tokens-dark.css` under `[data-bp-color-scheme="dark"], .bp6-dark`. Named per-scale values (Solid text color, Indicator, Focus) are emitted as ordinary color tokens pointing at a step.

Earlier direction:

- Two ramps, named by size: an outer ramp `shadow-{xs, sm, lg, xl, 2xl}` and an inner ramp `inner-shadow-{xs, …}`. Card elevations map onto the outer ramp (`elevation-1` = `sm`, `elevation-2` = `lg`, 3 and 4 = `xl` / `2xl`); Button's drop uses the `xs` geometry at 10%.
- Rings live inside the ramp levels (as in Blueprint's legacy `$pt-elevation-shadow-N`), so there are no ring tokens; the Button uses one level (`xs`) holding its inset ring and drop; Card `elevation-N` maps to a level through a table in Card's SCSS; Card's dark inset highlights live inside the dark level values, so Card has no dark block.
- Composite values may differ per theme (the composite-value exception to ADR 0001).

Not settled:

- `inset` appears inside some tokens (Button's level, Card's dark levels), reversing the earlier idea that components add `inset` themselves (H10).
- Button hover/active needs a "same shape, stronger drop" level that the size ramp does not have (H8).
- Exact level list, black/white alpha steps for shadow colors, and how `sd.config.ts` emits shadow arrays.

## Known issues: backgrounds

Visual changes and open problems caused by the background roles. ΔE is OKLab ×100 (about 2 is the threshold of a noticeable difference); light theme over white unless stated.

| #   | Where                                            | Change                                                                                                                                                                                                  | ΔE                                                                | In the 9?                  | Cause                                                                                                                             |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Button `minimal` intent hover                    | 15% → 10% (dark unchanged)                                                                                                                                                                              | 2.3                                                               | yes                        | Transparent hover = `soft-rest`                                                                                                   |
| 2   | Button `minimal` intent active, dark             | 30% → 35% (light unchanged)                                                                                                                                                                             | 1.8                                                               | yes                        | Transparent active = `soft-active`                                                                                                |
| 3   | Button `minimal` warning tint                    | orange5 → orange3 base                                                                                                                                                                                  | 1.0 hover / 1.9 active                                            | yes                        | Warning Soft built from orange3 like every other component                                                                        |
| 4   | Button `minimal` neutral                         | dark-gray5 8% / 16% (dark gray1 24% / 49%) → soft rest / soft active (gray3 10% / 30% light, 20% / 35% dark; #18)                                                                                       | needs re-measuring: the earlier ≤ 1.3 was against gray3 15% / 35% | yes                        | One soft ladder (#18 supersedes ADR 0003)                                                                                         |
| 5   | Callout neutral, dark                            | gray3 20% → 20% (dark soft rest after #18)                                                                                                                                                              | 0                                                                 | yes                        | Resolved by #18                                                                                                                   |
| 6   | Menu item intent active                          | 20% → 30% (dark 30% → 35%)                                                                                                                                                                              | 4.7 (dark 1.8)                                                    | no                         | Transparent active = `soft-active`                                                                                                |
| 7   | Tree node active                                 | light gray3 30% → 30% (soft active after #18); dark not measured                                                                                                                                        | 0 light                                                           | no                         | Transparent active = `soft-active`                                                                                                |
| 8   | HTMLTable row hover                              | gray3 30% → 15%                                                                                                                                                                                         | 4.9                                                               | no                         | Exception adopting Transparent hover                                                                                              |
| 9   | HTMLTable row active                             | gray1 30% → gray3 35%                                                                                                                                                                                   | 4.1 vs gray3 30%; 35% not measured                                | no                         | Exception adopting Transparent active                                                                                             |
| 10  | Breadcrumbs hover                                | gray3 30% → 15%                                                                                                                                                                                         | 4.9                                                               | no                         | Exception adopting Transparent hover                                                                                              |
| 11  | DateRangePicker range hover, dark                | 40% → 30%                                                                                                                                                                                               | not measured                                                      | no                         | Exception adopting `soft-hover`                                                                                                   |
| 12  | Dark Card background                             | derived `oklch(... l * 0.54 ...)` = dark-gray2 → `--bp-background-color-content` (white / dark-gray2)                                                                                                   | 0                                                                 | yes                        | Resolved: Card uses the Content layer, no visual change                                                                           |
| 13  | Layer names                                      | Base / Content / Overlay pending team review                                                                                                                                                            | —                                                                 | —                          | Naming                                                                                                                            |
| 14  | Input ring, dark (exception)                     | white 20% → 30%                                                                                                                                                                                         | 8.3 (over dark-gray1)                                             | yes                        | Input ring and Button `outlined` share the strong border; keeps `outlined` unchanged and raises dark input contrast 1.82 → 2.60:1 |
| 15  | Input boundary contrast                          | pre-existing: ring 1.54:1 light, 1.82:1 dark (2.19:1 at 25%), below WCAG 2.2 1.4.11's 3:1; ~black 45% / white 40% needed                                                                                | —                                                                 | yes                        | Not fixed in the experiment; the contrast test reports it as a known failure; fix is a follow-up with design review               |
| 16  | Button `outlined` border, light                  | gray1 25% → black 20%                                                                                                                                                                                   | 3.0                                                               | yes                        | Shared strong border; matches the pre-#7727 value (dark-gray1 20%)                                                                |
| 17  | Readonly input ring                              | light gray1 12% → `border.subtle` black 10%; dark black 40% (effectively invisible, 1.04:1) → white 10% (a visible faint edge)                                                                          | 1.6 / 11.0                                                        | yes                        | Readonly gets a real, visible boundary in both themes; the missing inner shadow still distinguishes it from editable              |
| 18  | Neutral soft backgrounds                         | gray3 15/30/35% → 10/20/30% light, 15/30/35% → 20/30/35% dark (supersedes ADR 0003)                                                                                                                     | light 1.6 / 3.4 / 1.5, dark 2.4 / 0 / 0                           | yes (Tag, Callout, Button) | One soft ladder for every Intent; default Button on steps 3/4/5 within ΔE 1.3                                                     |
| 19  | Default Button, dark: hover and active direction | hover `#252a31` → soft hover, active `#1d2126` → soft active: they now get lighter instead of darker (rest unchanged, ΔE 0.9)                                                                           | hover 10.4, active 16.4                                           | yes                        | One soft rule for every Intent and theme with no dark block (dark hover is lighter). Needs design review                          |
| 20  | Callout Intent text, light                       | step 13 → step 12 (blue1 → blue2, green1 → green2, orange1 → orange2, red1 → red2); dark unchanged                                                                                                      | 6.4–7.4 (lighter)                                                 | yes                        | Callout is a Soft element; contrast on its background stays ≥ 5.26:1 (AA)                                                         |
| 21  | Warning Tag solid hover / active                 | `#e19e61` → `#e29d4e`, `#c9750b` → `#b27634`                                                                                                                                                            | 1.8 / 4.3                                                         | yes                        | Tag shares the warning Button's solid steps 10 / 11                                                                               |
| 22  | CompoundTag left half                            | hand-made darker offsets → one state ahead of the right half: rest → step 10, hover → step 11, active → step 11 (the split disappears while pressed)                                                    | rest ≤ 2.3, hover ≤ 2.8, active 3.1–8.7                           | yes                        | No solid step darker than 11; interactive CompoundTags only                                                                       |
| 23  | Card selected ring and halo                      | ring blue4 / blue5 → `focus-color-primary` (blue2 @ 75% / blue5 @ 75%); 3px halo blue4 @ 20% / blue5 @ 40% → `background-color-primary-soft-hover` (blue3 20% / 30%)                                    | ring 6.7 / 11.7, halo 1.8 / 13.1                                  | yes                        | One attention color per Intent: selected reuses focus; fallback is a per-scale `selected` value if the dark change is too large   |
| 24  | Warning Button faded icon                        | `button/_button.scss:194` / `:244` require `.bp6-icon` on the Button root and a direct `svg` child; Button never adds that class, so the 70% fade likely never applies (not yet confirmed in a browser) | 0 if dead                                                         | no                         | Not migrated; warning icons inherit the text color like other Intents                                                             |

| 25 | Button text, dark (best bet B3) | Neutral text white → step 13 (light-gray5); Intent `minimal`/`outlined` rest `color-mix(intent 51–54%, white)` → step 12 (hue 5); pressed `color-mix(intent active, white)` → step 13 (hue 6, lighter); dark Intent `outlined` border follows (step 12 @ 60%, not measured); light theme unchanged | 2.4; rest 2.6–5.7; pressed 11.0–14.8 (approximate: today's values recomputed from the mixes) | yes | One text rule for every Variant and theme (12 rest, 13 pressed) |
| 26 | Warning Tag solid text | `oklch(from #111418 l + 0.05)` → Solid text color `#111418` (darker) | 5.0 | yes | Tag and Button share the orange Solid text color |
| 27 | Input inner shadow (implementation) | one geometry for both themes: light rest black 30% → 20% (strong border role); dark bottom highlight `inset 0 -1px 1px` white 30% → top `inset 0 1px 1px` white 30%, now also on focus | not measured | yes | No dark block allowed; alternative is dropping the inner shadow in both themes (design call) |
| 28 | Intent input ring and focus, dark (implementation) | ring hue 4 (blue4, green4, orange4, red4) → mid tone (step 8, same as light); focus hue 4 @ 75% → the focus roles (blue5 @ 75% for Primary, mid tone @ 75% otherwise) | not measured | yes | Intent strong border and focus are one value per scale and theme |
| 29 | Button mixins outside the nine (implementation) | HTMLSelect and FileInput include the Button mixins, so they get the soft background, the `xs` shadow and role text; the `pt-dark-button*` and `pt-dark-input*` mixins are now empty (roles switch per theme; re-emitting light rules in a dark block broke minimal HTMLSelect in dark). Slider handle: opaque Content base with the soft role layered on top (`background-image`), because the translucent soft background let the track show through; its dark block is still legacy. time-picker, file-input and tag-input get the role-based input styles | not measured | no | Shared mixins; check those components before shipping |
| 30 | CompoundTag `minimal` left half (implementation) | one soft step ahead of the right half: light 20/30/40% → 20/30/30%, dark 40/50/55% → 30/35/35% (lighter; split disappears when pressed) | not measured | yes | Mirrors #22 with soft steps |
| 31 | Icons on solid Intent Tags (implementation) | default foreground → each Intent's Solid text color (warning icon → `#111418`) | not measured | yes | Icons follow text |
| 32 | ~~Global `:focus` outline~~ resolved in wave 2 (see #39) | still `$pt-focus-indicator-color` (blue) with a dark block in `common/_mixins.scss`; a generated accent changes Tag, input and Card focus but not Button or Card keyboard focus; Tag uses offset 0, the global outline 2px | — | partly | Out of the nine components' files; next step is pointing the global outline at `--bp-focus-color-neutral` |
| 33 | Intent subtle borders (review finding) | `border-color-{intent}-subtle` not emitted (no alpha 6 for Intents), so readonly Intent inputs keep `strong` while readonly Neutral inputs use `subtle` | — | yes | Needs a value for Intent alpha 6 (generator) |
| 34 | Public Sass mixin contracts (review finding) | `pt-input-intent` now takes an intent name (a `--bp-intent-*` value hits `@error`); `minimal-compound-tag-colors` takes an intent name; `pt-tag-minimal-intent` has 5 args; `pt-tag-minimal-dark-intent`, `dark-minimal-compound-tag-colors`, `$tag-default-color`, `$button-intent-states` removed; `pt-dark-*` mixins are no-ops. In-repo packages compile | — | — | Breaking for consumers who include these mixins from `@blueprintjs/core/src`; needs a changelog entry or shims before release |
| 35 | Rest of core, transparent items (wave 2) | Menu, Tree, HTMLTable, Section, CardList, Breadcrumbs, Tabs follow the soft ladder: hover 15% → 10% light / 20% dark, pressed → 30% / 35%; selected Menu item and CardList selected → soft hover; striped interactive HTMLTable hovers one step up (soft hover); Tabs rest text → step 12, indicator → primary Indicator (blue3) | not measured | no | One Transparent rule everywhere |
| 36 | Overlays (wave 2) | Popover, Toast, Dialog header/footer, MultistepDialog panels → Overlay / Base layers (dark Toast dark-gray4 → dark-gray3; dark MultistepDialog panels → Base); dark Popover hsl ring → the `xl` level's inset ring; arrows' shadow color uses the Sunken role (a background role as a shadow color, like H12); Drawer → `2xl` (dark was elevation 3); light Toast shadow → `xl` shape | not measured | no | Layers and the shadow ramp |
| 37 | Tooltip (wave 2) | Inverse surface in both themes (dark bg light-gray3 → `#e5e8eb`); muted, link and code text inside collapse to the inverse text color; intent icons inside follow the page theme (possible contrast gap); warning Tooltip → orange solid + `#111418` | not measured | no | Inverse roles are background + one text color only |
| 38 | Form controls (wave 2) | Checkbox/Radio unchecked: field + strong border (light ring lighter than gray2), hover via soft layered over field; checked ring → `xs`; disabled drops 0.5 opacity for disabled roles; Switch track → soft ladder, knob uses `text-color-neutral-solid` as a background (like H12), dark knob ring nearly invisible; SegmentedControl keeps the raised pill (Base track + Overlay pill), not the Soft selected rule; FormGroup/Label set neutral text in light too | not measured | no | Design review for the knob ring and SegmentedControl |
| 39 | Typography and globals (wave 2) | link hover → step 13 (was same as rest); `::selection` → primary soft active (old rgba(125,188,255,.6) has no role); blockquote border → neutral default; inline code ring dark 20% → 30%; Skeleton dark glow now lightens; global focus outline → `--bp-focus-color-neutral` (resolves #32) | small | no | Roles only |
| 40 | Public Sass removed (wave 2) | menu, tree, tabs, navbar, controls, switch, popover/tooltip arrow and toast color variables and `%pt-dark-select` removed; `popover-appearance` and `pt-toast-intent` signatures changed; menu `dark-*` mixins are no-ops | — | — | Same concern as #34 |

Rows 8–11 change visibly. If that is unacceptable when those components are migrated, first point the component at a different existing role; only if no existing role works, use a local value. Either way, record the exception here.

## Indicator and track naming

**Best bet (unreviewed):** keep "Indicator" for the per-scale value and `--bp-background-color-{intent}-indicator` for the Head role; Track stays the unfilled rail. Renaming the value to "track" would force renaming Track too. Earlier note: Each scale has a named Indicator color and every Intent has a head role pointing at it; the long role name (`--bp-background-color-{intent}-indicator`) and the word itself are not settled. If the per-scale value is named "track", the unfilled rail currently called Track needs another name (e.g. "rail").

## Reference: neutral borders in Blueprint today

| Today                                                      | Light                   | Dark                                       | Used by                                                                                       |
| ---------------------------------------------------------- | ----------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `$pt-divider-black-muted` / `$pt-dark-divider-white-muted` | black 10%               | white 10%                                  | CardList                                                                                      |
| `surface.border-color.default`                             | gray1 12% (≈ black 8%)  | white 20%                                  | Button, forms                                                                                 |
| `$pt-divider-black` / `$pt-dark-divider-white`             | black 15%               | white 20%                                  | Divider, Menu, Dialog, Section, Navbar, HTMLTable, CardList, Drawer, PanelStack, EditableText |
| Input ring (`forms/_common.scss:95`)                       | black 20%               | white 20%                                  | InputGroup                                                                                    |
| `surface.border-color.strong`                              | gray1 25% (≈ black 17%) | white 30%                                  | Button `outlined`                                                                             |
| `$pt-dark-divider-black`                                   | —                       | black 40% (darkens, like the Sunken layer) | Drawer, MultistepDialog                                                                       |

Decided ladder (gray alpha, black in light, white in dark):

| Role                           | Light     | Dark      | Used by                                                     |
| ------------------------------ | --------- | --------- | ----------------------------------------------------------- |
| `border-color-neutral-subtle`  | black 10% | white 10% | CardList muted divider                                      |
| `border-color-neutral-default` | black 15% | white 20% | Divider and the other `$pt-divider-black` users (unchanged) |
| `border-color-neutral-strong`  | black 20% | white 30% | Input ring and Button `outlined` (shared)                   |

`surface.border-color.default` (gray1 12% / white 20%) is fully resolved by other decisions: readonly → `border.subtle`; `outlined` disabled → the disabled treatment; the dark solid Button edge (default @ 50% = white 10%) → `border.subtle`. `$pt-dark-divider-black` (black 40%, dark only; Drawer, MultistepDialog) behaves like the Sunken layer, not a border; it is outside the 9 components.

## Reference: Blueprint borders before #7727/#7865

| Version                      | Divider               | Input border          | Outline/default Button border | Intent outline border | Shared input + outline? |
| ---------------------------- | --------------------- | --------------------- | ----------------------------- | --------------------- | ----------------------- |
| Blueprint before #7727/#7865 | black 15% / white 20% | black 20% / white 20% | dark-gray1 20% / white 40%    | intent text 60%       | Light only              |

## Decision: intent borders

Every Intent gets the same three border roles as Neutral, mirroring scale steps 6/7/8 (subtle, default, strong), e.g. `warning.border.subtle`, `warning.border.default`, `warning.border.strong`. The Intent × strength set is generated from the scale's slots, so it costs no per-Intent decisions. InputGroup with an Intent uses its `border.strong` (opaque mid tone; exact match today in light). Intent `border.subtle` roles are not emitted yet (Known issues #33). Button `outlined` with an Intent uses one of the three, chosen to match today's intent text color at 60%; the alpha step values are not yet chosen.

## Decision: Track and Head

- Track (unfilled rail) background: `--bp-background-color-sunken` (Sunken layer: light gray1 20%, dark `#111418` 50%), aliased in Sass as `$pt-track-background-color`; shared by ProgressBar, Spinner, Slider and Button's loading spinner. No visual change.
- Head (filled part): `--bp-background-color-{intent}-indicator`, pointing at each scale's Indicator color (Neutral → gray step 8). Only change: Neutral head in the light theme, gray1 80% → gray2 (ΔE 3.2).

## Decision: scale generator (follow-up)

The seed-color generator works in OKLCH: it blends the two nearest reference scales (Blueprint's own hue scales; see "Generator references"), places the seed at step 9, back-solves the alpha steps over the background, chooses the Solid text color by APCA, and keeps the same step equally light across hues. Rejected: an HSL lightness/saturation lookup, which gives uneven steps across hues.

## Hacks to revisit

Shortcuts taken to avoid visual changes; each should be reconsidered once the experiment works.

| #   | Hack                                                                                                                                                                                                                                                 | Why                                                                                                                                                                                                                                                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H1  | Blue, green, red: duplicate steps 8 = 9 (mid tone), 10 = 12 (e.g. blue2), 11 = 13 (e.g. blue1)                                                                                                                                                       | Blueprint's 5-step hues serve both fills and text; built only from today's values, the 13-step scale repeats itself. The generator removes this                                                                                                                                                                                       |
| H2  | Orange Indicator = step 8, every other Indicator = step 9                                                                                                                                                                                            | Orange step 9 is the light fill (orange5) for dark-text Buttons                                                                                                                                                                                                                                                                       |
| H3  | `bp-outlined` strength map: Neutral `strong`, Intents `default`                                                                                                                                                                                      | Intent `outlined` border (text @ 60%) differs from the Intent input border                                                                                                                                                                                                                                                            |
| H4  | Focus ring width 2px Neutral / 3px Intent inputs                                                                                                                                                                                                     | Preserves Blueprint's original intent-input ring                                                                                                                                                                                                                                                                                      |
| H5  | ~~`focus-color-neutral` points at the blue scale~~ Resolved: Neutral focus points at the Primary scale's focus, so a generated Primary retargets both                                                                                                | —                                                                                                                                                                                                                                                                                                                                     |
| H6  | Dark Input ring moved to white 30% (shared with `outlined`)                                                                                                                                                                                          | Divider and Input ring were both white 20% in the dark theme                                                                                                                                                                                                                                                                          |
| H7  | Soft steps 3/4/5 use equal percentages for every hue (10/20/30% light, 20/30/35% dark), not equal lightness                                                                                                                                          | Keeps Intent components unchanged; at the same step blue/green/orange/red read darker than gray (e.g. blue 20% L 0.911 vs gray 20% L 0.939). Fixed later by the generator                                                                                                                                                             |
| H9  | Disabled text is a translucent gray alpha step (gray1 60% / gray4 60%), slot gray-alpha 12 (best bet B1)                                                                                                                                             | Keeps legacy disabled text exactly; translucent text is harder to contrast-check (exempt under WCAG 1.4.3 incidental text)                                                                                                                                                                                                            |
| H8  | Button hover/active drop (20%) has no level on the size ramp. Implemented: a state change keeps the level (`xs`), so hover/active drop 20% → 10%; a next-level rule was rejected because `sm` has a different geometry than the Button's ring + drop | Ramp levels are named by size; the Button needs the same shape at higher opacity                                                                                                                                                                                                                                                      |
| H10 | `inset` inside some shadow tokens                                                                                                                                                                                                                    | Rings live inside ramp levels so no ring tokens or Card dark block are needed                                                                                                                                                                                                                                                         |
| H12 | Card selected halo uses `background-color-primary-soft-hover`, a soft background role, as a shadow color                                                                                                                                             | Card is not a soft background; no existing role matches the halo (blue4 @ 20% / blue5 @ 40%). Costs ΔE 1.8 light / 13.1 dark (Known issues #23)                                                                                                                                                                                       |
| H13 | Tag remove × fades the Solid text color to 70% at rest (100% on hover) via `opacity` on the × button                                                                                                                                                 | The fade is the only hover cue; dropping it costs ΔE 13.6–14.4. Danger × is 3.06:1 at 70%, barely above the 3:1 non-text minimum                                                                                                                                                                                                      |
| H11 | ProgressBar stripes use a placeholder white-alpha role (white 20%, both themes)                                                                                                                                                                      | Blueprint-only decoration with no precedent; may belong with highlights/shadows instead of color roles                                                                                                                                                                                                                                |
| H14 | Opaque and alpha steps of the same slot do not match (gray 8 = gray2, gray-alpha 8 = black 20%), and gray-alpha mixes bases (soft steps gray3, borders black / white)                                                                                | Built from today's values. The generator fixes it by back-solving alpha steps so both match over the background                                                                                                                                                                                                                       |
| H15 | ~~`background-color-field` points at different scales per theme~~ Resolved: field is gray-alpha step 2 (white light, `#111418` 30% dark); an alpha step may hold an opaque value                                                                     | —                                                                                                                                                                                                                                                                                                                                     |
| H16 | Gray step 2 (Content, white) is lighter than step 1 (Base, light-gray5) in the light theme                                                                                                                                                           | Blueprint's Content sits lighter than Base in light and darker-to-lighter in dark; slots keep meaning, not lightness order                                                                                                                                                                                                            |
| H17 | Generator references are built from today's hue scales (gray, blue, green, orange, red only): hue steps 1–2 take gray's, and the missing hue step 6 (no Intent subtle border, Known issue #33) is the OKLCH midpoint of steps 5 and 7                | No complete 13-step Blueprint references exist. Measured: default seeds reproduce today's values (light blue 12 / 13 `#215db0` / `#174a90` vs `#215db0` / `#184a90`), so H1 (8 = 9) persists in generated scales; seeds far from these hues borrow a neighbor's curve (dark, seed `#9d3f9d` → step 12 `#ff6dff`). Needs design review |

**Predictability review (best bet, unreviewed).** Against the goal, these hacks break a rule a consumer would otherwise rely on and are the first to revisit: H3 (Intent `outlined` uses a different border strength than Neutral; dropping it costs ΔE 15.4), H4 (focus width split; G4 already wires one `emphasis.focus-width`), H12 (a background role used as a shadow color), H13 (opacity), H14–H16. H1 (not for default seeds; H17), H2, H7 and H9 go away with the generator; H5 and H11 are naming placeholders.

## Theming gaps

Found by recreating two external buttons with these tokens (computed styles read in a browser). Colors map cleanly; these do not.

| #   | Gap                             | Example                                                                                                                                                                                                                     | Status                                                                                                              |
| --- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| G1  | Border width                    | One recreated button uses 2px; Blueprint 1px. The token already exists (`surface.border-width` = 1px, `--bp-surface-border-width`) but only Button uses it; Divider, Card, Callout, Tag and the input rings hard-code `1px` | decided, not yet implemented: Divider and the input rings still hard-code `1px`                                     |
| G2  | Ring placement (inset vs outer) | A recreated secondary button uses an outer `0 0 0 1px` ring; Blueprint uses inset                                                                                                                                           | proposed: components write the full shadow from color roles, so geometry is a component decision, not a theme token |
| G3  | Dedicated disabled colors       | Recreated buttons use `#f2f2f2` / `#8f8f8f` and `#d5dade` / `#3f525f`; Blueprint uses opacity                                                                                                                               | resolved by "Decision: disabled"                                                                                    |
| G4  | Focus width                     | A recreated button uses 3px                                                                                                                                                                                                 | decided: wire `emphasis.focus-width` (exists, unused) into the outline and the input ring                           |
| G5  | Focus background                | A recreated button darkens to its hover color while focused                                                                                                                                                                 | best bet (unreviewed): not adopted; focus is only the ring, so a theme cannot express it (documented gap)           |
| G6  | Focus contrast                  | A yellow ring `#fae100` is 1.33:1 on white but 8.93:1 on the focused button; the contrast test must check the ring against the focused element as well as the page                                                          | decided: covered by the contrast test (B6)                                                                          |

## Decision: disabled

Disabled uses dedicated Neutral roles, not opacity and not the Intent: `background-color-disabled`, `text-color-disabled`, `border-color-disabled`, shared by every Intent and Variant. Supersedes the earlier opacity decision. Consequence: disabled Intent Buttons lose their Intent tint (today Intent @ 50% background, text @ 60%), a visible change to record per component. Steps: `background-color-disabled` → gray alpha 3 (soft rest; ΔE 2.8 light / 1.9 dark vs today's disabled input), `border-color-disabled` → `border.subtle`, `text-color-disabled` → see "Decision: disabled text".

## Decision: text reference values

Text roles take the legacy Sass values as the reference (what components render after their local patches), not the current typography tokens, whose dark values are incomplete (muted and disabled have no dark override): default dark-gray1 / light-gray5, muted gray1 / gray4, disabled gray1 @ 60% / gray4 @ 60% (light / dark).

## Decision: disabled text

`text-color-disabled` points at a gray **alpha** step holding the legacy values exactly: gray1 @ 60% (light) and gray4 @ 60% (dark). No visual change. Its slot number on the gray alpha scale is pending the scale layout (H9).

## Decision: Tag solid

Tag solid uses the solid roles (steps 9 / 10 / 11) for every Intent, Neutral included, exactly as Button does; no Tag-specific fills. Orange steps 10 / 11 take the warning Button's current hover / active values, so the warning Tag's hand-made offsets follow:

| Warning, solid                         | Rest                                       | Hover                                                   | Active                                                  |
| -------------------------------------- | ------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------- |
| Button (`button/_button.scss:200–213`) | orange5 `#fbb360`                          | `color-mix(in oklch, orange5 77%, orange2)` = `#e29d4e` | `color-mix(in oklch, orange5 46%, orange1)` = `#b27634` |
| Tag (`tag/_common.scss:43–46`)         | `oklch(from orange3 l + 0.19)` = `#ffb261` | `oklch(from orange2 l + 0.24)` = `#e19e61`              | `oklch(from orange1 l + 0.2, c + 0.05)` = `#c9750b`     |
| Difference (Tag change)                | ΔE 0.7                                     | ΔE 1.8                                                  | ΔE 4.3 (interactive Tags only)                          |

## Decision: CompoundTag

The right half uses the solid roles (steps 9 / 10 / 11). The left half is one state ahead: rest → step 10, hover → step 11, active → step 11. No CompoundTag-specific colors; see Known issues #22.

## Decision: Callout

Callout is a Soft element: background `background-color-{intent}-soft-rest`; text and icon `text-color-{intent}-subtle` (step 12); Neutral icon `text-color-neutral-subtle` (step 12, today's `$pt-icon-color` = muted text); links inside a primary Callout keep their underline and use step 13 on hover (today `$blue1` / `$blue6`). No Callout-specific colors and no dark block.

## Field background

**Best bet (unreviewed):** `background-color-field`, keeping today's values (white light, `#111418` 30% dark; H15). "Field" avoids the `.bp6-control` and `--bp-surface-*` collisions; a transparent-in-light field is rejected because inputs would turn gray on a light-gray5 Base. Earlier proposal: a `background-color-field` role for field-like controls (InputGroup now; later TextArea, HTMLSelect, Checkbox/Radio indicators, SegmentedControl). Values would keep today's input: white (light) and `#111418` 30% (dark), which no layer reproduces (dark input vs Base ΔE 1.7, vs Sunken 1.3; Content is lighter). Name undecided: `background-color-field` or `background-color-control` ("control" collides with Blueprint's `.bp6-control` class for Checkbox / Radio / Switch; "surface" collides with the legacy `--bp-surface-*` tokens). Alternative to evaluate: no field token, transparent in light and a lighter tint in dark; on a light-gray5 Base that would turn light inputs gray and flip the dark direction.

## Decision: Base value and ProgressBar stripes

- `background-color-base` = light-gray5 `#f6f7f9` (light) / dark-gray1 `#1c2127` (dark), Blueprint's `$pt-app-background-color` / `$pt-dark-app-background-color`; Content stays white / dark-gray2 above it.
- ProgressBar stripes (`rgba($white, 0.2)` over the Head, both themes) use a placeholder white-alpha role (H11).

## Decision: Card selected

Card's selected ring uses the focus color (`focus-color-primary`) and its 3px halo uses `background-color-primary-soft-hover`; no Card-specific colors and no dark block. See Known issues #23 and H12.

Rejected for the halo: a per-scale subtle focus value (one consumer, unclear meaning), the focus color at 3px (ΔE 32.5 light / 18.5 dark; ring and halo merge into one band), no halo (ΔE 7.7 light / 23.7 dark), and the exact match, step 12 at 40% in dark (alpha applied to a step is mixing).

Also found (out of scope): the selected styles only apply with `interactive` (nested in `.bp6-card.bp6-interactive`), they replace the elevation shadow, and `:active` hides them while pressed.

Inconsistency found: today Card's selected state uses its own primary color (blue4 / blue5, from hand-made offsets), unlike the focus color everywhere else (blue2 @ 75% / blue5 @ 75%) and unlike any soft step.

| Card `.bp6-selected` (`card/_card.scss:121–130`) | Formula                                                      | Resolves to | Match          |
| ------------------------------------------------ | ------------------------------------------------------------ | ----------- | -------------- |
| Light ring (1px)                                 | `oklch(from primary-rest calc(l + 0.095) calc(c - 0.004) h)` | `#4d90f0`   | blue4 (ΔE 0.1) |
| Light halo (3px)                                 | same color `/ 0.2`                                           | blue4 @ 20% | —              |
| Dark ring                                        | `calc(l + 0.224) calc(c - 0.053)`                            | `#8cbbff`   | blue5 (ΔE 0.2) |
| Dark halo                                        | same color `/ 0.4`                                           | blue5 @ 40% | —              |

| Mapped to                                                          | Ring ΔE (light / dark) | Halo ΔE (light / dark) |
| ------------------------------------------------------------------ | ---------------------- | ---------------------- |
| focus color (blue2 @ 75% / blue5 @ 75%)                            | 6.7 / 11.7             | —                      |
| soft hover (blue3 20% / 30%) for the halo                          | —                      | 1.8 / 13.1             |
| a per-scale `selected` value (blue4 / blue5 + alpha), the fallback | 0 / 0                  | 0 / 0                  |

## Best bets (2026-10-08, unreviewed)

### B1 — Step layout (ADR 0004, proposed)

Every hue has an opaque scale and an alpha scale with the same 13 slot meanings. A slot means the same thing in every hue and theme; values come from today's Blueprint until the generator replaces them.

| Slot        | Meaning                          | Roles                                                                               |
| ----------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| 1           | Page background                  | gray: `background-color-base` (opaque), `background-color-sunken` (alpha)           |
| 2           | Container background             | gray: `background-color-content`                                                    |
| 3 / 4 / 5   | Soft rest / hover / active       | `background-color-{intent}-soft-*`; Transparent hover = 3, active = 5               |
| 6 / 7 / 8   | Border subtle / default / strong | `border-color-{intent}-*`                                                           |
| 9 / 10 / 11 | Solid rest / hover / active      | `background-color-{intent}-solid-*`                                                 |
| 12          | Low-contrast text                | muted Neutral text, Intent text at rest, placeholder; gray-alpha 12 = disabled text |
| 13          | High-contrast text               | Neutral text, Intent text when pressed                                              |

Named per scale, outside the slots: Solid text color, Indicator color, Focus color.

Values decided so far (light / dark; "same" = both themes):

| Slot        | gray                                   | gray-alpha                                | blue (green, red follow the pattern) | blue-alpha                  | orange                                 |
| ----------- | -------------------------------------- | ----------------------------------------- | ------------------------------------ | --------------------------- | -------------------------------------- |
| 1           | light-gray5 / dark-gray1 (Base)        | gray1 20% / `#111418` 50% (Sunken)        | —                                    | —                           | —                                      |
| 2           | white / dark-gray2 (Content; H16)      | —                                         | —                                    | —                           | —                                      |
| 3 / 4 / 5   | —                                      | gray3 10/20/30% / 20/30/35%               | —                                    | blue3 10/20/30% / 20/30/35% | orange3 alpha, same percentages        |
| 6 / 7 / 8   | 8: gray2 (Neutral Indicator) / not set | black 10/15/20% / white 10/20/30%         | 8: blue3 (same)                      | 7: step 12 @ 60%            | 8: orange3 (Indicator, H2)             |
| 9 / 10 / 11 | gray1 / dark-gray5 / dark-gray4 (same) | —                                         | blue3 / blue2 / blue1 (same)         | —                           | orange5 / `#e29d4e` / `#b27634` (same) |
| 12          | gray1 / gray4                          | gray1 60% / gray4 60% (disabled text, H9) | blue2 / blue5                        | —                           | orange2 / orange5                      |
| 13          | dark-gray1 / light-gray5               | —                                         | blue1 / blue6                        | —                           | orange1 / orange6                      |

"—" slots are unused by the nine components and left to the generator. Dark values for green, red and orange slots 12/13 follow blue's pattern (hue 5 / hue 6) and are not individually verified; the contrast test (B6) checks them. Known mismatches: H1, H14, H16.

### B2 — Input text

Input text `text-color-neutral-default` (step 13), placeholder `text-color-neutral-subtle` (step 12), disabled `text-color-disabled`. No visual change: today's dark text (gray1 `l + 0.212` from the dark typography token, then `l + 0.239` in `forms/_common.scss:214`) lands on light-gray5 (ΔE 0.1), and the dark placeholder on gray4 (ΔE 0.1).

### B3 — Button text and icons

One rule for every Variant and theme; icons follow text, except Neutral icons, which are muted (today's rule, `button/_button.scss:105`).

| Variant                             | Text rest / hover     | Text active      | Icon            |
| ----------------------------------- | --------------------- | ---------------- | --------------- |
| solid, Intent                       | Solid text color      | Solid text color | = text          |
| default (Neutral, soft with border) | step 13               | step 13          | step 12 (muted) |
| `minimal` / `outlined`, Intent      | step 12               | step 13          | = text          |
| `minimal` / `outlined`, Neutral     | step 13               | step 13          | step 12 (muted) |
| disabled, any                       | `text-color-disabled` | —                | = text          |

Light theme matches today exactly (Intent `minimal` rest = hue 2, active = hue 1). Dark changes are Known issues #25. The warning icon fade is dead CSS (#24) and is dropped.

### B4 — Warning text on solid

Orange's Solid text color is `#111418` (the warning Button's value today): 10.31 / 8.06 / 4.87:1 on orange steps 9 / 10 / 11, so AA holds on all three. The warning Tag's lightened text follows (#26).

### B5 — Naming

"Contrast color" → **Solid text color**, role `text-color-{intent}-solid`. Indicator keeps its name. Layer names (Sunken, Base, Content, Overlay) stay pending team review; not settled here.

### B6 — Contrast test

A build-time Vitest test next to the tokens (e.g. `design-tokens/contrast.test.ts`) that composites alpha over Base and Content in both themes:

- Text (AA gate 4.5:1, AAA reported): every text role on every background it is used on (Base, Content, soft 3/4/5, solid 9/10/11 with the Solid text color).
- Non-text (3:1): strong borders, the focus ring against the page and against the focused element (G6), Indicator against Track.
- Known failures are listed in the test with their Known issues number (#15 input boundary); H13's danger × (3.06:1) passes and is watched.

## Implementation notes (2026-10-08, unreviewed)

Where the implementation settled something the best bets left open:

- **Files.** Scales: `tokens/base/scale.tokens.json` (light) and `tokens/themes/dark/scale.tokens.json`. Accent alias and roles: `tokens/semantic/`, emitted as `var()` references in both theme files (`sd.config.ts` `SEMANTIC_TOKENS_DIR`), so a runtime override of a scale step reaches every role. Shadows: `tokens/base/shadow.tokens.json` and its dark twin.
- **Next styles.** Components that use the roles live in `*-next.scss` twins next to the default files, which are identical to `develop`. `src/blueprint-next.scss` builds `lib/css/blueprint-next.css`, a full replacement for `blueprint.css` (load one or the other, never both); Storybook's "Styles" toolbar switches between them. Files with a `@use` cannot override default mixins when imported, so mixins, functions and placeholders that exist in both carry a `-next` suffix in the twins. The public Sass breakages in Known issues #34 and #40 now apply only to the `-next` files. Only core has next styles; datetime, select, table and labs keep their default styles in both stylesheets.
- **Intent scales.** Each Intent's roles point at an alias scale: `scale.primary` (→ blue), `scale.success` (→ green), `scale.warning` (→ orange), `scale.danger` (→ red); Neutral points at gray directly. The Storybook Theme panel has one color input per Intent (Primary, Success, Warning, Danger); each generates a full scale for both themes and overrides only `--bp-scale-{intent}-*`. A generated scale uses one rule for every Intent, so a generated Success/Warning/Danger focus is step 12 @ 75% (the defaults keep their mid tone @ 75%).
- **Generator references.** The Storybook generator's references are Blueprint's hue scales (gray, blue, green, orange, red) read from `scale.tokens.json` in both themes, by step role: 1–2 backgrounds, 3–5 soft elements, 6–8 borders, 9–11 solid, 12–13 text. Each step takes its opaque value, else its alpha value composited over the background; hue steps 1–2 and 6 are filled per H17. A reference holds steps 1–10, 12 and 13; step 11 (solid active) is one more hover step from 10. Alpha 3/4/5/7/8 are back-solved, focus = step 12 @ 75%. A seed close to the page background falls back to the blended reference's step 9 (light, seed `#fbd065` → `#e5ba4e`).
- **Text role names**, the same for every Intent: `text-color-{intent}-default` (step 13), `-subtle` (step 12), `-solid` (Solid text color); `text-color-disabled`. They replace `text-color-{intent}-rest` and `text-color-neutral-muted` used in earlier sections.
- **Border roles** always point at alpha steps 6/7/8; for Intents, alpha 8 holds the opaque mid tone (an alpha step may be opaque), so Neutral and Intents follow one rule.
- **Gray step 8, dark** = gray3 (today's dark Neutral head).
- **ProgressBar stripes**: `background-color-stripe` → `scale.white.alpha.4` (white 20%), still the H11 placeholder.
- **Tag Neutral `minimal` text** stays step 13 (`text-color-neutral-default`) at rest, like Button Neutral `minimal`; only its icons and × are step 12. So for Neutral, Soft/Transparent text is 13 at rest, while Intents use 12 at rest and 13 pressed.
- **Button loading spinner** head uses `currentcolor`, so a loading (disabled) solid Button shows the disabled text color instead of white on the gray disabled background.
- **Generator text and seed rules**: the Solid text color must meet WCAG AA (4.5:1) on steps 9/10/11, so when the APCA choice on step 9 fails and the other candidate (white or the dark tinted text) does better, the generator switches (e.g. seed orange5 in light: white 2.41:1 → dark text); the seed's alpha is ignored; a hueless background gets a gray (not reddish) dark text. Pure white/black seeds use the gray reference scale. Translucent steps are solved over Content (white) in light and Base (dark-gray1) in dark, so on the light Base an alpha step reads slightly differently from its opaque twin (H14).
- **More layers (best bet, unreviewed)**: Overlay (`background-color-overlay`, white / dark-gray3), Backdrop and Inverse are named per-scale values on gray (`scale.gray.overlay`, `backdrop`, `inverse`, `inverse-text`), like Focus and Indicator, because the step layout has only two layer slots (1 page, 2 container). Dialog body = Base (unchanged in both themes), Dialog header/footer = Overlay. Links use `text-color-primary-subtle` (blue2 / blue5, unchanged), code backgrounds use `background-color-field`.
- **Theme Playground** story (`Core/Theme Playground`) shows most core components on one page for judging a theme with the Theme panel's four Intent colors.
- **Intent scale override in Storybook** is a `<style>` on `:root:root` and the doubled dark selectors; roles are redeclared under the dark selector by the token build, so both themes pick it up. The border-radius control was removed from the panel.
