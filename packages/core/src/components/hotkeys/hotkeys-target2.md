---
tag: new
---

@# HotkeysTarget2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [HotkeysTarget](#core/components/hotkeys)?

</h4>

HotkeysTarget2 is a replacement for HotkeysTarget. You are encouraged to use this new API, or
the `useHotkeys` hook directly in your function components, as they will become the standard
APIs in a future major version of Blueprint. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/HotkeysTarget-&-useHotkeys-migration) on the wiki.

</div>


The `HotkeysTarget2` component is a utility component which allows you to use the new
[`useHotkeys` hook](#core/hooks/use-hotkeys) inside a React component class. It's useful
if you want to switch to the new hotkeys API without refactoring your class components
into functional components.

Focus on the piano below to try its hotkeys. The global hotkeys dialog can be shown using the "?" key.

@reactExample HotkeysTarget2Example

@## Usage

First, make sure [HotkeysProvider](#core/context/hotkeys-provider) is configured correctly at the root of your
React application.

Then, to register hotkeys and generate the relevant event handlers, use the component like so:

```tsx
import React from "react";
import { HotkeysTarget2, InputGroup } from "@blueprintjs/core";

export default class extends React.PureComponent {
    private inputEl: HTMLInputElement | null = null;
    private handleInputRef = (el: HTMLInputElement) => (this.inputEl = el);

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
            onKeyDown: this.inputEl?.focus(),
        },
    ];

    public render() {
        return (
            <HotkeysTarget2 hotkeys={this.hotkeys}>
                {({ handleKeyDown, handleKeyUp }) => (
                    <div tabIndex={0} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                        Press "R" to refresh data, "F" to focus the input...
                        <InputGroup ref={this.handleInputRef} />
                    </div>
                )}
            </HotkeysTarget2>
        )
    }
}
```

Hotkeys must define a group, or be marked as global. The component will automatically bind global event handlers
and configure the <kbd>?</kbd> key to open the generated hotkeys dialog, but it is up to you to bind _local_
event handlers with the `handleKeyDown` and `handleKeyUp` functions in the child render function. Note that
you will likely have to set a non-negative `tabIndex` on the DOM node to which these local event handlers are
bound for them to work correctly.

`<HotkeysTarget2>` takes an optional `options: UseHotkeysOptions` prop which can customize some of the hook's
default behavior.

@## Props

@interface HotkeysTarget2Props

@interface HotkeyConfig

@interface UseHotkeysOptions
