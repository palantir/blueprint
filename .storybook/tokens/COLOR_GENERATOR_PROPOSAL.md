A variation on #8397: fit the user’s exact rest color into a shared 10-color palette, then use palette shades for hover and selected. In light mode, prefer darker states (lighter for very dark inputs); in dark mode, prefer lighter hover and darker selected. Try adjacent shades first, adjust the ramp before skipping, and flag direction exceptions when range or readability checks require them. The light end stays softly tinted, including for vivid yellow.

Greg’s preservation of existing colors and Ryan’s separate lightness/chroma curves inspired this. There’s a Storybook playground showing the starting template, final ramp, state colors, and contrast checks. Curious how this feels!

---

## The idea in one sentence

**Final shade = a sample of the shared template + a correction that fades away from the exact input.**

A standard template with an exact input anchor. Positions 0–9 have common starting lightness targets and a common chroma profile. The final positions are allowed to move to accommodate the input. They do not promise identical luminance across hues.

## Follow the calculation

### 1. Read the input

Accept an opaque `#RGB` or `#RRGGBB` color. Keep its exact RGB value as rest, then read its OKLCH lightness L, chroma C, and hue H. Neutral inputs stay neutral.

Hue sets the color family; input chroma sets its strength. This preserves the distinction between muted blue-gray and vivid blue. L is perceptual lightness, not the luminance used for contrast.

Choose the mode explicitly: `mode: "light"` (default) or `mode: "dark"`. Storybook uses its theme toolbar. The surrounding surface is a separate input for contrast checks; changing its color alone does not change the mode.

### 2. Build the same template for every hue

These are the shared design choices:

| Position | Target L | Chroma multiplier |
| -------- | -------: | ----------------: |
| 0        |     0.98 |              0.10 |
| 1        |     0.94 |              0.18 |
| 2        |     0.86 |              0.32 |
| 3        |     0.76 |              0.55 |
| 4        |     0.66 |              0.80 |
| 5        |     0.56 |              1.00 |
| 6        |     0.46 |              0.85 |
| 7        |     0.35 |              0.65 |
| 8        |     0.23 |              0.40 |
| 9        |     0.12 |              0.25 |

```text
Template L[i] = target L[i]
Template C[i] = min(input C × chroma multiplier[i], chroma cap[i])
Template H[i] = input H
```

Chroma caps at 0–4 are **0.02, 0.04, 0.07, 0.12, 0.18**; later slots have no extra cap. Positions 0 and 1 keep L at least **0.96 and 0.91** before final RGB rounding. These rules reserve pale backgrounds rather than letting vivid yellow occupy the lightest slot.

Endpoints use the input hue, not fixed white and black. For inputs already near an endpoint, leave room beyond them. If readability requires it, retry endpoint targets `[0.985, 0.10]`, `[0.99, 0.08]`, and `[0.995, 0.06]` after the initial `[0.98, 0.12]`. Interior template targets stay fixed.

### 3. Find a place for the exact input

Measure OKLab color distance from the input to each displayed template shade. Try the closest compatible slot first. Compatibility includes the chroma caps and background lightness minimums; slot 9 also requires input L ≤ 0.15.

Call the chosen slot **k**. Set its final HEX to the exact input. There is no rule that every input must be 5. If the first position cannot provide a valid complete palette and states, try another compatible position.

### 4. Adjust nearby shades with a fading correction

The amount of correction at the anchor is:

```text
ΔL = input L − template L[k]
ΔC = input C − template C[k]
```

For each other shade, calculate progress **t** from the anchor (0) toward that side’s endpoint (1). Sample the template there, then apply:

```text
w = (1 − t)^p

Final L = sampled template L + w × ΔL
Final C = sampled template C + w × ΔC
Final H = input H
```

At the anchor, w is 1: the correction is applied in full. At an endpoint, w is 0: the endpoint stays put. Higher **p** makes the correction more local. We try p = **1, 2, 4**, limiting it where necessary to prevent a large anchor movement from reversing lightness order. Apply the chroma caps and background minimums afterward.

