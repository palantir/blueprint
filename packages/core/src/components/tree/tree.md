@# Tree

__Trees__ display hierarchical data.

@reactExample TreeExample

@## Props interface

__Tree__ is a stateless component. Its contents are dictated by the `contents` prop, which is an array of `<TreeNode>`
elements (see [below](#components/tree.tree-node)). The tree is multi-rooted if `contents` contains more than one
top-level object.

A variety of interaction callbacks are also exposed as props. All interaction callbacks supply a parameter `nodePath`,
which is an array of numbers representing a node's position in the tree. For example, `[2, 0]` represents the first
child (`0`) of the third top-level node (`2`).

@interface TreeProps

@### Instance methods

*   `Tree.getNodeContentElement(nodeId: string | number): HTMLElement | undefined` &ndash;
    Returns the underlying HTML element of the `Tree` node with an id of `nodeId`.
    This element does not contain the children of the node, only its label and controls.
    If the node is not currently mounted, `undefined` is returned.

@### Tree node

__TreeNode__ elements determine the contents, appearance, and state of each node in the tree.

For example, `icon` controls the icon displayed for the node, and `isExpanded` determines whether the node's children
are shown.

@interface TreeNodeProps

@## CSS API

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign @ns-callout-has-body-content">
    <h5 class="@ns-heading">

Deprecated API: use [`<Tree>`](#core/components/tree)

</h5>

CSS APIs for Blueprint components are considered deprecated, as they are verbose, error-prone, and they
often fall out of sync as the design system is updated. You should use the React component APIs instead.

</div>

@css tree
