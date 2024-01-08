@# Overlay

__Overlay__ is a generic low-level component for rendering content _on top of_ its siblings or above the entire
application.

It combines the functionality of the [__Portal__](#core/components/portal) component (which allows React elements to
escape their current DOM hierarchy) with a [__CSSTransitionGroup__](https://reactcommunity.org/react-transition-group/)
(to show elegant enter and leave transitions).

An optional "backdrop" element can be rendered behind the overlaid children to provide modal behavior, whereby the
overlay prevents interaction with anything behind it.

__Overlay__ is the backbone of all the components listed in the **Overlays** group in the sidebar. Using __Overlay__
directly should be rare in your application; it should only be necessary if no existing component meets your needs.

@reactExample OverlayExample

@## Usage

__Overlay__ is a controlled component that renders its children only when `isOpen={true}`. The optional backdrop element
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

Note that the [__Dialog__](https://blueprintjs.com/docs/#core/components/dialog) component applies this CSS class
automatically.

@## Props interface

@interface OverlayProps
