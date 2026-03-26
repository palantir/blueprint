/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
    title: "Core/Tooltip",
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
 * The `compact` prop renders a more condensed tooltip, and the `minimal` prop removes the arrow.
 */
export const VariantExample: Story = {
    name: "Variant",
    argTypes: {
        compact: { table: { disable: true } },
        minimal: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 32 }}>
            <Tooltip {...args} compact={false} minimal={false} isOpen={true}>
                <span>Default</span>
            </Tooltip>
            <Tooltip {...args} compact={true} minimal={false} isOpen={true}>
                <span>Compact</span>
            </Tooltip>
            <Tooltip {...args} compact={false} minimal={true} isOpen={true}>
                <span>Minimal</span>
            </Tooltip>
            <Tooltip {...args} compact={true} minimal={true} isOpen={true}>
                <span>Compact + Minimal</span>
            </Tooltip>
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
