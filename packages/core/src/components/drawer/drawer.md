@# Drawer

**Drawers** overlay content over existing parts of the UI and are anchored to the edge of the screen.
It is built using the lower-level [**Overlay2**](#core/components/overlay2) component.

@reactExample DrawerExample

@## Usage

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

[OverlaysProvider](#core/context/overlays-provider) recommended

</h5>

This component renders an **Overlay2** which works best inside a React tree which includes an
**OverlaysProvider**. Blueprint v5.x includes a backwards-compatibile shim which allows this context
to be optional, but it will be required in a future major version. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/Overlay2-migration) on the wiki.

</div>

`<Drawer>` is a stateless React component controlled by its `isOpen` prop.

Use the `size` prop to set the size of a **Drawer**. This prop sets CSS `width` if `vertical={false}` (default)
and `height` otherwise. Constants are available for common sizes:

-   `DrawerSize.SMALL = 360px`
-   `DrawerSize.STANDARD = 50%` (default)
-   `DrawerSize.LARGE = 90%`

@## Props interface

@interface DrawerProps
