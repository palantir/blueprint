@# ContextMenu2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [ContextMenu](#core/components/context-menu)?

</h4>

ContextMenu2 is a replacement for ContextMenu + ContextMenuTarget. It will become the standard
context menu API in Blueprint core v5. You are encouraged to use this new API now to ease the
transition to the next major version of Blueprint. See the full
[migration guide](https://github.com/palantir/blueprint/wiki/ContextMenu2-migration) on the wiki.

</div>

Context menus present the user with a list of actions when right-clicking on a target element.
They essentially generate an opinionated Popover2 instance configured with the appropriate
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

`<ContextMenu2>` will render a `<div>` wrapper element around its children. You can treat this
component as a `<div>`, since extra props will be forwarded down to the DOM element. For example,
you can add an `onClick` handler. You may also customize the tag name of the generated wrapper
element using the `tagName` prop. Note that the generated popover will be rendered as a _sibling_
of this wrapper element.

### Advanced usage

By default, `<ContextMenu2>` will render a wrapper element around its children to attach an event handler
and get a DOM ref for theme detection. If this wrapper element breaks your HTML and/or CSS layout in
some way and you wish to omit it, you may do so by utilizing ContextMenu2's advanced rendering API
which uses a `children` render function. If you use this approach, you must take care to properly use
all the render props supplied to the `children()` function:

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
            {(ctxMenuProps: ContextMenu2ChildrenProps) => (
                <div
                    className={classNames("my-context-menu-target", ctxMenuProps.className)}
                    onContextMenu={ctxMenuProps.onContextMenu}
                    ref={ctxMenuProps.ref}
                >
                    {ctxMenuProps.popover}
                    Right click me!
                </div>
            )}
        </ContextMenu2>
    )
}
```

Both `content` and `children` props support the [render prop](https://reactjs.org/docs/render-props.html)
pattern, so you may use information about the context menu's state (such as `isOpen: boolean`) in your
render code.

@## Props

To enable/disable the context menu popover, use the `disabled` prop. Note that it is inadvisable to change
the value of this prop inside the `onContextMenu` callback for this component; doing so can lead to unpredictable
behavior.

@interface ContextMenu2Props
