---
tag: new
---

@# MenuItem2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h4 class="@ns-heading">

Migrating from [MenuItem](#core/components/menu.menu-item)?

</h4>

MenuItem2 is a replacement for MenuItem and will replace it in Blueprint core v5.
You are encouraged to use this new API now to ease the transition to the next major version of Blueprint.
See the [migration guide](https://github.com/palantir/blueprint/wiki/Popover2-migration#menuitem2)
on the wiki (the changes are minimal, it should be an easy drop-in replacement).

</div>

A MenuItem2 is a single interactive item in a [Menu](#core/components/menu).

@reactExample MenuItem2Example

@## Markup

This component renders an `<li>` element containing an `<a>` anchor element.
Use the required `text` prop for text label content.
To make the menu item interactive, provide the `href`, `target`, and `onClick` props as necessary.

MenuItem2 supports multiple "role structures" which allow it to be used in different contexts
depending on the `role` attribute of its parent `<ul>` list:

- `roleStructure="menuitem"` is the default. This is appropriate for a `<ul role="menu">` parent.
    The item will render with `<li role="none">` and `<a role="menuitem">`.
- `roleStructure="listoption"` is appropriate for a `<ul role="listbox">` parent, such as
    those found in Select2, Suggest2, and MultiSelect2 components. The item will render with
    `<li role="option">` and `<a>` (anchor role undefined).

@## Submenus

Menu items may have submenus when nested MenuItem2 `children` are defined. These nested items will
be displayed inside a popover next to the active menu item on hover. Here's a code example:

```tsx
import { Menu } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";

function Example() {
    return (
        <Menu>
            <MenuItem2 text="See more">
                <MenuItem2 text="First submenu item" />
                <MenuItem2 text="Second submenu item" />
            </MenuItem2>
        </Menu>
    )
}
```

@## Props

@interface MenuItem2Props
