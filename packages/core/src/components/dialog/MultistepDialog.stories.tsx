/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { useArgs, useCallback } from "storybook/preview-api";
import { expect, screen, waitFor } from "storybook/test";

import { Button } from "../button/buttons";

import { DialogBody } from "./dialogBody";
import { DialogStep } from "./dialogStep";
import { MultistepDialog } from "./multistepDialog";

const disabledArgs = [
    "containerRef",
    "hasBackdrop",
    "transitionName",
    "backButtonProps",
    "closeButtonProps",
    "finalButtonProps",
    "nextButtonProps",
] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof MultistepDialog>>;

function StepPanel({ stepNumber }: { stepNumber: number }) {
    return (
        <DialogBody>
            <p>This is the content for step {stepNumber}.</p>
            <p>You can place forms, instructions, or any other content here.</p>
        </DialogBody>
    );
}

function MultistepDialogDemo(
    props: React.ComponentProps<typeof MultistepDialog> & {
        buttonText?: string;
        onOpen: () => void;
        onClose: () => void;
    },
) {
    const { buttonText = "Open Multistep Dialog", children: _children, onOpen, onClose, ...dialogProps } = props;

    return (
        <>
            <Button text={buttonText} onClick={onOpen} />
            <MultistepDialog {...dialogProps} onClose={onClose}>
                <DialogStep id="select" title="Select items" panel={<StepPanel stepNumber={1} />} />
                <DialogStep id="confirm" title="Confirm selection" panel={<StepPanel stepNumber={2} />} />
                <DialogStep id="complete" title="Complete" panel={<StepPanel stepNumber={3} />} />
            </MultistepDialog>
        </>
    );
}

const meta: Meta<typeof MultistepDialog> = {
    title: "Core/Overlays/MultistepDialog",
    component: MultistepDialog,
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
        title: "Multistep Dialog",
        isOpen: true,
        isCloseButtonShown: true,
        navigationPosition: "left",
        resetOnClose: true,
        showCloseButtonInFooter: false,
    },
    argTypes: {
        icon: { control: "text" },
        title: { control: "text" },
        isCloseButtonShown: { control: "boolean" },
        navigationPosition: { control: "select", options: ["left", "top", "right"] },
        resetOnClose: { control: "boolean" },
        showCloseButtonInFooter: { control: "boolean" },
        initialStepIndex: { control: "number" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof MultistepDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

type DemoProps = Omit<React.ComponentProps<typeof MultistepDialogDemo>, "onOpen" | "onClose">;

function renderMultistepDialog(extraProps?: Partial<DemoProps>) {
    return function Render(args: React.ComponentProps<typeof MultistepDialog>) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <MultistepDialogDemo
                {...args}
                finalButtonProps={{ text: "Submit", onClick: handleClose }}
                onOpen={handleOpen}
                onClose={handleClose}
                {...extraProps}
            />
        );
    };
}

const disableNavigationPosition = {
    argTypes: { navigationPosition: { table: { disable: true } } },
} as const;

export const Default: Story = {
    render: renderMultistepDialog(),
};

/**
 * The `navigationPosition` prop controls where step navigation appears: left, top, or right.
 */
export const LeftPositionExample: Story = {
    name: "Left Navigation",
    ...disableNavigationPosition,
    render: renderMultistepDialog({ navigationPosition: "left", buttonText: "Open Left Navigation (default)" }),
};

export const RightPositionExample: Story = {
    name: "Right Navigation",
    ...disableNavigationPosition,
    render: renderMultistepDialog({ navigationPosition: "right", buttonText: "Open Right Navigation" }),
};

export const TopPositionExample: Story = {
    name: "Top Navigation",
    ...disableNavigationPosition,
    render: renderMultistepDialog({ navigationPosition: "top", buttonText: "Open Top Navigation" }),
};

/**
 * Use the `icon` prop to display an icon in the dialog header.
 */
export const IconExample: Story = {
    name: "Icon",
    args: {
        icon: "cog",
    },
    render: renderMultistepDialog({ title: "Settings" }),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);

        return (
            <>
                <Button text="Open Multistep Dialog" onClick={handleOpen} />
                <MultistepDialog
                    {...args}
                    isOpen={args.isOpen}
                    onClose={handleClose}
                    finalButtonProps={{ text: "Submit", onClick: handleClose }}
                >
                    <DialogStep id="step1" title="Select items" panel={<StepPanel stepNumber={1} />} />
                    <DialogStep id="step2" title="Confirm selection" panel={<StepPanel stepNumber={2} />} />
                    <DialogStep id="step3" title="Complete" panel={<StepPanel stepNumber={3} />} />
                </MultistepDialog>
            </>
        );
    },
};

/**
 * Opens the multistep dialog and verifies step 1 is active.
 */
export const OpenDialog: Story = {
    args: { isOpen: false },
    render: renderMultistepDialog(),
    play: async ({ canvas, userEvent, step }) => {
        await step("Click open button shows dialog at step 1", async () => {
            await userEvent.click(canvas.getByText("Open Multistep Dialog"));
            await waitFor(() => expect(screen.getByText("This is the content for step 1.")).toBeVisible());
            const selectStep = screen.getByText("Select items").closest(".bp6-dialog-step-container");
            await expect(selectStep).toHaveClass("bp6-active");
        });
    },
};

