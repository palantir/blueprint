/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

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
 * A checked radio card.
 */
export const Checked: Story = {
    args: {
        label: "Selected option",
        checked: true,
    },
};

/**
 * A disabled radio card cannot be interacted with.
 */
export const Disabled: Story = {
    args: {
        label: "Unavailable option",
        disabled: true,
    },
};

/**
 * A disabled radio card that is also checked.
 */
export const DisabledChecked: Story = {
    args: {
        label: "Locked selection",
        disabled: true,
        checked: true,
    },
};

/**
 * Use `showAsSelectedWhenChecked={false}` to prevent "selected" card styling when checked.
 */
export const NoSelectedStyling: Story = {
    name: "No selected styling",
    args: {
        label: "No highlight when checked",
        checked: true,
        showAsSelectedWhenChecked: false,
    },
};

/**
 * Radio cards used in a group to select one option from several.
 */
export const Group: Story = {
    render: function Render(args) {
        const [selected, setSelected] = useState("monthly");
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
                {["monthly", "quarterly", "yearly"].map(value => (
                    <RadioCard
                        key={value}
                        {...args}
                        label={value.charAt(0).toUpperCase() + value.slice(1)}
                        value={value}
                        checked={selected === value}
                        onChange={() => setSelected(value)}
                    />
                ))}
            </div>
        );
    },
};

/**
 * A group with one disabled option.
 */
export const GroupWithDisabled: Story = {
    name: "Group with disabled option",
    render: function Render(args) {
        const [selected, setSelected] = useState("standard");
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
                <RadioCard
                    {...args}
                    label="Standard"
                    value="standard"
                    checked={selected === "standard"}
                    onChange={() => setSelected("standard")}
                />
                <RadioCard
                    {...args}
                    label="Premium"
                    value="premium"
                    checked={selected === "premium"}
                    onChange={() => setSelected("premium")}
                />
                <RadioCard {...args} label="Enterprise (coming soon)" value="enterprise" disabled={true} />
            </div>
        );
    },
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
