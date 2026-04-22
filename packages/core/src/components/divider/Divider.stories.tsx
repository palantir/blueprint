/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

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
        <Flex flexDirection="column" gap={10}>
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
        </Flex>
    ),
};

/**
 * A basic vertical divider inside a flex container
 */
export const Vertical: Story = {
    render: args => (
        <Flex flexDirection="column" gap={10}>
            <Flex>
                Content to the left that wraps around a bit more than you'd expect
                <Divider {...args} />
                Content to the right that also wraps around a bit more than you'd expect
            </Flex>

            <Flex style={{ textAlign: "center" }}>
                Content above, text center-aligned
                <Divider {...args} />
                Content below, text center-aligned
            </Flex>
        </Flex>
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
        <Flex flexDirection="column" gap={10}>
            <Flex flexDirection="column" style={{ textAlign: "center" }}>
                <StoryLabel title="Default" />
                Above
                <Divider {...args} compact={false} />
                Below
            </Flex>
            <Flex flexDirection="column" style={{ textAlign: "center" }}>
                <StoryLabel title="Compact" />
                Above
                <Divider {...args} compact={true} />
                Below
            </Flex>
        </Flex>
    ),
};

/**
 * Interactive playground with all Divider props available via Storybook controls.
 */
export const Playground: Story = {
    decorators: [
        Story => (
            <Flex flexDirection="column">
                Content above
                <Story />
                Content below
            </Flex>
        ),
    ],
    args: {
        compact: false,
    },
};
