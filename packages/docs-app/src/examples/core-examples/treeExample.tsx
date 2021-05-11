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

import { cloneDeep } from "lodash-es";
import React, { useCallback, useReducer } from "react";

import { Classes, ContextMenu, Icon, Intent, Tooltip, TreeNodeInfo, Tree } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

type NodePath = number[];

type TreeAction =
    | { type: "SET_IS_EXPANDED"; payload: { path: NodePath; isExpanded: boolean } }
    | { type: "DESELECT_ALL" }
    | { type: "SET_IS_SELECTED"; payload: { path: NodePath; isSelected: boolean } };

function forEachNode(nodes: TreeNodeInfo[] | undefined, callback: (node: TreeNodeInfo) => void) {
    if (nodes === undefined) {
        return;
    }

    for (const node of nodes) {
        callback(node);
        forEachNode(node.childNodes, callback);
    }
}

function forNodeAtPath(nodes: TreeNodeInfo[], path: NodePath, callback: (node: TreeNodeInfo) => void) {
    callback(Tree.nodeFromPath(path, nodes));
}

function treeExampleReducer(state: TreeNodeInfo[], action: TreeAction) {
    switch (action.type) {
        case "DESELECT_ALL":
            const newState1 = cloneDeep(state);
            forEachNode(newState1, node => (node.isSelected = false));
            return newState1;
        case "SET_IS_EXPANDED":
            const newState2 = cloneDeep(state);
            forNodeAtPath(newState2, action.payload.path, node => (node.isExpanded = action.payload.isExpanded));
            return newState2;
        case "SET_IS_SELECTED":
            const newState3 = cloneDeep(state);
            forNodeAtPath(newState3, action.payload.path, node => (node.isSelected = action.payload.isSelected));
            return newState3;
        default:
            return state;
    }
}

export const TreeExample: React.FC<ExampleProps> = props => {
    const [nodes, dispatch] = useReducer(treeExampleReducer, INITIAL_STATE);

    const handleNodeClick = useCallback((node: TreeNodeInfo, nodePath: NodePath, e: React.MouseEvent<HTMLElement>) => {
        const originallySelected = node.isSelected;
        if (!e.shiftKey) {
            dispatch({ type: "DESELECT_ALL" });
        }
        dispatch({
            payload: { path: nodePath, isSelected: originallySelected == null ? true : !originallySelected },
            type: "SET_IS_SELECTED",
        });
    }, []);

    const handleNodeCollapse = useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        dispatch({
            payload: { path: nodePath, isExpanded: false },
            type: "SET_IS_EXPANDED",
        });
    }, []);

    const handleNodeExpand = useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        dispatch({
            payload: { path: nodePath, isExpanded: true },
            type: "SET_IS_EXPANDED",
        });
    }, []);

    return (
        <Example options={false} {...props}>
            <Tree
                contents={nodes}
                onNodeClick={handleNodeClick}
                onNodeCollapse={handleNodeCollapse}
                onNodeExpand={handleNodeExpand}
                className={Classes.ELEVATION_0}
            />
        </Example>
    );
};

const contentSizing = { popoverProps: { popoverClassName: Classes.POPOVER_CONTENT_SIZING } };

/* tslint:disable:object-literal-sort-keys so childNodes can come last */
const INITIAL_STATE: TreeNodeInfo[] = [
    {
        id: 0,
        hasCaret: true,
        icon: "folder-close",
        label: (
            <ContextMenu {...contentSizing} content={<div>Hello there!</div>}>
                Folder 0
            </ContextMenu>
        ),
    },
    {
        id: 1,
        icon: "folder-close",
        isExpanded: true,
        label: (
            <ContextMenu {...contentSizing} content={<div>Hello there!</div>}>
                <Tooltip content="I'm a folder <3" placement="right">
                    Folder 1
                </Tooltip>
            </ContextMenu>
        ),
        childNodes: [
            {
                id: 2,
                icon: "document",
                label: "Item 0",
                secondaryLabel: (
                    <Tooltip content="An eye!">
                        <Icon icon="eye-open" />
                    </Tooltip>
                ),
            },
            {
                id: 3,
                icon: <Icon icon="tag" intent={Intent.PRIMARY} className={Classes.TREE_NODE_ICON} />,
                label: "Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.",
            },
            {
                id: 4,
                hasCaret: true,
                icon: "folder-close",
                label: (
                    <ContextMenu {...contentSizing} content={<div>Hello there!</div>}>
                        <Tooltip content="foo" placement="right">
                            Folder 2
                        </Tooltip>
                    </ContextMenu>
                ),
                childNodes: [
                    { id: 5, label: "No-Icon Item" },
                    { id: 6, icon: "tag", label: "Item 1" },
                    {
                        id: 7,
                        hasCaret: true,
                        icon: "folder-close",
                        label: (
                            <ContextMenu {...contentSizing} content={<div>Hello there!</div>}>
                                Folder 3
                            </ContextMenu>
                        ),
                        childNodes: [
                            { id: 8, icon: "document", label: "Item 0" },
                            { id: 9, icon: "tag", label: "Item 1" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        hasCaret: true,
        icon: "folder-close",
        label: "Super secret files",
        disabled: true,
    },
];
/* tslint:enable:object-literal-sort-keys */
