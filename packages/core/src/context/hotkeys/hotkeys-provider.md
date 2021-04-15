---
tag: new
---

@# HotkeysProvider

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">This API requires React 16.8+</h4>
</div>

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [HotkeysTarget](#core/components/hotkeys)?

</h4>

HotkeysProvider and `useHotkeys`, used together, are a replacement for HotkeysTarget.
You are encouraged to use this new API, as it will become the standard APIs in Blueprint v4.
See the full [migration guide](https://github.com/palantir/blueprint/wiki/useHotkeys-migration)
on the wiki.

</div>

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