For a middle blue, this can be a small correction. For vivid yellow, preserving its very high L while reserving pale slots requires a much larger change. “Local correction” is a preference; it cannot always be a small adjustment.

### 5. Follow direction and adjacency preferences, then score the ramp

The preferred patterns are:

| Mode / input          | Hover             | Selected         | Adjacent positions around rest k |
| --------------------- | ----------------- | ---------------- | -------------------------------- |
| Light, input L > 0.30 | Darker            | Darker again     | k → k+1 → k+2                    |
| Light, input L ≤ 0.30 | Lighter           | Lighter again    | k → k−1 → k−2                    |
| Dark                  | Lighter than rest | Darker than rest | hover k−1, rest k, selected k+1  |

**Direction first, adjacency second, score third.** For the preferred pattern, try adjacent entries while adjusting density, locality, anchor position, and endpoints. Only after all supported adjacent configurations fail may the generator use a skipping result. Only after both adjacent and skipping options fail may it try a direction exception. In light mode, the exception reverses both states; in dark mode, it tries the light-mode pattern above, then its reverse.

The generator can pack more shades near rest on either side or both sides and recover toward the endpoints. For very dark inputs, it can also spread nearby shades to make states easier to see. This changes the positions sampled from the template; it does not create independent state colors.

For every completed candidate palette, measure:

- **Template deviation:** how far all ten shades moved from the starting template.
- **Spacing deviation:** how much the nine neighboring color differences changed from the template’s differences. Squaring these errors makes large jumps count more.
- **State error:** how far the two state steps are from their desired differences: normally **0.075**, with a stronger target near black. For the same direction, measure rest → hover → selected. For opposite directions, measure rest → hover and rest → selected separately.

```text
Score = template deviation + spacing deviation + 2 × state error
```

Lower is better. Reject invalid palettes and unreadable/overly weak/overly strong states first. Within the first anchor/endpoint group that supports adjacency, choose the best-scoring sampled settings. If no group supports adjacency, use the best skipping result from the first group that supports skipping. A better score cannot override direction or adjacency priority. This is a bounded deterministic search: an exception means the supported configurations did not pass, not proof that no imaginable ramp could work.

### 6. Check the colors a screen actually displays

If a shade falls outside sRGB, reduce chroma while holding L and H fixed. Round to six-digit HEX, then validate those final colors. Reject duplicate or reversed lightness steps and accidental pure-white/pure-black endpoints, unless the input itself is that endpoint. Rounding can shift hue slightly, especially near white and black.

Hover and selected must come from the final palette and follow their chosen directions in both perceptual lightness and luminance. Each measured state step normally needs OKLab distance **0.055–0.10**, and fill-to-fill contrast **1.08:1–1.50:1**. Near black, the target and upper allowance increase: a small RGB change can register a large OKLab distance while still looking subtle. This boost fades to zero when both shades have L ≥ 0.30. Text readability takes priority over hitting the target. These are design limits, not WCAG rules. In dark mode, hover → selected crosses rest, so that total change can be larger than either measured step.

A single label color must meet **4.5:1** on rest, hover, and selected. If a button fill does not reach **3:1** against its surrounding surface, supply a palette boundary that does. Accent text and subtle text also need 4.5:1. Labels normally come from a palette endpoint; an explicitly locked label is the exception. Incompatible constraints return an explanation without changing rest.

Readability can force an exception even away from black and white. For example, blue `#2D72D2` has little headroom for a lighter hover with its light label. In dark mode this implementation falls back to darker states and displays an explanation. Preserving one readable label, the exact rest, and the state-distance limits can conflict with the preferred direction.

These checks cover the demonstrated pairings, not every accessibility requirement of a complete theme.

## Examples from this implementation

