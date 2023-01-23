---
tag: new
---

@# MenuItem2

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">
    <h5 class="@ns-heading">

Migrating from [MenuItem](#core/components/menu.menu-item)?

</h5>

MenuItem2 is a replacement for MenuItem. It uses Popover2 instead of Popover for its submenus.
You are encouraged to migrate to MenuItem2 now in the rare case where you customize submenu layout
using the `<MenuItem popoverProps>` API (see the
[Popover2 migration guide](https://github.com/palantir/blueprint/wiki/Popover2-migration#menuitem2)
on the wiki) &mdash; otherwise, you can leave MenuItem as-is and it will be seamlessly updated
in Blueprint v5.

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
- `roleStructure="listitem"` is appropriate for a `<ul>` (no role defined) or a `<ul role="list">` parent. The
    item will render with `<li>` and `<a>` (roles undefined).
- `roleStructure="none"` is useful when wrapping in a custom `<li>`. The
    item will render with `<li role="none">` and `<a>` (roles undefined).

@## Selection state

When `roleStructure="listoption"` is set, MenuItem2 has built-in support for indicating selection state
using an icon on the left side of the item element. This works for both single- and multi-selection, like the
kind you would find in Select2, Suggest2, or MultiSelect2 components.

Specify selection state with the `selected?: boolean | undefined` prop. Note that `undefined` is only recommended
with `roleStructure="menuitem"`, and an explicit boolean value (`true` or `false`) should be set when using
`roleSTructure="listoption"` &mdash; this ensures consistent padding on the left side of menu items which are
not currently selected.

Also note that the `icon` prop will take precedence over `selected` if specified, and using them both at the same
time is not recommended.

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
