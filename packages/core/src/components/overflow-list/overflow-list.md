@# Overflow list

`OverflowList` takes a generic list of items and renders as many items as can
fit inside itself. Other items are collapsed into an overflow menu. The visible
items will be recomputed when a resize is detected.

The `items` prop accepts an array of generic objects. The required
`visibleItemRenderer` callback prop determines the appearance of a visible item.
The required `overflowRenderer` callback prop receives all overflowed items
and renders the overflow menu or indicator.

The component uses a polyfill for the [proposed `ResizeObserver` API][resizeobserver]
to efficiently detect when its dimensions change. Use the `observeParents` prop
to watch for resizing further up in the DOM tree.

[resizeobserver]: https://developers.google.com/web/updates/2016/10/resizeobserver

@reactExample OverflowListExample

@interface IOverflowListProps
