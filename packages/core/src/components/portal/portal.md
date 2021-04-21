@# Portal

The `Portal` component renders its children into a new "subtree" outside of the current component
hierarchy. It is an essential piece of [`Overlay`](#core/components/overlay), responsible for ensuring that
the overlay contents cover the application below. In most cases you do not need to use a `Portal`
directly; this documentation is provided simply for reference.

@## Portal context options

`Portal` supports some customization through [React context](https://reactjs.org/docs/context.html).
Using this API can be helpful if you need to apply some custom styling or logic to _all_ Blueprint
components which use portals (popovers, tooltips, dialogs, etc.). You can do so by rendering a
`<PortalProvider>` in your React tree (usually, this should be done near the root of your application).

```tsx
import { Button, Popover, PortalProvider } from "@blueprintjs/core";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <PortalProvider portalClassName="my-custom-class">
        <Popover content="My portal has a custom class">
            <Button text="Example" />
        </Popover>
    </PortalProvider>
    document.querySelector("#app"),
);
```

@interface PortalProviderProps

@## Props

The `Portal` component functions like a declarative `appendChild()`, or jQuery's
`$.fn.appendTo()`. The children of a `Portal` component are inserted into a new
child of the `<body>`.

`Portal` is used inside [`Overlay`](#core/components/overlay) to actually overlay the content on the
application.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">A note about responsive layouts</h4>

For a single-page app, if the `<body>` is styled with `width: 100%` and `height: 100%`, a `Portal`
may take up extra whitespace and cause the window to undesirably scroll. To fix this, instead
apply `position: absolute` to the `<body>` tag.

</div>

@interface PortalProps
