---
tag: new
---

@# Flex

**Flex** is a specialized layout component that wraps **Box** with `display="flex"` pre-applied. It simplifies flexbox layouts by providing convenient access to flexbox properties through props.

@## Import

```tsx
import { Flex } from "@blueprintjs/labs";
```

@## Usage

Use **Flex** to create flexbox layouts with alignment, direction, and spacing props. Flex automatically sets `display: flex`, so you can focus on layout properties.

@## Flexbox props

Flex supports all Box props except `display`, with common flexbox patterns:

-   **Direction & Wrap**: `flexDirection`, `flexWrap`
-   **Alignment**: `alignItems`, `alignContent`, `justifyContent`
-   **Gap**: `gap` for spacing between items
-   **Child control**: `flex` for flex grow/shrink behavior

Each prop accepts Blueprint token values for consistent spacing and sizing.

@## Examples

@### Direction

Control the main axis and direction of how flex items are placed with the `flexDirection` property.

@reactCodeExample FlexDirectionExample

@### Alignment

Align flex items along the cross axis with `alignItems` and distribute them along the main axis with `justifyContent`.

@reactCodeExample FlexAlignExample

@### Gap

Add even spacing between flex items using the `gap` prop.

@reactCodeExample FlexGapExample

@## Props interface

@interface FlexProps
