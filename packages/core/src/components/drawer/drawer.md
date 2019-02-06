---
tag: new
---

@# Drawer

Drawers overlay content over existing parts of the UI and are anchored to the edge of the screen.

@reactExample DrawerExample

@## Props

`Drawer` is a stateless React component controlled by the `isOpen` prop.

Use the `size` prop to set the size of the `Drawer`. This prop sets CSS `width` if `vertical={false}` (default) and `height` otherwise. Constants are available for common sizes:

- `Drawer.SIZE_SMALL = 360px`
- `Drawer.SIZE_STANDARD = 50%` (default)
- `Drawer.SIZE_LARGE = 90%`

@interface IDrawerProps
