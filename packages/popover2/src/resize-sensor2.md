@# ResizeSensor2

`ResizeSensor2` is a component that provides a `"resize"` event for its single
DOM element child. It is a thin wrapper around
[`ResizeObserver`][resizeobserver] to provide React bindings.

Compared to [`ResizeSensor`](#core/components/resize-sensor), this component features some __small breaking changes__:

- The child of `<ResizeSensor2>` can only be a single DOM element or React component.
- The child (target) of `<ResizeSensor2>` _must be a native DOM element_ or utilize [`React.forwardRef()`](forwardRef) to forward any injected ref to the underlying DOM element.
  - In addition, if you attach a `ref` to the child yourself, you must pass the same value to `<ResizeSensor2>`
with the `targetRef` prop (otherwise, the component won't be able to attach one itself).

[resizeobserver]: https://developers.google.com/web/updates/2016/10/resizeobserver
[forwardRef]: https://reactjs.org/docs/forwarding-refs.html

```tsx
import { ResizeEntry, ResizeSensor2 } from "@blueprintjs/core";

function handleResize(entries: ResizeEntry[]) {
    console.log(entries.map(e => `${e.contentRect.width} x ${e.contentRect.height}`));
}

<ResizeSensor2 onResize={handleResize}>
    <div style={{ width: this.props.width }} />
</ResizeSensor2>
```

@## Props

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Asynchronous behavior</h4>

The `onResize` callback is invoked asynchronously after a resize is detected
and typically happens at the end of a frame (after layout, before paint).
Therefore, testing behavior that relies on this component involves setting a
timeout for the next frame.

</div>

@interface ResizeSensor2Props
