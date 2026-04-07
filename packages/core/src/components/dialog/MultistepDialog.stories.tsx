/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

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

function MultistepDialogDemo(props: React.ComponentProps<typeof MultistepDialog> & { buttonText?: string }) {
    const { buttonText = "Open Multistep Dialog", children: _children, ...dialogProps } = props;
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = useCallback(() => setIsOpen(true), []);
    const handleClose = useCallback(() => setIsOpen(false), []);

    return (
        <>
            <Button text={buttonText} onClick={handleOpen} />
            <MultistepDialog {...dialogProps} isOpen={isOpen} onClose={handleClose}>
                <DialogStep id="select" title="Select items" panel={<StepPanel stepNumber={1} />} />
                <DialogStep id="confirm" title="Confirm selection" panel={<StepPanel stepNumber={2} />} />
                <DialogStep id="complete" title="Complete" panel={<StepPanel stepNumber={3} />} />
            </MultistepDialog>
        </>
    );
}

const meta: Meta<typeof MultistepDialog> = {
    title: "Core/MultistepDialog",
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
        isOpen: false,
        isCloseButtonShown: true,
        navigationPosition: "left",
        resetOnClose: true,
        showCloseButtonInFooter: false,
    },
    argTypes: {
        icon: {
            control: "select",
            options: [
                undefined,
                "cog",
                "info-sign",
                "tick-circle",
                "warning-sign",
                "error",
                "trash",
                "search",
                "home",
                "user",
                "lock",
                "document",
            ],
        },
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

export const Default: Story = {
    render: args => <MultistepDialogDemo {...args} />,
};

/**
 * The `navigationPosition` prop controls where step navigation appears: left, top, or right.
 */
export const NavigationPositionExample: Story = {
    name: "Navigation Position",
    argTypes: {
        navigationPosition: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8 }}>
            <MultistepDialogDemo {...args} navigationPosition="left" buttonText="Left (default)" />
            <MultistepDialogDemo {...args} navigationPosition="top" buttonText="Top" />
            <MultistepDialogDemo {...args} navigationPosition="right" buttonText="Right" />
        </div>
    ),
};

/**
 * Use the `icon` prop to display an icon in the dialog header.
 */
export const IconExample: Story = {
    name: "Icon",
    args: {
        icon: "cog",
    },
    render: args => <MultistepDialogDemo {...args} title="Settings" />,
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
                <Button text="Open Multistep Dialog" onClick={handleOpen} />
                <MultistepDialog {...args} isOpen={isOpen} onClose={handleClose}>
                    <DialogStep id="step1" title="Select items" panel={<StepPanel stepNumber={1} />} />
                    <DialogStep id="step2" title="Confirm selection" panel={<StepPanel stepNumber={2} />} />
                    <DialogStep id="step3" title="Complete" panel={<StepPanel stepNumber={3} />} />
                </MultistepDialog>
            </>
        );
    },
};
