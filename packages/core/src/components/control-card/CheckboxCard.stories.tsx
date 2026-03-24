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
 * A checked checkbox card.
 */
export const Checked: Story = {
    args: {
        label: "Enabled feature",
        checked: true,
    },
};

/**
 * A disabled checkbox card cannot be interacted with.
 */
export const Disabled: Story = {
    args: {
        label: "Unavailable option",
        disabled: true,
    },
};

/**
 * A disabled checkbox card that is also checked.
 */
export const DisabledChecked: Story = {
    args: {
        label: "Locked feature",
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
 * Use the `alignIndicator` prop to control the position of the checkbox within the card.
 */
export const AlignmentExample: Story = {
    name: "Alignment",
    argTypes: {
        alignIndicator: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <CheckboxCard {...args} alignIndicator={Alignment.START} label="Start (default)" />
            <CheckboxCard {...args} alignIndicator={Alignment.END} label="End" />
        </div>
    ),
};

/**
 * Multiple checkbox cards in a group layout.
 */
export const Group: Story = {
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <CheckboxCard {...args} label="Wi-Fi" defaultChecked={true} />
            <CheckboxCard {...args} label="Bluetooth" defaultChecked={false} />
            <CheckboxCard {...args} label="Location Services" defaultChecked={true} />
            <CheckboxCard {...args} label="NFC" disabled={true} />
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
