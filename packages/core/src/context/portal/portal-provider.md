---
tag: new
---

@# PortalProvider

PortalProvider generates a React context necessary for customizing global [Portal](#core/components/portal)
options. It uses the [React context API](https://reactjs.org/docs/context.html).

@## Usage

```tsx
import { PortalProvider, Dialog } from "@blueprintjs/core";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <PortalProvider portalClassName="my-portal">
        <Dialog isOpen={true}>
            <span>This dialog will have a custom class on its portal element.</span>
        </Dialog>
    </PortalProvider>,
    document.querySelector("#app"),
);
```

@## Props interface

@interface PortalContextOptions
