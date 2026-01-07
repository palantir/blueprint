@# Menu

**Menu** displays a list of interactive menu items.

@## Import

```tsx
import { Menu } from "@blueprintjs/core";
```

@reactExample MenuExample

@## Usage

Blueprint's **Menu** API includes three React components:

-   [**Menu**](#core/components/menu)
-   [**MenuItem**](#core/components/menu.menu-item)
-   [**MenuDivider**](#core/components/menu.menu-divider)

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

**MenuItem** is a single interactive item in a [**Menu**](#core/components/menu).

This component renders an `<li>` containing an `<a>`. You can make the **MenuItem** interactive by defining the
`href`, `target`, and `onClick` props as necessary.

Create submenus by nesting **MenuItem** elements inside each other as `children`. Remember to use the required `text`
prop to define **MenuItem** content.

@reactExample MenuItemExample

@interface MenuItemProps

@## Menu divider

**MenuDivider** is a decorative component used to group sets of items into sections which may optionally have a title.

@interface MenuDividerProps

@## Dropdowns

**Menu** only renders a static list container element. To make an interactive dropdown menu, you may leverage
[**Popover**](#core/components/popover) and specify a **Menu** as the `content` property:

```tsx
<Popover content={<Menu>...</Menu>} placement="bottom">
    <Button alignText="start" icon="applications" endIcon="caret-down" text="Open with..." />
</Popover>
```

Some tips for designing dropdown menus:

-   **Appearance**: it's often useful to style the target Button with `fill={true}`, `alignText="start"`, and
    `endIcon="caret-down"`. This makes it appear more like an [HTML `<select>`](#core/components/html-select) dropdown.

-   **Interactions**: by default, the popover is automatically dismissed when the user clicks a menu
    item ([Popover docs](#core/components/popover.closing-on-click) have more details). If you want to opt out of this
    behavior, set `shouldDismissPopover={false}` on a **MenuItem**. For example, clicking the "Table" item in this
    dropdown menu will not dismiss the `Popover`:

@reactExample DropdownMenuExample

@## Submenus

To add a submenu to a **Menu**, you may nest one or more **MenuItem** elements within another **MenuItem**.
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
