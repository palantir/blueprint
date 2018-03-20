@# Context menus

Context menus present the user with a custom list of actions upon right-click.

You can create context menus in either of the following ways:

- by adding the `@ContextMenuTarget` [decorator](#core/components/context-menu.decorator-api)
  to a React component that implements `renderContextMenu(): JSX.Element`.
- via the [imperative](#core/components/context-menu.imperative-api) `ContextMenu.show`
  and `ContextMenu.hide` API methods, ideal for non-React-based applications.

@reactExample ContextMenuExample

@## Decorator API

The `ContextMenuTarget` decorator is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

The `@ContextMenuTarget` [class decorator][ts-decorator] can be applied to any `React.Component`
class that meets the following requirements:

- It defines an instance method called `renderContextMenu()` that returns a single `JSX.Element`
(most likely a [`Menu`](#core/components/menu)) or `undefined`.
- Its root element supports the `"contextmenu"` event and the `onContextMenu` prop.

This is always true if the decorated class uses an intrinsic element, such as `<div>`, as its
root. If it uses a custom element as its root, you must ensure that the prop is implemented
correctly for that element.

When the user triggers the `"contextmenu"` event on the decorated class, `renderContextMenu()` is
called. If `renderContextMenu()` returns an element, the browser's native [context menu][wiki-cm] is
blocked and the returned element is displayed instead in a `Popover` at the cursor's location.

If the instance has a `onContextMenuClose` method, the decorator will call this function when
the context menu is closed.

```tsx
import { ContextMenuTarget, Menu, MenuItem } from "@blueprintjs/core";

@ContextMenuTarget
class RightClickMe extends React.Component<{}, {}> {
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

[ts-decorator]: https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md
[wiki-cm]: https://en.wikipedia.org/wiki/Context_menu

@## Imperative API

The `ContextMenu` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

The imperative API provides a single static `ContextMenu` object, enforcing the principle that only
one context menu can be open at a time.

- `ContextMenu.show(menu: JSX.Element, offset: IOffset, onClose?: () => void): void` &ndash;
Show the given element at the given offset from the top-left corner of the viewport.
Showing a menu closes the previously shown one automatically.

The menu appears below-right of this point, but will flip to below-left instead if there is not
enough room onscreen. The optional callback is invoked when this menu closes.

- `ContextMenu.hide(): void` &ndash; Hide the context menu, if it is open.
- `ContextMenu.isOpen(): boolean` &ndash; Whether a context menu is currently visible.

This API is ideal for non-React-based apps or for programmatically triggered menus.

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
