/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs, useCallback, useState } from "storybook/preview-api";

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
    onOpen,
    onClose,
    ...dialogProps
}: React.ComponentProps<typeof Dialog> & {
    buttonText?: string;
    onOpen: () => void;
    onClose: () => void;
}) {
    return (
        <>
            <Button text={buttonText} onClick={onOpen} />
            <Dialog {...dialogProps} isOpen={dialogProps.isOpen} onClose={onClose}>
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
                                    <Button text="Cancel" onClick={onClose} />
                                    <Button text="Confirm" intent="primary" onClick={onClose} />
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
        chromatic: { disableSnapshot: true },
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
    render: function Render(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return <DialogDemo {...args} title="Dialog Title" onOpen={handleOpen} onClose={handleClose} />;
    },
};

/**
 * A dialog without a title bar.
 */
export const WithoutTitle: Story = {
    name: "Without Title",
    render: function Render(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return <DialogDemo {...args} title={undefined} onOpen={handleOpen} onClose={handleClose} />;
    },
};

/**
 * A dialog with a minimal footer that flows inline with the content.
 */
export const WithMinimalFooter: Story = {
    name: "With Minimal Footer",
    render: function Render(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);

        return (
            <>
                <Button text="Open Dialog" onClick={handleOpen} />
                <Dialog {...args} isOpen={args.isOpen} onClose={handleClose}>
                    <DialogBody>
                        <p>
                            This dialog uses a minimal footer, which flows inline with the content rather than being
                            fixed at the bottom.
                        </p>
                    </DialogBody>
                    <DialogFooter
                        minimal={true}
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
                            // eslint-disable-next-line react/jsx-no-bind
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
    args: {
        icon: "cog",
    },
    render: function Render(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return <DialogDemo {...args} title="Settings" onOpen={handleOpen} onClose={handleClose} />;
    },
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
