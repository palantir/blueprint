@# Panel stack

`PanelStack` manages a stack of panels and displays only the topmost panel.

Each panel appears with a header containing a "back" button to pop the stack and
return to the previous panel. The bottom-most `initialPanel` cannot be closed
or removed from the stack. Panels use [`CSSTransition`](http://reactcommunity.org/react-transition-group/css-transition)
for seamless transitions.


@reactExample PanelStackExample

@## Panels

`PanelStack` will inject its own `IPanelProps` into each panel, providing
methods to imperatively close the panel or open a new one on top of it.

```tsx
import { Button, IPanelProps, PanelStack } from "@blueprintjs/core";

class MyPanel extends React.Component<IPanelProps> {
    public render() {
        return <Button onClick={this.openSettingsPanel} text="Settings" />
    }

    private openSettingsPanel() {
        this.props.openPanel({
            component: SettingsPanel,
            props: { enabled: true },
            title: "Settings",
        });
    }
}

class SettingsPanel extends React.Component<IPanelProps & { enabled: boolean }> {
    // ...
}

<PanelStack initialPanel={{ component: MyPanel, title: "Home" }} />
```

@interface IPanelProps

@## Props

Panels are supplied as `{ component, props, title }` objects where `component`
and `props` are used to render the panel element and `title` will appear in the
header and back button.

The panel stack cannot be controlled but `onClose` and `onOpen` callbacks are
available to listen for changes.

@interface IPanelStackProps

@interface IPanel
