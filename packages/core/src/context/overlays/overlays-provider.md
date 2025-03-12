---
tag: new
---

@# OverlaysProvider

**OverlaysProvider** is responsible for managing global overlay state in an application,
specifically the stack of all overlays which are currently open. It provides the necessary
[React context](https://react.dev/learn/passing-data-deeply-with-context) for the
[**Overlay** component](#core/components/overlay).

## Usage

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Consider [**BlueprintProvider**](#core/context/blueprint-provider)

</h5>

**BlueprintProvider** is a new composite React context provider for Blueprint applications which
enables & configures multiple providers automatically and is simpler to use than individual lower-level providers.

</div>

To use **OverlaysProvider**, wrap your application with it at the root level:

```tsx
import { OverlaysProvider } from "@blueprintjs/core";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <OverlaysProvider>
        <div>My app has overlays 😎</div>
    </OverlaysProvider>,
);
```

@## Props interface

**OverlaysProvider** has no props other than `children`.
