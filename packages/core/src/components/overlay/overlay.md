@# Overlay

`Overlay` is a generic low-level component for rendering content _on top of_ its
siblings, or above the entire application.

It combines a [`Portal`](#core/components/portal), which allows JSX children to
be rendered at a different place in the DOM tree, with a
[`CSSTransition`](https://reactcommunity.org/react-transition-group/) to support
elegant enter and leave transitions.

An optional "backdrop" element can be rendered behind the overlaid children to
provide modal behavior, whereby the overlay prevents interaction with anything
behind it.

`Overlay` is the backbone of all the components listed in the **Overlays** group
in the sidebar. Using `Overlay` directly should be rare in your app; it should
only be necessary if no existing component meets your needs.

@reactExample OverlayExample

@## Scroll support

Overlays rely heavily on fixed and absolute positioning. By default, an overlay
larger than the viewport will not be scrollable, so any overflowing content will
be hidden. Fortunately, making an overlay scrollable is very easy: simply pass
`Classes.OVERLAY_SCROLL_CONTAINER` as the Overlay `className`, and we'll take
care of the rest.

```tsx
<Overlay className={Classes.OVERLAY_SCROLL_CONTAINER} ... />
```

The `Dialog` component applies this CSS class automatically.

@## Props

`Overlay` is a controlled component that renders its children only when
`isOpen={true}`. The optional backdrop element will be inserted before the
children if `hasBackdrop={true}`.

The `onClose` callback prop is invoked when user interaction causes the overlay
to close, but your application is responsible for updating the state that
actually closes the overlay.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">A note about overlay content positioning</h4>

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

@interface IOverlayProps
