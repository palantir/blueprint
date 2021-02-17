@# HotkeysTarget2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [HotkeysTarget](#core/components/hotkeys)?

</h4>

HotkeysTarget2 is a replacement for HotkeysTarget. You are encouraged to use this new API, or
the `useHotkeys` hook directly in your function components, as they will be come the standard
APIs in Blueprint v4. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/useHotkeys-migration) on the wiki.

</div>


The `HotkeysTarget2` component is a utility component which allows you to use the new
[`useHotkeys` hook](#core/hooks/useHotkeys) inside a React component class. It's useful
if you want to switch to the new hotkeys API without refactoring your class components
into functional components.

@reactExample HotkeysTarget2Example

@## Usage

```tsx
import React from "react";
import { HotkeysTarget2 } from "@blueprintjs/core";

export default class extends React.PureComponent {
    private hotkeys = [
        {
            combo: "?",
            label: "Open help dialog",
            onKeyDown: () => alert("Opened help dialog!"),
        },
    ];

    public render() {
        return (
            <HotkeysTarget2 hotkeys={this.hotkeys}>
                {({ handleKeyDown, handleKeyUp }) => (
                    <div tabIndex={0} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                        Need help?
                    </div>
                )}
            </HotkeysTarget2>
        )
    }
}
```

@## Props

@interface HotkeysTarget2Props
