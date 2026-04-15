/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StorybookLayout, storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { useCallback, useState } from "react";

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
    parameters: {
        layout: "centered",
    },
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="None" />
                <SegmentedControl {...args} intent={Intent.NONE} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="Primary" />
                <SegmentedControl {...args} intent={Intent.PRIMARY} />
            </div>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            {Object.values(Size).map(size => (
                <div key={size} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <StoryLabel title={size} />
                    <SegmentedControl {...args} size={size} />
                </div>
            ))}
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="Default" />
                <SegmentedControl {...args} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="Disabled" />
                <SegmentedControl {...args} disabled={true} />
            </div>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="Fill" />
                <SegmentedControl {...args} fill={true} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="Auto Width" />
                <SegmentedControl {...args} fill={false} />
            </div>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title={'role="radiogroup" (default) + aria-label'} />
                <SegmentedControl {...args} aria-label="View mode" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title={'role="toolbar" + aria-label'} />
                <SegmentedControl {...args} role="toolbar" aria-label="View mode toolbar" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title={'role="group" + aria-label'} />
                <SegmentedControl {...args} role="group" aria-label="View mode group" />
            </div>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[Intent.NONE, Intent.PRIMARY].map(intent => (
                <div key={intent} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <StoryLabel title={`Intent: ${intent}`} />
                    {Object.values(Size).map(size => (
                        <SegmentedControl key={size} {...args} intent={intent} size={size} />
                    ))}
                    <SegmentedControl {...args} intent={intent} disabled={true} />
                </div>
            ))}
        </div>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <SegmentedControl {...args} options={ICON_OPTIONS} value={value} onValueChange={handleValueChange} />
                <StoryLabel title={`Selected: ${value}`} />
            </div>
        );
    },
};
