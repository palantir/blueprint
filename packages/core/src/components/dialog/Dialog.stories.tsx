/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs, useCallback } from "storybook/preview-api";
import { expect, screen, waitFor } from "storybook/test";

import { Button } from "../button/buttons";

import { Dialog } from "./dialog";
import { DialogBody } from "./dialogBody";
import { DialogFooter } from "./dialogFooter";

const disabledArgs = ["containerRef", "hasBackdrop", "transitionName"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof Dialog>
>;

const meta: Meta<typeof Dialog> = {
    title: "Core/Overlays/Dialog",
    component: Dialog,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
        isOpen: true,
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
    render: renderDialog(),
};

/**
 * A dialog without a title bar.
 */
export const WithoutTitle: Story = {
    name: "Without Title",
    args: {
        title: undefined,
    },
    render: renderDialog(),
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
 * Use the `icon` prop to display an icon in the dialog header.
 */
export const IconExample: Story = {
    name: "Icon",
    args: {
        icon: "cog",
        title: "Settings",
    },
    render: renderDialog(),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: renderDialog({
        bodyText:
            "Use the Storybook controls panel to adjust the dialog properties. The dialog supports icons, close buttons, and custom titles.",
    }),
};

/**
 * Opens the dialog and verifies that the body content is visible.
 */
export const OpenDialog: Story = {
    name: "Open Dialog",
    render: renderDialog(),
    play: async ({ canvas, userEvent, step }) => {
        await step("Click button to open dialog", async () => {
            const button = canvas.getByRole("button", { name: "Open Dialog" });
            await userEvent.click(button);
            await waitFor(() => expect(screen.getByText(/This is a simple dialog body/)).toBeVisible());
        });
    },
};

/**
 * Opens the dialog, presses Escape, and verifies it closes.
 */
export const EscapeKeyClose: Story = {
    name: "Escape Key Close",
    render: renderDialog(),
    play: async ({ canvas, userEvent, step }) => {
        await step("Open dialog", async () => {
            const button = canvas.getByRole("button", { name: "Open Dialog" });
            await userEvent.click(button);
            await waitFor(() => expect(screen.getByText(/This is a simple dialog body/)).toBeVisible());
        });

        await step("Press Escape to close dialog", async () => {
            await userEvent.keyboard("{Escape}");
            await waitFor(() => expect(screen.queryByText(/This is a simple dialog body/)).toBeNull());
        });
    },
};

/**
 * Opens the dialog, clicks the backdrop, and verifies it closes.
 */
export const OutsideClickClose: Story = {
    name: "Outside Click Close",
    render: renderDialog(),
    play: async ({ canvas, userEvent, step }) => {
        await step("Open dialog", async () => {
            const button = canvas.getByRole("button", { name: "Open Dialog" });
            await userEvent.click(button);
            await waitFor(() => expect(screen.getByText(/This is a simple dialog body/)).toBeVisible());
        });

        await step("Click backdrop to close dialog", async () => {
            const backdrop = document.querySelector(".bp6-overlay-backdrop") as HTMLElement;
            await userEvent.click(backdrop);
            await waitFor(() => expect(screen.queryByText(/This is a simple dialog body/)).toBeNull());
        });
    },
};

function renderDialog(extraProps?: {
    bodyText?: string;
    intent?: React.ComponentProps<typeof Button>["intent"];
    buttonText?: string;
}) {
    return function Render(args: React.ComponentProps<typeof Dialog>) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);

        const bodyText =
            extraProps?.bodyText ??
            "This is a simple dialog body. You can put any content here, including forms, text, or other components.";
        const intent = extraProps?.intent;
        const buttonText = extraProps?.buttonText ?? "Open Dialog";

        return (
            <>
                <Button text={buttonText} intent={intent} onClick={handleOpen} />
                <Dialog {...args} isOpen={args.isOpen} onClose={handleClose}>
                    <DialogBody>
                        <p>{bodyText}</p>
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
            </>
        );
    };
}
