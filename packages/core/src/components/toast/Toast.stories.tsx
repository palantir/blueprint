/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { Toast } from "./toast";

const meta: Meta<typeof Toast> = {
    title: "Core/Overlays/Toast",
    component: Toast,
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
        message: "This is a toast message",
        intent: Intent.NONE,
        icon: undefined,
        isCloseButtonShown: true,
        timeout: 0,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        icon: {
            control: "text",
        },
        isCloseButtonShown: {
            control: "boolean",
        },
        timeout: {
            control: "number",
        },
        onDismiss: { action: "dismissed" },
    },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic toast with default styling and a close button.
 */
export const Default: Story = {
    args: {
        message: "This is a toast message",
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the toast.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.values(Intent).map(intent => (
                <Toast
                    key={intent}
                    {...args}
                    intent={intent}
                    message={`${intent.charAt(0).toUpperCase() + intent.slice(1)} intent toast`}
                />
            ))}
        </div>
    ),
};

/**
 * Use the `icon` prop to render a Blueprint icon before the message.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        icon: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Toast {...args} icon="tick-circle" intent="success" message="File saved successfully" />
            <Toast {...args} icon="warning-sign" intent="warning" message="Connection is unstable" />
            <Toast {...args} icon="error" intent="danger" message="Failed to save changes" />
            <Toast {...args} icon="info-sign" intent="primary" message="New update available" />
        </div>
    ),
};

/**
 * Interactive playground for experimenting with toast props.
 */
export const Playground: Story = {
    args: {
        message: "Playground toast message",
        icon: "info-sign",
        intent: "primary",
        isCloseButtonShown: true,
        action: {
            text: "Undo",
        },
    },
};
