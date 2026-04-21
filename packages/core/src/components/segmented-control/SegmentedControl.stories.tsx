/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { useCallback, useState } from "react";

import { Flex } from "@blueprintjs/labs";

import { Intent, Size } from "../../common";

import { SegmentedControl } from "./segmentedControl";

const DEFAULT_OPTIONS = [
    { label: "List", value: "list" },
    { label: "Grid", value: "grid" },
    { label: "Gallery", value: "gallery" },
];

const ICON_OPTIONS = [
    { label: "List", value: "list", icon: "list" as const },
    { label: "Grid", value: "grid", icon: "grid-view" as const },
    { label: "Gallery", value: "gallery", icon: "media" as const },
];

// These props are deprecated on SegmentedControl — hide them from the Storybook controls panel.
const disabledArgs = ["large", "small"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof SegmentedControl>
>;

const meta: Meta<typeof SegmentedControl> = {
    title: "Core/Form/Controls/SegmentedControl",
    component: SegmentedControl,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        options: DEFAULT_OPTIONS,
        defaultValue: "list",
        intent: Intent.NONE,
        size: "medium",
        disabled: false,
        fill: false,
        inline: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: [Intent.NONE, Intent.PRIMARY],
        },
        size: {
            control: "select",
            options: Object.values(Size),
        },
        disabled: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        inline: {
            control: "boolean",
        },
        onValueChange: { action: "valueChanged" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = {
                    table: {
                        disable: true,
                    },
                };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic segmented control with default styling.
 */
export const Default: Story = {};

/**
 * Use the `intent` prop to apply a semantic color to the selected segment.
 * SegmentedControl supports `"none"` (default) and `"primary"`.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="None" />
                <SegmentedControl {...args} intent={Intent.NONE} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Primary" />
                <SegmentedControl {...args} intent={Intent.PRIMARY} />
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `size` prop to adjust the control dimensions.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} alignItems="center">
            {Object.values(Size).map(size => (
                <Flex key={size} flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title={size} />
                    <SegmentedControl {...args} size={size} />
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * The disabled state prevents user interaction with the control.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Default" />
                <SegmentedControl {...args} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Disabled" />
                <SegmentedControl {...args} disabled={true} />
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the control expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Fill" />
                <SegmentedControl {...args} fill={true} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Auto Width" />
                <SegmentedControl {...args} fill={false} />
            </Flex>
        </Flex>
    ),
};

/**
 * Each option can include an `icon` prop to display an icon alongside the label.
 */
export const WithIcons: Story = {
    name: "With Icons",
    args: {
        options: ICON_OPTIONS,
    },
};

/**
 * Use `aria-label` on the container and `role` to control the ARIA semantics.
 * The component supports `"radiogroup"` (default), `"group"`, `"toolbar"`, and `"menu"` roles.
 */
export const AriaLabels: Story = {
    name: "Aria Labels",
    render: args => (
        <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title={'role="radiogroup" (default) + aria-label'} />
                <SegmentedControl {...args} aria-label="View mode" />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title={'role="toolbar" + aria-label'} />
                <SegmentedControl {...args} role="toolbar" aria-label="View mode toolbar" />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title={'role="group" + aria-label'} />
                <SegmentedControl {...args} role="group" aria-label="View mode group" />
            </Flex>
        </Flex>
    ),
};

/**
 * All intents across all sizes and states.
 */
export const AllIntentsAllSizes: Story = {
    name: "All Intents & Sizes",
    argTypes: {
        intent: { table: { disable: true } },
        size: { table: { disable: true } },
        disabled: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            {[Intent.NONE, Intent.PRIMARY].map(intent => (
                <Flex key={intent} flexDirection="column" gap={2}>
                    <StoryLabel title={`Intent: ${intent}`} />
                    {Object.values(Size).map(size => (
                        <SegmentedControl key={size} {...args} intent={intent} size={size} />
                    ))}
                    <SegmentedControl {...args} intent={intent} disabled={true} />
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * Interactive playground demonstrating controlled value state.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [value, setValue] = useState("list");

        const handleValueChange = useCallback((newValue: string) => {
            setValue(newValue);
        }, []);

        return (
            <Flex flexDirection="column" gap={3} alignItems="center">
                <SegmentedControl {...args} options={ICON_OPTIONS} value={value} onValueChange={handleValueChange} />
                <StoryLabel title={`Selected: ${value}`} />
            </Flex>
        );
    },
};
