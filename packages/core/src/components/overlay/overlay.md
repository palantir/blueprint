---
tag: deprecated
---

@# Overlay

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated: use [**Overlay2**](#core/components/overlay2)

</h5>

This component is **deprecated since @blueprintjs/core v5.9.0** in favor of the new
**Overlay2** component which is compatible with React 18 strict mode. You should migrate to the
new API which will become the standard in a future major version of Blueprint.

</div>

**Overlay** is a generic low-level component for rendering content _on top of_ its siblings or above the entire
application.

It combines the functionality of the [**Portal**](#core/components/portal) component (which allows React elements to
escape their current DOM hierarchy) with a [**CSSTransitionGroup**](https://reactcommunity.org/react-transition-group/)
(to show elegant enter and leave transitions).

An optional "backdrop" element can be rendered behind the overlaid children to provide modal behavior, whereby the
overlay prevents interaction with anything behind it.

**Overlay** is the backbone of all the components listed in the **Overlays** group in the sidebar. Using **Overlay**
directly should be rare in your application; it should only be necessary if no existing component meets your needs.

@reactExample OverlayExample

@## Usage

**Overlay** is a controlled component that renders its children only when `isOpen={true}`. The optional backdrop element
will be inserted before the children if `hasBackdrop={true}`.

The `onClose` callback prop is invoked when user interaction causes the overlay to close, but your application is
responsible for updating the state that actually closes the overlay.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">A note about overlay content positioning</h5>

When rendered inline, content will automatically be set to `position: absolute` to respect
document flow. Otherwise, content will be set to `position: fixed` to cover the entire viewport.

</div>

```tsx
<div>
    <Button text="Show overlay" onClick={this.toggleOverlay} />
    <Overlay isOpen={this.state.isOpen} onClose={this.toggleOverlay}>
        Overlaid contents...
    </Overlay>
</div>
```

@## Scrolling interactions

Overlays rely on fixed and absolute CSS positioning. By default, an overlay larger than the viewport will not be
scrollable, so any overflowing content will be hidden. Fortunately, making an overlay scrollable is very easy: pass
`Classes.OVERLAY_SCROLL_CONTAINER` in the Overlay `className` prop, and the component will take care of the rest.

```tsx
<Overlay className={Classes.OVERLAY_SCROLL_CONTAINER} />
```

Note that the [**Dialog**](https://blueprintjs.com/docs/#core/components/dialog) component applies this CSS class
automatically.

@## Props interface

@interface OverlayProps
