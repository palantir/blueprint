/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";
import type React from "react";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";

import { Toast } from "./toast";

const disabledArgs = ["timeout", "className", "action", "onDismiss", "message"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof Toast>
>;

const meta: Meta<typeof Toast> = {
    title: "Core/Overlays/Toast",
    component: Toast,
    decorators: [storybookLayoutDecorator],
    args: {
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
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
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
        <Flex flexDirection="column" gap={2}>
            {Object.values(Intent).map(intent => (
                <Toast
                    key={intent}
                    {...args}
                    intent={intent}
                    message={`${intent.charAt(0).toUpperCase() + intent.slice(1)} intent toast`}
                />
            ))}
        </Flex>
    ),
};

/**
 * Use the `icon` prop to render a Blueprint icon before the message.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        icon: { table: { disable: true } },
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={2}>
            <Toast {...args} icon="tick-circle" intent="success" message="File saved successfully" />
            <Toast {...args} icon="warning-sign" intent="warning" message="Connection is unstable" />
            <Toast {...args} icon="error" intent="danger" message="Failed to save changes" />
            <Toast {...args} icon="info-sign" intent="primary" message="New update available" />
        </Flex>
    ),
};

/**
 * Use the `action` prop to render an {@link AnchorButton} alongside the message.
 * The action accepts `ActionProps & LinkProps`, supporting text, icons, and links.
 */
export const ActionExample: Story = {
    name: "Action",
    argTypes: {
        isCloseButtonShown: { table: { disable: true } },
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={2}>
            <Toast {...args} message="File deleted" action={{ text: "Undo" }} />
            <Toast {...args} message="Changes saved" intent="success" action={{ text: "View", icon: "share" }} />
            <Toast
                {...args}
                message="New version available"
                intent="primary"
                action={{ text: "Release notes", href: "#", icon: "link" }}
            />
        </Flex>
    ),
};

/**
 * Interactive playground for experimenting with toast props.
 */
export const Playground: Story = {
    args: {
        message: "Playground toast message",
        icon: "info-sign",
        intent: Intent.PRIMARY,
        isCloseButtonShown: true,
        action: {
            text: "Undo",
        },
    },
};
