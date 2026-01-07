---
tag: new
---

@# Box

**Box** is a generic layout component that exposes a subset of the [CSS box-model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model) and [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout) APIs as props. It enables layout composition using Blueprint's spacing and sizing design tokens.

@## Import

```tsx
import { Box } from "@blueprintjs/labs";
```

@## Usage

Use **Box** to compose layouts with spacing, alignment, and sizing props.

@reactCodeExample BoxBasicExample

@## Composition with asChild

When `asChild` is set, `<Box>` will not render an extra wrapper element. Instead it clones and enhances its single child, merging class names and props.
This is useful for applying layout to existing components without adding an extra DOM node.

@reactCodeExample BoxAsChildExample

@## Layout props

Box supports a wide range of layout props that map to CSS properties:

-   **Spacing**: `margin`, `padding` and their logical variants
-   **Positioning**: `position`, `inset` and their logical variants
-   **Sizing**: `width`, `height`
-   **Flexbox**: `display`, `flex`, `flexDirection`, `flexWrap`, `gap`
-   **Alignment**: `alignItems`, `alignContent`, `alignSelf`, `justifyContent`, `justifyItems`, `justifySelf`
-   **Overflow**: `overflow`, `overflowX`, `overflowY`

Each prop accepts Blueprint token values to enforce consistent spacing and sizing.

@## Examples

@### Padding

@reactExample BoxPaddingExample

@### Margin

@reactExample BoxMarginExample

@### Object Card

A practical example demonstrating how to compose a card layout using Box with multiple layout props working together.

@reactExample BoxObjectCardExample

@## Props interface

@interface BoxProps
