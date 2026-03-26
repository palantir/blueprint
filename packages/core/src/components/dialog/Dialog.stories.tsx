/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Intent } from "../../common";
import { Button } from "../button/buttons";

import { Dialog } from "./dialog";
import { DialogBody } from "./dialogBody";
import { DialogFooter } from "./dialogFooter";

const disabledArgs = ["containerRef", "hasBackdrop", "transitionName"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof Dialog>
>;

/**
 * Helper wrapper so that each story can open/close its own Dialog.
 */
function DialogDemo({
    buttonText = "Open Dialog",
    ...dialogProps
}: React.ComponentProps<typeof Dialog> & { buttonText?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);

    return (
        <>
            <Button text={buttonText} onClick={handleOpen} />
            <Dialog {...dialogProps} isOpen={isOpen} onClose={handleClose}>
                {dialogProps.children ?? (
                    <>
                        <DialogBody>
                            <p>
                                This is a simple dialog body. You can put any content here, including forms, text, or
                                other components.
                            </p>
                        </DialogBody>
                        <DialogFooter
                            actions={
                                <>
                                    <Button text="Cancel" onClick={handleClose} />
                                    <Button text="Confirm" intent="primary" onClick={handleClose} />
                                </>
                            }
                        />
                    </>
                )}
            </Dialog>
        </>
    );
}

const meta: Meta<typeof Dialog> = {
    title: "Core/Dialog",
    component: Dialog,
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
        title: "Dialog Title",
        isOpen: false,
        isCloseButtonShown: true,
    },
    argTypes: {
        icon: { control: "text" },
        title: { control: "text" },
        isCloseButtonShown: { control: "boolean" },
        isOpen: { control: "boolean" },
        role: { control: "select", options: ["dialog", "alertdialog"] },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: args => <DialogDemo {...args} title="Dialog Title" />,
};

/**
 * Dialogs with intent-colored footer actions and corresponding icons.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: function Render(args) {
        const [openIntent, setOpenIntent] = useState<string | null>(null);
        const handleClose = useCallback(() => setOpenIntent(null), []);

        return (
            <div style={{ display: "flex", gap: 8 }}>
                {Object.values(Intent).map(intent => (
                    <div key={intent}>
                        <Button
                            text={intent.charAt(0).toUpperCase() + intent.slice(1)}
                            intent={intent}
                            onClick={() => setOpenIntent(intent)}
                        />
                        <Dialog
                            {...args}
                            title={`${intent.charAt(0).toUpperCase() + intent.slice(1)} Dialog`}
                            icon={
                                intent === "primary"
                                    ? "info-sign"
                                    : intent === "success"
                                      ? "tick-circle"
                                      : intent === "warning"
                                        ? "warning-sign"
                                        : "error"
                            }
                            isOpen={openIntent === intent}
                            onClose={handleClose}
                        >
                            <DialogBody>
                                <p>This dialog demonstrates a {intent} intent action.</p>
                            </DialogBody>
                            <DialogFooter
                                actions={
                                    <>
                                        <Button text="Cancel" onClick={handleClose} />
                                        <Button text="Confirm" intent={intent} onClick={handleClose} />
                                    </>
                                }
                            />
                        </Dialog>
                    </div>
                ))}
            </div>
        );
    },
};

/**
 * Use the `icon` prop to display an icon in the dialog header.
 */
export const IconExample: Story = {
    name: "Icon",
    argTypes: {
        icon: { table: { disable: true } },
    },
    render: args => <DialogDemo {...args} title="Settings" icon="cog" />,
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);

        return (
            <>
                <Button text="Open Dialog" onClick={handleOpen} />
                <Dialog {...args} isOpen={isOpen} onClose={handleClose}>
                    <DialogBody>
                        <p>
                            Use the Storybook controls panel to adjust the dialog properties. The dialog supports icons,
                            close buttons, and custom titles.
                        </p>
                    </DialogBody>
                    <DialogFooter
                        actions={
                            <>
                                <Button text="Cancel" onClick={handleClose} />
                                <Button text="Confirm" intent="primary" onClick={handleClose} />
                            </>
                        }
                    />
                </Dialog>
            </>
        );
    },
};
