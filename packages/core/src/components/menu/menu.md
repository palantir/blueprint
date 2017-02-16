---
parent: components
---

# Menus

Menus display lists of interactive items.

## JavaScript API

The `Menu`, `MenuItem`, and `MenuDivider` components are available in the __@blueprintjs/core__
package. Make sure to review the [general usage docs for JS components](#components.usage).

The `Menu` API includes three stateless React components:

- [`Menu`](#components.menu.js.menu)
- [`MenuItem`](#components.menu.js.menu-item)
- [`MenuDivider`](#components.menu.js.menu-divider)

### Sample usage

```tsx
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

class MenuExample extends React.Component<{}, {}> {
    public render() {
        return (
            <Menu>
                <MenuItem
                    iconName="new-text-box"
                    onClick={this.handleClick}
                    text="New text box"
                />
                <MenuItem
                    iconName="new-object"
                    onClick={this.handleClick}
                    text="New object"
                />
                <MenuItem
                    iconName="new-link"
                    onClick={this.handleClick}
                    text="New link"
                />
                <MenuDivider />
                <MenuItem text="Settings..." iconName="cog" />
            </Menu>
        );
    }

    private handleClick(e: React.MouseEvent) {
        console.log("clicked", (e.target as HTMLElement).textContent);
    }
}
```

@reactExample MenuExample

### Menu

A `Menu`'s children (menu items and dividers) are rendered as the contents of a `.pt-menu` element.

You can add the `pt-large` class to the `Menu` to make a larger version of the menu.

@interface IMenuProps

### Menu item

A `MenuItem` is a single interactive item in a `Menu`.

This component renders an `a.pt-menu-item`. Make the `MenuItem` a link by providing the `href`,
`target`, and `onClick` props as necessary.

Create submenus by nesting `MenuItem`s inside each other as `children`, or by providing a `submenu`
prop with an array of `MenuItem`s.

@interface IMenuItemProps

### Menu divider

Use `MenuDivider` to separate menu sections. Optionally, add a title to the divider.

@interface IMenuDividerProps

### Submenus

To add a submenu to a `Menu`, simply nest `MenuItem`s within another `MenuItem`.
The submenu opens to the right of its parent by default, but will adjust and flip to the left if
there is not enough room to the right.

```jsx
<MenuItem text="Submenu">
    <MenuItem text="Child one" />
    <MenuItem text="Child two" />
    <MenuItem text="Child three" />
</MenuItem>
```

Alternatively, you can pass an array of `IMenuItemProps` to the `submenu` prop:

```jsx
React.createElement(MenuItem, {
    submenu: [
        { text: "Child one" },
        { text: "Child two" },
        { text: "Child three" },
    ],
    text: "parent",
});
```

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
    <h5>JavaScript only</h5>
    Submenus are only supported in the React components. They cannot be created with CSS alone because
    they rely on the [`Popover`](#components.popover) component for positioning and transitions.
</div>

### Dropdown menus

The `Menu` component by itself simply renders a menu list. To make a dropdown menu, use a `Menu`
element as the `content` property of a `Popover`:

```jsx
<Popover content={<Menu>...</Menu>} position={Position.RIGHT_TOP}>
    <Button iconName="share" text="Open in..." />
</Popover>
```

When the user clicks a menu item that is not disabled and is not part of a submenu, the popover is
automatically dismissed (in other words, the menu closes). This is because the `MenuItem` component
adds the `pt-popover-dismiss` class to these items by default (see [Popover JavaScript
API](#components.popover.js) for more information). If you want to opt out of this behavior, you can
add the `shouldDismissPopover` prop to a `MenuItem`.

Notice that selecting the menu item labeled **Table** in the example below does not automatically
dismiss the `Popover`. Selecting other menu items does dismiss the popover.

@reactExample DropdownMenuExample

## CSS API

Menus can be constructed manually using the HTML markup and `pt-menu-*` classes below. However, you
should use the menu [React components](#components.menu.js) instead wherever possible, as they
abstract away the tedious parts of implementing a menu.

- Begin with a `ul.pt-menu`. Each `li` child denotes a single entry in the menu.

- Put a `.pt-menu-item` element inside an `li` to create a clickable entry. Use either `<button>` or
`<a>` tags for menu items to denote interactivity.

- Add icons to menu items the same way you would to buttons: simply add the appropriate
`pt-icon-<name>` class*.

- Make menu items active with the class `pt-active` (along with `pt-intent-*` if suitable).

- Make menu items non-interactive with the class `pt-disabled`.

- Wrap menu item text in a `<span>` element for proper alignment. (Note that React automatically
does this.)

- Add a right-aligned label to a menu item by adding a `span.pt-menu-item-label` inside the
`.pt-menu-item`, after the content. Add an icon to the label by adding icon classes to the label
element (`pt-icon-standard` size is recommended).

- Add a divider between items with `li.pt-menu-divider`.

- If you want the popover to close when the user clicks a menu item, add the class
`pt-popover-dismiss` to any relevant menu items.

<small>\* You do not need to add a `pt-icon-<sizing>` class to menu items&mdash;icon sizing is
defined as part of `.pt-menu-item`.</small>

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
Note that the following examples are `display: inline-block`; you may need to adjust
menu width in your own usage.
</div>

Markup:
<ul class="pt-menu {{.modifier}} pt-elevation-1">
<li>
<a class="pt-menu-item pt-icon-people" tabindex="0">Share...</a>
</li>
<li>
<a class="pt-menu-item pt-icon-circle-arrow-right" tabindex="0">Move...</a>
</li>
<li>
<a class="pt-menu-item pt-icon-edit" tabindex="0">Rename</a>
</li>
<li class="pt-menu-divider"></li>
<li>
<a class="pt-menu-item pt-icon-trash pt-intent-danger" tabindex="0">Delete</a>
</li>
</ul>

.pt-large - Large size (only supported on <code>.pt-menu</code>)

### Section headers

Add an `li.pt-menu-header`. Wrap the text in an `<h6>` tag for proper typography and borders.

Markup:
<ul class="pt-menu pt-elevation-1">
<li class="pt-menu-header"><h6>Layouts</h6></li>
<li><button type="button" class="pt-menu-item pt-icon-layout-auto">Auto</button></li>
<li><button type="button" class="pt-menu-item pt-icon-layout-circle">Circle</button></li>
<li><button type="button" class="pt-menu-item pt-icon-layout-grid">Grid</button></li>
<li class="pt-menu-header"><h6>Views</h6></li>
<li><button type="button" class="pt-menu-item pt-icon-history">History</button></li>
<li><button type="button" class="pt-menu-item pt-icon-star">Favorites</button></li>
<li><button type="button" class="pt-menu-item pt-icon-envelope">Messages</button></li>
</ul>
