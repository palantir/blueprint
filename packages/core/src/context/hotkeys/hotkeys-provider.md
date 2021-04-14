@# HotkeysProvider

HotkeysProvider generates a React context necessary for the [`useHotkeys` hook](#core/hooks/use-hotkeys)
to maintain state for the globally-accessible hotkeys dialog. As your application runs and components
are mounted/unmounted, global and local hotkeys are registered/unregistered with this context and
the dialog displays/hides the relevant information. You can try it out in the Blueprint docs app
by navigating around and triggering the dialog with the <kbd>?</kbd> key.

@## Usage

```tsx
import { HotkeysProvider } from "@blueprintjs/core";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <HotkeysProvider>
        <div>My app has hotkeys 😎</div>
    </HotkeysProvider>,
    document.querySelector("#app"),
);
```

@## Props

@interface HotkeysProviderProps
