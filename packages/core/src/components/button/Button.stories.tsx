/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alignment, ButtonVariant, Intent, Size } from "../../common";

import { Button } from "./buttons";

// These props are deprecated on Button — hide them from the Storybook controls panel.
const disabledArgs = ["large", "minimal", "outlined", "rightIcon", "small", "type"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof Button>
>;

const meta: Meta<typeof Button> = {
    title: "Core/Button",
    component: Button,
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
        text: "Button",
        intent: "none",
        variant: "solid",
        size: "medium",
        alignText: "center",
        icon: undefined,
        endIcon: undefined,
        fill: false,
        active: false,
        loading: false,
        disabled: false,
    },
    argTypes: {
        text: {
            control: "text",
        },
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "select",
            options: Object.values(Size),
        },
        variant: {
            control: "select",
            options: Object.values(ButtonVariant),
        },
        alignText: {
            control: "select",
            options: Object.values(Alignment),
        },
        icon: {
            control: "text",
        },
        endIcon: {
            control: "text",
        },
        active: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        loading: {
            control: "boolean",
        },
        onClick: { action: "clicked" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = {
                    table: {
                        disable: true,
                    },
                };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic button with default styling.
 */
export const Default: Story = {
    args: {
        text: "Button",
    },
};

// Intent variants
export const Primary: Story = {
    args: {
        text: "Primary Button",
        intent: "primary",
    },
};

export const Success: Story = {
    args: {
        text: "Success Button",
        intent: "success",
    },
};

export const Warning: Story = {
    args: {
        text: "Warning Button",
        intent: "warning",
    },
};

export const Danger: Story = {
    args: {
        text: "Danger Button",
        intent: "danger",
    },
};

// Size variants
export const Small: Story = {
    args: {
        text: "Small Button",
        size: "small",
    },
};

export const Medium: Story = {
    args: {
        text: "Medium Button",
        size: "medium",
    },
};

export const Large: Story = {
    args: {
        text: "Large Button",
        size: "large",
    },
};

// Visual style variants
export const Solid: Story = {
    args: {
        text: "Solid Button",
        variant: "solid",
        intent: "primary",
    },
};

export const Minimal: Story = {
    args: {
        text: "Minimal Button",
        variant: "minimal",
        intent: "primary",
    },
};

export const Outlined: Story = {
    args: {
        text: "Outlined Button",
        variant: "outlined",
        intent: "primary",
    },
};

// States
export const Active: Story = {
    args: {
        text: "Active Button",
        active: true,
        intent: "primary",
    },
};

export const Disabled: Story = {
    args: {
        text: "Disabled Button",
        disabled: true,
    },
};

export const Loading: Story = {
    args: {
        text: "Loading Button",
        loading: true,
        intent: "primary",
    },
};

export const WithStartIcon: Story = {
    args: {
        text: "Upload",
        icon: "upload",
    },
};

export const WithEndIcon: Story = {
    args: {
        text: "Next",
        endIcon: "arrow-right",
        intent: "primary",
    },
};

export const IconOnly: Story = {
    args: {
        icon: "search",
        text: undefined,
        "aria-label": "Search",
    },
};

// Text alignment
export const AlignStart: Story = {
    args: {
        text: "Start",
        alignText: "start",
        icon: "align-left",
        endIcon: "caret-down",
        fill: true,
    },
};

export const AlignCenter: Story = {
    args: {
        text: "Center",
        alignText: "center",
        icon: "align-center",
        endIcon: "caret-down",
        fill: true,
    },
};

export const AlignEnd: Story = {
    args: {
        text: "End",
        alignText: "end",
        icon: "align-right",
        endIcon: "caret-down",
        fill: true,
    },
};

// Fill
export const Fill: Story = {
    args: {
        text: "Fill Container",
        fill: true,
        intent: "primary",
    },
};

// All intents
export const AllIntents: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
                <Button>None</Button>
                <Button intent="primary">Primary</Button>
                <Button intent="success">Success</Button>
                <Button intent="warning">Warning</Button>
                <Button intent="danger">Danger</Button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <Button variant="minimal">None</Button>
                <Button variant="minimal" intent="primary">
                    Primary
                </Button>
                <Button variant="minimal" intent="success">
                    Success
                </Button>
                <Button variant="minimal" intent="warning">
                    Warning
                </Button>
                <Button variant="minimal" intent="danger">
                    Danger
                </Button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <Button variant="outlined">None</Button>
                <Button variant="outlined" intent="primary">
                    Primary
                </Button>
                <Button variant="outlined" intent="success">
                    Success
                </Button>
                <Button variant="outlined" intent="warning">
                    Warning
                </Button>
                <Button variant="outlined" intent="danger">
                    Danger
                </Button>
            </div>
        </div>
    ),
};

// All sizes
export const AllSizes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
        </div>
    ),
};
