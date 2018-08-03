---
tag: new
---

@# Panel stack

`PanelStack` manages a stack of panels and displays only the topmost panel.

Each panel appears with a header containing a "back" button to return to the
previous panel. The bottom-most `initialPanel` cannot be closed or removed from
the stack. Panels use
[`CSSTransition`](http://reactcommunity.org/react-transition-group/css-transition)
for seamless transitions.


@reactExample PanelStackExample

@## Panels

Panels are supplied as `IPanel` objects like `{ component, props, title }`,
where `component` and `props` are used to render the panel element and `title`
will appear in the header and back button. This breakdown allows the component
to avoid cloning elements. Note that each panel is only mounted when it is atop
the stack and is unmounted when it is closed or when a panel opens above it.

`PanelStack` injects its own `IPanelProps` into each panel (in addition to the
`props` defined alongside the `component`), providing methods to imperatively
close the current panel or open a new one on top of it.

```tsx
import { Button, IPanelProps, PanelStack } from "@blueprintjs/core";

class MyPanel extends React.Component<IPanelProps> {
    public render() {
        return <Button onClick={this.openSettingsPanel} text="Settings" />
    }

    private openSettingsPanel() {
        // openPanel (and closePanel) are injected by PanelStack
        this.props.openPanel({
            component: SettingsPanel, // <- class or stateless function type
            props: { enabled: true }, // <- SettingsPanel props without IPanelProps
            title: "Settings",        // <- appears in header and back button
        });
    }
}

class SettingsPanel extends React.Component<IPanelProps & { enabled: boolean }> {
    // ...
}

<PanelStack initialPanel={{ component: MyPanel, title: "Home" }} />
```

@interface IPanel

@interface IPanelProps

@## Props

The panel stack cannot be controlled but `onClose` and `onOpen` callbacks are
available to listen for changes.

@interface IPanelStackProps

