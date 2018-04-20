@# Menus

Menus display lists of interactive items.

@## JavaScript API

The `Menu`, `MenuItem`, and `MenuDivider` components are available in the **@blueprintjs/core**
package. Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

The `Menu` API includes three stateless React components:

* [`Menu`](#core/components/menu.menu)
* [`MenuItem`](#core/components/menu.menu-item)
* [`MenuDivider`](#core/components/menu.menu-divider)

@### Sample usage

```tsx
import { Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

class MenuExample extends React.Component<{}, {}> {
    public render() {
        return (
            <Menu>
                <MenuItem icon="new-text-box" onClick={this.handleClick} text="New text box" />
                <MenuItem icon="new-object" onClick={this.handleClick} text="New object" />
                <MenuItem icon="new-link" onClick={this.handleClick} text="New link" />
                <MenuDivider />
                <MenuItem text="Settings..." icon="cog" />
            </Menu>
        );
    }

    private handleClick(e: React.MouseEvent) {
        console.log("clicked", (e.target as HTMLElement).textContent);
    }
}
```

@reactExample MenuExample

@### Menu

A `Menu`'s children (menu items and dividers) are rendered as the contents of a `.@ns-menu` element.

You can add the `@ns-large` class to the `Menu` to make a larger version of the menu.

@interface IMenuProps

@### Menu item

A `MenuItem` is a single interactive item in a `Menu`.

This component renders an `a.@ns-menu-item`. Make the `MenuItem` a link by providing the `href`,
`target`, and `onClick` props as necessary.

Create submenus by nesting `MenuItem`s inside each other as `children`. Use the `text` prop
for `MenuItem` content.

@interface IMenuItemProps

@### Menu divider

Use `MenuDivider` to separate menu sections. Optionally, add a title to the divider.

@interface IMenuDividerProps

@### Submenus

To add a submenu to a `Menu`, simply nest `MenuItem`s within another `MenuItem`.
The submenu opens to the right of its parent by default, but will adjust and flip to the left if
there is not enough room to the right.

```tsx
<Menu>
    <MenuItem text="Submenu">
        <MenuItem text="Child one" />
        <MenuItem text="Child two" />
        <MenuItem text="Child three" />
    </MenuItem>
</Menu>
```

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">
    <h4 class="@ns-callout-title">JavaScript only</h4>
    Submenus are only supported in the React components. They cannot be created with CSS alone because
    they rely on the [`Popover`](#core/components/popover) component for positioning and transitions.
</div>

@### Dropdown menus

The `Menu` component by itself simply renders a menu list. To make a dropdown menu, use a `Menu`
element as the `content` property of a `Popover`:

```tsx
<Popover content={<Menu>...</Menu>} position={Position.RIGHT_TOP}>
    <Button icon="share" text="Open in..." />
</Popover>
```

When the user clicks a menu item that is not disabled and is not part of a submenu, the popover is
automatically dismissed (in other words, the menu closes). This is because the `MenuItem` component
adds the `@ns-popover-dismiss` class to these items by default (see
[Popover JavaScript API](#core/components/popover) for more information). If you want to opt out of
this behavior, you can add the `shouldDismissPopover` prop to a `MenuItem`.

Notice that selecting the menu item labeled "Table" in the example below does not automatically
dismiss the `Popover`. Selecting other menu items does dismiss the popover.

@reactExample DropdownMenuExample

@## CSS API

Menus can be constructed manually using the HTML markup and `@ns-menu-*` classes below. However, you
should use the menu [React components](#core/components/menu.javscript-api) instead wherever possible,
as they abstract away the tedious parts of implementing a menu.

* Begin with a `ul.@ns-menu`. Each `li` child denotes a single entry in the menu.

* Put a `.@ns-menu-item` element inside an `li` to create a clickable entry. Use either `<button>` or
  `<a>` tags for menu items to denote interactivity.

* Add icons to menu items the same way you would to buttons: simply add the appropriate
  `@ns-icon-<name>` class\*.

* Make menu items active with the class `@ns-active` (along with `@ns-intent-*` if suitable).

* Make menu items non-interactive with the class `@ns-disabled`.

* Wrap menu item text in a `<span>` element for proper alignment. (Note that React automatically
  does this.)

* Add a right-aligned label to a menu item by adding a `span.@ns-menu-item-label` inside the
  `.@ns-menu-item`, after the content. Add an icon to the label by adding icon classes to the label
  element (`@ns-icon-standard` size is recommended).

* Add a divider between items with `li.@ns-menu-divider`.

* If you want the popover to close when the user clicks a menu item, add the class
  `@ns-popover-dismiss` to any relevant menu items.

<small>\* You do not need to add a `@ns-icon-<sizing>` class to menu items—icon sizing is
defined as part of `.@ns-menu-item`.</small>

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    Note that the following examples are `display: inline-block`; you may need to adjust
    menu width in your own usage.
</div>

@css menu

@### Section headers

Add an `li.@ns-menu-header`. Wrap the text in an `<h6>` tag for proper typography and borders.

@css menu-header
