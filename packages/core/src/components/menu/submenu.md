---
parent: components
---

### Submenus

To add a submenu to a `Menu`, simply nest `MenuItem`s within another `MenuItem`.
The submenu opens to the right of its parent by default, but will adjust and flip to the left if
there is not enough room to the right.

```
<MenuItem text="Submenu">
<MenuItem text="Child one" />
<MenuItem text="Child two" />
<MenuItem text="Child three" />
</MenuItem>
```

Alternatively, you can pass an array of `IMenuItemProps` to the `submenu` prop:

```
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

Weight: 2
