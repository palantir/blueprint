# Blueprint Color System

The language of Blueprint's experimental color system.

## Language

**Color family**:
A named collection of related colors, such as blue, orange, or grey, independent of the meaning assigned to them in an interface.
_Avoid_: Intent

**Functional color scale**:
A color family's ordered set of roles for backgrounds, interaction states, borders, and foregrounds. Its purpose is consistent usage, not preserving every existing component color.
_Avoid_: Lightness ramp

**Intent**:
A semantic purpose, such as primary, success, warning, or danger, that can be assigned a color family without changing its meaning.
_Avoid_: Color family

**Semantic color token**:
A named interface role whose color is supplied by the color system rather than chosen directly by an individual component.
_Avoid_: Palette swatch

**Alpha scale**:
A sequence of translucent colors sharing a base color, used for overlays such as borders. Blueprint's black and white alpha scales are distinct from its functional color-family scales.

**Intent family assignment**:
The choice of an existing color family to supply an intent's semantic roles together, rather than overriding one isolated color.

**Scoped theme**:
A region whose intent family assignments may differ from its surroundings. Assignments that the region does not override are inherited from the surrounding theme.

**Color variant**:
A coordinated color treatment combining foreground, background, border, and interaction-state colors, independent of intent. Blueprint keeps its existing variant names and adds surface for the low-emphasis treatment; Mantine's variant names describe conversion targets, not Blueprint API renames.

**Surface variant**:
The low-emphasis treatment corresponding to Mantine's light variant, including the neutral treatment of Blueprint's default Button. Surface does not require transparency or absence of borders and shadows, and is distinct from minimal, which corresponds to Mantine's subtle variant.

**Theme conversion**:
Expressing a Blueprint theme's families and color variants in another design system's theme model, with Mantine as the concrete portability target. This does not mean reproducing the other system's component structure or geometry.
