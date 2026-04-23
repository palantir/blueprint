/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Button } from "../button/buttons";

import { ControlGroup } from "./controlGroup";
import { InputGroup } from "./inputGroup";

const meta: Meta<typeof ControlGroup> = {
    title: "Core/Form/ControlGroup",
    component: ControlGroup,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        fill: false,
        vertical: false,
    },
    argTypes: {
        fill: {
            control: "boolean",
        },
        vertical: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof ControlGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic control group with default styling containing an input and a button.
 */
export const Default: Story = {
    argTypes: {
        fill: { table: { disable: true } },
        children: {
            table: {
                disable: true,
            },
        },
    },
    render: args => (
        <ControlGroup {...args}>
            <InputGroup placeholder="Enter text..." />
            <Button text="Submit" />
        </ControlGroup>
    ),
};

/**
 * Use the `fill` prop to make the control group expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
        children: {
            table: {
                disable: true,
            },
        },
    },
    decorators: [
        Story => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <Flex flexDirection="column" gap={2}>
            <ControlGroup {...args} fill={true}>
                <InputGroup placeholder="Full width input" />
                <Button text="Submit" />
            </ControlGroup>
            <ControlGroup {...args} fill={false}>
                <InputGroup placeholder="Auto width input" />
                <Button text="Submit" />
            </ControlGroup>
        </Flex>
    ),
};

/**
 * Use the `vertical` prop to make the control group show vertically.
 */
export const VerticalExample: Story = {
    name: "Vertical",
    argTypes: {
        vertical: { table: { disable: true } },
        children: {
            table: {
                disable: true,
            },
        },
    },
    decorators: [
        Story => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <Flex flexDirection="column" gap={8}>
            <ControlGroup {...args} vertical={true}>
                <InputGroup placeholder="Vertical input" />
                <Button text="Submit" />
            </ControlGroup>
            <ControlGroup {...args} vertical={false}>
                <InputGroup placeholder="Horizontal input" />
                <Button text="Submit" />
            </ControlGroup>
        </Flex>
    ),
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    argTypes: {
        children: {
            table: {
                disable: true,
            },
        },
    },
    render: args => (
        <ControlGroup {...args}>
            <Button icon="filter" aria-label="Filter results" />
            <InputGroup placeholder="Enter text..." />
            <Button text="Submit" />
        </ControlGroup>
    ),
};
