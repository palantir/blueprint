@# BlueprintProvider

**BlueprintProvider** is a compound [React context](https://react.dev/learn/passing-data-deeply-with-context)
provider which enables & manages various global behaviors of Blueprint applications. It should be rendered
near the top of your application tree and may only be used once as a singleton provider.

Concretely, this provider renders the following provider components _in the correct nesting order_
and allows customization of their options via props:

- [**OverlaysProvider**](#core/context/overlays-provider)
- [**HotkeysProvider**](#core/context/hotkeys-provider)
- [**PortalProvider**](#core/context/portal-provider)

## Usage

To use **BlueprintProvider**, wrap the parts of your application that need Blueprint features.
If your app uses a router or other providers (e.g. `RouterProvider`, `ApolloProvider`), nest
**BlueprintProvider** underneath them:

```tsx
import { BlueprintProvider } from "@blueprintjs/core";
import { RouterProvider } from "react-router-dom";

function App() {
    return (
        <RouterProvider router={router}>
            <BlueprintProvider>
                <div>My app has overlays, hotkeys, and portal customization 😎</div>
            </BlueprintProvider>
        </RouterProvider>
    );
}
```

## Props interface

@interface BlueprintProviderProps
