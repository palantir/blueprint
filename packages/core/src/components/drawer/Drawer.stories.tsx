/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Position } from "../../common";
import { Button } from "../button/buttons";

import { Drawer, DrawerSize } from "./drawer";

const meta: Meta<typeof Drawer> = {
    title: "Core/Overlays/Drawer",
    component: Drawer,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        isOpen: true,
        title: "Drawer Title",
        position: "right",
        size: DrawerSize.SMALL,
        isCloseButtonShown: true,
        hasBackdrop: true,
    },
    argTypes: {
        position: {
            control: "select",
            options: [Position.TOP, Position.BOTTOM, Position.LEFT, Position.RIGHT],
        },
        size: {
            control: "select",
            options: [DrawerSize.SMALL, DrawerSize.STANDARD, DrawerSize.LARGE],
        },
        isOpen: {
            control: "boolean",
        },
        isCloseButtonShown: {
            control: "boolean",
        },
        hasBackdrop: {
            control: "boolean",
        },
        onClose: { action: "closed" },
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic drawer opening from the right side.
 */
export const Default: Story = {
    args: {
        title: "Drawer Title",
        children: (
            <div style={{ padding: 20 }}>
                <p>Drawer content goes here.</p>
            </div>
        ),
    },
};

/**
 * Drawers can open from any of the four edges of the screen.
 */
export const PositionExample: Story = {
    name: "Position",
    argTypes: {
        position: { table: { disable: true } },
    },
    render: function Render(args) {
        const [openPosition, setOpenPosition] = useState<string | null>(null);
        const positions = [Position.TOP, Position.BOTTOM, Position.LEFT, Position.RIGHT] as const;

        const handleClose = useCallback(() => setOpenPosition(null), []);

        return (
            <div style={{ display: "flex", gap: 8 }}>
                {positions.map(pos => (
                    <Button key={pos} onClick={() => setOpenPosition(pos)}>
                        {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </Button>
                ))}
                <Drawer
                    {...args}
                    isOpen={openPosition !== null}
                    position={openPosition ?? "right"}
                    onClose={handleClose}
                    title={`Drawer (${openPosition})`}
                >
                    <div style={{ padding: 20 }}>
                        <p>This drawer opens from the {openPosition} edge.</p>
                    </div>
                </Drawer>
            </div>
        );
    },
};

/**
 * Drawers come in three predefined sizes: Small (360px), Standard (50%), and Large (90%).
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: function Render(args) {
        const [openSize, setOpenSize] = useState<string | null>(null);
        const sizes = [
            { label: "Small", value: DrawerSize.SMALL },
            { label: "Standard", value: DrawerSize.STANDARD },
            { label: "Large", value: DrawerSize.LARGE },
        ];

        const handleClose = useCallback(() => setOpenSize(null), []);

        return (
            <div style={{ display: "flex", gap: 8 }}>
                {sizes.map(({ label, value }) => (
                    <Button key={label} onClick={() => setOpenSize(value)}>
                        {label}
                    </Button>
                ))}
                <Drawer
                    {...args}
                    isOpen={openSize !== null}
                    size={openSize ?? DrawerSize.SMALL}
                    onClose={handleClose}
                    title={`${sizes.find(s => s.value === openSize)?.label ?? ""} Drawer`}
                >
                    <div style={{ padding: 20 }}>
                        <p>This drawer uses the {openSize} size.</p>
                    </div>
                </Drawer>
            </div>
        );
    },
};

/**
 * Drawers can display a header with a title, icon, and close button.
 */
export const WithIcon: Story = {
    name: "With Icon",
    args: {
        title: "Settings",
        icon: "cog",
        children: (
            <div style={{ padding: 20 }}>
                <p>Drawer with an icon in the header.</p>
            </div>
        ),
    },
};

/**
 * The close button in the header can be hidden.
 */
export const NoCloseButton: Story = {
    name: "No Close Button",
    args: {
        title: "Persistent Drawer",
        isCloseButtonShown: false,
        children: (
            <div style={{ padding: 20 }}>
                <p>This drawer has no close button in the header.</p>
            </div>
        ),
    },
    argTypes: {
        isCloseButtonShown: { table: { disable: true } },
    },
};

/**
 * A drawer without a title will not render a header.
 */
export const NoHeader: Story = {
    name: "No Header",
    args: {
        title: undefined,
        children: (
            <div style={{ padding: 20 }}>
                <p>This drawer has no header because no title was provided.</p>
            </div>
        ),
    },
};

/**
 * Drawers support header, body, and footer sections for structured content.
 */
export const WithFooter: Story = {
    name: "With Footer",
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);

        return (
            <>
                <Button onClick={handleOpen}>Open Drawer</Button>
                <Drawer {...args} isOpen={isOpen} onClose={handleClose} title="Confirm Action">
                    <div className="bp6-drawer-body">
                        <div style={{ padding: 20 }}>
                            <p>Are you sure you want to proceed?</p>
                        </div>
                    </div>
                    <div className="bp6-drawer-footer">
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button intent="primary" onClick={handleClose}>
                                Confirm
                            </Button>
                        </div>
                    </div>
                </Drawer>
            </>
        );
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
                <Button onClick={handleOpen}>Open Drawer</Button>
                <Drawer {...args} isOpen={isOpen} onClose={handleClose}>
                    <div className="bp6-drawer-body">
                        <div style={{ padding: 20 }}>
                            <p>Drawer body content. Use the Storybook controls to adjust props.</p>
                        </div>
                    </div>
                    <div className="bp6-drawer-footer">
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <Button onClick={handleClose}>Close</Button>
                        </div>
                    </div>
                </Drawer>
            </>
        );
    },
};
