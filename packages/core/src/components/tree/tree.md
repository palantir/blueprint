@# Tree

Trees display hierarchical data.

@reactExample TreeExample

@## Props

`Tree` is a stateless component. Its contents are dictated by the `contents` prop, which is an array
of `ITreeNode`s (see [below](#components/tree.tree-node)). The tree is multi-rooted if
`contents` contains more than one top-level object.

A variety of interaction callbacks are also exposed as props. All interaction callbacks supply a
parameter `nodePath`, which is an array of numbers representing a node's position in the tree. For
example, `[2, 0]` represents the first child (`0`) of the third top-level node (`2`).

@interface ITreeProps

@### Instance methods

* `Tree.getNodeContentElement(nodeId: string | number): HTMLElement | undefined` &ndash;
  Returns the underlying HTML element of the `Tree` node with an id of `nodeId`.
  This element does not contain the children of the node, only its label and controls.
  If the node is not currently mounted, `undefined` is returned.

@### Tree node

`ITreeNode` objects determine the contents, appearance, and state of each node in the tree.

For example, `icon` controls the icon displayed for the node, and `isExpanded` determines
whether the node's children are shown.

@interface ITreeNodeProps

@## CSS

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

Note that the following examples set a maximum width and background color for the tree;
you may want to do this as well in your own usage.

</div>

@css tree
