---
tag: new
---

@# OverlaysProvider

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Migrating from [Overlay](#core/components/overlay)?

</h5>

**OverlaysProvider** and [**Overlay2**](#core/components/overlay2), when used
together, are a replacement for **Overlay**. You are encouraged to use these new APIs, as they will
become the standard in a future major version of Blueprint. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/Overlay2-migration) on the wiki.

</div>

**OverlaysProvider** is responsible for managing global overlay state in an application,
specifically the stack of all overlays which are currently open. It provides the necessary
[React context](https://react.dev/learn/passing-data-deeply-with-context) for the
[**Overlay2** component](#core/components/overlay2).

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
