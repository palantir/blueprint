@# Collapse

The **Collapse** component reveals and hides content with a smooth sliding animation.
It is commonly used to create expandable sections, like settings panels, sub-sections, or FAQs.

@## Import

```tsx
import { Collapse } from "@blueprintjs/core";
```

@## Usage

The **Collapse** component wraps its children and toggles their visibility with a sliding animation.
The `isOpen` prop controls whether the content is visible. Content must be in the normal document
flow (i.e., avoid `position: absolute;`), as **Collapse** calculates height to animate the transition.

@reactCodeExample CollapseBasicExample

@## Keeping children mounted

By default, **Collapse** removes its children from the DOM when the collapse is closed.
This improves performance, especially when there are many collapsible elements on a page.
To keep the content mounted (but hidden) when collapsed, use the `keepChildrenMounted` prop.
This can be useful when preserving the internal state of child components.

@reactCodeExample CollapseMountedExample

@## Interactive Playground

@reactExample CollapsePlaygroundExample

@## Props interface

@interface CollapseProps
