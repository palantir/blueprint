@# Hotkeys

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">

Deprecated: use [useHotkeys](#core/hooks/use-hotkeys)

</h4>

This API is **deprecated since @blueprintjs/core v3.39.0** in favor of the new
[`useHotkeys` hook](#core/hooks/use-hotkeys) and
[HotkeysTarget2 component](#core/components/hotkeys-target2) available to React 16.8+ users.
You should migrate to one of these new APIs, as they will become the standard in Blueprint v5.

</div>

Hotkeys enable you to create interactions based on user keyboard events.

To add hotkeys to your React component, use the `@HotkeysTarget` class decorator
and add a `renderHotkeys()` method. The decorator will call `renderHotkeys()`
and attach the appropriate key listeners.

@reactExample HotkeyPiano

@## Usage

1. Add the `@HotkeysTarget` class decorator to your react component.
1. Implement the `renderHotkeys()` method.
1. Define your `<Hotkey>`s inside a `<Hotkeys>` element.

```tsx
import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";
import * as React from "react";

@HotkeysTarget
export class MyComponent extends React.Component {
    public render() {
        return <div>Custom content</div>;
    }

    public renderHotkeys() {
        return (
            <Hotkeys>
                <Hotkey
                    global={true}
                    combo="shift + a"
                    label="Be awesome all the time"
                    onKeyDown={() => console.log("Awesome!")}
                />
                <Hotkey
                    group="Fancy shortcuts"
                    combo="shift + f"
                    label="Be fancy only when focused"
                    onKeyDown={() => console.log("So fancy!")}
                />
            </Hotkeys>
        );
    }
}
```

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

Your decorated component must return a single DOM element in its `render()` method,
not a custom React component. This constraint allows `HotkeysTarget` to inject
event handlers without creating an extra wrapper element.

</div>

@### Decorator

The `@HotkeysTarget` decorator allows you to easily add global and local
hotkeys to any React component. Add the decorator to the top of the class and
make sure to implement the `renderHotkeys` method.

@interface IHotkeysTarget

@### Props

Wrap your `Hotkey`s in the `Hotkeys` element. For example:

```tsx
<Hotkeys>
    <Hotkey label="Quit" combo="ctrl+q" global onKeyDown={handleQuit} />
    <Hotkey label="Save" combo="ctrl+s" group="File" onKeyDown={handleSave} />
</Hotkeys>
```

@interface IHotkeysProps

@interface IHotkeyProps

@## Scope

`Hotkey`s can have either local or global scope. Local hotkeys will only be
triggered when the target is focused, while global hotkeys can be triggered no
matter which element is focused.

Additionally, any keyboard input that occurs inside a text input (such as a
`<textarea>`, `<input>`, or `<div contenteditable>`) is ignored.

@## Dialog

If you define hotkeys for your page, you'll want to display the hotkeys in a
nice format for the user. If you register any global or local hotkeys, we
automatically attach a hotkey `?`, which will display the hotkeys dialog.

The dialog will always include all available global hotkeys, and if you are
focused on an element that has any hotkeys, those will be shown as well.

If you would like to change the style of the dialog (for example, to apply the
dark theme class), call the `setHotkeysDialogProps` function with `IDialogProps`.

@## Key combos

Each hotkey must be assigned a key combo that will trigger its events. A key
combo consists of zero or more modifier keys (`alt`, `ctrl`, `shift`, `meta`,
`cmd`) and exactly one action key, such as `A`, `return`, or `up`.

Some key combos have aliases. For example, `shift + 1` can equivalently be
expressed as `!` and `cmd` is equal to `meta`. However, normal alphabetic
characters do not have this aliasing, so `X` is equivalent to `x` but is not
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

The special modifier `mod` will choose the OS-preferred modifier key — `cmd`
for macOS and iOS, or `ctrl` for Windows and Linux.

### Hotkey tester

Below is a little widget to quickly help you try out hotkey combos and see how
they will look in the dialog. See the key combos section above for more about
specifying key combo props.

@reactExample HotkeyTester
