@# Menu

Menus display lists of interactive items.

@reactExample MenuExample

@## Dropdowns

The `Menu` component by itself simply renders a list of items. To make a
dropdown menu, compose a `Menu` as the `content` property of a `Popover`:

```tsx
<Popover content={<Menu>...</Menu>} position={Position.RIGHT_TOP}>
    <Button icon="share" text="Open in..." />
</Popover>
```

By default, the popover is automatically dismissed when the user clicks a menu
item ([Popover docs](#core/components/popover.opening-and-closing) have more
details). If you want to opt out of this behavior, set
`shouldDismissPopover={false}` on a `MenuItem`.

In the example below, clicking the menu item labeled "Table" will not dismiss
the `Popover`.

@reactExample DropdownMenuExample

@## Submenus

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
    <h4 class="@ns-heading">JavaScript only</h4>

Submenus are only supported in the React components. They cannot be created with CSS alone because
they rely on the [`Popover`](#core/components/popover) component for positioning and transitions.

</div>

@## Props

The `Menu` API includes three stateless React components:

* [`Menu`](#core/components/menu.menu)
* [`MenuItem`](#core/components/menu.menu-item) (aliased as `Menu.Item`)
* [`MenuDivider`](#core/components/menu.menu-divider) (aliased as `Menu.Divider`)

```tsx
<Menu>
    <Menu.Item icon="new-text-box" onClick={this.handleClick} text="New text box" />
    <Menu.Item icon="new-object" onClick={this.handleClick} text="New object" />
    <Menu.Item icon="new-link" onClick={this.handleClick} text="New link" />
    <Menu.Divider />
    <Menu.Item text="Settings..." icon="cog">
        <Menu.Item icon="tick" text="Save on edit" />
        <Menu.Item icon="blank" text="Compile on edit" />
    </Menu.Item>
</Menu>
```

@### Menu

A `Menu` is a `<ul>` container for menu items and dividers.

@interface IMenuProps

@### Menu item

A `MenuItem` is a single interactive item in a `Menu`.

This component renders an `<li>` containing an `<a>`. Make the `MenuItem`
interactive by providing the `href`, `target`, and `onClick` props as necessary.

Create submenus by nesting `MenuItem`s inside each other as `children`. Use the
required `text` prop for `MenuItem` content.

@interface IMenuItemProps

@### Menu divider

Use `MenuDivider` to separate menu sections. Optionally, add a title to the divider.

@interface IMenuDividerProps

@## CSS

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
