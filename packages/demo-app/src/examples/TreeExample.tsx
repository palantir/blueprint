/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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
import * as React from "react";

import { Classes, Icon, Intent, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { ContextMenu2, Classes as Popover2Classes, Tooltip2 } from "@blueprintjs/popover2";

import { ExampleCard } from "./ExampleCard";

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

export const TreeExample: React.FC = _props => {
    const [nodes, dispatch] = React.useReducer(treeExampleReducer, INITIAL_STATE);

    const handleNodeClick = React.useCallback(
        (node: TreeNodeInfo, nodePath: NodePath, e: React.MouseEvent<HTMLElement>) => {
            const originallySelected = node.isSelected;
            if (!e.shiftKey) {
                dispatch({ type: "DESELECT_ALL" });
            }
            dispatch({
                payload: { path: nodePath, isSelected: originallySelected == null ? true : !originallySelected },
                type: "SET_IS_SELECTED",
            });
        },
        [],
    );

    const handleNodeCollapse = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        dispatch({
            payload: { path: nodePath, isExpanded: false },
            type: "SET_IS_EXPANDED",
        });
    }, []);

    const handleNodeExpand = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
        dispatch({
            payload: { path: nodePath, isExpanded: true },
            type: "SET_IS_EXPANDED",
        });
    }, []);

    return (
        <ExampleCard label="Tree" width={400}>
            <Tree
                contents={nodes}
                onNodeClick={handleNodeClick}
                onNodeCollapse={handleNodeCollapse}
                onNodeExpand={handleNodeExpand}
                className={Classes.ELEVATION_0}
            />
        </ExampleCard>
    );
};

const contentSizing = { popoverProps: { popoverClassName: Popover2Classes.POPOVER2_CONTENT_SIZING } };

/* tslint:disable:object-literal-sort-keys so childNodes can come last */
const INITIAL_STATE: TreeNodeInfo[] = [
    {
        id: 0,
        hasCaret: true,
        icon: "folder-close",
        label: (
            <ContextMenu2 {...contentSizing} content={<div>Hello there!</div>}>
                Folder 0
            </ContextMenu2>
        ),
    },
    {
        id: 1,
        icon: "folder-close",
        isExpanded: true,
        label: (
            <ContextMenu2 {...contentSizing} content={<div>Hello there!</div>}>
                <Tooltip2 content="I'm a folder <3" placement="right">
                    Folder 1
                </Tooltip2>
            </ContextMenu2>
        ),
        childNodes: [
            {
                id: 2,
                icon: "document",
                label: "Item 0",
                secondaryLabel: (
                    <Tooltip2 content="An eye!">
                        <Icon icon="eye-open" />
                    </Tooltip2>
                ),
            },
            {
                id: 3,
                icon: <Icon icon="tag" intent={Intent.PRIMARY} className={Classes.TREE_NODE_ICON} />,
                label: "Primary icon item",
            },
            {
                id: 4,
                icon: <Icon icon="endorsed" intent={Intent.SUCCESS} className={Classes.TREE_NODE_ICON} />,
                label: "Success icon item",
            },
            {
                id: 5,
                icon: <Icon icon="warning-sign" intent={Intent.WARNING} className={Classes.TREE_NODE_ICON} />,
                label: "Warning icon item",
            },
            {
                id: 6,
                icon: <Icon icon="error" intent={Intent.DANGER} className={Classes.TREE_NODE_ICON} />,
                label: "Danger icon item",
            },
            {
                id: 7,
                hasCaret: true,
                icon: "folder-close",
                label: (
                    <ContextMenu2 {...contentSizing} content={<div>Hello there!</div>}>
                        <Tooltip2 content="foo" placement="right">
                            Folder 2
                        </Tooltip2>
                    </ContextMenu2>
                ),
                childNodes: [
                    { id: 8, label: "No-Icon Item" },
                    { id: 9, icon: "tag", label: "Item 1" },
                    {
                        id: 10,
                        hasCaret: true,
                        icon: "folder-close",
                        label: (
                            <ContextMenu2 {...contentSizing} content={<div>Hello there!</div>}>
                                Folder 3
                            </ContextMenu2>
                        ),
                        childNodes: [
                            { id: 11, icon: "document", label: "Item 0" },
                            { id: 12, icon: "tag", label: "Item 1" },
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
