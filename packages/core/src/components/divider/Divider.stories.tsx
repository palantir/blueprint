/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryLabel } from "../storybook-components/StoryLabel";

import { Divider } from "./divider";

const meta: Meta<typeof Divider> = {
    title: "Core/Divider",
    component: Divider,
    decorators: [
        Story => (
            <div style={{ width: "300px" }}>
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
    name: "Default",
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: "3em" }}>
            <div>
                Content above
                <Divider {...args} />
                Content below
            </div>

            <div style={{ textAlign: "center" }}>
                Content above, text center-aligned
                <Divider {...args} />
                Content below, text center-aligned
            </div>
        </div>
    ),
};

/**
 * A basic vertical divider inside a flex container
 */
export const Vertical: Story = {
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: "3em" }}>
            <div style={{ display: "flex" }}>
                Content to the left that wraps around a bit more than you'd expect
                <Divider {...args} />
                Content to the right that also wraps around a bit more than you'd expect
            </div>

            <div style={{ display: "flex", textAlign: "center" }}>
                Content above, text center-aligned
                <Divider {...args} />
                Content below, text center-aligned
            </div>
        </div>
    ),
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
        <div style={{ display: "flex", flexDirection: "column", gap: "3em" }}>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                <StoryLabel title="Default" />
                Above
                <Divider {...args} compact={false} />
                Below
            </div>
            <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                <StoryLabel title="Compact" />
                Above
                <Divider {...args} compact={true} />
                Below
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
            <div style={{ display: "flex", flexDirection: "column" }}>
                Content above
                <Story />
                Content below
            </div>
        ),
    ],
    args: {
        compact: false,
    },
};
