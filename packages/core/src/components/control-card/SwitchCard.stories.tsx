/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alignment, Elevation } from "../../common";

import { SwitchCard } from "./switchCard";

const meta: Meta<typeof SwitchCard> = {
    title: "Core/ControlCard/SwitchCard",
    component: SwitchCard,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "400px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        label: "Switch option",
        checked: false,
        disabled: false,
        showAsSelectedWhenChecked: true,
        compact: false,
        elevation: Elevation.ZERO,
    },
    argTypes: {
        label: {
            control: "text",
        },
        checked: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        showAsSelectedWhenChecked: {
            control: "boolean",
        },
        compact: {
            control: "boolean",
        },
        elevation: {
            control: "select",
            options: Object.values(Elevation),
        },
        alignIndicator: {
            control: "select",
            options: Object.values(Alignment),
        },
        onChange: { action: "changed" },
    },
} satisfies Meta<typeof SwitchCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic switch card with default styling.
 */
export const Default: Story = {
    args: {
        label: "Switch option",
    },
};

/**
 * Use the `compact` prop to render a more condensed switch card.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <SwitchCard {...args} compact={false} label="Default" defaultChecked={true} />
            <SwitchCard {...args} compact={true} label="Compact" defaultChecked={true} />
        </div>
    ),
};

/**
 * Switch cards support `disabled`, `checked`, and `selected` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        checked: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <SwitchCard {...args} label="Default" />
            <SwitchCard {...args} label="Checked" checked={true} />
            <SwitchCard {...args} label="Disabled" disabled={true} />
            <SwitchCard {...args} label="Disabled Checked" disabled={true} checked={true} />
            <SwitchCard {...args} label="No selected styling" checked={true} showAsSelectedWhenChecked={false} />
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: args => <SwitchCard {...args} />,
    args: {
        label: "Playground switch card",
    },
};
