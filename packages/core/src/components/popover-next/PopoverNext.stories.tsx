/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/buttons";
import { Menu } from "../menu/menu";
import { MenuItem } from "../menu/menuItem";
import { PopoverInteractionKind } from "../popover/popoverProps";

import type { PopoverNextPlacement } from "./popoverNextProps";
import { PopoverNext } from "./popoverNext";

const PLACEMENTS: PopoverNextPlacement[] = [
    "top",
    "top-start",
    "top-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "right",
    "right-start",
    "right-end",
    "left",
    "left-start",
    "left-end",
];

const disabledArgs = [
    "autoUpdateOptions",
    "backdropProps",
    "boundary",
    "middleware",
    "portalClassName",
    "portalContainer",
    "renderTarget",
    "rootBoundary",
    "targetProps",
    "targetTagName",
    "popupKind",
] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof PopoverNext>>;

const meta = {
    title: "Core/Overlays/PopoverNext",
    component: PopoverNext,
    decorators: [
        Story => (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "300px",
                    padding: "40px",
                }}
            >
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        disabled: false,
        arrow: true,
        matchTargetWidth: false,
        interactionKind: PopoverInteractionKind.CLICK,
        hasBackdrop: false,
    },
    argTypes: {
        placement: {
            control: "select",
            options: PLACEMENTS,
        },
        interactionKind: {
            control: "select",
            options: Object.values(PopoverInteractionKind),
        },
        disabled: { control: "boolean" },
        arrow: { control: "boolean" },
        matchTargetWidth: { control: "boolean" },
        hasBackdrop: { control: "boolean" },
        fill: { control: "boolean" },
        canEscapeKeyClose: { control: "boolean" },
        onClose: { action: "closed" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof PopoverNext>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_MENU = (
    <Menu>
        <MenuItem text="Cut" icon="cut" />
        <MenuItem text="Copy" icon="duplicate" />
        <MenuItem text="Paste" icon="clipboard" />
    </Menu>
);

/**
 * A basic PopoverNext that opens a menu when clicked. PopoverNext wraps its children
 * and uses them as the trigger target. By default, clicking outside or on a menu item
 * closes the popover.
 */
export const Default: Story = {
    render: args => (
        <PopoverNext {...args} content={SAMPLE_MENU}>
            <Button text="Open Menu" endIcon="caret-down" />
        </PopoverNext>
    ),
};

/**
 * Use the `placement` prop to control where the popover appears relative to its target.
 * The popover automatically flips to the opposite side if there is insufficient space.
 */
export const PlacementExample: Story = {
    name: "Placement",
    argTypes: {
        placement: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {(["top", "bottom", "left", "right"] as PopoverNextPlacement[]).map(placement => (
                <PopoverNext
                    key={placement}
                    {...args}
                    placement={placement}
                    content={
                        <Menu>
                            <MenuItem text="Option 1" />
                            <MenuItem text="Option 2" />
                            <MenuItem text="Option 3" />
                        </Menu>
                    }
                >
                    <Button text={`Open ${placement}`} />
                </PopoverNext>
            ))}
        </div>
    ),
};

/**
 * Use `arrow={false}` to hide the arrow pointing to the target. This creates a cleaner
 * look for dropdown menus that should appear directly below the trigger.
 */
export const ArrowExample: Story = {
    name: "Arrow",
    argTypes: {
        arrow: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>With Arrow</span>
                <PopoverNext
                    {...args}
                    arrow={true}
                    content={
                        <Menu>
                            <MenuItem text="Action 1" icon="play" />
                            <MenuItem text="Action 2" icon="pause" />
                        </Menu>
                    }
                >
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>No Arrow</span>
                <PopoverNext
                    {...args}
                    arrow={false}
                    content={
                        <Menu>
                            <MenuItem text="Action 1" icon="play" />
                            <MenuItem text="Action 2" icon="pause" />
                        </Menu>
                    }
                >
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
        </div>
    ),
};

/**
 * Use `interactionKind` to control how the popover is triggered. `"click"` opens on click,
 * `"hover"` opens on mouse hover, and `"hover-target"` opens on hover but only tracks
 * the target element (not the popover content).
 */
export const InteractionKindExample: Story = {
    name: "Interaction Kind",
    argTypes: {
        interactionKind: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            {(
                [
                    ["Click", PopoverInteractionKind.CLICK],
                    ["Hover", PopoverInteractionKind.HOVER],
                    ["Hover Target Only", PopoverInteractionKind.HOVER_TARGET_ONLY],
                ] as Array<[string, PopoverInteractionKind]>
            ).map(([label, kind]) => (
                <div key={kind} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{label}</span>
                    <PopoverNext
                        {...args}
                        interactionKind={kind}
                        content={
                            <Menu>
                                <MenuItem text="Option 1" />
                                <MenuItem text="Option 2" />
                            </Menu>
                        }
                    >
                        <Button text={label} />
                    </PopoverNext>
                </div>
            ))}
        </div>
    ),
};

/**
 * Use `matchTargetWidth={true}` to make the popover content match the width of the
 * trigger element. This is useful for dropdown menus that should align with a wider trigger.
 */
export const MatchTargetWidthExample: Story = {
    name: "Match Target Width",
    argTypes: {
        matchTargetWidth: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <PopoverNext
                    {...args}
                    matchTargetWidth={false}
                    content={
                        <Menu>
                            <MenuItem text="Short" />
                            <MenuItem text="Option" />
                        </Menu>
                    }
                >
                    <Button text="Wide Trigger Button" fill={true} style={{ width: 250 }} />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Match Target Width</span>
                <PopoverNext
                    {...args}
                    matchTargetWidth={true}
                    content={
                        <Menu>
                            <MenuItem text="Short" />
                            <MenuItem text="Option" />
                        </Menu>
                    }
                >
                    <Button text="Wide Trigger Button" fill={true} style={{ width: 250 }} />
                </PopoverNext>
            </div>
        </div>
    ),
};

/**
 * A disabled popover will not open regardless of user interaction.
 */
export const DisabledExample: Story = {
    name: "Disabled",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Enabled</span>
                <PopoverNext {...args} disabled={false} content={SAMPLE_MENU}>
                    <Button text="Click Me" endIcon="caret-down" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Disabled</span>
                <PopoverNext {...args} disabled={true} content={SAMPLE_MENU}>
                    <Button text="Click Me" endIcon="caret-down" />
                </PopoverNext>
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: args => (
        <PopoverNext
            arrow={args.arrow}
            canEscapeKeyClose={args.canEscapeKeyClose}
            disabled={args.disabled}
            fill={args.fill}
            hasBackdrop={args.hasBackdrop}
            interactionKind={args.interactionKind}
            matchTargetWidth={args.matchTargetWidth}
            placement={args.placement}
            content={
                <Menu>
                    <MenuItem text="New" icon="document" />
                    <MenuItem text="Open" icon="folder-shared" />
                    <MenuItem text="Save" icon="floppy-disk" />
                    <MenuItem text="Export" icon="export" />
                </Menu>
            }
        >
            <Button text="File" endIcon="caret-down" />
        </PopoverNext>
    ),
    args: {
        placement: "bottom-start",
        interactionKind: PopoverInteractionKind.CLICK,
        arrow: true,
        disabled: false,
        matchTargetWidth: false,
    },
};
