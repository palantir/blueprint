/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Button, Menu, MenuItem } from "../..";

import { Popover } from "./popover";
import { PopoverInteractionKind } from "./popoverProps";

const disabledArgs = [
    "boundary",
    "captureDismiss",
    "modifiers",
    "modifiersCustom",
    "popoverRef",
    "renderTarget",
    "rootBoundary",
    "targetProps",
    "targetTagName",
] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof Popover>>;

const sampleMenu = (
    <Menu>
        <MenuItem text="New file" icon="document" />
        <MenuItem text="New folder" icon="folder-new" />
        <MenuItem text="Settings" icon="cog" />
    </Menu>
);

const meta: Meta<typeof Popover> = {
    title: "Core/Overlay/Popover",
    component: Popover,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        content: sampleMenu,
        interactionKind: "click",
        placement: "bottom",
        minimal: false,
        disabled: false,
        fill: false,
        usePortal: true,
    },
    argTypes: {
        interactionKind: {
            control: "select",
            options: Object.values(PopoverInteractionKind),
        },
        placement: {
            control: "select",
            options: [
                "auto",
                "auto-start",
                "auto-end",
                "top",
                "top-start",
                "top-end",
                "bottom",
                "bottom-start",
                "bottom-end",
                "left",
                "left-start",
                "left-end",
                "right",
                "right-start",
                "right-end",
            ],
        },
        minimal: { control: "boolean" },
        disabled: { control: "boolean" },
        fill: { control: "boolean" },
        hasBackdrop: { control: "boolean" },
        usePortal: { control: "boolean" },
        matchTargetWidth: { control: "boolean" },
        onInteraction: { action: "interaction" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic popover triggered by a button click, displaying a menu.
 */
export const Default: Story = {
    args: {
        children: <Button text="Open popover" />,
    },
};

/**
 * Popover interaction kinds determine how the popover opens and closes.
 */
export const InteractionKindExample: Story = {
    name: "Interaction Kind",
    argTypes: {
        interactionKind: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8 }}>
            <Popover {...args} interactionKind="click">
                <Button text="Click" />
            </Popover>
            <Popover {...args} interactionKind="hover">
                <Button text="Hover" />
            </Popover>
            <Popover {...args} interactionKind="hover-target">
                <Button text="Hover target only" />
            </Popover>
        </div>
    ),
};

/**
 * Use `minimal` to render the popover without an arrow and with a subtler animation.
 */
export const VariantExample: Story = {
    name: "Variant",
    argTypes: {
        minimal: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <Popover {...args} minimal={false}>
                    <Button text="With arrow" />
                </Popover>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Minimal</span>
                <Popover {...args} minimal={true}>
                    <Button text="No arrow" />
                </Popover>
            </div>
        </div>
    ),
};

/**
 * Use the `placement` prop to control where the popover appears relative to the target.
 */
export const PlacementExample: Story = {
    name: "Placement",
    argTypes: {
        placement: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["top", "bottom", "left", "right"] as const).map(placement => (
                <Popover key={placement} {...args} placement={placement}>
                    <Button text={placement} />
                </Popover>
            ))}
        </div>
    ),
};

/**
 * Popover supports disabled and backdrop states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        hasBackdrop: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8 }}>
            <Popover {...args}>
                <Button text="Default" />
            </Popover>
            <Popover {...args} disabled={true}>
                <Button text="Disabled" disabled={true} />
            </Popover>
            <Popover {...args} hasBackdrop={true}>
                <Button text="With backdrop" />
            </Popover>
        </div>
    ),
};

/**
 * Use `fill` to make the popover target expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Popover {...args} fill={true}>
                <Button text="Full width" fill={true} />
            </Popover>
            <Popover {...args} fill={false}>
                <Button text="Auto width" />
            </Popover>
        </div>
    ),
};

/**
 * Use `matchTargetWidth` to make the popover content match the width of the target.
 */
export const MatchTargetWidthExample: Story = {
    name: "Match Target Width",
    argTypes: {
        matchTargetWidth: { table: { disable: true } },
    },
    render: args => (
        <Popover {...args} matchTargetWidth={true} fill={true}>
            <Button text="Popover matches this button's width" fill={true} />
        </Popover>
    ),
    decorators: [
        Story => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Interactive playground with a controlled popover and all props togglable.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);

        const handleInteraction = useCallback((nextOpenState: boolean) => {
            setIsOpen(nextOpenState);
        }, []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <Popover {...args} isOpen={isOpen} onInteraction={handleInteraction}>
                    <Button text={isOpen ? "Close popover" : "Open popover"} intent={isOpen ? "danger" : "primary"} />
                </Popover>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Popover is {isOpen ? "open" : "closed"}</span>
            </div>
        );
    },
};
