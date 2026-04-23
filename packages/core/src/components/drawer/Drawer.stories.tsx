/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs, useCallback, useState } from "storybook/preview-api";

import { Flex } from "@blueprintjs/labs";

import { Position } from "../../common";
import { Button } from "../button/buttons";

import { Drawer, type DrawerProps, DrawerSize } from "./drawer";

const meta: Meta<typeof Drawer> = {
    title: "Core/Overlays/Drawer",
    component: Drawer,
    decorators: [
        Story => (
            <Flex justifyContent="center" alignItems="center">
                <Story />
            </Flex>
        ),
    ],
    args: {
        isOpen: true,
        title: "Drawer Title",
        icon: "cog",
        position: "right",
        size: DrawerSize.STANDARD,
        isCloseButtonShown: true,
        hasBackdrop: true,
        transitionDuration: 0,
        transitionName: "no-transition",
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
        icon: {
            control: "text",
        },
        onClose: { action: "closed" },
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function DrawerStoryRender(args: DrawerProps) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
    const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);

    return (
        <>
            <Button text="Open Drawer" onClick={handleOpen} />
            <Drawer {...args} isOpen={args.isOpen} onClose={handleClose}>
                <div style={{ padding: 20 }}>
                    <p>Drawer content goes here.</p>
                </div>
            </Drawer>
        </>
    );
}

/**
 * A basic drawer opening from the right side with a title and icon.
 */
export const Default: Story = {
    render: DrawerStoryRender,
};

/**
 * Drawer opening from the top edge of the screen.
 */
export const PositionTop: Story = {
    name: "Position: Top",
    argTypes: {
        position: { table: { disable: true } },
    },
    args: {
        position: Position.TOP,
        title: "Top Drawer",
    },
    render: DrawerStoryRender,
};

/**
 * Drawer opening from the bottom edge of the screen.
 */
export const PositionBottom: Story = {
    name: "Position: Bottom",
    argTypes: {
        position: { table: { disable: true } },
    },
    args: {
        position: Position.BOTTOM,
        title: "Bottom Drawer",
    },
    render: DrawerStoryRender,
};

/**
 * Drawer opening from the left edge of the screen.
 */
export const PositionLeft: Story = {
    name: "Position: Left",
    argTypes: {
        position: { table: { disable: true } },
    },
    args: {
        position: Position.LEFT,
        title: "Left Drawer",
    },
    render: DrawerStoryRender,
};

/**
 * Drawer opening from the right edge of the screen.
 */
export const PositionRight: Story = {
    name: "Position: Right",
    argTypes: {
        position: { table: { disable: true } },
    },
    args: {
        position: Position.RIGHT,
        title: "Right Drawer",
    },
    render: DrawerStoryRender,
};

/**
 * Drawer with the small size.
 */
export const SizeSmall: Story = {
    name: "Size: Small",
    argTypes: {
        size: { table: { disable: true } },
    },
    args: {
        size: DrawerSize.SMALL,
        title: "Small Drawer",
    },
    render: DrawerStoryRender,
};

/**
 * Drawer with the standard size.
 */
export const SizeStandard: Story = {
    name: "Size: Standard",
    argTypes: {
        size: { table: { disable: true } },
    },
    args: {
        size: DrawerSize.STANDARD,
        title: "Standard Drawer",
    },
    render: DrawerStoryRender,
};

/**
 * Drawer with the large size.
 */
export const SizeLarge: Story = {
    name: "Size: Large",
    argTypes: {
        size: { table: { disable: true } },
    },
    args: {
        size: DrawerSize.LARGE,
        title: "Large Drawer",
    },
    render: DrawerStoryRender,
};

/**
 * Drawer with the close button hidden.
 */
export const CloseButtonHidden: Story = {
    name: "Close Button Hidden",
    argTypes: {
        isCloseButtonShown: { table: { disable: true } },
    },
    args: {
        isCloseButtonShown: false,
        title: "No Close Button",
    },
    render: DrawerStoryRender,
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
                        <Flex gap={2} justifyContent="end">
                            <Button onClick={handleClose}>Close</Button>
                        </Flex>
                    </div>
                </Drawer>
            </>
        );
    },
};
