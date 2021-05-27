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

import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";
import { isFunction } from "../../common/utils";
import { TreeNodeInfo, TreeNode } from "./treeNode";

// eslint-disable-next-line @typescript-eslint/ban-types
export type TreeEventHandler<T = {}> = (
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void;

// eslint-disable-next-line @typescript-eslint/ban-types, deprecation/deprecation
export type TreeProps<T = {}> = ITreeProps<T>;
/** @deprecated use TreeProps */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface ITreeProps<T = {}> extends Props {
    /**
     * The data specifying the contents and appearance of the tree.
     */
    contents: Array<TreeNodeInfo<T>>;

    /**
     * Invoked when a node is clicked anywhere other than the caret for expanding/collapsing the node.
     */
    onNodeClick?: TreeEventHandler<T>;

    /**
     * Invoked when caret of an expanded node is clicked.
     */
    onNodeCollapse?: TreeEventHandler<T>;

    /**
     * Invoked when a node is right-clicked or the context menu button is pressed on a focused node.
     */
    onNodeContextMenu?: TreeEventHandler<T>;

    /**
     * Invoked when a node is double-clicked. Be careful when using this in combination with
     * an `onNodeClick` (single-click) handler, as the way this behaves can vary between browsers.
     * See http://stackoverflow.com/q/5497073/3124288
     */
    onNodeDoubleClick?: TreeEventHandler<T>;

    /**
     * Invoked when the caret of a collapsed node is clicked.
     */
    onNodeExpand?: TreeEventHandler<T>;

    /**
     * Invoked when the mouse is moved over a node.
     */
    onNodeMouseEnter?: TreeEventHandler<T>;

    /**
     * Invoked when the mouse is moved out of a node.
     */
    onNodeMouseLeave?: TreeEventHandler<T>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export class Tree<T = {}> extends React.Component<TreeProps<T>> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Tree`;

    public static ofType<U>() {
        return Tree as new (props: TreeProps<U>) => Tree<U>;
    }

    public static nodeFromPath<U>(path: number[], treeNodes?: Array<TreeNodeInfo<U>>): TreeNodeInfo<U> {
        if (path.length === 1) {
            return treeNodes![path[0]];
        } else {
            return Tree.nodeFromPath(path.slice(1), treeNodes![path[0]].childNodes);
        }
    }

    private nodeRefs: { [nodeId: string]: HTMLElement } = {};

    public render() {
        return (
            <div className={classNames(Classes.TREE, this.props.className)}>
                {this.renderNodes(this.props.contents, [], Classes.TREE_ROOT)}
            </div>
        );
    }

    /**
     * Returns the underlying HTML element of the `Tree` node with an id of `nodeId`.
     * This element does not contain the children of the node, only its label and controls.
     * If the node is not currently mounted, `undefined` is returned.
     */
    public getNodeContentElement(nodeId: string | number): HTMLElement | undefined {
        return this.nodeRefs[nodeId];
    }

    private renderNodes(treeNodes: Array<TreeNodeInfo<T>> | undefined, currentPath?: number[], className?: string) {
        if (treeNodes == null) {
            return null;
        }

        const nodeItems = treeNodes.map((node, i) => {
            const elementPath = currentPath!.concat(i);
            const TypedTreeNode = TreeNode.ofType<T>();
            return (
                <TypedTreeNode
                    {...node}
                    key={node.id}
                    contentRef={this.handleContentRef}
                    depth={elementPath.length - 1}
                    onClick={this.handleNodeClick}
                    onContextMenu={this.handleNodeContextMenu}
                    onCollapse={this.handleNodeCollapse}
                    onDoubleClick={this.handleNodeDoubleClick}
                    onExpand={this.handleNodeExpand}
                    onMouseEnter={this.handleNodeMouseEnter}
                    onMouseLeave={this.handleNodeMouseLeave}
                    path={elementPath}
                >
                    {this.renderNodes(node.childNodes, elementPath)}
                </TypedTreeNode>
            );
        });

        return <ul className={classNames(Classes.TREE_NODE_LIST, className)}>{nodeItems}</ul>;
    }

    private handleNodeCollapse = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeCollapse, node, e);
    };

    private handleNodeClick = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeClick, node, e);
    };

    private handleContentRef = (node: TreeNode<T>, element: HTMLElement | null) => {
        if (element != null) {
            this.nodeRefs[node.props.id] = element;
        } else {
            // don't want our object to get bloated with old keys
            delete this.nodeRefs[node.props.id];
        }
    };

    private handleNodeContextMenu = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeContextMenu, node, e);
    };

    private handleNodeDoubleClick = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeDoubleClick, node, e);
    };

    private handleNodeExpand = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeExpand, node, e);
    };

    private handleNodeMouseEnter = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeMouseEnter, node, e);
    };

    private handleNodeMouseLeave = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeMouseLeave, node, e);
    };

    private handlerHelper(
        handlerFromProps: TreeEventHandler<T> | undefined,
        node: TreeNode<T>,
        e: React.MouseEvent<HTMLElement>,
    ) {
        if (isFunction(handlerFromProps)) {
            const nodeData = Tree.nodeFromPath(node.props.path, this.props.contents);
            handlerFromProps(nodeData, node.props.path, e);
        }
    }
}
