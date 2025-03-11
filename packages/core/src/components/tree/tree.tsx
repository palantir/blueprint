/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";

import { Classes, DISPLAYNAME_PREFIX, type Props } from "../../common";
import { keepOnlyAriaProps } from "../../common/props";

import { TreeNode } from "./treeNode";
import type {
    TreeKeyboardEventHandler,
    TreeKeyboardOrMouseEventHandler,
    TreeMouseEventHandler,
    TreeNodeInfo,
} from "./treeTypes";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TreeProps<T = {}> extends Props, React.AriaAttributes {
    /**
     * Whether to use a compact appearance which reduces the visual padding around node content.
     */
    compact?: boolean;

    /**
     * The data specifying the contents and appearance of the tree.
     */
    contents: ReadonlyArray<TreeNodeInfo<T>>;

    /**
     * Invoked when a node is clicked anywhere other than the caret for expanding/collapsing the node.
     */
    onNodeClick?: TreeMouseEventHandler<T>;

    /**
     * Invoked when caret of an expanded node is clicked.
     */
    onNodeCollapse?: TreeKeyboardOrMouseEventHandler<T>;

    /**
     * Invoked when a node is right-clicked or the context menu button is pressed on a focused node.
     */
    onNodeContextMenu?: TreeMouseEventHandler<T>;

    /**
     * Invoked when a node is double-clicked. Be careful when using this in combination with
     * an `onNodeClick` (single-click) handler, as the way this behaves can vary between browsers.
     * See http://stackoverflow.com/q/5497073/3124288
     */
    onNodeDoubleClick?: TreeMouseEventHandler<T>;

    /**
     * Invoked when the caret of a collapsed node is clicked.
     */
    onNodeExpand?: TreeKeyboardOrMouseEventHandler<T>;

    /**
     * Invoked when the mouse is moved over a node.
     */
    onNodeMouseEnter?: TreeMouseEventHandler<T>;

    /**
     * Invoked when the mouse is moved out of a node.
     */
    onNodeMouseLeave?: TreeMouseEventHandler<T>;
}

