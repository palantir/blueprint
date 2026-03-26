/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alignment, Elevation } from "../../common";

import { CheckboxCard } from "./checkboxCard";

const meta: Meta<typeof CheckboxCard> = {
    title: "Core/ControlCard/CheckboxCard",
    component: CheckboxCard,
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
        label: "Checkbox option",
        checked: false,
        disabled: false,
        showAsSelectedWhenChecked: true,
        compact: false,
        elevation: Elevation.ZERO,
        alignIndicator: Alignment.START,
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
} satisfies Meta<typeof CheckboxCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic checkbox card with default styling.
 */
export const Default: Story = {
    args: {
        label: "Checkbox option",
    },
};

/**
 * Use the `size` prop to render a medium or large checkbox card.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <CheckboxCard {...args} compact={false} label="Default" defaultChecked={true} />
            <CheckboxCard {...args} compact={true} label="Compact" defaultChecked={true} />
        </div>
    ),
};

/**
 * Checkbox cards support `disabled`, `checked`, and `selected` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        checked: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <CheckboxCard {...args} label="Default" />
            <CheckboxCard {...args} label="Checked" checked={true} />
            <CheckboxCard {...args} label="Disabled" disabled={true} />
            <CheckboxCard {...args} label="Disabled Checked" disabled={true} checked={true} />
            <CheckboxCard {...args} label="No selected styling" checked={true} showAsSelectedWhenChecked={false} />
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: args => <CheckboxCard {...args} />,
    args: {
        label: "Playground checkbox card",
    },
};
