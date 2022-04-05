---
tag: new
---

@# useHotkeys

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-heading">This API requires React 16.8+</h4>
</div>

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [HotkeysTarget](#core/components/hotkeys)?

</h4>

`useHotkeys` is a replacement for HotkeysTarget. You are encouraged to use this new API in your function
components, or the [HotkeysTarget2 component](#core/components/hotkeys-target2) in your component classes,
as they will become the standard APIs in Blueprint v5. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/HotkeysTarget-&-useHotkeys-migration) on the wiki.

</div>

The `useHotkeys` hook adds hotkey / keyboard shortcut interactions to your application using a custom React hook.
Compared to the deprecated [Hotkeys](#core/components/hotkeys) API, it works with function components and its
corresponding [context provider](#core/context/hotkeys-provider) allows more customization of the hotkeys dialog.

Focus on the piano below to try its hotkeys. The global hotkeys dialog can be shown using the "?" key.

@reactExample UseHotkeysExample

@## Usage

First, make sure [HotkeysProvider](#core/context/hotkeys-provider) is configured correctly at the root of your
React application.

Then, to register hotkeys and generate the relevant event handlers, use the hook like so:

```tsx
import { useHotkeys } from "@blueprintjs/core";
import React, { createRef, useMemo } from "react";

export default function() {
    const inputRef = createRef<HTMLInputElement>();

    // important: hotkeys array must be memoized to avoid infinitely re-binding hotkeys
    const hotkeys = useMemo(() => [
        {
            combo: "R",
            global: true,
            label: "Refresh data",
            onKeyDown: () => console.info("Refreshing data..."),
        },
        {
            combo: "F",
            group: "Input",
            label: "Focus text input",
            onKeyDown: inputRef.current?.focus(),
        },
    ], []);
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    return (
        <div tabIndex={0} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
            Press "R" to refresh data, "F" to focus the input...
            <InputGroup inputRef={inputRef} />
        </div>
    );
}
```

__Important__: the `hotkeys` array must be memoized, as shown above, to prevent the hook from re-binding
hotkeys on every render.

Hotkeys must define a group, or be marked as global. The hook will automatically bind global event handlers
and configure the <kbd>?</kbd> key to open the generated hotkeys dialog, but it is up to you to bind _local_
event handlers with the returned `handleKeyDown` and `handleKeyUp` functions. The hook takes an optional
second parameter which can customize some of its default behavior.

@interface UseHotkeysOptions

@method useHotkeys

@interface HotkeyConfig
