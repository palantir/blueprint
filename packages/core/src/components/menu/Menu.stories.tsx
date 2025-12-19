/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Menu } from "./menu";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

const meta = {
    title: "Core/Menu",
    component: Menu,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        size: "medium",
    },
    argTypes: {
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
    },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic menu with items.
 */
export const Default: Story = {
    render: args => (
        <Menu {...args}>
            <MenuItem icon="new-text-box" text="New file" />
            <MenuItem icon="folder-new" text="New folder" />
            <MenuDivider />
            <MenuItem icon="export" text="Export" />
            <MenuItem icon="import" text="Import" disabled={true} />
            <MenuDivider />
            <MenuItem icon="trash" text="Delete" intent="danger" />
        </Menu>
    ),
};

/**
 * Menu with labels (e.g. keyboard shortcuts).
 */
export const WithLabels: Story = {
    render: args => (
        <Menu {...args}>
            <MenuItem icon="cut" label="⌘X" text="Cut" />
            <MenuItem icon="duplicate" label="⌘D" text="Duplicate" />
            <MenuItem icon="clipboard" label="⌘V" text="Paste" />
        </Menu>
    ),
};

/**
 * Small menu items.
 */
export const Small: Story = {
    render: args => (
        <Menu {...args} size="small">
            <MenuItem text="Option 1" />
            <MenuItem text="Option 2" />
            <MenuItem text="Option 3" />
        </Menu>
    ),
};

/**
 * Large menu items.
 */
export const Large: Story = {
    render: args => (
        <Menu {...args} size="large">
            <MenuItem icon="document" text="Document" />
            <MenuItem icon="folder-close" text="Folder" />
        </Menu>
    ),
};
