@# ContextMenu

Context menus present the user with a list of actions when right-clicking on a target element.
They are essentially an opinionated version of Popover, configured with the appropriate
interaction handlers.

@reactExample ContextMenuExample

@## Usage

Create a context menu using the simple function component:

```tsx
import { ContextMenu, Menu, MenuItem } from "@blueprintjs/core";

export default function ContextMenuExample() {
    return (
        <ContextMenu
            content={
                <Menu>
                    <MenuItem text="Save" />
                    <MenuItem text="Save as..." />
                    <MenuItem text="Delete..." intent="danger" />
                </Menu>
            }
        >
            <div className="my-context-menu-target">
                Right click me!
            </div>
        </ContextMenu>
    );
}
```

Both `content` and `children` props support the [render prop](https://reactjs.org/docs/render-props.html)
pattern, so you may use information about the context menu's state to in your render code.

@## Props

To enable/disable the context menu popover, use the `disabled` prop. Note that it is inadvisable to change
the value of this prop inside the `onContextMenu` callback for this component; doing so can lead to unpredictable
behavior.

@interface ContextMenuProps
