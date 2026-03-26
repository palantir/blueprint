/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alignment, Elevation } from "../../common";

import { RadioCard } from "./radioCard";

const meta: Meta<typeof RadioCard> = {
    title: "Core/ControlCard/RadioCard",
    component: RadioCard,
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
        label: "Radio option",
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
} satisfies Meta<typeof RadioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic radio card with default styling.
 */
export const Default: Story = {
    args: {
        label: "Radio option",
    },
};

/**
 * Use the `compact` prop to render a more condensed radio card.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <RadioCard {...args} compact={false} label="Default" defaultChecked={true} />
            <RadioCard {...args} compact={true} label="Compact" defaultChecked={true} />
        </div>
    ),
};

/**
 * Radio cards support `disabled`, `checked`, and `selected` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        checked: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <RadioCard {...args} label="Default" />
            <RadioCard {...args} label="Checked" checked={true} />
            <RadioCard {...args} label="Disabled" disabled={true} />
            <RadioCard {...args} label="Disabled Checked" disabled={true} checked={true} />
            <RadioCard {...args} label="No selected styling" checked={true} showAsSelectedWhenChecked={false} />
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: args => <RadioCard {...args} />,
    args: {
        label: "Playground radio card",
    },
};
