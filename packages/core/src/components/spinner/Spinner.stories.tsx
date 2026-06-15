/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";

import { Spinner, SpinnerSize } from "./spinner";

const meta: Meta<typeof Spinner> = {
    title: "Core/Spinner",
    component: Spinner,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        intent: Intent.NONE,
        size: SpinnerSize.STANDARD,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "number",
        },
        value: {
            control: { type: "range", min: 0, max: 1, step: 0.05 },
        },
        tagName: {
            control: "text",
        },
    },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic spinner with default styling (indeterminate).
 */
export const Default: Story = {};

/**
 * Use the `intent` prop to apply a semantic color to the spinner.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4} alignItems="center">
            {Object.values(Intent).map(intent => (
                <Flex key={intent} flexDirection="column" gap={1} alignItems="center">
                    <Spinner {...args} intent={intent} size={SpinnerSize.STANDARD} />
                    <StoryLabel title={intent} />
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * Use the `size` prop to control the spinner dimensions. Common sizes are available as `SpinnerSize` constants.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={6} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} size={SpinnerSize.SMALL} />
                <StoryLabel title="Small (20px)" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} size={SpinnerSize.STANDARD} />
                <StoryLabel title="Standard (50px)" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} size={SpinnerSize.LARGE} />
                <StoryLabel title="Large (100px)" />
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `value` prop to show determinate progress. Omit it for an indeterminate spinner.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        value: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={6} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} value={undefined} />
                <StoryLabel title="Indeterminate" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} value={0} />
                <StoryLabel title="0%" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} value={0.5} />
                <StoryLabel title="50%" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Spinner {...args} value={1} />
                <StoryLabel title="100%" />
            </Flex>
        </Flex>
    ),
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        intent: Intent.PRIMARY,
        size: SpinnerSize.STANDARD,
        value: 0.7,
    },
};
