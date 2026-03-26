/*!
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { Icon, IconSize } from "./icon";

const meta: Meta<typeof Icon> = {
    title: "Core/Icon",
    component: Icon,
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
        icon: "home",
        size: IconSize.STANDARD,
        intent: "none",
        color: undefined,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "select",
            options: [IconSize.STANDARD, IconSize.LARGE],
        },
        icon: {
            control: "text",
        },
        color: {
            control: "text",
        },
    },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic icon with default styling.
 */
export const Default: Story = {
    args: {
        icon: "home",
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the icon.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8 }}>
            {Object.values(Intent).map(intent => (
                <Icon key={intent} {...args} intent={intent} />
            ))}
        </div>
    ),
};

/**
 * Use the `size` prop to adjust the icon dimensions. Icon supports `STANDARD` (16px) and `LARGE` (20px).
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Icon {...args} size={IconSize.STANDARD} />
            <Icon {...args} size={IconSize.LARGE} />
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        icon: "home",
        size: IconSize.STANDARD,
        intent: "none",
        color: undefined,
    },
};
