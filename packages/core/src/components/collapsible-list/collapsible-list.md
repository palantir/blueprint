@# Collapsible list

The `CollapsibleList` React component accepts a list of menu items and a count of visible items. It
shows precisely that many items and collapses the rest into a dropdown menu. The required
`visibleItemRenderer` callback prop allows for customizing the appearance of visible items, using the
props from the `MenuItem` children.

@reactExample CollapsibleListExample

@## JavaScript API

The `CollapsibleList` component is available in the __@blueprintjs/core__ package.
Make sure to review the [getting started docs for installation info](#blueprint/getting-started).

Children of the `CollapsibleList` component _must_ be `MenuItem`s so they can be easily rendered
in the dropdown. Define a `visibleItemRenderer` callback to customize the appearance of visible
items using their [`IMenuItemProps`](#core/components/menu.menu-item).

@interface ICollapsibleListProps

@## Separators

Often a list of items calls for separators between each item.
Adding separators to a `CollapsibleList` is easily achieved via CSS using `::after` pseudo-elements.

```css.scss
// pass `visibleItemClassName="my-list-item"` to component, then...

.my-list-item::after {
    display: inline-block;
    content: "";
    // custom separator styles...
}

// remove separator after the last item
.my-list-item:last-child::after {
    display: none;
}
```
