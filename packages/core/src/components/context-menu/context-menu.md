@# Context menu

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">

Deprecated: use [ContextMenu2](#popover2-package/context-menu2)

</h4>

This API is **deprecated since @blueprintjs/core v3.39.0** in favor of the new
ContextMenu2 component available in the `@blueprintjs/popover2` package. You should migrate
to the new API which will become the standard in Blueprint v5.

</div>

Context menus present the user with a list of actions upon a right-click.

You can create context menus in either of the following ways:

1. Adding the `@ContextMenuTarget` [decorator](#core/components/context-menu.decorator-usage)
   to a React component that implements `renderContextMenu(): JSX.Element`.
1. Use the [imperative](#core/components/context-menu.imperative-usage) `ContextMenu.show`
   and `ContextMenu.hide` API methods, ideal for non-React-based applications.

@reactExample ContextMenuExample

@## Decorator usage

The `@ContextMenuTarget` [class decorator][ts-decorator] can be applied to any `React.Component`
class that meets the following requirements:

-   It defines an instance method called `renderContextMenu()` that returns a single `JSX.Element`
    (most likely a [`Menu`](#core/components/menu)) or `undefined`.
-   Its root element supports the `"contextmenu"` event and the `onContextMenu` prop.

    This is always true if the decorated class uses an intrinsic element, such
    as `<div>`, as its root. If it uses a custom element as its root, you must
    ensure that the prop is implemented correctly for that element.

When the user triggers the `"contextmenu"` event on the decorated class, `renderContextMenu()` is
called. If `renderContextMenu()` returns an element, the browser's native [context menu][wiki-cm] is
blocked and the returned element is displayed instead in a `Popover` at the cursor's location.

If the instance has a `onContextMenuClose` method, the decorator will call this function when
the context menu is closed.

```tsx
import { ContextMenuTarget, Menu, MenuItem } from "@blueprintjs/core";

@ContextMenuTarget
class RightClickMe extends React.Component {
    public render() {
        // root element must support `onContextMenu`
        return <div>{...}</div>;
    }

    public renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem onClick={this.handleSave} text="Save" />
                <MenuItem onClick={this.handleDelete} text="Delete" />
            </Menu>
        );
    }

    public onContextMenuClose() {
        // Optional method called once the context menu is closed.
    }
}
```

If you're using Blueprint in Javascript, and don't have access to the Babel config (ie: using `create-react-app`), you won't be able to just use the decorator. You can, instead, use it as a [Higher-Order Component][react-hoc], and get to keep all the benefits of `ContextMenuTarget`:

```jsx
import { ContextMenuTarget, Menu, MenuItem } from "@blueprintjs/core";

const RightClickMe = ContextMenuTarget(class RightClickMeWithContext extends React.Component {
    render() {
        // root element must support `onContextMenu`
        return <div>{...}</div>;
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem onClick={this.handleSave} text="Save" />
                <MenuItem onClick={this.handleDelete} text="Delete" />
            </Menu>
        );
    }

    onContextMenuClose() {
        // Optional method called once the context menu is closed.
    }
});
```

[ts-decorator]: https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md
[wiki-cm]: https://en.wikipedia.org/wiki/Context_menu
[react-hoc]: https://reactjs.org/docs/higher-order-components.html

@## Imperative usage

The imperative API provides a single static `ContextMenu` object, enforcing the
principle that only one context menu can be open at a time. This API is ideal
for programmatically triggered menus or for non-React apps.

-   `ContextMenu.show(menu: JSX.Element, offset: IOffset, onClose?: () => void, isDarkTheme?: boolean): void`

    Show the given element at the given offset from the top-left corner of the
    viewport. Showing a menu closes the previously shown one automatically. The
    menu appears below-right of this point, but will flip to below-left instead if
    there is not enough room on-screen. The optional callback is invoked when this
    menu closes.

-   `ContextMenu.hide(): void`

    Hide the context menu, if it is open.

-   `ContextMenu.isOpen(): boolean`

    Whether a context menu is currently visible.

```ts
import { ContextMenu, Menu, MenuItem } from "@blueprintjs/core";

const rightClickMe = document.querySelector("#right-click-me") as HTMLElement;
rightClickMe.oncontextmenu = (e: MouseEvent) => {
    // prevent the browser's native context menu
    e.preventDefault();

    // render a Menu without JSX...
    const menu = React.createElement(
        Menu,
        {}, // empty props
        React.createElement(MenuItem, { onClick: handleSave, text: "Save" }),
        React.createElement(MenuItem, { onClick: handleDelete, text: "Delete" }),
    );

    // mouse position is available on event
    ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () => {
        // menu was closed; callback optional
    });
};
```
