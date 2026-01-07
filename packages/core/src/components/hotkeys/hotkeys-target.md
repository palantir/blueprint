@# HotkeysTarget

The **HotkeysTarget** component is a utility component which allows you to use the
[`useHotkeys` hook](#core/hooks/use-hotkeys) inside a React component class. It's useful if you want to switch to the
new hotkeys API without refactoring your class components into functional components.

@## Import

```tsx
import { HotkeysTarget } from "@blueprintjs/core";
```

Focus on the piano below to try its hotkeys. The global hotkeys dialog can be shown using the <kbd>?</kbd> key.

@reactExample HotkeysTargetExample

@## Usage

First, make sure [**HotkeysProvider**](#core/context/hotkeys-provider) is configured correctly at the root of your
React application.

Then, to register hotkeys and generate the relevant event handlers, use the component like so:

```tsx
import * as React from "react";
import { HotkeysTarget, InputGroup } from "@blueprintjs/core";

export default class extends React.PureComponent {
    private inputRef = React.createRef<HTMLInputElement>();

    private hotkeys = [
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
            onKeyDown: this.inputRef.current?.focus(),
        },
    ];

    public render() {
        return (
            <HotkeysTarget hotkeys={this.hotkeys}>
                {({ handleKeyDown, handleKeyUp }) => (
                    <div tabIndex={0} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                        Press "R" to refresh data, "F" to focus the input...
                        <InputGroup inputRef={this.inputRef} />
                    </div>
                )}
            </HotkeysTarget>
        );
    }
}
```

Hotkeys must define a group, or be marked as global. The component will automatically bind global event handlers
and configure the <kbd>?</kbd> key to open the generated hotkeys dialog, but it is up to you to bind _local_
event handlers with the `handleKeyDown` and `handleKeyUp` functions in the child render function. Note that
you will likely have to set a non-negative `tabIndex` on the DOM node to which these local event handlers are
bound for them to work correctly.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

See the [useHotkeys hook documentation](#core/hooks/use-hotkeys.key-combos) to understand the semantics of "key combos":
how they are configured and how they will appear in the global dialog.

</div>

@## Props interface

@interface HotkeysTargetProps

@interface UseHotkeysOptions

@## Hotkey configuration

@interface HotkeyConfig
