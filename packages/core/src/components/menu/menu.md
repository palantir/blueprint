@# Menu

__Menu__ displays a list of interactive menu items.

@reactExample MenuExample

@## Usage

Blueprint's __Menu__ API includes three React components:

* [__Menu__](#core/components/menu)
* [__MenuItem__](#core/components/menu.menu-item)
* [__MenuDivider__](#core/components/menu.menu-divider)

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

@## Props interface

`<Menu>` renders a `<ul>` container element for menu items and dividers.

@interface MenuProps

@## Menu item

__MenuItem__ is a single interactive item in a [__Menu__](#core/components/menu).

This component renders an `<li>` containing an `<a>`. You can make the __MenuItem__ interactive by defining the
`href`, `target`, and `onClick` props as necessary.

Create submenus by nesting __MenuItem__ elements inside each other as `children`. Remember to use the required `text`
prop to define __MenuItem__ content.

@reactExample MenuItemExample

@interface MenuItemProps

@## Menu divider

__MenuDivider__ is a decorative component used to group sets of items into sections which may optionally have a title.

@interface MenuDividerProps

@## Dropdowns

__Menu__ only renders a static list container element. To make an interactive dropdown menu, you may leverage
[__Popover__](#core/components/popover) and specify a __Menu__ as the `content` property:

```tsx
<Popover content={<Menu>...</Menu>} placement="bottom">
    <Button alignText="left" icon="applications" rightIcon="caret-down" text="Open with..." />
</Popover>
```

Some tips for designing dropdown menus:

* __Appearance__: it's often useful to style the target Button with `fill={true}`, `alignText="left"`, and
  `rightIcon="caret-down"`. This makes it appear more like an [HTML `<select>`](#core/components/html-select) dropdown.

* __Interactions__: by default, the popover is automatically dismissed when the user clicks a menu
  item ([Popover docs](#core/components/popover.closing-on-click) have more details). If you want to opt out of this
  behavior, set `shouldDismissPopover={false}` on a __MenuItem__. For example, clicking the "Table" item in this
  dropdown menu will not dismiss the `Popover`:

@reactExample DropdownMenuExample

@## Submenus

To add a submenu to a __Menu__, you may nest one or more __MenuItem__ elements within another __MenuItem__.
The submenu opens to the right of its parent by default, but will adjust and flip to the left if there is not enough
room to the right.

```tsx
<Menu>
    <MenuItem text="Submenu">
        <MenuItem text="Child one" />
        <MenuItem text="Child two" />
        <MenuItem text="Child three" />
    </MenuItem>
</Menu>
```

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<Menu>` and `<MenuItem>`](#core/components/menu)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

Menus can be constructed manually using the following HTML markup and `@ns-menu-*` classes
(available in JS/TS as `Classes.MENU_*`):

* Begin with a `ul.@ns-menu`. Each `li` child denotes a single entry in the menu.

* Put a `.@ns-menu-item` element inside an `li` to create a clickable entry. Use either `<button>` or `<a>` tags for
  menu items to denote interactivity.

* Add icons to menu items the same way you would to buttons: add the appropriate `@ns-icon-<name>` class\*.

* Make menu items active with the class `@ns-active` (along with `@ns-intent-*` if suitable).

* Make menu items non-interactive with the class `@ns-disabled`.

* Wrap menu item text in a `<span>` element for proper alignment. (Note that React automatically does this.)

* Add a right-aligned label to a menu item by adding a `span.@ns-menu-item-label` inside the
  `.@ns-menu-item`, after the content. Add an icon to the label by adding icon classes to the label
  element (`@ns-icon-standard` size is recommended).

* Add a divider between items with `li.@ns-menu-divider`.

* If you want the popover to close when the user clicks a menu item, add the class `@ns-popover-dismiss` to any
  relevant menu items.

<small>\* You do not need to add a `@ns-icon-<sizing>` class to menu items—icon sizing is
defined as part of `.@ns-menu-item`.</small>

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign @ns-callout-has-body-content">

Note that the following examples are `display: inline-block`; you may need to adjust
menu width in your own usage.

</div>

@css menu

@### Section headers

Add an `li.@ns-menu-header`. Wrap the text in an `<h6>` tag for proper typography and borders.

@css menu-header
