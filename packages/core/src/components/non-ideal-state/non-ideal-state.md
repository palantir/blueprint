---
parent: components
---

@# Non-ideal state

Non-ideal UI states inform the user that some content is unavailable. There are several types of non-ideal states,
including:

-   **Empty state:** a container has just been created and has no data in it yet, or a container's contents have been
    intentionally removed.
-   **Loading state:** a container is awaiting data. A good practice is to show a spinner for this state with optional
    explanatory text below the spinner.
-   **Error state:** something went wrong (for instance, 404 and 500 HTTP errors). In this case, a good practice is to
    add a call to action directing the user what to do next.

@## Import

```tsx
import { NonIdealState } from "@blueprintjs/core";
```

@reactExample NonIdealStateExample

@## Usage

**NonIdealState** component props are rendered in this order in the DOM, with comfortable spacing between each child:

1. `icon`
2. text (`title` + optional `description`)
3. `action`
4. `children`

By default, a vertical layout is used, but you can make it horizontal with `layout="horizontal"`.

Icons will also take on a muted appearance inside this component, with their shape contrast preserved by adding a small stroke to the SVG paths. This behavior can be disabled by setting `iconMuted={false}`.

@## Props interface

@interface NonIdealStateProps
