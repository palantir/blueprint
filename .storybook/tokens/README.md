# Storybook theme tokens

## Ownership and value flow

- [generatePalette.ts](generatePalette.ts) generates palette colors from an opaque seed.
- [generateTokens.ts](generateTokens.ts) owns family names and the `GeneratorInputs` contract. It derives both themes' family tokens from saved `generatorInputs`, whose family values have the shape `{ color }`, including CSS expressions and foreground references.
- [tokens.ts](tokens.ts) owns editor configuration and normalization of saved Advanced overrides.
- [TokensPanel.tsx](TokensPanel.tsx) owns editing, reset actions, and the values displayed by controls. Simple controls show saved seeds independently of Advanced edits. Advanced controls use `override ?? generated ?? stylesheet`.
- [preview.tsx](preview.tsx) applies the same precedence for the active theme, restores original inline values when neither an override nor a generated value exists, and publishes resolved values tagged with the story and theme.

Keep seeds, Advanced overrides, and computed display values separate. Literal values take effect in controls immediately; CSS references and generated `color-mix()` expressions use preview-resolved colors for display while preserving their expressions. Generated values are derived locally and do not enter the URL.

Individual Advanced reset removes only that token's override in the active theme and reveals its generated value, if any. Advanced reset-all clears only the active theme's overrides. Simple reset removes only the family's seed; changing or resetting a seed preserves all Advanced overrides in both themes. Without a seed or override, the preview restores the underlying stylesheet and original inline values. Simple controls without a saved seed display their editor defaults independently of Advanced edits.

## Visual verification

Run `pnpm storybook` from the repository root. If another server owns the default port, use `pnpm exec storybook dev --port <free-port>`. Open the **Theme** panel on a component story that uses the affected tokens. [ColorGeneration.stories.tsx](ColorGeneration.stories.tsx) is useful for palette output; its story controls do not exercise the Theme panel's override persistence.

Before interpreting results, verify the browser's server and loaded manager source match the current checkout. Check the changed panel code in browser DevTools; a current preview iframe does not establish that the manager bundle is current. Restart the owned server and reload if needed.

Run `pnpm exec vitest run --project storybook-tokens` for focused persistence, panel, and preview regression tests.

Start each scenario without seeds or token overrides and record the affected controls and rendered values in both themes. Use those values as the stylesheet baseline, rather than editor defaults or regenerated colors.

1. **Literal override and preview lag.** In Advanced, change a literal color override twice. The picker should immediately show the latest override and remain consistent when the preview publishes its value. Exercise this with a delayed preview update when checking stale-value handling; if that timing cannot be reproduced, record that part as unverified.
2. **Generated expressions and references.** In Simple, generate the primary family from a dark opaque seed such as `#713ac7`. Confirm only its seed is persisted, while the preview applies `color-mix()` shades and a foreground reference to `--bp-palette-white`. Advanced hover/active/foreground pickers should display resolved colors. Change the white palette token in Advanced: the foreground picker and rendered foreground should follow it, while Simple continues to display `#713ac7`.
3. **Saved link and themes.** Make distinct literal Advanced overrides in light and dark themes and save a seed such as `#663399`. Copy the URL and open it in a fresh tab. Confirm the seed and both themes' overrides survive.
4. **Seed edits and resets preserve Advanced overrides.** Generate a family and make distinct rest-token overrides in both themes. Change the seed and confirm Simple displays it while Advanced and the preview retain their overrides. Reset the seed and confirm only its generated values disappear; both themes' Advanced overrides and unrelated seeds remain. Tokens without overrides should return to the recorded stylesheet baseline.
5. **Advanced reset reveals generated values.** Generate a family, override its rest token, then reset that token in Advanced. Confirm the generated rest color returns, the seed remains saved, and its Simple reset stays available. Create overrides in both themes and reset all in the active theme. Confirm generated colors remain, only the active theme's overrides disappear, and the other theme retains its overrides. Reload the saved URL and confirm the reset persists.

Record the server URL, story, themes, steps exercised, observed results, and any verification gaps. Inspect both persisted overrides and rendered/control values: either alone misses errors across the manager, globals, and preview boundary.
