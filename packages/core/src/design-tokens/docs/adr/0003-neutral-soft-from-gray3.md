---
status: superseded (Neutral now uses the same soft percentages as every Intent: 10/20/30% light, 20/30/35% dark; see Known issues #18 and H7 in CONTEXT.md)
---

# Neutral Soft backgrounds are gray3 at 15 / 30 / 35%

The neutral Soft roles (`soft-rest`, `soft-hover`, `soft-active`) are gray3 at 15%, 30% and 35% in both themes, the values neutral Tag `minimal` already uses. Neutral tints today use different base colors and percentages per component, so percentages alone look inconsistent; composited over the containers Blueprint defines, the chosen values are within ΔE(OKLab ×100) ≤ 1.3 of today's colors, below the ~2 threshold of a noticeable difference.

## Consequences

Neutral tints today (percentages are of the listed base color):

| Component                                  | Base color                   | Rest           | Hover         | Active         |
| ------------------------------------------ | ---------------------------- | -------------- | ------------- | -------------- |
| Tag `minimal` (`tag/_common.scss:207–236`) | gray1 at `l + 0.16` (≈gray3) | 15%            | 30%           | 35%            |
| Callout (`callout/_callout.scss:17, 77`)   | gray3                        | 15% · dark 20% | —             | —              |
| Menu item hover (`menu/_common.scss:35`)   | gray3                        | —              | 15%           | —              |
| Tree node (`tree/_tree.scss:64–68`)        | gray3                        | —              | 15%           | 30%            |
| Button `minimal`                           | dark-gray5 · dark: gray1     | —              | 8% · dark 24% | 16% · dark 49% |

Button `minimal` neutral, today vs proposed, largest ΔE per backdrop: white 0.7, light-gray5 0.4, light-gray4 0.4, dark-gray1 0.5, dark-gray2 0.8, dark-gray3 1.3. The dark Card's derived background was not measured.
