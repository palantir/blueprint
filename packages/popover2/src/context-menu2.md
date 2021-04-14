@# ContextMenu2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [ContextMenu](#core/components/context-menu)?

</h4>

ContextMenu2 is a replacement for ContextMenu + ContextMenuTarget. It will become the standard
context menu API in Blueprint core v4. You are encouraged to use this new API now to ease the
transition to the next major version of Blueprint. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/ContextMenu2-migration) on the wiki.

</div>

Context menus present the user with a list of actions when right-clicking on a target element.
They are essentially an opinionated version of Popover2, configured with the appropriate
interaction handlers.

@reactExample ContextMenu2Example

@## Usage

Create a context menu using the simple function component:

```tsx
import { Menu, MenuItem } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";

export default function ContextMenuExample() {
    return (
        <ContextMenu2
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
        </ContextMenu2>
    );
}
```

Both `content` and `children` props support the [render prop](https://reactjs.org/docs/render-props.html)
pattern, so you may use information about the context menu's state to in your render code.

### Advanced usage

By default, `<ContextMenu2>` will render a container `<div>` element around its children, to contain the
generated Popover and attach an event handler. If this container breaks your HTML and/or CSS layout in some
way and you wish to omit it, you may do so by utilizing ContextMenu2's advanced rendering API, which
uses a `children` render function. If you use this approach, you must take care to properly use the
render props supplied to `children()`:

```tsx
import classNames from "classnames";
import { Menu, MenuItem } from "@blueprintjs/core";
import { ContextMenu2, ContextMenu2ChildrenProps } from "@blueprintjs/popover2";

export default function AdvancedContextMenu2Example() {
    return (
        <ContextMenu2
            content={
                <Menu>
                    <MenuItem text="Save" />
                    <MenuItem text="Save as..." />
                    <MenuItem text="Delete..." intent="danger" />
                </Menu>
            }
        >
            {(props: ContextMenu2ChildrenProps) => (
                <div
                    className={classNames("my-context-menu-target", props.className)}
                    onContextMenu={props.onContextMenu}
                    ref={props.ref}
                >
                    Right click me!
                </div>
            )}
        </ContextMenu>
    )
}
```

@## Props

To enable/disable the context menu popover, use the `disabled` prop. Note that it is inadvisable to change
the value of this prop inside the `onContextMenu` callback for this component; doing so can lead to unpredictable
behavior.

@interface ContextMenu2Props
