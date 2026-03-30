/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "./divider";

const meta: Meta<typeof Divider> = {
    title: "Core/Divider",
    component: Divider,
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
        compact: false,
    },
    argTypes: {
        compact: {
            control: "boolean",
        },
        tagName: {
            control: "select",
            options: ["div", "span", "br", "hr", "p"], // Can be any HTML tag
        },
    },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic horizontal divider rendered inside a column flex container.
 */
export const Default: Story = {
    decorators: [
        Story => (
            <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
                <span>Content above</span>
                <Story />
                <span>Content below</span>
            </div>
        ),
    ],
};

/**
 * A basic vertical divider inside a flex container
 */
export const Vertical: Story = {
    decorators: [
        Story => (
            <div style={{ display: "flex", width: "300px" }}>
                <span>Content to the left that wraps around a bit more than you'd expect</span>
                <Story />
                <span>Content to the right that also wraps around a bit more than you'd expect</span>
            </div>
        ),
    ],
};

/**
 * Use the `compact` prop to remove the default margin around the Divider,
 * making it flush with adjacent content.
 */
export const CompactExample: Story = {
    name: "Compact",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: "3em", width: "300px" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <span>Above</span>
                <Divider {...args} compact={false} />
                <span>Below</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Compact</span>
                <span>Above</span>
                <Divider {...args} compact={true} />
                <span>Below</span>
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all Divider props available via Storybook controls.
 */
export const Playground: Story = {
    decorators: [
        Story => (
            <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
                <span>Content above</span>
                <Story />
                <span>Content below</span>
            </div>
        ),
    ],
    args: {
        compact: false,
    },
};
