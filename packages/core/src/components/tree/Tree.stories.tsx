/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryLabel } from "@storybook-common";
import { type MouseEvent, useCallback, useReducer } from "react";
import { expect, waitFor } from "storybook/test";

import { Home } from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";

import { Tree } from "./tree";
import type { TreeNodeInfo } from "./treeTypes";

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
        case "DESELECT_ALL": {
            const newState = structuredClone(state);
            forEachNode(newState, node => (node.isSelected = false));
            return newState;
        }
        case "SET_IS_EXPANDED": {
            const newState = structuredClone(state);
            forNodeAtPath(newState, action.payload.path, node => (node.isExpanded = action.payload.isExpanded));
            return newState;
        }
        case "SET_IS_SELECTED": {
            const newState = structuredClone(state);
            forNodeAtPath(newState, action.payload.path, node => (node.isSelected = action.payload.isSelected));
            return newState;
        }
        default:
            return state;
    }
}

const SAMPLE_CONTENTS: TreeNodeInfo[] = [
    {
        id: 0,
        hasCaret: true,
        icon: "folder-close",
        label: "Folder 0",
        isExpanded: true,
        childNodes: [
            { id: 1, icon: "document", label: "Item 0" },
            { id: 2, icon: "document", label: "Item 1" },
            {
                id: 3,
                hasCaret: true,
                icon: "folder-close",
                label: "Folder 1",
                isExpanded: false,
                childNodes: [
                    { id: 4, icon: "document", label: "Nested Item 0" },
                    { id: 5, icon: "document", label: "Nested Item 1" },
                ],
            },
        ],
    },
    {
        id: 6,
        hasCaret: true,
        icon: "folder-close",
        label: "Folder 2",
        isExpanded: false,
        childNodes: [
            { id: 7, icon: "document", label: "Item 2" },
            { id: 8, icon: "document", label: "Item 3" },
        ],
    },
    { id: 9, icon: "document", label: "Item 4" },
];

const SELECTED_CONTENTS: TreeNodeInfo[] = [
    {
        id: 0,
        hasCaret: true,
        icon: "folder-close",
        label: "Folder 0",
        isExpanded: true,
        childNodes: [
            { id: 1, icon: "document", label: "Item 0", isSelected: true },
            { id: 2, icon: "document", label: "Item 1" },
        ],
    },
    { id: 3, icon: "document", label: "Item 2" },
];

const ELEMENT_ICON_CONTENTS: TreeNodeInfo[] = [
    { id: 0, icon: "home", label: "String icon" },
    { id: 1, icon: <Home />, label: "Element icon" },
];

const DISABLED_CONTENTS: TreeNodeInfo[] = [
    {
        id: 0,
        hasCaret: true,
        icon: "folder-close",
        label: "Folder 0 (disabled)",
        isExpanded: true,
        disabled: true,
        childNodes: [
            { id: 1, icon: "document", label: "Item 0", disabled: true },
            { id: 2, icon: "document", label: "Item 1", disabled: true },
        ],
    },
    { id: 3, icon: "document", label: "Item 2" },
];

