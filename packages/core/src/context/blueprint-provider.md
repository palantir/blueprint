---
tag: new
---

@# BlueprintProvider

**BlueprintProvider** is a compound [React context](https://react.dev/learn/passing-data-deeply-with-context)
provider which enables & manages various global behaviors of Blueprint applications. It must be rendered
at the root of your application and may only be used once as a singleton provider.

Concretely, this provider renders the following provider components _in the correct nesting order_
and allows customization of their options via props:

-   [**OverlaysProvider**](#core/context/overlays-provider)
-   [**HotkeysProvider**](#core/context/hotkeys-provider)
-   [**PortalProvider**](#core/context/portal-provider)

## Usage

To use **BlueprintProvider**, wrap your application with it at the root level:

```tsx
import { BlueprintProvider } from "@blueprintjs/core";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BlueprintProvider>
        <div>My app has overlays, hotkeys, and portal customization 😎</div>
    </BlueprintProvider>,
);
```

## Props interface

@interface BlueprintProviderProps
