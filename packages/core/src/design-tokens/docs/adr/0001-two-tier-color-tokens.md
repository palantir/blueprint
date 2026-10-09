# Two-tier color tokens: scales, then roles

Color tokens have exactly two tiers: hue scales (e.g. orange 1–13, gray-alpha) and roles (e.g. `warning.solid.rest`, `surface.app`). Components consume roles only, and each color role points at exactly one scale step, with no `color-mix` or relative-color derivation in roles or components. We chose this so that every component color is a designed value with a named purpose, which is what removes the per-component hand-tuned colors and the components' dark-theme blocks (dark is handled entirely by theme overrides of the scales).

## Considered Options

- **Three tiers (hue scale → intent scale → role)**. Rejected to keep a single indirection; the cost is that retargeting an Intent (e.g. primary → indigo) means overriding each of its roles rather than repointing one alias scale.
- **Components consume scale steps directly** (`var(--bp-scale-blue-9)`). Rejected because shadows, focus and surfaces must be roles anyway, and roles guarantee that every component uses the same step for the same purpose.
- **Roles derived with `color-mix`** (e.g. disabled = solid at 50%). Rejected because the result is an undesigned color that is on no scale and can wash out on a generated scale. Exceptions are decided case by case, e.g. a user-supplied opacity.

## Consequences

- Disabled states use dedicated Neutral roles (background, text, border) rather than opacity or derived colors; see "Decision: disabled" in CONTEXT.md.
- Where an existing component color cannot be expressed with a single step, the component snaps to the nearest role and the difference is recorded as a visual change.
- Exceptions: when a migrated component's visual change is unacceptable, it may point at a different existing role; only if none works may it use a local value. Every exception is recorded under "Known issues: backgrounds" in CONTEXT.md.

## Amendment (2026-10-09, unreviewed)

Intent roles point at alias scales (`scale.primary`, `scale.success`, `scale.warning`, `scale.danger`, defaulting to blue, green, orange and red) rather than at the hues directly. This is the one sanctioned middle layer, kept because a generated Intent color must replace a whole scale at once (Storybook's Theme panel overrides only `--bp-scale-{intent}-*`). The aliases carry no state or role meaning; Neutral has none and points at gray.
