@# useHotkeys

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Migrating from [__HotkeysTarget__](#core/legacy/hotkeys-legacy)?

</h5>

`useHotkeys` is a replacement for __HotkeysTarget__. You are encouraged to use this new API in your function
components, or the [__HotkeysTarget2__ component](#core/components/hotkeys-target2) in your component classes,
as they will become the standard APIs in a future major version of Blueprint. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/HotkeysTarget-&-useHotkeys-migration) on the wiki.

</div>

The `useHotkeys` hook adds hotkey / keyboard shortcut interactions to your application using a custom React hook.
Compared to the deprecated [Hotkeys API](#core/legacy/hotkeys-legacy), it works with function components and its
corresponding [context provider](#core/context/hotkeys-provider) allows more customization of the hotkeys dialog.

Focus on the piano below to try its hotkeys. The global hotkeys dialog can be shown using the <kbd>?</kbd> key.

@reactExample UseHotkeysExample

@## Usage

First, make sure [__HotkeysProvider__](#core/context/hotkeys-provider) is configured correctly at the root of your
React application.

Then, to register hotkeys and generate the relevant event handlers, use the hook like so:

```tsx
import { InputGroup, KeyComboTag, useHotkeys } from "@blueprintjs/core";
import React, { createRef, useCallback, useMemo } from "react";

export default function() {
    const inputRef = createRef<HTMLInputElement>();
    const handleRefresh = useCallback(() => console.info("Refreshing data..."), []);
    const handleFocus = useCallback(() => inputRef.current?.focus(), [inputRef]);

    // important: hotkeys array must be memoized to avoid infinitely re-binding hotkeys
    const hotkeys = useMemo(() => [
        {
            combo: "R",
            global: true,
            label: "Refresh data",
            onKeyDown: handleRefresh,
        },
        {
            combo: "F",
            group: "Input",
            label: "Focus text input",
            onKeyDown: handleFocus,
        },
    ], [handleRefresh, handleFocus]);
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    return (
        <div tabIndex={0} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
            Press <KeyComboTag combo="R" /> to refresh data, <KeyComboTag combo="F" /> to focus the input...
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

@## Hook options

@interface UseHotkeysOptions

@method useHotkeys

@## Hotkey configuration

@interface HotkeyConfig

@## Key combos

Each hotkey must be assigned a key combo that will trigger its events. A key combo consists of zero or more modifier
keys (`alt`, `ctrl`, `shift`, `meta`, `cmd`) and exactly one action key, such as `A`, `return`, or `up`.

Some key combos have aliases. For example, `shift + 1` can equivalently be expressed as `!` and `cmd` is equal to
`meta`. However, normal alphabetic characters do not have this aliasing, so `X` is equivalent to `x` but is not
equivalent to `shift + x`.

Examples of valid key combos:

-   `cmd+plus`
-   `!` or, equivalently `shift+1`
-   `return` or, equivalently `enter`
-   `alt + shift + x`
-   `ctrl + left`

Note that spaces are ignored.

### Named keys

-   `plus`
-   `minus`
-   `backspace`
-   `tab`
-   `enter`
-   `capslock`
-   `esc`
-   `space`
-   `pageup`
-   `pagedown`
-   `end`
-   `home`
-   `left`
-   `up`
-   `right`
-   `down`
-   `ins`
-   `del`

### Aliased keys

-   `option` &rarr; `alt`
-   `cmd` &rarr; `meta`
-   `command` &rarr; `meta`
-   `return` &rarr; `enter`
-   `escape` &rarr; `esc`
-   `win` &rarr; `meta`

The special modifier `mod` will choose the OS-preferred modifier key: `cmd` for macOS and iOS, or `ctrl` for Windows
and Linux.

@## Key combo tester

Below is a little widget to quickly help you try out hotkey combos and see how they will appear in the dialog. See the
[Key combos section](#core/hooks/use-hotkeys.key-combos) above for more info.

@reactExample HotkeyTesterExample