/**
 * Tree component.
 *
 * Follows aria tree example for role structure and keypress actions: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-1a/
 *
 * @see https://blueprintjs.com/docs/#core/components/tree
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class Tree<T = {}> extends React.Component<TreeProps<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Tree`;

    public static ofType<U>() {
        return Tree as new (props: TreeProps<U>) => Tree<U>;
    }

    public static nodeFromPath<U>(
        path: readonly number[],
        treeNodes?: ReadonlyArray<TreeNodeInfo<U>>,
    ): TreeNodeInfo<U> {
        if (path.length === 1) {
            return treeNodes![path[0]];
        } else {
            return Tree.nodeFromPath(path.slice(1), treeNodes![path[0]].childNodes);
        }
    }

    private treeRef = React.createRef<HTMLDivElement>();

    private nodeContentRefs: { [nodeId: string]: HTMLElement } = {};

    public render() {
        return (
            <div
                className={classNames(Classes.TREE, this.props.className, {
                    [Classes.COMPACT]: this.props.compact,
                })}
                role="tree"
                ref={this.treeRef}
                {...keepOnlyAriaProps(this.props)}
            >
                {this.renderNodes(this.props.contents, [], Classes.TREE_ROOT)}
            </div>
        );
    }

    /**
     * Returns the underlying HTML element of the `Tree` node with an id of `nodeId`.
     * This element does not contain the children of the node, only its label and controls.
     * If the node is not currently mounted, `undefined` is returned.
     */
    public getNodeContentElement = (nodeId: string | number): HTMLElement | undefined => this.nodeContentRefs[nodeId];

    /**
     * Returns the underlying HTML element of the `Tree` node with an id of `nodeId`.
     * This element contains the full node, including the children of the node.
     * If the node is not currently mounted, `undefined` is returned.
     */
    private getNodeElement = (nodeId: string | number): HTMLElement | undefined =>
        this.getNodeContentElement(nodeId)?.closest<HTMLElement>(`.${Classes.TREE_NODE}`) ?? undefined;

    private renderNodes(
        treeNodes: ReadonlyArray<TreeNodeInfo<T>> | undefined,
        currentPath?: number[],
        className?: string,
    ) {
        if (treeNodes == null) {
            return null;
        }

        const nodeItems = treeNodes.map((node, i) => {
            const elementPath = currentPath!.concat(i);
            return (
                <TreeNode<T>
                    {...node}
                    key={node.id}
                    contentRef={this.handleContentRef}
                    depth={elementPath.length - 1}
                    onClick={this.handleNodeClick}
                    onContextMenu={this.handleNodeContextMenu}
                    onCollapse={this.handleNodeCollapse}
                    onDoubleClick={this.handleNodeDoubleClick}
                    onExpand={this.handleNodeExpand}
                    onKeyDown={this.handleNodeKeyDown}
                    onMouseEnter={this.handleNodeMouseEnter}
                    onMouseLeave={this.handleNodeMouseLeave}
                    path={elementPath}
                >
                    {this.renderNodes(node.childNodes, elementPath)}
                </TreeNode>
            );
        });

        return (
            <ul className={classNames(Classes.TREE_NODE_LIST, className)} role="group">
                {nodeItems}
            </ul>
        );
    }

    private handleContentRef = (node: TreeNodeInfo<T>, element: HTMLElement | null) => {
        if (element != null) {
            this.nodeContentRefs[node.id] = element;
        } else {
            // don't want our object to get bloated with old keys
            delete this.nodeContentRefs[node.id];
        }
    };

    public componentDidMount() {
        // On first render, set first node to tabIndex=0
        const firstNode = this.getFirstEnabledNode();
        if (firstNode) {
            firstNode.tabIndex = 0;
        }
    }

    /** Is not a disabled tree node, or a child of a disabled tree node */
    private static ENABLED_TREE_NODE_SELECTOR = `.${Classes.TREE_NODE}:not(.${Classes.DISABLED}, .${Classes.TREE_NODE}.${Classes.DISABLED} .${Classes.TREE_NODE})`;

    private getFirstEnabledNode = () =>
        this.treeRef.current?.querySelector<HTMLElement>(Tree.ENABLED_TREE_NODE_SELECTOR);

    private getAllEnabledNodes = () =>
        this.treeRef.current?.querySelectorAll<HTMLElement>(Tree.ENABLED_TREE_NODE_SELECTOR);

    private getCurrentTabbableNode = () =>
        this.treeRef.current?.querySelector<HTMLElement>(`.${Classes.TREE_NODE}[tabindex="0"]`);

    private setTabbableNode(node: HTMLElement, focus: boolean = false) {
        const prevNode = this.getCurrentTabbableNode();
        if (prevNode && prevNode !== node) {
            prevNode?.removeAttribute("tabindex");
            node.tabIndex = 0;
        }
        if (focus) {
            node.focus();
        }
    }

    private handleNodeCollapse: TreeKeyboardOrMouseEventHandler<T> = (node, path, e) => {
        this.props.onNodeCollapse?.(node, path, e);

        // This is important when currently tabbable node is nested, and parent is clicked that makes is disappear.
        const nodeElement = this.getNodeElement(node.id);
        if (!nodeElement) return;
        this.setTabbableNode(nodeElement);
    };

    private handleNodeClick: TreeMouseEventHandler<T> = (node, path, e) => {
        this.props.onNodeClick?.(node, path, e);
    };

    private handleNodeKeyDown: TreeKeyboardEventHandler<T> = (node, path, e) => {
        if (["Enter", " "].includes(e.key)) {
            e.preventDefault();
            // Pass the click to the content element, because that where all the actual event handlers are (even though we're focusing on the whole treenodes in keyboard navigation)
            this.getNodeContentElement(node.id)?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            this.getNodeElement(node.id)?.focus();
        } else if (node.isExpanded && e.key === "ArrowLeft") {
            e.preventDefault();
            this.handleNodeCollapse(node, path, e);
        } else if (!node.isExpanded && e.key === "ArrowRight") {
            e.preventDefault();
            this.handleNodeExpand(node, path, e);
        } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const direction = e.key === "ArrowUp" ? -1 : 1;

            const treeNodes = this.getAllEnabledNodes();
            if (!treeNodes) return;

            const currentIndex = Array.from(treeNodes).findIndex(el => el.tabIndex === 0);
            if (currentIndex < 0) return;

            const nextIndex = currentIndex + direction;
            if (nextIndex < 0 || nextIndex >= treeNodes.length) return;

            this.setTabbableNode(treeNodes[nextIndex], true);
        } else if (e.key === "Home") {
            e.preventDefault();
            const firstNode = this.getFirstEnabledNode();
            if (!firstNode) return;
            this.setTabbableNode(firstNode, true);
        } else if (e.key === "End") {
            e.preventDefault();
            const treeNodes = this.getAllEnabledNodes();
            if (!treeNodes) return;
            const lastNode = treeNodes[treeNodes.length - 1];
            this.setTabbableNode(lastNode, true);
        }
    };

    private handleNodeContextMenu: TreeMouseEventHandler<T> = (node, path, e) => {
        this.props.onNodeContextMenu?.(node, path, e);
    };

    private handleNodeDoubleClick: TreeMouseEventHandler<T> = (node, path, e) => {
        this.props.onNodeDoubleClick?.(node, path, e);
    };

    private handleNodeExpand: TreeKeyboardOrMouseEventHandler<T> = (node, path, e) => {
        this.props.onNodeExpand?.(node, path, e);
    };

    private handleNodeMouseEnter: TreeMouseEventHandler<T> = (node, path, e) => {
        this.props.onNodeMouseEnter?.(node, path, e);
    };

    private handleNodeMouseLeave: TreeMouseEventHandler<T> = (node, path, e) => {
        this.props.onNodeMouseLeave?.(node, path, e);
    };
}
