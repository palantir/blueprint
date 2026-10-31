/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { type ComponentProps } from "react";

import { EndorsedIcon, type IconName } from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";

import { HTMLSelect } from "./htmlSelect";

const SAMPLE_OPTIONS = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
    { label: "Option 4", value: "4" },
    { label: "Option 5", value: "5" },
];

const disabledArgs = ["children", "multiple"] as const satisfies ReadonlyArray<keyof ComponentProps<typeof HTMLSelect>>;

const meta: Meta<typeof HTMLSelect> = {
    title: "Core/Form/HTMLSelect",
    component: HTMLSelect,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        options: SAMPLE_OPTIONS,
        fill: false,
        large: false,
        minimal: false,
        disabled: false,
        icon: "double-caret-vertical",
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
        icon: {
            control: "select",
            options: ["double-caret-vertical", "caret-down"] satisfies IconName[],
        },
        onChange: { action: "changed" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof HTMLSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic HTML select with default styling.
 */
export const Default: Story = {};

/**
 * Use the `minimal` prop to apply minimal styling.
 */
export const VariantExample: Story = {
    name: "Variant",
    argTypes: {
        minimal: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} minimal={false} />
                <StoryLabel title="Default" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} minimal={true} />
                <StoryLabel title="Minimal" />
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `large` prop to render a larger select element.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        large: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2} alignItems="center">
            <HTMLSelect {...args} large={false} />
            <HTMLSelect {...args} large={true} />
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
        <Flex gap={2} alignItems="center">
            <HTMLSelect {...args} disabled={false} />
            <HTMLSelect {...args} disabled={true} />
        </Flex>
    ),
};

/**
 * Use the `icon` prop to render any Blueprint icon — or an icon element — on the right side of the select.
 */
export const IconsExample: Story = {
    name: "Icons",
    argTypes: {
        icon: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} icon="double-caret-vertical" />
                <StoryLabel title="double-caret-vertical" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} icon="caret-down" />
                <StoryLabel title="caret-down" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} icon="filter" />
                <StoryLabel title="filter" />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <HTMLSelect {...args} icon={<EndorsedIcon />} />
                <StoryLabel title="<EndorsedIcon />" />
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
        <Flex flexDirection="column" gap={2} alignItems="start">
            <HTMLSelect {...args} fill={true} options={[{ label: "Full Width", value: "full" }]} />
            <HTMLSelect {...args} fill={false} options={[{ label: "Auto Width", value: "auto" }]} />
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {};
