@# Resize sensor

`ResizeSensor` is a component that provides a `"resize"` event for its single
DOM element child. It is a thin wrapper around
[`ResizeObserver`][resizeobserver] to provide React bindings.

[resizeobserver]: https://developers.google.com/web/updates/2016/10/resizeobserver

```tsx
import { IResizeEntry, ResizeSensor } from "@blueprintjs/core";

function handleResize(entries: IResizeEntry[]) {
    console.log(entries.map(e => `${e.contentRect.width} x ${e.contentRect.height}`));
}

<ResizeSensor onResize={handleResize}>
    <div style={{ width: this.props.width }} />
</ResizeSensor>
```

@## Props

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">Asynchronous behavior</h4>

The `onResize` callback is invoked asynchronously after a resize is detected
and typically happens at the end of a frame (after layout, before paint).
Therefore, testing behavior that relies on this component involves setting a
timeout for the next frame.

</div>

@interface IResizeSensorProps
