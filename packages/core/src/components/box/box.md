@# Box

**Box** is a primitive, low-level layout component that exposes a subset of the CSS box-model and flexbox APIs as props. It enables layout composition using Blueprint's spacing and sizing tokens.

@## Import

```tsx
import { Box } from "@blueprintjs/core";
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

@## Props interface

@interface BoxProps
