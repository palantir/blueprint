/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { HTMLSelect, type HTMLSelectIconName } from "./htmlSelect";

const SAMPLE_OPTIONS = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
    { label: "Option 4", value: "4" },
    { label: "Option 5", value: "5" },
];

const meta: Meta<typeof HTMLSelect> = {
    title: "Core/Form/HTMLSelect",
    component: HTMLSelect,
    decorators: [storybookLayoutDecorator],
    args: {
        options: SAMPLE_OPTIONS,
        fill: false,
        large: false,
        minimal: false,
        disabled: false,
        iconName: "double-caret-vertical",
    },
    argTypes: {
        fill: {
            control: "boolean",
        },
        large: {
            control: "boolean",
        },
        minimal: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        iconName: {
            control: "select",
            options: ["double-caret-vertical", "caret-down"] satisfies HTMLSelectIconName[],
        },
        onChange: { action: "changed", table: { disable: true } },
    },
} satisfies Meta<typeof HTMLSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic HTML select with default styling.
 */
export const Default: Story = {};

/**
 * Use the `large` prop to render a larger select element.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        large: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={10} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="default" />
                <HTMLSelect {...args} large={false} />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="large" />
                <HTMLSelect {...args} large={true} />
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `disabled` prop to make the select non-interactive.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={10} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="enabled" />
                <HTMLSelect {...args} disabled={false} />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="disabled" />
                <HTMLSelect {...args} disabled={true} />
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the select expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <Flex flexDirection="column" gap={5} alignItems="start">
            <Flex flexDirection="column" gap={1} width={100}>
                <StoryLabel title="fill is true" />
                <HTMLSelect {...args} fill={true} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="fill is false" />
                <HTMLSelect {...args} fill={false} />
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `minimal` prop to render a select with minimal chrome.
 */
export const MinimalExample: Story = {
    name: "Minimal",
    argTypes: {
        minimal: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={10} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="default" />
                <HTMLSelect {...args} minimal={false} />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="minimal" />
                <HTMLSelect {...args} minimal={true} />
            </Flex>
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        options: SAMPLE_OPTIONS,
        fill: false,
        large: false,
        minimal: false,
        disabled: false,
    },
};
