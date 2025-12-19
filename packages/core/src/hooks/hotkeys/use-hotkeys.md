@# useHotkeys

The `useHotkeys()` hook adds hotkey / keyboard shortcut interactions to your application using a custom React hook.
This works with function components and a corresponding [context provider](#core/context/hotkeys-provider) to allow
customization of the hotkeys dialog.

Focus on the piano below to try its hotkeys. The global hotkeys dialog can be shown using the <kbd>?</kbd> key.

@reactExample UseHotkeysExample

Try modifier key combinations too.

@reactExample HotkeyModifierExample

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

The configured keyboard layout is respected for letter keys by using `event.key`, so hotkeys work correctly
if the keyboard is configured to a different layout than is physically on the keys (e.g., a QWERTY keyboard
configured as AZERTY).

**Key detection behavior:**
- **Letters (a-z)**: Uses the character produced by the key to respect keyboard layout (QWERTY vs AZERTY)
- **Digits (0-9)**: Uses the physical key position to avoid shifted symbols (Shift+1 is detected as `shift+1`, not `!`)
- **Symbols**: Uses the character produced, with special handling for shift combinations (Shift+[ is detected as `shift+[`, not `{`)
- **Alt combinations**: Uses physical key position to avoid Alt-transformed characters (Alt+c on macOS is detected as `alt+c`, not `alt+ç`)

Some key combos have aliases. For example, `cmd` is equal to `meta`, and `return` is equal to `enter`. Alphabetic
characters are case-insensitive, so `X` is equivalent to `x`.

Examples of valid key combos:

-   `cmd+plus`
-   `shift+1` (note: `!` is not supported)
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
