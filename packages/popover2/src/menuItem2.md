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

A MenuItem2 is a single interactive item in a `Menu`.

This component renders an `<li>` containing an `<a>`. To make the menu item interactive,
provide the `href`, `target`, and `onClick` props as necessary.

Create submenus by nesting MenuItem2s inside each other as `children`. Use the
required `text` prop for MenuItem2 content.

@reactExample MenuItem2Example