/**
 * Navigates from step 1 to step 2 using the Next button.
 */
export const NavigateNext: Story = {
    render: renderMultistepDialog(),
    play: async ({ canvas, userEvent, step }) => {
        await step("Open dialog", async () => {
            await userEvent.click(canvas.getByText("Open Multistep Dialog"));
            await waitFor(() => expect(screen.getByText("This is the content for step 1.")).toBeVisible());
        });

        await step("Click Next goes to step 2", async () => {
            await userEvent.click(screen.getByRole("button", { name: "Next" }));
            await waitFor(() => expect(screen.getByText("This is the content for step 2.")).toBeVisible());

            const confirmStep = screen.getByText("Confirm selection").closest(".bp6-dialog-step-container");
            await expect(confirmStep).toHaveClass("bp6-active");
            await expect(screen.getByRole("button", { name: "Back" })).toBeVisible();
        });
    },
};

/**
 * Navigates forward to step 2 then back to step 1.
 */
export const NavigateBack: Story = {
    render: renderMultistepDialog(),
    play: async ({ canvas, userEvent, step }) => {
        await step("Open dialog and go to step 2", async () => {
            await userEvent.click(canvas.getByText("Open Multistep Dialog"));
            await waitFor(() => expect(screen.getByText("This is the content for step 1.")).toBeVisible());
            await userEvent.click(screen.getByRole("button", { name: "Next" }));
            await waitFor(() => expect(screen.getByText("This is the content for step 2.")).toBeVisible());
        });

        await step("Click Back returns to step 1", async () => {
            await userEvent.click(screen.getByRole("button", { name: "Back" }));
            await waitFor(() => expect(screen.getByText("This is the content for step 1.")).toBeVisible());
            const selectStep = screen.getByText("Select items").closest(".bp6-dialog-step-container");
            await expect(selectStep).toHaveClass("bp6-active");
        });
    },
};

/**
 * Pressing Escape closes the dialog.
 */
export const EscapeKeyClose: Story = {
    render: renderMultistepDialog(),
    play: async ({ canvas, userEvent, step }) => {
        await step("Open dialog", async () => {
            await userEvent.click(canvas.getByText("Open Multistep Dialog"));
            await waitFor(() => expect(screen.getByText("This is the content for step 1.")).toBeVisible());
        });

        await step("Escape key closes dialog", async () => {
            await userEvent.keyboard("{Escape}");
            await waitFor(() => expect(screen.queryByText("This is the content for step 1.")).not.toBeInTheDocument());
        });
    },
};

/**
 * When `showCloseButtonInFooter` is true, the footer close button appears regardless
 * of `isCloseButtonShown` being false.
 */
export const ShowCloseButtonInFooter: Story = {
    render: renderMultistepDialog({ showCloseButtonInFooter: true, isCloseButtonShown: false }),
    play: async ({ canvas, userEvent, step }) => {
        await step("Open dialog with showCloseButtonInFooter=true and isCloseButtonShown=false", async () => {
            await userEvent.click(canvas.getByText("Open Multistep Dialog"));
            await waitFor(() => expect(screen.getByText("This is the content for step 1.")).toBeVisible());
        });

        await step("Header close button is hidden", async () => {
            const headerCloseButton = document.querySelector(`.bp6-dialog-header .bp6-dialog-close-button`);
            await expect(headerCloseButton).toBeNull();
        });

        await step("Footer close button is still visible", async () => {
            const footerCloseButton = screen.getByRole("button", { name: "Close" });
            await expect(footerCloseButton).toBeVisible();
        });
    },
};

/**
 * The `initialStepIndex` prop allows the dialog to open at a specific step.
 */
export const InitialStepIndex: Story = {
    render: renderMultistepDialog({ initialStepIndex: 1 }),
    play: async ({ canvas, userEvent, step }) => {
        await step("Open dialog with initialStepIndex=1", async () => {
            await userEvent.click(canvas.getByText("Open Multistep Dialog"));
            await waitFor(() => expect(screen.getByText("This is the content for step 2.")).toBeVisible());
        });

        await step("Step 2 is active", async () => {
            const confirmStep = screen.getByText("Confirm selection").closest(".bp6-dialog-step-container");
            await expect(confirmStep).toHaveClass("bp6-active");
        });

        await step("Back button is available since we started at step 2", async () => {
            await expect(screen.getByRole("button", { name: "Back" })).toBeVisible();
        });
    },
};

/**
 * Clicking outside the dialog (on the backdrop) closes it.
 */
export const OutsideClickClose: Story = {
    render: renderMultistepDialog(),
    play: async ({ canvas, userEvent, step }) => {
        await step("Open dialog", async () => {
            await userEvent.click(canvas.getByText("Open Multistep Dialog"));
            await waitFor(() => expect(screen.getByText("This is the content for step 1.")).toBeVisible());
        });

        await step("Clicking backdrop closes dialog", async () => {
            const backdrop = document.querySelector(".bp6-overlay-backdrop") as HTMLElement;
            await userEvent.click(backdrop);
            await waitFor(() => expect(screen.queryByText("This is the content for step 1.")).not.toBeInTheDocument());
        });
    },
};
