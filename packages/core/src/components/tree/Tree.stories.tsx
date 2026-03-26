/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Tree } from "./tree";
import type { TreeNodeInfo } from "./treeTypes";

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
    parameters: {
        layout: "centered",
    },
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
        <div style={{ display: "flex", gap: 32 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Selected</div>
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={SELECTED_CONTENTS} />
                </div>
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Disabled</div>
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={DISABLED_CONTENTS} />
                </div>
            </div>
        </div>
    ),
};

/**
 * All tree states displayed together for visual comparison.
 */
export const AllStates: Story = {
    name: "All States",
    render: args => (
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Default</div>
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={SAMPLE_CONTENTS} />
                </div>
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Selected</div>
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={SELECTED_CONTENTS} />
                </div>
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Disabled</div>
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={DISABLED_CONTENTS} />
                </div>
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Compact</div>
                <div style={{ minWidth: "300px" }}>
                    <Tree {...args} contents={SAMPLE_CONTENTS} compact={true} />
                </div>
            </div>
        </div>
    ),
};

/**
 * Interactive playground with node click, expand, and collapse handlers.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [nodes, setNodes] = useState<TreeNodeInfo[]>(SAMPLE_CONTENTS);

        const forEachNode = useCallback((treeNodes: TreeNodeInfo[], callback: (node: TreeNodeInfo) => void) => {
            for (const node of treeNodes) {
                callback(node);
                if (node.childNodes) {
                    forEachNode(node.childNodes, callback);
                }
            }
        }, []);

        const handleNodeClick = useCallback(
            (node: TreeNodeInfo, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
                const originallySelected = node.isSelected;
                setNodes(prev => {
                    const newNodes = structuredClone(prev);
                    if (!e.shiftKey) {
                        forEachNode(newNodes, n => (n.isSelected = false));
                    }
                    const findNode = (items: TreeNodeInfo[]): TreeNodeInfo | undefined => {
                        for (const item of items) {
                            if (item.id === node.id) return item;
                            if (item.childNodes) {
                                const found = findNode(item.childNodes);
                                if (found) return found;
                            }
                        }
                        return undefined;
                    };
                    const target = findNode(newNodes);
                    if (target) {
                        target.isSelected = originallySelected == null ? true : !originallySelected;
                    }
                    return newNodes;
                });
            },
            [forEachNode],
        );

        const handleNodeCollapse = useCallback((_node: TreeNodeInfo, nodePath: number[]) => {
            setNodes(prev => {
                const newNodes = structuredClone(prev);
                let target: TreeNodeInfo = newNodes[nodePath[0]];
                for (let i = 1; i < nodePath.length; i++) {
                    target = target.childNodes![nodePath[i]];
                }
                target.isExpanded = false;
                return newNodes;
            });
        }, []);

        const handleNodeExpand = useCallback((_node: TreeNodeInfo, nodePath: number[]) => {
            setNodes(prev => {
                const newNodes = structuredClone(prev);
                let target: TreeNodeInfo = newNodes[nodePath[0]];
                for (let i = 1; i < nodePath.length; i++) {
                    target = target.childNodes![nodePath[i]];
                }
                target.isExpanded = true;
                return newNodes;
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
