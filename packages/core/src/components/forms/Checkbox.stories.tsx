/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alignment } from "../../common";
import { Checkbox } from "./controls";

const meta = {
    title: "Core/Checkbox",
    component: Checkbox,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        label: "Checkbox",
        checked: false,
        disabled: false,
        inline: false,
        alignIndicator: Alignment.START,
        size: "medium",
    },
    argTypes: {
        alignIndicator: {
            control: "select",
            options: [Alignment.START, Alignment.CENTER, Alignment.END],
        },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Unchecked checkbox.
 */
export const Default: Story = {};

/**
 * Checked state.
 */
export const Checked: Story = {
    args: {
        checked: true,
    },
};

/**
 * Indeterminate (partially checked) state.
 */
export const Indeterminate: Story = {
    args: {
        indeterminate: true,
        label: "Indeterminate",
    },
};

/**
 * Disabled checkbox.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        label: "Disabled",
    },
};

/**
 * Inline checkboxes.
 */
export const Inline: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 16 }}>
            <Checkbox inline={true} label="One" />
            <Checkbox inline={true} label="Two" />
            <Checkbox inline={true} label="Three" />
        </div>
    ),
};

/**
 * Size variants.
 */
export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Checkbox size="small" label="Small" />
            <Checkbox size="medium" label="Medium" />
            <Checkbox size="large" label="Large" />
        </div>
    ),
};
