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
See the full [migration guide](https://github.com/palantir/blueprint/wiki/HotkeysTarget-&-useHotkeys-migration)
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

@## Advanced usage

HotkeysProvider should not be nested, except in special cases. If you have a rendering boundary within your application
through which React context is not preserved (for example, a plugin system which uses `ReactDOM.render()`) and you wish
to use hotkeys in a descendant part of the tree below such a boundary, you may render a descendant provider and initialize
it with the root context instance. This ensures that there will only be one "global" hotkeys dialogs in an application
which has multiple HotkeysProviders.

```tsx
import {
    HotkeyConfig,
    HotkeysContext,
    HotkeysProvider,
    HotkeysTarget2
} from "@blueprintjs/core";
import React, { useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

function App() {
    const appHotkeys: HotkeyConfig[] = [
        {
            combo: "o",
            global: true,
            label: "Open",
            onKeyDown: () => console.info("open"),
        },
    ];

    return (
        <HotkeysProvider>
            <div>
                <HotkeysTarget2 hotkeys={appHotkeys}>
                    <div>My app has hotkeys 😎</div>
                </HotkeysTarget2>
                <PluginSlot>
                    <Plugin />
                </PluginSlot>
            </div>
        </HotkeysProvider>
    );
}

function Plugin() {
    const pluginHotkeys: HotkeyConfig[] = [
        {
            combo: "f",
            global: true,
            label: "Search",
            onKeyDown: () => console.info("search"),
        }
    ];

    return (
        <HotkeysTarget2 hotkeys={pluginHotkeys}>
            <div>This plugin also has hotkeys</div>
        </HotkeysTarget2>
    );
}

function PluginSlot(props) {
    const hotkeysContext = useContext(HotkeysContext);
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        if (ref.current != null) {
            ReactDOM.render(
                <HotkeysProvider value={hotkeysContext}>
                    {props.children}
                </HotkeysProvider>,
                ref.current,
            );
        }
    }, [ref, hotkeysContext, props.children]);

    return <div ref={ref} />;
}
```

@## Props

@interface HotkeysProviderProps
