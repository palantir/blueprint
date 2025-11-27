@# useHotkeys

The `useHotkeys()` hook adds hotkey / keyboard shortcut interactions to your application using a custom React hook.
This works with function components and a corresponding [context provider](#core/context/hotkeys-provider) to allow
customization of the hotkeys dialog.

Focus on the piano below to try its hotkeys. The global hotkeys dialog can be shown using the <kbd>?</kbd> key.

@reactExample UseHotkeysExample

@## Usage

First, make sure [**HotkeysProvider**](#core/context/hotkeys-provider) is configured correctly at the root of your
React application.

Then, to register hotkeys and generate the relevant event handlers, use the hook like so:

```tsx
import { InputGroup, KeyComboTag, useHotkeys } from "@blueprintjs/core";
import React, { createRef, useCallback, useMemo } from "react";

export default function () {
    const inputRef = createRef<HTMLInputElement>();
    const handleRefresh = useCallback(() => console.info("Refreshing data..."), []);
    const handleFocus = useCallback(() => inputRef.current?.focus(), [inputRef]);

    // important: hotkeys array must be memoized to avoid infinitely re-binding hotkeys
    const hotkeys = useMemo(
        () => [
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
        ],
        [handleRefresh, handleFocus],
    );
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    return (
        <div tabIndex={0} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
            Press <KeyComboTag combo="R" /> to refresh data, <KeyComboTag combo="F" /> to focus the input...
            <InputGroup inputRef={inputRef} />
        </div>
    );
}
```

**Important**: the `hotkeys` array must be memoized, as shown above, to prevent the hook from re-binding
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
keys (`alt`, `ctrl`, `shift`, `meta`/`cmd`) and exactly one action key, such as `A`, `return`, or `up`.

Your configured keyboard layout is respected as much as possible by using `event.key`. Most hotkeys work correctly
if your keyboard is configured to a different layout than is physically on the keys, for example, a QWERTY keyboard
configured as AZERTY. However, shifted characters (like `!`) and Alt combinations may not work reliably on non-default
keyboard layouts, so these are not recommended.

Some key combos have aliases. For example, `cmd` is equal to `meta`, and `return` is equal to `enter`. Alphabetic
characters are case-insensitive, so `X` is equivalent to `x`.

Examples of valid key combos:

-   `cmd+plus`
-   `!` or, equivalently `shift+1` (not recommended, won't work with non-default keyboard layouts)
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