const meta: Meta<typeof Tree> = {
    title: "Core/Tree",
    component: Tree,
    decorators: [
        Story => (
            <div style={{ minWidth: "350px" }}>
                <Story />
            </div>
        ),
    ],
    tags: ["autodocs"],
    args: {
        contents: SAMPLE_CONTENTS,
        compact: false,
    },
    argTypes: {
        compact: { control: "boolean" },
        onNodeClick: { action: "nodeClick" },
        onNodeCollapse: { action: "nodeCollapse" },
        onNodeExpand: { action: "nodeExpand" },
        onNodeContextMenu: { action: "nodeContextMenu" },
        onNodeDoubleClick: { action: "nodeDoubleClick" },
        onNodeMouseEnter: { action: "nodeMouseEnter" },
        onNodeMouseLeave: { action: "nodeMouseLeave" },
    },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Use the `compact` prop for a denser tree layout.
 */
export const CompactExample: Story = {
    name: "Compact",
    argTypes: {
        compact: { table: { disable: true } },
    },
    args: {
        compact: true,
    },
};

/**
 * Tree nodes support `isSelected`, `disabled`, and `isExpanded` states.
 */
export const StateExample: Story = {
    name: "State",
    render: args => (
        <Flex gap={8}>
            <div>
                <StoryLabel title="Selected" />
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={SELECTED_CONTENTS} />
                </div>
            </div>
            <div>
                <StoryLabel title="Disabled" />
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={DISABLED_CONTENTS} />
                </div>
            </div>
        </Flex>
    ),
};

/**
 * All tree states displayed together for visual comparison.
 */
export const AllStates: Story = {
    name: "All States",
    render: args => (
        <Flex gap={8} flexWrap="wrap">
            <div>
                <StoryLabel title="Default" />
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={SAMPLE_CONTENTS} />
                </div>
            </div>
            <div>
                <StoryLabel title="Selected" />
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={SELECTED_CONTENTS} />
                </div>
            </div>
            <div>
                <StoryLabel title="Disabled" />
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={DISABLED_CONTENTS} />
                </div>
            </div>
            <div>
                <StoryLabel title="Compact" />
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={SAMPLE_CONTENTS} compact={true} />
                </div>
            </div>
        </Flex>
    ),
};

/**
 * `TreeNodeInfo.icon` accepts either a string icon name or a React element.
 */
export const ElementIconExample: Story = {
    name: "Element icon",
    args: { contents: ELEMENT_ICON_CONTENTS },
};

/**
 * Interactive playground with node click, expand, and collapse handlers.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [nodes, dispatch] = useReducer(treeExampleReducer, SAMPLE_CONTENTS);

        const handleNodeClick = useCallback((node: TreeNodeInfo, nodePath: NodePath, e: MouseEvent<HTMLElement>) => {
            const originallySelected = node.isSelected;
            if (!e.shiftKey) {
                dispatch({ type: "DESELECT_ALL" });
            }
            dispatch({
                payload: {
                    isSelected: originallySelected == null ? true : !originallySelected,
                    path: nodePath,
                },
                type: "SET_IS_SELECTED",
            });
        }, []);

        const handleNodeCollapse = useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
            dispatch({
                payload: { isExpanded: false, path: nodePath },
                type: "SET_IS_EXPANDED",
            });
        }, []);

        const handleNodeExpand = useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
            dispatch({
                payload: { isExpanded: true, path: nodePath },
                type: "SET_IS_EXPANDED",
            });
        }, []);

        return (
            <Tree
                {...args}
                contents={nodes}
                onNodeClick={handleNodeClick}
                onNodeCollapse={handleNodeCollapse}
                onNodeExpand={handleNodeExpand}
            />
        );
    },
};

/**
 * Clicking a node selects it. Clicking again deselects it.
 */
export const SelectNode: Story = {
    name: "Select Node",
    ...Playground,
    play: async ({ canvas, userEvent, step }) => {
        const item0 = canvas.getByText("Item 0");
        const item1 = canvas.getByText("Item 1");

        await step("Click node to select it", async () => {
            await userEvent.click(item0);
            await expect(item0.closest(".bp6-tree-node")).toHaveClass("bp6-tree-node-selected");
        });

        await step("Click another node — selection moves", async () => {
            await userEvent.click(item1);
            await expect(item1.closest(".bp6-tree-node")).toHaveClass("bp6-tree-node-selected");
            await expect(item0.closest(".bp6-tree-node")).not.toHaveClass("bp6-tree-node-selected");
        });

        await step("Click same node again to deselect", async () => {
            await userEvent.click(item1);
            await expect(item1.closest(".bp6-tree-node")).not.toHaveClass("bp6-tree-node-selected");
        });
    },
};

/**
 * Clicking the caret expands a collapsed folder and reveals its children.
 */
export const ExpandNode: Story = {
    name: "Expand Node",
    ...Playground,
    play: async ({ canvas, userEvent, step }) => {
        await step("Collapsed folder hides children", async () => {
            await expect(canvas.queryByText("Nested Item 0")).toBeNull();
        });

        await step("Click caret to expand folder", async () => {
            const folder1Caret = canvas
                .getByText("Folder 1")
                .closest(".bp6-tree-node")!
                .querySelector(".bp6-tree-node-caret")!;
            await userEvent.click(folder1Caret);
            await expect(canvas.getByText("Nested Item 0")).toBeVisible();
            await expect(canvas.getByText("Nested Item 1")).toBeVisible();
        });
    },
};

/**
 * Clicking the caret on an expanded folder collapses it and hides its children.
 */
export const CollapseNode: Story = {
    name: "Collapse Node",
    ...Playground,
    play: async ({ canvas, userEvent, step }) => {
        await step("Expanded folder shows children", async () => {
            await expect(canvas.getByText("Item 0")).toBeVisible();
            await expect(canvas.getByText("Item 1")).toBeVisible();
        });

        await step("Click caret to collapse folder", async () => {
            const folder0Caret = canvas
                .getByText("Folder 0")
                .closest(".bp6-tree-node")!
                .querySelector(".bp6-tree-node-caret")!;
            await userEvent.click(folder0Caret);
            await waitFor(() => expect(canvas.queryByText("Item 0")).toBeNull());
        });
    },
};

/**
 * Disabled nodes do not respond to click interactions.
 */
export const DisabledInteraction: Story = {
    name: "Disabled Interaction",
    render: function Render(args) {
        const [nodes, dispatch] = useReducer(treeExampleReducer, DISABLED_CONTENTS);

        const handleNodeClick = useCallback((node: TreeNodeInfo, nodePath: NodePath, e: MouseEvent<HTMLElement>) => {
            const originallySelected = node.isSelected;
            if (!e.shiftKey) {
                dispatch({ type: "DESELECT_ALL" });
            }
            dispatch({
                payload: {
                    isSelected: originallySelected == null ? true : !originallySelected,
                    path: nodePath,
                },
                type: "SET_IS_SELECTED",
            });
        }, []);

        return <Tree {...args} contents={nodes} onNodeClick={handleNodeClick} />;
    },
    play: async ({ canvas, userEvent, step }) => {
        await step("Click disabled node — no selection", async () => {
            const disabledItem = canvas.getByText("Item 0");
            await userEvent.click(disabledItem);
            await expect(disabledItem.closest(".bp6-tree-node")).not.toHaveClass("bp6-tree-node-selected");
        });

        await step("Click enabled node — becomes selected", async () => {
            const enabledItem = canvas.getByText("Item 2");
            await userEvent.click(enabledItem);
            await expect(enabledItem.closest(".bp6-tree-node")).toHaveClass("bp6-tree-node-selected");
        });
    },
};
