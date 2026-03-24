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
 * A checked switch card.
 */
export const Checked: Story = {
    args: {
        label: "Enabled setting",
        checked: true,
    },
};

/**
 * A disabled switch card cannot be interacted with.
 */
export const Disabled: Story = {
    args: {
        label: "Unavailable setting",
        disabled: true,
    },
};

/**
 * A disabled switch card that is also checked.
 */
export const DisabledChecked: Story = {
    args: {
        label: "Locked setting",
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
 * Multiple switch cards for a settings panel layout.
 */
export const SettingsPanel: Story = {
    name: "Settings panel",
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <SwitchCard {...args} label="Dark mode" defaultChecked={true} />
            <SwitchCard {...args} label="Notifications" defaultChecked={true} />
            <SwitchCard {...args} label="Auto-save" defaultChecked={false} />
            <SwitchCard {...args} label="Beta features" disabled={true} />
        </div>
    ),
};

/**
 * Use the `compact` prop to render a more condensed card.
 */
export const Compact: Story = {
    args: {
        label: "Compact switch card",
        compact: true,
    },
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
