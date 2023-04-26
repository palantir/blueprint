@# MenuItem

A MenuItem is a single interactive item in a [Menu](#core/components/menu).

@reactExample MenuItemExample

@## Markup

This component renders an `<li>` element containing an `<a>` anchor element.
Use the required `text` prop for text label content.
To make the menu item interactive, provide the `href`, `target`, and `onClick` props as necessary.

MenuItem supports multiple "role structures" which allow it to be used in different contexts
depending on the `role` attribute of its parent `<ul>` list:

- `roleStructure="menuitem"` is the default. This is appropriate for a `<ul role="menu">` parent.
    The item will render with `<li role="none">` and `<a role="menuitem">`.
- `roleStructure="listoption"` is appropriate for a `<ul role="listbox">` parent, such as
    those found in Select, Suggest, and MultiSelect components. The item will render with
    `<li role="option">` and `<a>` (anchor role undefined).

@## Submenus

Menu items may have submenus when nested MenuItem `children` are defined. These nested items will
be displayed inside a popover next to the active menu item on hover. Here's a code example:

```tsx
import { Menu, MenuItem } from "@blueprintjs/core";

function Example() {
    return (
        <Menu>
            <MenuItem text="See more">
                <MenuItem text="First submenu item" />
                <MenuItem text="Second submenu item" />
            </MenuItem>
        </Menu>
    )
}
```

@## Props

@interface MenuItemProps
