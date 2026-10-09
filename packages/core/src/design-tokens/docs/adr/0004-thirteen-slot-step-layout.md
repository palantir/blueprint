---
status: proposed
---

# Every hue has an opaque and an alpha scale with the same 13 slot meanings

Each hue (gray, blue, green, orange, red) gets an opaque scale and an alpha scale. Both have 13 slots, and a slot means the same thing in every hue and theme: 1 page background, 2 container background, 3/4/5 soft rest/hover/active, 6/7/8 border subtle/default/strong, 9/10/11 solid rest/hover/active, 12 low-contrast text, 13 high-contrast text. Roles point at one slot of one scale (ADR 0001). The Solid text color, Indicator color and Focus color are named per-scale values outside the slots. Until the generator exists, slots hold today's Blueprint values, and slots unused by the nine experiment components stay empty.

This is a best bet made on 2026-10-08 toward the goal of a predictable system, and it needs review. A consumer who knows the slot meanings can predict any role in any hue or theme without reading component code.

## Considered Options

- **12 slots** (text at 11/12). Rejected: Blueprint needs a third solid state (active, slot 11), which pushes text to 12/13.
- **Opaque scale only.** Rejected: today's soft backgrounds, neutral borders and disabled text are translucent, and making them opaque changes them over every surface.
- **Slots ordered by lightness instead of meaning.** Rejected: Blueprint's light Content (white) is lighter than its Base (light-gray5), so lightness order would swap the layer slots between themes.

## Consequences

- Built from today's values, the scale repeats itself (H1), the opaque and alpha values of a slot don't match (H14), and light step 2 is lighter than step 1 (H16). The generator was meant to remove all three; with references built from today's values it keeps H1 for default seeds (H17).
- Disabled text takes gray-alpha slot 12 (H9).
- Dark values for green, red and orange text slots follow blue's pattern and are checked by the contrast test, not one by one.
