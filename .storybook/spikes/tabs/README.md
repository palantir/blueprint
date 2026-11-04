# Tabs token model spike

This comparison asks which token model Tabs should use and which appearance changes are intentional. It does not change shipped Tabs styles or register new public tokens.

After the normal repository installation and library compilation, run `pnpm storybook`. Open **Spikes → Tabs token comparison → Overview**. The same story is included in `pnpm build-storybook`; it does not depend on the local comparison server or external snapshots.

The overview shows three rows on one page:

- **Horizontal:** compare selected text, underline, hover, and disabled foreground.
- **Vertical:** compare selected fill and foreground, sharing selection with the horizontal row.
- **Selected disabled:** compare the original full-strength selected foreground with the semantic model's 50% foreground. This row has independent selection; use its reset button to restore the selected-disabled state after clicking another tab.

Selection is synchronized across the three implementations in each row. Controls change size, indicator animation, selected tab, and annotations. Row orientations stay fixed so both layouts remain visible. The theme toolbar switches light/dark. Hover and focus the actual tabs to inspect native states. Amber marks changed defaults next to the specimen; it does not recolor the tabs. There is no intent control because Tabs has no intent prop.

## Implementations

All previews use the repository's real React Tabs/Tab components. Each iframe receives a separate compiled stylesheet, so their identical selectors and token names cannot affect each other or the parent Storybook. The Theme panel lists the nine proposed roles first while viewing the overview, followed by the shipped tokens. Overrides are applied to each frame; the original Sass remains a fixed baseline wherever it uses Sass colors. Reset each override with its adjacent reset button. Annotations describe the default palette and are replaced with a notice while overrides are active.

`_foundation.scss` imports the common reset, typography, tokens, focus, dark, and icon styles without the production Tabs recipe. `original.scss` adds the current production recipe. The alternatives add their own recipe from `fixtures/`, with explicit role defaults in `existing.scss` and `semantic.scss`. These role declarations are fixture equivalents of the proposed token JSON, using `color-mix` for derived alpha values. They are not additions to the public token generator. Build output lives in the ignored `generated/` directory and is recreated by both Storybook commands.

`fixtures/existing.patch` and `fixtures/semantic.patch` preserve the production-code proposals against `develop fbc45c11e`. They are review artifacts, not applied by the Storybook build. Fixture Sass only changes the common import paths from those proposals.

`frameInteractions.ts` installs Blueprint's focus-mode engine in each document and bridges arrow-key focus. The latter compensates for Tabs' active-element check crossing iframe realms; Enter/Space selection still uses the real component handlers.

| Behavior                     | Existing tokens + dark roles | Semantic API                     |
| ---------------------------- | ---------------------------- | -------------------------------- |
| Hover / selected foreground  | Shared link role             | Separate normal / strong roles   |
| Light selected foreground    | Blue2                        | Blue1                            |
| Light / dark underline       | Blue2 / Blue5                | Blue3 / Blue3                    |
| Selected fill                | Blue3 at 20%                 | Blue3 at 20%                     |
| Disabled foreground          | Gray1 / Gray4 at 60%         | Normal foreground at 50%         |
| Selected-disabled foreground | Selected foreground at 100%  | Selected foreground at 50%, once |

The decision is whether separate selected/hover/indicator roles and the different disabled foreground are desired. Adopting either proposal is a subsequent change. Neither custom ancestor foregrounds, independently colored children such as Tags, nor forced-colors rendering are covered by the three default specimens.

Focused checks:

```sh
pnpm storybook:spike-styles
pnpm exec vitest run --config .storybook/spikes/tabs/vitest.config.mts
```
