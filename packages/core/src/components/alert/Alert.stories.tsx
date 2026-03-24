/* !
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
 * A primary intent alert for general informational confirmations.
 */
export const Primary: Story = {
    args: {
        intent: "primary",
        icon: "info-sign",
        confirmButtonText: "Got it",
        children: "This is an informational alert.",
    },
};

/**
 * A success intent alert for confirming successful actions.
 */
export const Success: Story = {
    args: {
        intent: "success",
        icon: "tick-circle",
        confirmButtonText: "Great",
        children: "The operation completed successfully.",
    },
};

/**
 * A warning intent alert for cautionary messages.
 */
export const Warning: Story = {
    args: {
        intent: "warning",
        icon: "warning-sign",
        confirmButtonText: "I understand",
        children: "This action may have unintended consequences.",
    },
};

/**
 * A danger intent alert for destructive or irreversible actions.
 */
export const Danger: Story = {
    args: {
        intent: "danger",
        icon: "trash",
        confirmButtonText: "Delete",
        children: "Are you sure you want to delete this item? This action cannot be undone.",
    },
};

/**
 * An alert with a cancel button, allowing the user to dismiss the alert without confirming.
 */
export const WithCancel: Story = {
    args: {
        intent: "danger",
        icon: "trash",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        canEscapeKeyCancel: true,
        canOutsideClickCancel: true,
        children: "Are you sure you want to delete this item? This action cannot be undone.",
    },
};

/**
 * All intents displayed side by side for visual comparison.
 */
export const AllIntents: Story = {
    argTypes: {
        intent: { table: { disable: true } },
        icon: { table: { disable: true } },
    },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Alert key={intent} isOpen={true} intent={intent} icon="info-sign" confirmButtonText="OK">
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
