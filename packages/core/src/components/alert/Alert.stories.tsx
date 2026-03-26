/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Intent } from "../../common";

import { Alert } from "./alert";

const meta: Meta<typeof Alert> = {
    title: "Core/Alert",
    component: Alert,
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
        intent: "none",
        isOpen: true,
        canEscapeKeyCancel: false,
        canOutsideClickCancel: false,
        icon: "info-sign",
        confirmButtonText: "OK",
        cancelButtonText: undefined,
        loading: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        isOpen: {
            control: "boolean",
        },
        canEscapeKeyCancel: {
            control: "boolean",
        },
        canOutsideClickCancel: {
            control: "boolean",
        },
        icon: {
            control: "text",
        },
        confirmButtonText: {
            control: "text",
        },
        cancelButtonText: {
            control: "text",
        },
        loading: {
            control: "boolean",
        },
        onConfirm: { action: "confirmed" },
        onCancel: { action: "cancelled" },
        onClose: { action: "closed" },
    },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic alert with default styling.
 */
export const Default: Story = {
    args: {
        children: "Are you sure you want to continue?",
    },
};

/**
 * Use the `intent` prop to apply a semantic color to the confirm button and icon.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Alert key={intent} {...args} isOpen={true} intent={intent} icon="info-sign" confirmButtonText="OK">
                        This is a <strong>{intent}</strong> alert.
                    </Alert>
                ))}
        </div>
    ),
};

/**
 * Alerts support `loading` state and can include a cancel button with `cancelButtonText`.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        loading: { table: { disable: true } },
        cancelButtonText: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Alert {...args} isOpen={true} intent="danger" icon="trash" confirmButtonText="Delete">
                Default alert with confirm only.
            </Alert>
            <Alert
                {...args}
                isOpen={true}
                intent="danger"
                icon="trash"
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
            >
                Alert with cancel button.
            </Alert>
            <Alert {...args} isOpen={true} intent="primary" icon="info-sign" confirmButtonText="OK" loading={true}>
                Loading alert.
            </Alert>
        </div>
    ),
};

/**
 * All intents displayed for visual regression testing.
 */
export const AllIntents: Story = {
    argTypes: {
        intent: { table: { disable: true } },
        icon: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Alert key={intent} {...args} isOpen={true} intent={intent} icon="info-sign" confirmButtonText="OK">
                        This is a <strong>{intent}</strong> alert.
                    </Alert>
                ))}
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(true);

        const handleConfirm = useCallback(() => {
            args.onConfirm?.();
            setIsOpen(false);
        }, [args]);

        const handleCancel = useCallback(() => {
            args.onCancel?.();
            setIsOpen(false);
        }, [args]);

        const handleReopen = useCallback(() => setIsOpen(true), []);

        return (
            <div>
                <button type="button" onClick={handleReopen}>
                    Open Alert
                </button>
                <Alert
                    cancelButtonText={args.cancelButtonText}
                    canEscapeKeyCancel={args.canEscapeKeyCancel}
                    canOutsideClickCancel={args.canOutsideClickCancel}
                    confirmButtonText={args.confirmButtonText}
                    icon={args.icon}
                    intent={args.intent}
                    isOpen={isOpen}
                    loading={args.loading}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                >
                    This is a playground alert. Use the controls to customize it.
                </Alert>
            </div>
        );
    },
    args: {
        intent: "danger",
        icon: "trash",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        canEscapeKeyCancel: true,
        canOutsideClickCancel: true,
        loading: false,
    },
};
