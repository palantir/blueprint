---
tag: new
---

@# PortalProvider

PortalProvider generates a React context necessary for customizing global [Portal](#core/components/portal)
options. It uses the [React context API](https://reactjs.org/docs/context.html).

@## Usage

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Consider [**BlueprintProvider**](#core/context/blueprint-provider)

</h5>

**BlueprintProvider** is a new composite React context provider for Blueprint applications which
enables & configures multiple providers automatically and is simpler to use than individual lower-level providers.

</div>

To use **PortalProvider**, wrap your application with it at the root level:

```tsx
import { PortalProvider, Dialog } from "@blueprintjs/core";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <PortalProvider portalClassName="my-portal">
        <Dialog isOpen={true}>
            <span>This dialog will have a custom class on its portal element.</span>
        </Dialog>
    </PortalProvider>,
);
```

@## Props interface

@interface PortalContextOptions
