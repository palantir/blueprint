# Orange palette proposal

Try **`#B45B00` as orange 500**. The goal is to make warning feel less red, especially in the darker shades, while staying close to the other 500 colors and keeping white text at rest.

It has OKLCH lightness **56.8**, chroma **0.141**, hue **54.5°**, and **4.73:1** contrast with white. Ryan's orange 500 is `#BD5200`, at lightness 56.7 and hue 47.2°. The proposed hue is more yellow with almost the same lightness.

## Try it

Download [index.html](index.html) and open it in a current Chrome, Edge, Safari, or Firefox. No Blueprint build is needed. An internet connection loads the preview icons; the palette calculations run locally. Use **Starting color → Proposed orange** to return to `#B45B00` after experimenting.

- Compare BP6 orange, the proposed orange, Ryan's orange, and red across the full ramp and shared component previews.
- Open **All colors** to compare lightness steps, dark-end hue shift, and light tint strength.
- Open **Preview** to change the surface or reference palette; use **Contrast checks** to inspect the displayed color pairs.
- Save candidates and use Ctrl/Cmd+Z to undo. The standalone file remembers edits in browser storage when available.

## Starting recipe

1. Preserve `#B45B00` exactly at 500.
2. Use **9 OKLCH lightness points** around the anchor, capped by available range. Extend the ramp to lightness 94 at 100 and 12 at 1000.
3. Keep orange's hue direction through the ramp: **0° intentional dark-end hue shift**. Target **28% of the anchor's chroma at 100**, with more chroma near the middle and less at the ends.
4. Reduce chroma when a color does not fit sRGB, then round to hex. Displayed measurements can differ from the requested settings, especially near black.
5. Choose states from the ramp and check their actual foreground/background contrast.

| Preview surface | Rest            | Hover           | Selected        |
| --------------- | --------------- | --------------- | --------------- |
| Light           | 500 · `#B45B00` | 600 · `#8E4700` | 700 · `#6A3300` |
| Dark            | 500 · `#B45B00` | 400 · `#C97C44` | 600 · `#8E4700` |

## Review focus

Does warning stay distinct from danger at 500, 600, and 700? Does its brightness and color strength feel consistent with the other intents? Are the light tints useful as backgrounds?

White text passes 4.5:1 on the proposed light-mode rest, hover, and selected fills. The current dark-mode hover at 400 gives **3.26:1 with white**, so that pairing still needs a different foreground or state choice. The demo exposes this result rather than treating the entire palette as approved. Similar OKLCH lightness does not guarantee identical contrast across hues.

This is a palette proposal and shared HTML component study. It does not change Blueprint's shipped tokens or reproduce its exact component CSS. The other families stay fixed by default; “Regenerate from orange” is an optional experiment. The recipe preserves hue by reducing chroma and does not reproduce Ryan's full generator or dark-mode compensation.

Fixed BP6 and Blueprint Next colors come from [develop at 75a8495](https://github.com/palantir/blueprint/tree/75a8495a8c5654cc5bf6c93c08dc1778cb5a0098); the separate Ryan orange comparison uses the published light/dark checkpoints in _Color Palette: Generation recipe_. BP6 keeps its original numbering; the proposed ramp uses 100–1000.

[source.html](source.html) contains the editable prototype; `index.html` is its standalone review export, including the display and persistence wrapper. Checked in light/dark modes and at desktop/mobile sizes, including presets, undo/redo, saved candidates, reference palettes, and contrast readouts.
