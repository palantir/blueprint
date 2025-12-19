/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { TreeNodeInfo } from "./treeTypes";
import { Tree } from "./tree";

const INITIAL_CONTENTS: TreeNodeInfo[] = [
    {
        id: "0",
        label: "Root",
        icon: "folder-close",
        isExpanded: true,
        childNodes: [
            {
                id: "1",
                label: "Folder 1",
                icon: "folder-close",
                isExpanded: true,
                childNodes: [
                    { id: "2", label: "File 1-1", icon: "document" },
                    { id: "3", label: "File 1-2", icon: "document" },
                ],
            },
            {
                id: "4",
                label: "Folder 2",
                icon: "folder-close",
                childNodes: [{ id: "5", label: "File 2-1", icon: "document" }],
            },
        ],
    },
];

const meta = {
    title: "Core/Tree",
    component: Tree,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        contents: INITIAL_CONTENTS,
        compact: false,
    },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic tree with expandable nodes.
 */
export const Default: Story = {
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Compact tree with reduced padding.
 */
export const Compact: Story = {
    args: {
        compact: true,
    },
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Flat list (no children).
 */
export const FlatList: Story = {
    args: {
        contents: [
            { id: "a", label: "Item A", icon: "document" },
            { id: "b", label: "Item B", icon: "document" },
            { id: "c", label: "Item C", icon: "document" },
        ],
    },
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * With selected node.
 */
export const WithSelection: Story = {
    args: {
        contents: INITIAL_CONTENTS.map((node, i) =>
            i === 0 && node.childNodes
                ? {
                      ...node,
                      childNodes: node.childNodes.map((child, j) => (j === 0 ? { ...child, isSelected: true } : child)),
                  }
                : node,
        ),
    },
    decorators: [
        Story => (
            <div style={{ width: 280 }}>
                <Story />
            </div>
        ),
    ],
};
