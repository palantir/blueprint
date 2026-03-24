/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
    title: "Core/Tooltip/Tooltip",
    component: Tooltip,
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
        content: "This is a tooltip",
        intent: "none",
        compact: false,
        minimal: false,
        disabled: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        compact: {
            control: "boolean",
        },
        minimal: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        content: {
            control: "text",
        },
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic tooltip that appears on hover.
 */
export const Default: Story = {
    args: {
        content: "This is a tooltip",
        isOpen: true,
        children: <span>Hover me</span>,
    },
};

/**
 * Use the `intent` prop to apply a semantic color to the tooltip background.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Tooltip key={intent} {...args} intent={intent} isOpen={true}>
                        <span>{intent.charAt(0).toUpperCase() + intent.slice(1)}</span>
                    </Tooltip>
                ))}
        </div>
    ),
};

/**
 * Use the `compact` prop for a more condensed tooltip appearance.
 */
export const CompactExample: Story = {
    name: "Compact",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24 }}>
            <Tooltip {...args} compact={false} isOpen={true}>
                <span>Default</span>
            </Tooltip>
            <Tooltip {...args} compact={true} isOpen={true}>
                <span>Compact</span>
            </Tooltip>
        </div>
    ),
};

/**
 * Use the `minimal` prop to render the tooltip without an arrow.
 */
export const MinimalExample: Story = {
    name: "Minimal",
    argTypes: {
        minimal: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24 }}>
            <Tooltip {...args} minimal={false} isOpen={true}>
                <span>With arrow</span>
            </Tooltip>
            <Tooltip {...args} minimal={true} isOpen={true}>
                <span>No arrow</span>
            </Tooltip>
        </div>
    ),
};

/**
 * Use the `disabled` prop to prevent the tooltip from appearing.
 */
export const DisabledExample: Story = {
    name: "Disabled",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24 }}>
            <Tooltip {...args} disabled={false} isOpen={true}>
                <span>Enabled</span>
            </Tooltip>
            <Tooltip {...args} disabled={true}>
                <span>Disabled</span>
            </Tooltip>
        </div>
    ),
};

/**
 * All intents displayed together for visual comparison.
 */
export const AllIntents: Story = {
    name: "All Intents",
    argTypes: {
        intent: { table: { disable: true } },
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Default</div>
                <div style={{ display: "flex", gap: 24 }}>
                    {Object.values(Intent).map(intent => (
                        <Tooltip key={intent} {...args} intent={intent} isOpen={true}>
                            <span style={{ textTransform: "capitalize" }}>{intent === "none" ? "none" : intent}</span>
                        </Tooltip>
                    ))}
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Compact</div>
                <div style={{ display: "flex", gap: 24 }}>
                    {Object.values(Intent).map(intent => (
                        <Tooltip key={intent} {...args} intent={intent} compact={true} isOpen={true}>
                            <span style={{ textTransform: "capitalize" }}>{intent === "none" ? "none" : intent}</span>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        content: "Tooltip content",
        children: <span>Hover over me</span>,
    },
};
