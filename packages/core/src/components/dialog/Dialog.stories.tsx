/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "../button/buttons";
import { Dialog } from "./dialog";
import { DialogBody } from "./dialogBody";
import { DialogFooter } from "./dialogFooter";

const meta = {
    title: "Core/Dialog",
    component: Dialog,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        title: "Dialog title",
        isCloseButtonShown: true,
    },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Dialog with title, body, and footer. Use the button to open.
 */
export const Default: Story = {
    render: function DialogDefault() {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button text="Open dialog" onClick={() => setIsOpen(true)} />
                <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Dialog title">
                    <DialogBody>Dialog body content goes here. You can put any content inside.</DialogBody>
                    <DialogFooter
                        actions={
                            <>
                                <Button text="Cancel" onClick={() => setIsOpen(false)} />
                                <Button text="Save" intent="primary" onClick={() => setIsOpen(false)} />
                            </>
                        }
                    />
                </Dialog>
            </>
        );
    },
};

/**
 * Dialog with icon in header.
 */
export const WithIcon: Story = {
    render: function DialogWithIcon() {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button text="Open" onClick={() => setIsOpen(true)} />
                <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Settings" icon="cog">
                    <DialogBody>Dialog with an icon in the header.</DialogBody>
                    <DialogFooter actions={<Button text="Close" onClick={() => setIsOpen(false)} />} />
                </Dialog>
            </>
        );
    },
};

/**
 * Dialog without close button in header.
 */
export const NoCloseButton: Story = {
    render: function DialogNoClose() {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button text="Open" onClick={() => setIsOpen(true)} />
                <Dialog
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="No close button"
                    isCloseButtonShown={false}
                >
                    <DialogBody>User must use the footer button to close.</DialogBody>
                    <DialogFooter actions={<Button text="OK" onClick={() => setIsOpen(false)} />} />
                </Dialog>
            </>
        );
    },
};

/**
 * Dialog without title (no header).
 */
export const NoTitle: Story = {
    render: function DialogNoTitle() {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button text="Open" onClick={() => setIsOpen(true)} />
                <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <DialogBody>This dialog has no title or header.</DialogBody>
                    <DialogFooter actions={<Button text="Close" onClick={() => setIsOpen(false)} />} />
                </Dialog>
            </>
        );
    },
};
