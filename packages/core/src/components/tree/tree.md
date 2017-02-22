@# Trees

Trees display hierarchical data.

@## JavaScript API

The `Tree` component is available in the __@blueprintjs/core__ package.
Make sure to review the [general usage docs for JS components](#components.usage).

`Tree` is a stateless component. Its contents are dictated by the `contents` prop, which is an array
of `ITreeNode`s (see [below](#components.tree.js.treenode)). The tree is multi-rooted if `contents`
contains more than one top-level object.

A variety of interaction callbacks are also exposed as props. All interaction callbacks supply a
parameter `nodePath`, which is an array of numbers representing a node's position in the tree. For
example, `[2, 0]` represents the first child (`0`) of the third top-level node (`2`).

@interface ITreeProps

@reactExample TreeExample

@### Tree node interface

`ITreeNode` objects determine the contents, appearance, and state of each node in the tree.

For example, `iconName` controls the icon displayed for the node, and `isExpanded` determines
whether the node's children are shown.

@interface ITreeNodeProps

@## CSS API

See below for the [JavaScript API](#components.tree.js) for the `Tree` React component. However, you
may also use the provided styles by themselves, without using the component.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
    Note that the following examples set a maximum width and background color for the tree;
    you may want to do this as well in your own usage.
</div>
