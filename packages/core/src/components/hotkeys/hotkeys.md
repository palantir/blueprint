---
parent: components
---

# Hotkeys

Hotkeys enable you to create interactions based on user keyboard events.

To add hotkeys to your React component, use the `@HotkeyTarget` class decorator
and add a `renderHotkeys()` method. The decorator will call `renderHotkeys()`
and attach the appropriate key listeners.

### Hotkey scope

`Hotkey`s can have either local or global scope. Local hotkeys will only be
triggered when the target is focused, while global hotkeys can be triggered no
matter which element is focused.

Additionally, any keyboard input that occurs inside a text input (such as a
`<textarea>`, `<input>`, or `<div contenteditable>`) is ignored.

### Hotkey dialog

If you define hotkeys for your page, you'll want to display the hotkeys in a
nice format for the user. If you register any global or local hotkeys, we
automatically attach a hotkey for <kbd class="pt-key">?</kbd>, which will
display the hotkeys dialog.

The dialog will always include all available global hotkeys, and if you are
focused on an element that has any hotkeys, those will be shown as well.

If you would like to change the style of the dialog (for example, to apply the
dark theme class), call the `setHotkeysDialogProps` function with
`IDialogProps`.

## Piano example

Also known as the keyboard keyboard. First, click the keys or press
<span class="pt-key-combo">
<kbd class="pt-key pt-modifier-key">
<span class="pt-icon-standard pt-icon-key-shift"></span>
shift
</kbd><kbd class="pt-key">P</kbd>
</span>
to focus the piano, then press the keys on your keyboard to play some music!

@reactExample HotkeyPiano

Weight: 0

## JavaScript API

1. Add the `@HotkeysTarget` class decorator to your react component.
1. Implement the `renderHotkeys()` method.
1. Define your `<Hotkey>`s inside a `<Hotkeys>` element.

```
import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";
import * as React from "react";

@HotkeysTarget
export class MyComponent extends React.Component<{}, {}> {
public render() {
return <div>Whatever content</div>;
}

public renderHotkeys() {
return <Hotkeys>
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
onKeyDown={() => console.log("So Fancy!")}
/>
</Hotkeys>;
}
}
```

Weight: 1

### Decorator

The `@HotkeysTarget` decorator allows you to easily add global and local
hotkeys to any React component. Add the decorator to the top of the class and
make sure to implement the `renderHotkeys` method.

@interface IHotkeysTarget

Weight: 2

### Hotkeys

Wrap your `Hotkey`s in the `Hotkeys` element. For example:

```
<Hotkeys>
<Hotkey label="Quit" combo="ctrl+q" global onKeyDown={handleQuit} />
<Hotkey label="Save" combo="ctrl+s" group="File" onKeyDown={handleSave} />
</Hotkey>
```

@interface IHotkeysProps

Weight: 3

### Hotkey

@interface IHotkeyProps

Weight: 4

### Key combos

Each hotkey must be assigned a key combo that will trigger its events. A key
combo consists of zero or more modifier keys (`alt`, `ctrl`, `shift`, `meta`,
`cmd`) and exactly one action key, such as `A`, `return`, or `up`.

Some key combos have aliases. For example, `shift + 1` can equivalently be
expressed as `!` and `cmd` is equal to `meta`. However, normal alphabetic
characters do not have this aliasing, so `X` is equivalent to `x` but is not
equivalent to `shift + x`.


##### Examples of valid key combos

* `cmd+plus`
* `!` or, equivalently `shift+1`
* `return` or, equivalently `enter`
* `alt + shift + x`
* `ctrl + left`

Note that spaces are ignored.

##### Named keys

* `plus`
* `minus`
* `backspace`
* `tab`
* `enter`
* `capslock`
* `esc`
* `space`
* `pageup`
* `pagedown`
* `end`
* `home`
* `left`
* `up`
* `right`
* `down`
* `ins`
* `del`

##### Aliased keys

* `option` &rarr; `alt`
* `cmd` &rarr; `meta`
* `command` &rarr; `meta`
* `return` &rarr; `enter`
* `escape` &rarr; `esc`
* `win` &rarr; `meta`

The special modifier `mod` will choose the OS-preferred modifier key — `cmd`
for macOS and iOS, or `ctrl` for Windows and Linux.

##### Hotkey tester

Below is a little widget to quickly help you try out hotkey combos and see how
they will look in the dialog. See the key combos section above for more about
specifying key combo props.

@reactExample HotkeyTester

Weight: 5
