---
tag: deprecated
---

@# Panel stack

<div class="@ns-callout @ns-intent-danger @ns-icon-error @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated: use [PanelStack2](#core/components/panel-stack2)

</h5>

This API is **deprecated since @blueprintjs/core v3.40.0** in favor of the new
**PanelStack2** component. You should migrate to the new API which will become the
standard in a future major version of Blueprint.

</div>

`PanelStack` manages a stack of panels and displays only the topmost panel.

Each panel appears with a header containing a "back" button to return to the
previous panel. The bottom-most `initialPanel` cannot be closed or removed from
the stack. Panels use
[`CSSTransition`](http://reactcommunity.org/react-transition-group/css-transition)
for seamless transitions.

By default, only the currently active panel is rendered to the DOM. This means
that other panels are unmounted and can lose their component state as a user
transitions between the panels. You can notice this in the example below as
the numeric counter is reset. To render all panels to the DOM and keep their
React trees mounted, change the `renderActivePanelOnly` prop.

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
        return <Button onClick={this.openSettingsPanel} text="Settings" />;
    }

    private openSettingsPanel() {
        // openPanel (and closePanel) are injected by PanelStack
        this.props.openPanel({
            component: SettingsPanel, // <- class or stateless function type
            props: { enabled: true }, // <- SettingsPanel props without IPanelProps
            title: "Settings", // <- appears in header and back button
        });
    }
}

class SettingsPanel extends React.Component<IPanelProps & { enabled: boolean }> {
    // ...
}

<PanelStack initialPanel={{ component: MyPanel, title: "Home" }} />;
```

@interface IPanel

@interface IPanelProps

@## Props interface

PanelStack can be operated as a controlled or uncontrolled component.

@interface IPanelStackProps
