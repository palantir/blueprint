@# Drawer

Drawers overlay content over existing parts of the UI and are anchored to the edge of the screen.

@reactExample DrawerExample

@## Props

`Drawer` is a stateless React component controlled by the `isOpen` prop.

Use the `size` prop to set the size of the `Drawer`. This prop sets CSS `width` if `vertical={false}` (default) and `height` otherwise. Constants are available for common sizes:

- `DrawerSize.SMALL = 360px`
- `DrawerSize.STANDARD = 50%` (default)
- `DrawerSize.LARGE = 90%`

@interface IDrawerProps
