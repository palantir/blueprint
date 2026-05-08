/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";
import { useCallback, useState } from "react";

import { Home } from "@blueprintjs/icons";

import { Intent } from "../../common";
import { Button } from "../button/buttons";

import { Alert } from "./alert";

const meta: Meta<typeof Alert> = {
    title: "Core/Alert",
    component: Alert,
    decorators: [storybookLayoutDecorator],
    args: {
        intent: Intent.NONE,
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
 * Primary intent alert.
 */
export const Primary: Story = {
    args: {
        intent: Intent.PRIMARY,
        icon: "info-sign",
        children: "This is a primary intent alert.",
    },
};

/**
 * Success intent alert.
 */
export const Success: Story = {
    args: {
        intent: Intent.SUCCESS,
        icon: "tick-circle",
        children: "This is a success intent alert.",
    },
};

/**
 * Warning intent alert.
 */
export const Warning: Story = {
    args: {
        intent: Intent.WARNING,
        icon: "warning-sign",
        children: "This is a warning intent alert.",
    },
};

/**
 * Danger intent alert.
 */
export const Danger: Story = {
    args: {
        intent: Intent.DANGER,
        icon: "error",
        children: "This is a danger intent alert.",
    },
};

/**
 * Alert with only a confirm button (no cancel).
 */
export const ConfirmOnly: Story = {
    args: {
        intent: Intent.NONE,
        icon: "info-sign",
        confirmButtonText: "OK",
        cancelButtonText: undefined,
        children: "Alert with confirm button only.",
    },
};

/**
 * Alert with both confirm and cancel buttons.
 */
export const WithCancel: Story = {
    args: {
        intent: Intent.NONE,
        icon: "info-sign",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        children: "Alert with cancel button.",
    },
};

/**
 * Alert in a loading state. The confirm button shows a spinner and the cancel button is disabled.
 */
export const Loading: Story = {
    args: {
        intent: Intent.PRIMARY,
        icon: "info-sign",
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        loading: true,
        children: "Loading alert.",
    },
};

/**
 * The `icon` prop accepts either a string icon name or a React element.
 * When an element is provided, `<Icon>` clones it and merges the parent-provided
 * `className` and intent class onto its root.
 */
export const ElementIconExample: Story = {
    name: "Element icon",
    args: {
        intent: Intent.PRIMARY,
        icon: <Home size={40} />,
        children: "This alert renders <Home /> as its icon.",
    },
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render({ onConfirm, onCancel, onClose, ...args }) {
        const [isOpen, setIsOpen] = useState(true);

        const handleConfirm = useCallback(() => {
            onConfirm?.();
            setIsOpen(false);
        }, [onConfirm]);

        const handleCancel = useCallback(() => {
            onCancel?.();
            setIsOpen(false);
        }, [onCancel]);

        const handleClose = useCallback(
            (confirmed: boolean) => {
                onClose?.(confirmed);
                setIsOpen(false);
            },
            [onClose],
        );

        const handleReopen = useCallback(() => setIsOpen(true), []);

        return (
            <div>
                <Button type="button" onClick={handleReopen}>
                    Open Alert
                </Button>
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
                    onClose={handleClose}
                    onConfirm={handleConfirm}
                >
                    This is a playground alert. Use the controls to customize it.
                </Alert>
            </div>
        );
    },
    args: {
        intent: Intent.DANGER,
        icon: "trash",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        canEscapeKeyCancel: true,
        canOutsideClickCancel: true,
        loading: false,
    },
};
