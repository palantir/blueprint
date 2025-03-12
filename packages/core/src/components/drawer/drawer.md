@# Drawer

**Drawers** overlay content over existing parts of the UI and are anchored to the edge of the screen.
It is built using the lower-level [**Overlay**](#core/components/overlay) component.

@reactExample DrawerExample

@## Usage

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Context provider required

</h5>

This component renders an **Overlay** which must be rendered inside a React tree which
contains a **[BlueprintProvider](#core/context/blueprint-provider)** or an
**[OverlaysProvider](#core/context/overlays-provider)**.

</div>

`<Drawer>` is a stateless React component controlled by its `isOpen` prop.

Use the `size` prop to set the size of a **Drawer**. This prop sets CSS `width` if `vertical={false}` (default)
and `height` otherwise. Constants are available for common sizes:

-   `DrawerSize.SMALL = 360px`
-   `DrawerSize.STANDARD = 50%` (default)
-   `DrawerSize.LARGE = 90%`

@## Props interface

@interface DrawerProps
