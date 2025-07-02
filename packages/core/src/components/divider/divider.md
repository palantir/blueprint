@# Divider

**Divider** visually separate contents with a thin line and margin on all sides.
It works best in flex layouts where they will adapt to orientation without
additional styles. Otherwise, a **Divider** will appear as a full-width 1px-high block element.

@## Import

```tsx
import { Divider } from "@blueprintjs/core";
```

@## Usage

Use **Divider** to separate blocks of content within a page or container. By default, it spans the full width of its container.

@reactCodeExample DividerBasicExample

@## Minimal

The `minimal` prop removes the margin from the divider, making it flush with adjacent content.

```tsx
<Divider minimal />
```

@## Vertical

When used inside a flex container, **Divider** adapts to the layout's direction. It becomes a vertical divider when placed between flex items.

@reactCodeExample DividerVerticalExample

@## Interactive Playground

@reactExample DividerPlaygroundExample

@## Props interface

@interface DividerProps
