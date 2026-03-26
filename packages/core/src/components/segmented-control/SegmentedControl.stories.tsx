/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
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
    title: "Core/SegmentedControl",
    component: SegmentedControl,
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
        options: DEFAULT_OPTIONS,
        defaultValue: "list",
        intent: "none",
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
                <span style={{ fontSize: 12, opacity: 0.6 }}>None</span>
                <SegmentedControl {...args} intent={Intent.NONE} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Primary</span>
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
                    <span style={{ fontSize: 12, opacity: 0.6, textTransform: "capitalize" }}>{size}</span>
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
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <SegmentedControl {...args} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Disabled</span>
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
                <span style={{ fontSize: 12, opacity: 0.6 }}>Fill</span>
                <SegmentedControl {...args} fill={true} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Auto Width</span>
                <SegmentedControl {...args} fill={false} />
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
                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                        Intent: {intent === Intent.NONE ? "none" : "primary"}
                    </div>
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
                <span style={{ fontSize: 12, opacity: 0.6 }}>Selected: {value}</span>
            </div>
        );
    },
};