| Input            | Rest slot | Hover         | Selected      | State differences |
| ---------------- | --------: | ------------- | ------------- | ----------------- |
| Blue `#2D72D2`   |         5 | `#225FB3` (6) | `#184B91` (7) | 0.069 / 0.076     |
| Yellow `#FFFF00` |         5 | `#E5E500` (6) | `#CCCC00` (7) | 0.077 / 0.076     |
| Indigo `#7961DB` |         5 | `#644EB9` (6) | `#4E3C94` (7) | 0.076 / 0.082     |
| White `#FFFFFF`  |         0 | `#EBEBEB` (1) | `#D1D1D1` (2) | 0.060 / 0.079     |
| Black `#000000`  |         9 | `#242424` (8) | `#404040` (7) | 0.260 / 0.111     |

The table uses light mode and measures rest → hover → selected. For dark-mode gray `#222222` at 8, hover is `#3D3D3D` at 7 and selected is `#060606` at 9. Both are adjacent to rest; their distances from rest are 0.108 and 0.130, using the near-black allowance. Pure black and white require direction exceptions in dark mode.

Black has C = 0, so its ramp varies only in lightness. Its stronger adjacent states give fill contrasts of **1.35:1** and **1.50:1**, compared with **1.12:1** and **1.29:1** before this adjustment. A locked label color may require subtler states to remain readable.

The blue template starts almost exactly at the input. Positions 1–4 remain unchanged after fitting; the dark side adjusts for interaction spacing and the endpoints extend slightly for readable text.

Yellow needs a larger change. Its final ramp is:

```text
0 #FAFBEC   1 #F9FBDE   2 #F9FBC7   3 #FAFD9F   4 #FCFE69
5 #FFFF00   6 #E5E500   7 #CCCC00   8 #585800   9 #060600
```

Its largest neighboring gap is about **0.38**, reduced from about **0.67** in the preceding local implementation. Gaps still remain large near the dark end: ten shades must cover pale backgrounds, the exact bright input, two gentle states, and dark text. The score discourages these gaps; it does not guarantee equal spacing.

Greg’s preserved blue example measures 0.076 / 0.072; Ryan’s documented final orange rest → hover measures 0.091. These informed the state target, rather than supplying the new formula. References: _Proposal: Extended BP6 Color Palette_, p. 6; _Color Palette: Generation recipe_, pp. 4, 7–11. Ryan’s source orange ramp differs from his final generated ramp. This prototype does not implement his CIECAM02 dark-mode transformation.

## What you can tune as a designer

All settings are together in `consumerColorPolicy` in [generateConsumerColors.ts](./generateConsumerColors.ts).

| Design question                                      | Setting                                            | Starting value                                                                                            |
| ---------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| How light should each starting position be?          | `templateLightness`                                | The ten L values above                                                                                    |
| Where should color strength peak and fade?           | `templateChroma`                                   | The ten multipliers above                                                                                 |
| How pale should background shades stay?              | `lightChromaLimits`, `backgroundLightnessMinimums` | Caps and minimums above                                                                                   |
| How strongly should we preserve the template?        | `scoreWeights.template`                            | 1                                                                                                         |
| How strongly should we discourage uneven changes?    | `scoreWeights.spacing`                             | 1                                                                                                         |
| How much priority should familiar state changes get? | `scoreWeights.states`                              | 2                                                                                                         |
| How strong should each state change feel?            | `stateDistance.target`                             | 0.075; try 0.065 for softer or 0.085 for stronger                                                         |
| How much stronger should near-black states feel?     | `stateDistance.darkTargetBoost`                    | Up to 0.20 extra distance; fades out by L = 0.30                                                          |
| When should light-mode states start getting lighter? | `veryDarkLightness`                                | Input L ≤ 0.30                                                                                            |
| How close to the input should adjustments stay?      | `anchorLocalities`                                 | Try 1, 2, 4; higher is more local                                                                         |
| How far should the dense region extend?              | `densityReach`                                     | 0.6 of the distance toward an endpoint                                                                    |
| How much can shade positions move?                   | `paletteSpacingBiases`                             | Add 0.75 and 0.875 for very dark inputs; otherwise 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 6, 8, 12, 16, 24, 32 |

