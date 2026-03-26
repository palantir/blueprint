/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent, Size } from "../../common";

import { Menu } from "./menu";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

// These props are deprecated on Menu — hide them from the Storybook controls panel.
const disabledArgs = ["large", "small"] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof Menu>>;

const meta: Meta<typeof Menu> = {
    title: "Core/Menu",
    component: Menu,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "300px" }}>
                <Story />
            </div>
        ),
    ],
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
            options: Object.values(Size),
        },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: args => (
        <Menu {...args}>
            <MenuItem icon="new-text-box" text="New text box" />
            <MenuItem icon="new-object" text="New object" />
            <MenuItem icon="new-link" text="New link" />
            <MenuDivider />
            <MenuItem icon="cog" text="Settings" label="⌘," />
        </Menu>
    ),
};

export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Menu key={intent} {...args}>
                        <MenuItem
                            icon="graph"
                            text={intent.charAt(0).toUpperCase() + intent.slice(1)}
                            intent={intent}
                        />
                        <MenuItem icon="notifications" text="Active" intent={intent} active={true} />
                    </Menu>
                ))}
        </div>
    ),
};

export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {Object.values(Size).map(size => (
                <div key={size} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 12, opacity: 0.6, textTransform: "capitalize" }}>{size}</span>
                    <Menu {...args} size={size}>
                        <MenuItem icon="document" text="New file" />
                        <MenuItem icon="folder-close" text="New folder" />
                        <MenuDivider />
                        <MenuItem icon="cog" text="Settings" />
                    </Menu>
                </div>
            ))}
        </div>
    ),
};

export const StateExample: Story = {
    name: "State",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <Menu {...args}>
                    <MenuItem icon="home" text="Home" />
                    <MenuItem icon="document" text="Files" />
                </Menu>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Active</span>
                <Menu {...args}>
                    <MenuItem icon="home" text="Home" active={true} />
                    <MenuItem icon="document" text="Files" />
                </Menu>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Disabled</span>
                <Menu {...args}>
                    <MenuItem icon="home" text="Home" disabled={true} />
                    <MenuItem icon="document" text="Files" disabled={true} />
                </Menu>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Selected</span>
                <Menu {...args}>
                    <MenuItem icon="home" text="Home" roleStructure="listoption" selected={true} />
                    <MenuItem icon="document" text="Files" roleStructure="listoption" selected={false} />
                </Menu>
            </div>
        </div>
    ),
};

export const IconExample: Story = {
    name: "Icons",
    render: args => (
        <Menu {...args}>
            <MenuItem icon="applications" text="With icon" />
            <MenuItem text="Without icon" />
            <MenuItem icon="graph" text="With icon and label" label="⌘G" />
            <MenuItem icon="add" text="With label element" labelElement={<span>Ctrl+N</span>} />
        </Menu>
    ),
};

export const AllIntents: Story = {
    name: "All Intents",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <div key={intent} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: 12, opacity: 0.6, textTransform: "capitalize" }}>{intent}</span>
                        <Menu {...args}>
                            <MenuItem icon="graph" text="Default" intent={intent} />
                            <MenuItem icon="notifications" text="Active" intent={intent} active={true} />
                            <MenuItem icon="lock" text="Disabled" intent={intent} disabled={true} />
                        </Menu>
                    </div>
                ))}
        </div>
    ),
};

export const Playground: Story = {
    render: args => (
        <Menu {...args}>
            <MenuDivider title="File" />
            <MenuItem icon="document" text="New" label="⌘N" />
            <MenuItem icon="document-open" text="Open" label="⌘O" />
            <MenuItem icon="floppy-disk" text="Save" label="⌘S" intent="primary" />
            <MenuDivider title="Edit" />
            <MenuItem icon="cut" text="Cut" label="⌘X" />
            <MenuItem icon="clipboard" text="Copy" label="⌘C" />
            <MenuItem icon="duplicate" text="Paste" label="⌘V" />
            <MenuDivider />
            <MenuItem icon="trash" text="Delete" intent="danger" />
            <MenuItem icon="lock" text="Locked" disabled={true} />
        </Menu>
    ),
};
