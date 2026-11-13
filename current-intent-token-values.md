# Generated palette mapping to BP6 tokens

Each intent has its own eight-color palette. The tables show where each palette entry is used, then compare the
assignments and current BP6 values across intents.

The palette runs from light to dark. Colored intents below means primary, success, warning, and danger.

## Palette usage

All mixes start from the chosen color and use OKLab interpolation toward white (`#ffffff`) or black (`#000000`).

| Palette      | Recipe                               | Usage                                                                                                                   |
| ------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `palette[0]` | Chosen color mixed 83⅓% toward white | Default text at rest in dark mode. Unused for colored intents.                                                          |
| `palette[1]` | Chosen color mixed 66⅔% toward white | Default active text in dark mode. Unused for colored intents.                                                           |
| `palette[2]` | Chosen color mixed 50% toward white  | Colored active text in dark mode. Unused for default.                                                                   |
| `palette[3]` | Chosen color mixed 33⅓% toward white | Colored text at rest and on hover in dark mode. Unused for default.                                                     |
| `palette[4]` | Chosen color mixed 16⅔% toward white | Disabled intent color for all intents, and disabled text for colored intents, in both themes.                           |
| `palette[5]` | Exact chosen color                   | Intent color at rest for all intents, plus the warning Button background at rest, in both themes.                       |
| `palette[6]` | Chosen color mixed 10% toward black  | Intent hover color for all intents in both themes; default active text and colored text at rest/on hover in light mode. |
| `palette[7]` | Chosen color mixed 20% toward black  | Intent active color for all intents in both themes; default text at rest and colored active text in light mode.         |

## Roles across intents

Each cell shows **generated palette assignment = current BP6 value**.

BP6 values use Sass variable names where available; otherwise they show the exact value in `palette.tokens.json`.

[Not generated](#unchanged-bp6-values) means the generator leaves that token to existing CSS.

**—** means the warning-specific token does not apply to that intent.

| Role                     | Theme | CSS token                                 | Default                                | Primary                  | Success                  | Warning                                 | Danger                   |
| ------------------------ | ----- | ----------------------------------------- | -------------------------------------- | ------------------------ | ------------------------ | --------------------------------------- | ------------------------ |
| Intent color · rest      | Both  | `--bp-intent-{intent}-rest`               | `palette[5]` = `$gray1`                | `palette[5]` = `$blue3`  | `palette[5]` = `$green3` | `palette[5]` = `$orange3`               | `palette[5]` = `$red3`   |
| Intent color · hover     | Both  | `--bp-intent-{intent}-hover`              | `palette[6]` = `$dark-gray5`           | `palette[6]` = `$blue2`  | `palette[6]` = `$green2` | `palette[6]` = `$orange2`               | `palette[6]` = `$red2`   |
| Intent color · active    | Both  | `--bp-intent-{intent}-active`             | `palette[7]` = `$dark-gray4`           | `palette[7]` = `$blue1`  | `palette[7]` = `$green1` | `palette[7]` = `$orange1`               | `palette[7]` = `$red1`   |
| Intent color · disabled  | Both  | `--bp-intent-{intent}-disabled`           | `palette[4]` = `$gray3`                | `palette[4]` = `$blue4`  | `palette[4]` = `$green4` | `palette[4]` = `$orange4`               | `palette[4]` = `$red4`   |
| Text · rest              | Light | `--bp-typography-color-{intent}-rest`     | `palette[7]` = `$dark-gray1`           | `palette[6]` = `$blue2`  | `palette[6]` = `$green2` | `palette[6]` = `$orange2`               | `palette[6]` = `$red2`   |
| Text · hover             | Light | `--bp-typography-color-{intent}-hover`    | [Not generated](#unchanged-bp6-values) | `palette[6]` = `$blue2`  | `palette[6]` = `$green2` | `palette[6]` = `$orange2`               | `palette[6]` = `$red2`   |
| Text · active            | Light | `--bp-typography-color-{intent}-active`   | `palette[6]` = `$dark-gray2`           | `palette[7]` = `$blue1`  | `palette[7]` = `$green1` | `palette[7]` = `$orange1`               | `palette[7]` = `$red1`   |
| Text · disabled          | Light | `--bp-typography-color-{intent}-disabled` | [Not generated](#unchanged-bp6-values) | `palette[4]` = `$blue4`  | `palette[4]` = `$green4` | `palette[4]` = `$orange4`               | `palette[4]` = `$red4`   |
| Text · rest              | Dark  | `--bp-typography-color-{intent}-rest`     | `palette[0]` = `$light-gray5`          | `palette[3]` = `$blue5`  | `palette[3]` = `$green5` | `palette[3]` = `$orange5`               | `palette[3]` = `$red5`   |
| Text · hover             | Dark  | `--bp-typography-color-{intent}-hover`    | [Not generated](#unchanged-bp6-values) | `palette[3]` = `$blue5`  | `palette[3]` = `$green5` | `palette[3]` = `$orange5`               | `palette[3]` = `$red5`   |
| Text · active            | Dark  | `--bp-typography-color-{intent}-active`   | `palette[1]` = `$light-gray4`          | `palette[2]` = `#99c4ff` | `palette[2]` = `#7cd7a2` | `palette[2]` = `#f5c186`                | `palette[2]` = `#ffa1a4` |
| Text · disabled          | Dark  | `--bp-typography-color-{intent}-disabled` | [Not generated](#unchanged-bp6-values) | `palette[4]` = `$blue4`  | `palette[4]` = `$green4` | `palette[4]` = `$orange4`               | `palette[4]` = `$red4`   |
| Button background · rest | Both  | `--bp6-button-warning-rest`               | —                                      | —                        | —                        | `palette[5]` = Derived from `$orange3`¹ | —                        |

**Text/icons on solid fill:** `--bp-intent-{intent}-foreground`. Current BP6 uses `$white` for default, primary,
success, and danger; `$black` for warning, in both themes. The generator chooses black/white automatically from the seed,
outside the numbered palette.

¹ Defined in [Button SCSS](/Volumes/git/blueprint/packages/core/src/components/button/_common.scss:71), using
`oklch(from var(--bp-intent-warning-rest) calc(l + 0.177) calc(c - 0.01) calc(h + 6.26))`.
Browsers without relative-color support use `$orange5` instead. When warning is customized through the generator,
this property is overridden with the exact chosen warning color in both modes.

## Unchanged BP6 values

These tokens retain their existing BP6 definitions.

| Role            | CSS token                                | Light                  | Dark                   |
| --------------- | ---------------------------------------- | ---------------------- | ---------------------- |
| Text · hover    | `--bp-typography-color-default-hover`    | `$black`               | `$white`               |
| Text · disabled | `--bp-typography-color-default-disabled` | `$gray1` · alpha `0.6` | `$gray4` · alpha `0.6` |

## Open questions

- I'm only generating 8 colors here: do we need more?
- What should be the formula to generate the token values?
