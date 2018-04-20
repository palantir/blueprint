@# Overlays

`Overlay` is a generic low-level component for rendering content _above_ its siblings, or above the
entire application.

It combines a [`Portal`](#core/components/portal), which allows the JSX children to be rendered at a
different place in the DOM tree, with a
[`CSSTransition`](https://reactcommunity.org/react-transition-group/) to support elegant
enter and leave transitions.

An optional "backdrop" element can be rendered behind the overlaid children to provide modal
behavior, whereby the overlay prevents interaction with anything behind it.

`Overlay` is the backbone of the [`Dialog`](#core/components/dialog) component. In most use cases, the
`Dialog` component should be sufficient; only use `Overlay` directly if an existing component _truly
does not_ meet your needs.

@reactExample OverlayExample

@## JavaScript API

The `Overlay` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

`Overlay` is a controlled component that renders its children only when `isOpen={true}`. The
optional backdrop element will be inserted before the children if `hasBackdrop={true}`.

The `onClose` callback prop is invoked when user interaction causes the overlay to close,
but your application is responsible for updating the state that actually closes the overlay.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-callout-title">A note about overlay content positioning</h4>
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

@## Scrollable overlays

Overlays rely heavily on fixed and absolute positioning. By default, a large overlay will not cause
the page to scroll, and any overflowing content will be hidden. Fortunately, Blueprint makes
scrolling support very easy: simply pass `"@ns-overlay-scroll-container"` as the Overlay `className`,
and we'll take care of the rest.

```tsx
<Overlay className="@ns-overlay-scroll-container" ... />
```

The `Dialog` component applies this CSS class automatically.
