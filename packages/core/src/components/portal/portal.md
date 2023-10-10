@# Portal

The __Portal__ component renders its children into a new DOM "subtree" outside of the current component
hierarchy. It is an essential piece of the [Overlay](#core/components/overlay) component, responsible for
ensuring that the overlay contents appear above the rest of the application. In most cases, you do not
need to use a Portal directly; this documentation is provided only for reference.

@## DOM Behavior

__Portal__ component functions like a declarative `appendChild()`. The children of a __Portal__ are inserted into a *new child* of the target element. This target element is determined in the following order:
1. The `container` prop, if specified
2. The `portalContainer` from the closest [PortalProvider](#core/context/portal-provider), if specified
3. Otherwise `document.body`


__Portal__ is used inside [Overlay](#core/components/overlay) to actually overlay the content on the
application.

<div class="@ns-callout @ns-intent-warning @ns-icon-move @ns-callout-has-body-content">
    <h5 class="@ns-heading">A note about responsive layouts</h5>

For a single-page app, if the `<body>` is styled with `width: 100%` and `height: 100%`, a `Portal`
may take up extra whitespace and cause the window to undesirably scroll. To fix this, instead
apply `position: absolute` to the `<body>` tag.

</div>

@## Props interface

@interface PortalProps

@## React context options

__Portal__ supports some customization through [React context](https://react.dev/learn/passing-data-deeply-with-context).
Using this API can be helpful if you need to apply some custom styling or logic to _all_ Blueprint
components which use portals (popovers, tooltips, dialogs, etc.). You can do so by rendering a
[PortalProvider](#core/context/portal-provider) in your React tree
(usually, this should be done near the root of your application).

```tsx
import { Button, Popover, PortalProvider } from "@blueprintjs/core";
import * as React from "react";
import * as ReactDOM from "react-dom";

ReactDOM.render(
    <PortalProvider portalClassName="my-custom-class">
        <Popover content="My portal has a custom class">
            <Button text="Example" />
        </Popover>
    </PortalProvider>
    document.querySelector("#app"),
);
```

@interface PortalContextOptions

@## Legacy context options

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">Legacy React API</h5>

This feature uses React's legacy context API. Support for this API will be removed in Blueprint v6.0.

</div>

__Portal__ supports the following options via the [React legacy context API](https://reactjs.org/docs/legacy-context.html).
To use them, supply a child context to a subtree that contains the Portals you want to customize.

@interface PortalLegacyContext
