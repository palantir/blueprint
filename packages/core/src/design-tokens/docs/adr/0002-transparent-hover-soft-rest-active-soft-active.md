---
status: accepted
---

# Transparent variant uses Soft rest on hover and Soft active when pressed

Soft has three background roles per Intent (`soft-rest`, `soft-hover`, `soft-active`), taken from the values Tag `minimal`, Callout and Menu item already share (light 10% / 20% / 30%, dark 20% / 30% / 35% of the Intent's step-3 color). The Transparent variant (Button `minimal`/`outlined`, ButtonGroup, HTMLSelect, Menu item, Tree, DatePicker day, HTMLTable row, Breadcrumbs) has no background at rest, uses `soft-rest` on hover and `soft-active` when pressed. A transparent element's hover reuses the soft rest step (3) and its pressed state the soft active step (5), so it needs no extra roles and keeps Button `minimal` within ΔE 2.3 of today.

## Considered Options

- **Hover = `soft-rest`, active = `soft-hover`**. Rejected: Button `minimal` light active would change by ΔE ≈ 4.7.
- **Dedicated hover/active roles** set to Button `minimal`'s current values. Rejected: two extra roles per Intent and two extra alpha steps per hue, for a Button change that is barely noticeable.
- **Base color plus one overlay** (#8236). Rejected: leaves solid steps 10/11 unused, cannot serve Soft and Transparent with one overlay, and loses state feedback in forced-colors mode.
- **Each component picks whichever existing role matches its old color.** Rejected: "hover" would stop meaning one role.
- **Same state, same role** (hover = `soft-hover`). Rejected: darkens Button `minimal` in both themes.

## Consequences

Visual changes are listed under "Known issues: backgrounds" in CONTEXT.md. ΔE is OKLab ×100; about 2 is the threshold of a noticeable difference.
