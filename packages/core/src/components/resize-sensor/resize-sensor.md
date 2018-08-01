---
tag: new
---

@# Resize sensor

`ResizeSensor` is a higher-order component that effectively provides a
`"resize"` event for a single DOM element. It is a thin wrapper around
[`ResizeObserver`][resizeobserver] to provide React bindings.

[resizeobserver]: https://developers.google.com/web/updates/2016/10/resizeobserver

```tsx
import { IResizeEntry, ResizeSensor } from "@blueprintjs/core";

function handleResize(entries: IResizeEntry[]) {
    console.log(entries.map(e => `${e.contentRect.width} x ${e.contentRect.height}`));
}

<ResizeSensor onChange={handleResize}>
    <div style={{ width: this.props.width }} />
</ResizeSensor>
```

@## Props

@interface IResizeSensorProps
