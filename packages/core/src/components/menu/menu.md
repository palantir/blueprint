@# Menu

Menus display lists of interactive items.

@reactExample MenuExample

The Menu API includes three React components:

* [Menu](#core/components/menu.menu)
* [MenuItem](#core/components/menu.menu-item)
* [MenuDivider](#core/components/menu.menu-divider)

```tsx
<Menu>
    <MenuItem icon="new-text-box" onClick={handleClick} text="New text box" />
    <MenuItem icon="new-object" onClick={handleClick} text="New object" />
    <MenuItem icon="new-link" onClick={handleClick} text="New link" />
    <MenuDivider />
    <MenuItem text="Settings..." icon="cog" intent="primary">
        <MenuItem icon="tick" text="Save on edit" />
        <MenuItem icon="blank" text="Compile on edit" />
    </MenuItem>
</Menu>
```

@## Props

A `Menu` is a `<ul>` container for menu items and dividers.

@interface IMenuProps

@## Menu item

A `MenuItem` is a single interactive item in a `Menu`.

This component renders an `<li>` containing an `<a>`. Make the `MenuItem`
interactive by providing the `href`, `target`, and `onClick` props as necessary.

Create submenus by nesting `MenuItem`s inside each other as `children`. Use the
required `text` prop for `MenuItem` content.

@reactExample MenuItemExample

@interface IMenuItemProps

@## Menu divider

Use `MenuDivider` to separate menu sections. Optionally, add a title to the divider.

@interface IMenuDividerProps

@## Dropdowns

The `Menu` component by itself simply renders a list of items. To make a
dropdown menu, compose a `Menu` as the `content` property of a `Popover`:

```tsx
<Popover content={<Menu>...</Menu>} position={Position.RIGHT_TOP}>
    <Button icon="share" text="Open in..." />
</Popover>
```

By default, the popover is automatically dismissed when the user clicks a menu
item ([Popover docs](#core/components/popover.closing-on-click) have more
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

<div class="@ns-callout @ns-intent-danger @ns-icon-error">
    <h4 class="@ns-heading">

Deprecated prop `popoverProps`: use [MenuItem2](#popover2-package/menu-item2)

</h4>

Usage of `<MenuItem popoverProps={...}>` is **deprecated since @blueprintjs/core v4.7.0**
in favor of the new MenuItem2 component, which uses Popover2 instead of Popover under the hood.
If you use customize the layout of submenus using this prop, you should migrate to the new API
which will become the standard in Blueprint v5.

</div>

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
