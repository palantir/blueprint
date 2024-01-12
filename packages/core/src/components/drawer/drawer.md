@# Drawer

**Drawers** overlay content over existing parts of the UI and are anchored to the edge of the screen. It is built using
the lower-level [**Overlay**](#core/components/overlay) component.

@reactExample DrawerExample

@## Usage

`<Drawer>` is a stateless React component controlled by its `isOpen` prop.

Use the `size` prop to set the size of a **Drawer**. This prop sets CSS `width` if `vertical={false}` (default)
and `height` otherwise. Constants are available for common sizes:

-   `DrawerSize.SMALL = 360px`
-   `DrawerSize.STANDARD = 50%` (default)
-   `DrawerSize.LARGE = 90%`

@## Props interface

@interface DrawerProps
