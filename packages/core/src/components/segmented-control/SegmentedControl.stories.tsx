/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Intent } from "../../common/intent";
import { SegmentedControl } from "./segmentedControl";

const OPTIONS = [
    { value: "list", label: "List", icon: "list" },
    { value: "grid", label: "Grid", icon: "grid-view" },
    { value: "chart", label: "Chart", icon: "chart" },
];

const meta = {
    title: "Core/SegmentedControl",
    component: SegmentedControl,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        options: OPTIONS,
        fill: false,
        inline: false,
        disabled: false,
        intent: Intent.PRIMARY,
    },
    argTypes: {
        intent: {
            control: "select",
            options: [Intent.NONE, Intent.PRIMARY],
        },
    },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Segmented control with default selection.
 */
export const Default: Story = {
    render: function SegmentedControlDefault() {
        const [value, setValue] = useState("list");
        return <SegmentedControl options={OPTIONS} value={value} onChange={setValue} />;
    },
};

/**
 * With fill to take container width.
 */
export const Fill: Story = {
    render: function SegmentedControlFill() {
        const [value, setValue] = useState("list");
        return (
            <div style={{ width: 280 }}>
                <SegmentedControl options={OPTIONS} value={value} onChange={setValue} fill={true} />
            </div>
        );
    },
};

/**
 * Text-only options (no icons).
 */
export const TextOnly: Story = {
    render: function SegmentedControlTextOnly() {
        const [value, setValue] = useState("left");
        return (
            <SegmentedControl
                options={[
                    { value: "left", label: "Left" },
                    { value: "center", label: "Center" },
                    { value: "right", label: "Right" },
                ]}
                value={value}
                onChange={setValue}
            />
        );
    },
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
    render: function SegmentedControlDisabled() {
        const [value, setValue] = useState("list");
        return <SegmentedControl options={OPTIONS} value={value} onChange={setValue} disabled={true} />;
    },
};
