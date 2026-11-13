# Blueprint color theming

Vocabulary for Blueprint's color-token generation and customization.

## Language

**Family palette**:
A set of related color values derived from a family's chosen color, before those values are assigned to Blueprint roles.

**Color role**:
The intended use of a color, such as a solid fill, text on that fill, ordinary text, a border, or a surface. A role can have
different values across interaction states and light/dark appearances without changing its meaning.

**Intent color**:
The chosen color for one of five theme roles: neutral, primary, success, warning, or danger. Neutral is the default,
no-intent role.

**Neutral family**:
Blueprint's default-intent and default-text colors, distinct from its primary, success, warning, and danger treatments.

**Intent foreground**:
The text and icon color used on an intent's solid-colored fills, not the application's general text color. Primary
foreground is the foreground for the primary intent.
_Avoid_: Foreground without a qualifier

**Automatic intent foreground**:
An intent foreground chosen as Blueprint black or white when no explicit foreground is supplied. It does not signify
validated contrast.

**Generated theme**:
The paired light and dark token customizations derived from chosen family colors and their optional intent foregrounds.
Uncustomized families retain Blueprint defaults.
