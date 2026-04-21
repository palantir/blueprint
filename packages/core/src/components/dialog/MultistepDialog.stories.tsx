/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { useArgs, useCallback } from "storybook/preview-api";

import { Flex } from "@blueprintjs/labs";

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
            <Flex justifyContent="center" alignItems="center" style={{ minWidth: "300px" }}>
                <Story />
            </Flex>
        ),
    ],
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
