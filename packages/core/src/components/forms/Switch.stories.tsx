/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryLabel } from "@storybook-common";
import { type ComponentProps } from "react";


import { Switch } from "./controls";

const disabledArgs = ["large", "tagName", "labelElement", "inputRef"] as const satisfies ReadonlyArray<
    keyof ComponentProps<typeof Switch>
>;

const meta: Meta<typeof Switch> = {
    title: "Core/Form/Controls/Switch",
    component: Switch,
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
        label: "Switch",
        disabled: false,
        inline: false,
        size: "medium",
    },
    argTypes: {
        size: {
            control: "select",
            options: ["medium", "large"],
        },
        disabled: {
            control: "boolean",
        },
        inline: {
            control: "boolean",
        },
        innerLabel: {
            control: "text",
        },
        innerLabelChecked: {
            control: "text",
        },
        defaultChecked: {
            control: "boolean",
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic switch with default styling.
 */
export const Default: Story = {
    args: {
        label: "Enable dark mode",
    },
};

/**
 * Use the `size` prop to adjust the switch dimensions.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Switch {...args} size="medium" label="Medium" defaultChecked={true} />
            <Switch {...args} size="large" label="Large" defaultChecked={true} />
        </div>
    ),
};

/**
 * Switches support `disabled`, `checked`, and `inline` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        inline: { table: { disable: true } },
        defaultChecked: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
            <StoryLabel title="Unchecked" />
            <div style={{ display: "flex", gap: 16 }}>
                <Switch {...args} label="Default" />
                <Switch {...args} label="Disabled" disabled={true} />
            </div>
            <StoryLabel title="Checked" />
            <div style={{ display: "flex", gap: 16 }}>
                <Switch {...args} label="Checked" defaultChecked={true} />
                <Switch {...args} label="Checked Disabled" defaultChecked={true} disabled={true} />
            </div>
            <StoryLabel title="Inline" />
            <div>
                <Switch {...args} inline={true} label="Wi-Fi" defaultChecked={true} />
                <Switch {...args} inline={true} label="Bluetooth" />
                <Switch {...args} inline={true} label="Airplane Mode" />
            </div>
        </div>
    ),
};

/**
 * All states across all sizes.
 */
export const AllStates: Story = {
    name: "All States",
    render: args => (
        <div style={{ display: "flex", gap: 24, flexDirection: "column" }}>
            {(["medium", "large"] as const).map(size => (
                <div key={size}>
                    <StoryLabel title={size} />
                    <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
                        <Switch {...args} size={size} label="Unchecked" />
                        <Switch {...args} size={size} label="Checked" defaultChecked={true} />
                        <Switch {...args} size={size} label="Disabled" disabled={true} />
                        <Switch {...args} size={size} label="Checked Disabled" defaultChecked={true} disabled={true} />
                        <Switch
                            {...args}
                            size={size}
                            label="With inner labels"
                            innerLabel="Off"
                            innerLabelChecked="On"
                            defaultChecked={true}
                        />
                    </div>
                </div>
            ))}
        </div>
    ),
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        label: "Enable feature",
        innerLabel: "Off",
        innerLabelChecked: "On",
        defaultChecked: false,
    },
};