Start with the template table, then state strength, then scoring weights. Change one setting at a time and inspect the template, full ramp, button states, and checks across ordinary and extreme inputs. Tightening constraints can make some inputs infeasible. Keep readability requirements separate from aesthetic tuning.

## Exact equations for implementation

Let T be the working template in OKLCH, k the anchor index, and e the endpoint index on the current side. Let T⁰ be the starting template before endpoint retries. All distances and scores below use final eight-bit sRGB colors converted to OKLab.

**Endpoint headroom.** On retry j = 0, 1, 2, 3, let r = 0.5 − 0.15j. Use qLight = r when input L > 0.98, otherwise 0.5; qDark = r when input L < 0.12, otherwise 0.5. Then:

```text
T[0].L = max(light target[j], 1 − (1 − input L) × qLight)
T[9].L = min(dark target[j], input L × qDark)
```

**Template sampling and density.** Use b = 1 on the unchanged side; try the listed biases on the candidate interaction side. For opposite-direction states, try both sides, then each side separately. Values below 1 are available only when input L ≤ 0.30. Use R = 0 for those expansion candidates, otherwise R = densityReach:

```text
u = (T[i].L − T[k].L) / (T[e].L − T[k].L)
q = max(0, (u − R) / (1 − R))
smoothstep(q) = q² × (3 − 2q)
t = u / b + (1 − 1/b) × smoothstep(q)

SampleL = T[k].L + (T[e].L − T[k].L) × t
SampleC = piecewise-linear interpolation of template C at SampleL
```

u and q stay within 0–1. When b = 1, t = u: original template positions. With a larger b, the inner region is denser and the outer region recovers toward the endpoint. Below 1, near-anchor shades spread apart; immediate recovery keeps the following steps from becoming too large.

**Anchor correction.** Let extent = T[e].L − T[k].L and ΔL = input L − T[k].L. If extent × ΔL > 0, use pEffective = min(p, |extent / ΔL|); otherwise use p. This bounds the correction’s slope to keep the continuous lightness curve monotonic.

```text
w = (1 − t)^pEffective
L[i] = max(background minimum[i], SampleL + w × ΔL)
C[i] = clamp(SampleC + w × (input C − T[k].C), 0, chroma cap[i])
H[i] = input H
P[k] = exact input HEX
```

Map each other shade into sRGB. Quantization and background floors can still affect ordering, so check the final palette too.

**Near-black target.** For each measured step, let Lmin be the lower of its two displayed OKLab lightness values:

```text
cutoff = exp(−0.30 / 0.12)
influence = max(0, (exp(−Lmin / 0.12) − cutoff) / (1 − cutoff))
target(first, second) = 0.075 + 0.20 × influence
```

The target is 0.275 when a step touches black, returning continuously to 0.075 by Lmin = 0.30. This is a design target, not a guaranteed output or a WCAG threshold.

**Whole-ramp score.** Let d be Euclidean OKLab distance and gap[i] = d(P[i−1], P[i]):

```text
Etemplate = sqrt(mean over 10 shades of d(P[i], T⁰[i])²)
Espacing  = sqrt(mean over 9 gaps of (gap[i] − templateGap[i])²)
Estate    = |d(rest, hover) − target(rest, hover)|
          + |d(hover, selected) − target(hover, selected)|

Score = 1 × Etemplate + 1 × Espacing + 2 × Estate
```

For opposite-direction states, use rest rather than hover in both the selected distance and its target. Apply this score only after the direction and adjacency priorities above.

The state-distance ceiling is the larger of `0.10 + 0.12 × exp(−Lmin / 0.12)` and `target(first, second) + 0.025`; other state/contrast constraints remain mandatory. The implementation regenerates complete palettes and selects states from their entries. It never generates an off-palette hover or selected color.
