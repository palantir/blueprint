/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs, useCallback } from "storybook/preview-api";

import { Flex } from "@blueprintjs/labs";

import { Button } from "../button/buttons";
import { Menu } from "../menu/menu";
import { MenuDivider } from "../menu/menuDivider";
import { MenuItem } from "../menu/menuItem";

import { ContextMenuPopover, type ContextMenuPopoverProps } from "./contextMenuPopover";

const SAMPLE_MENU = (
    <Menu>
        <MenuItem icon="select" text="Select all" />
        <MenuItem icon="insert" text="Insert..." />
        <MenuItem icon="layout" text="Layout..." />
        <MenuDivider />
        <MenuItem icon="cross-circle" intent="danger" text="Delete" />
    </Menu>
);

const meta: Meta<typeof ContextMenuPopover> = {
    title: "Core/Context Menu/ContextMenuPopover",
    component: ContextMenuPopover,
    decorators: [
        Story => (
            <Flex justifyContent="center" alignItems="center" style={{ minHeight: 320, minWidth: 480 }}>
                <Story />
            </Flex>
        ),
    ],
    args: {
        content: SAMPLE_MENU,
        isOpen: false,
        transitionDuration: 0,
        isDarkTheme: false,
    },
    argTypes: {
        content: { control: false },
        isOpen: { control: "boolean" },
        isDarkTheme: { control: "boolean" },
        targetOffset: { control: false },
        onClose: { action: "closed" },
    },
} satisfies Meta<typeof ContextMenuPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

function ContextMenuPopoverStoryRender(args: ContextMenuPopoverProps) {
    const [, updateArgs] = useArgs();
    const handleOpen = useCallback(
        (event: React.MouseEvent<HTMLElement>) =>
            updateArgs({
                isOpen: true,
                targetOffset: { left: event.clientX, top: event.clientY },
            }),
        [updateArgs],
    );
    const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
    return (
        <>
            <Button text="Click to open menu" onClick={handleOpen} />
            <ContextMenuPopover {...args} onClose={handleClose} />
        </>
    );
}

/**
 * A basic controlled context menu popover. Click the button to open the menu
 * anchored at the click location. Unlike `ContextMenu`, this lower-level component
 * does not wire up its own right-click handler — you control its open state directly.
 */
export const Default: Story = {
    render: ContextMenuPopoverStoryRender,
};

/**
 * Override `placement` via the prop to control which corner of the menu anchors
 * to the click point. The default is `right-start` (menu opens below and to the right).
 */
export const CustomPlacement: Story = {
    name: "Custom Placement",
    args: {
        placement: "top-end",
    },
    render: ContextMenuPopoverStoryRender,
};

/**
 * Pass `isDarkTheme` to render the popover with dark-theme styling. This is
 * needed when calling the imperative `showContextMenu()` API outside of a
 * `.bp6-dark` ancestor, since the singleton renders in its own React root.
 */
export const DarkTheme: Story = {
    name: "Dark Theme",
    args: {
        isDarkTheme: true,
    },
    decorators: [
        Story => (
            <div className="bp6-dark" style={{ padding: 40, background: "#1c2127" }}>
                <Story />
            </div>
        ),
    ],
    render: ContextMenuPopoverStoryRender,
};

/**
 * Interactive playground — click the button to open the menu, then adjust props via the controls panel.
 */
export const Playground: Story = {
    render: ContextMenuPopoverStoryRender,
};
