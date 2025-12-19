/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alignment } from "../../common";
import { Switch } from "./controls";

const meta = {
    title: "Core/Switch",
    component: Switch,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        label: "Switch",
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Unchecked switch.
 */
export const Default: Story = {};

/**
 * Checked (on) state.
 */
export const Checked: Story = {
    args: {
        checked: true,
    },
};

/**
 * With inner labels (e.g. On/Off).
 */
export const WithInnerLabels: Story = {
    args: {
        innerLabel: "Off",
        innerLabelChecked: "On",
        label: "Setting",
    },
};

/**
 * Disabled switch.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        label: "Disabled",
    },
};

/**
 * Size variants.
 */
export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Switch size="small" label="Small" />
            <Switch size="medium" label="Medium" />
            <Switch size="large" label="Large" />
        </div>
    ),
};
