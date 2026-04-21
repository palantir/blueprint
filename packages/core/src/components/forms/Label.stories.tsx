/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Flex } from "@blueprintjs/labs";

import { Label } from "../html/html";

import { InputGroup } from "./inputGroup";

const meta: Meta<typeof Label> = {
    title: "Core/Form/Label",
    component: Label,
    decorators: [
        Story => (
            <Flex flexDirection="column" gap={3} style={{ width: "100%", minWidth: "400px" }}>
                <Story />
            </Flex>
        ),
    ],
    tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic label with text content.
 */
export const Default: Story = {
    args: {
        children: "Label text",
    },
};

/**
 * Labels are commonly used alongside input elements.
 */
export const WithInput: Story = {
    name: "With Input",
    args: {
        children: "Label text",
    },
    render: ({ children, ...args }) => (
        <Flex flexDirection="column" gap={4} style={{ width: "100%" }}>
            <Label {...args}>
                {children}
                <InputGroup placeholder="Placeholder..." />
            </Label>
        </Flex>
    ),
};

/**
 * Labels support disabled styling through the `bp-disabled` class.
 */
export const StateExample: Story = {
    name: "State",
    render: () => (
        <Flex flexDirection="column" gap={4} style={{ width: "100%" }}>
            <Label>
                Enabled label
                <InputGroup placeholder="Enabled..." />
            </Label>
            <Label disabled={true}>
                Disabled label
                <InputGroup disabled={true} placeholder="Disabled..." />
            </Label>
        </Flex>
    ),
};

/**
 * Interactive playground.
 */
export const Playground: Story = {
    render: ({ children, ...args }) => (
        <Label {...args}>
            {children}
            <InputGroup placeholder="Enter value..." />
        </Label>
    ),
    args: {
        children: "Field label",
    },
};
