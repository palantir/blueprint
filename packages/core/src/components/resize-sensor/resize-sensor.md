@# Resize sensor

__ResizeSensor__ observes the DOM and provides a callback for `"resize"` events on a single child element.
It is a thin wrapper around [`ResizeObserver`][resizeobserver] to provide React bindings.

[resizeobserver]: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">DOM ref required</h5>

ResizeSensor's implementation relies on a React ref being attached to a DOM element,
so the child of this component _must be a native DOM element_ or utilize
[`React.forwardRef()`](https://reactjs.org/docs/forwarding-refs.html) to forward any
injected ref to the underlying DOM element.

</div>

@## Usage

```tsx
import { ResizeEntry, ResizeSensor } from "@blueprintjs/core";

function handleResize(entries: ResizeEntry[]) {
    console.log(entries.map(e => `${e.contentRect.width} x ${e.contentRect.height}`));
}

<ResizeSensor onResize={handleResize}>
    <div style={{ width: this.props.width }} />
</ResizeSensor>
```

If you attach a `ref` to the child yourself, you must pass the same value to `ResizeSensor`
with the `targetRef` prop (otherwise, the component won't be able to attach one itself).

```tsx
const myRef = React.createRef();

<ResizeSensor targetRef={myRef} onResize={handleResize}>
    <div ref={myRef} style={{ width: this.props.width }} />
</ResizeSensor>
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">Asynchronous behavior</h5>

The `onResize` callback is invoked asynchronously after a resize is detected
and typically happens at the end of a frame (after layout, before paint).
Therefore, testing behavior that relies on this component involves setting a
timeout for the next frame.

</div>

@## Props interface

@interface ResizeSensorProps
