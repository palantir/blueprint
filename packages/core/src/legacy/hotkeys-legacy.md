---
tag: deprecated
---

@# Hotkeys (legacy)

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated: use [useHotkeys](#core/hooks/use-hotkeys)

</h5>

This API is **deprecated since @blueprintjs/core v3.39.0** in favor of the new
[`useHotkeys` hook](#core/hooks/use-hotkeys) and
[**HotkeysTarget2** component](#core/components/hotkeys-target2). You should migrate to one of
these new APIs, as they will become the standard in future major version of Blueprint.

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
