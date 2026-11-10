/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";
import { expect, screen, waitFor } from "storybook/test";

import { Menu } from "../menu/menu";
import { MenuDivider } from "../menu/menuDivider";
import { MenuItem } from "../menu/menuItem";

import { ContextMenu, type ContextMenuChildrenProps } from "./contextMenu";

const SAMPLE_MENU = (
    <Menu>
        <MenuItem icon="select" text="Select all" />
        <MenuItem icon="insert" text="Insert...">
            <MenuItem icon="new-object" text="Object" />
            <MenuItem icon="new-text-box" text="Text box" />
            <MenuItem icon="star" text="Astral body" />
        </MenuItem>
        <MenuItem icon="layout" text="Layout...">
            <MenuItem icon="layout-auto" text="Auto" />
            <MenuItem icon="layout-circle" text="Circle" />
            <MenuItem icon="layout-grid" text="Grid" />
        </MenuItem>
        <MenuDivider />
        <MenuItem icon="cross-circle" intent="danger" text="Delete" />
    </Menu>
);

const TARGET_STYLE: React.CSSProperties = {
    alignItems: "center",
    background: "rgba(138, 155, 168, 0.15)",
    border: "1px dashed rgba(138, 155, 168, 0.5)",
    borderRadius: 3,
    display: "flex",
    height: 120,
    justifyContent: "center",
    padding: 20,
    textAlign: "center",
    width: 240,
};

const meta: Meta<typeof ContextMenu> = {
    title: "Core/Context Menu/ContextMenu",
    component: ContextMenu,
    decorators: [storybookLayoutDecorator],
    args: {
        content: SAMPLE_MENU,
        disabled: false,
    },
    argTypes: {
        content: { control: false, table: { disable: true } },
        disabled: { control: "boolean" },
        tagName: { control: "text" },
        onContextMenu: { action: "context-menu-opened" },
        onClose: { table: { disable: true } },
        popoverProps: { table: { disable: true } },
        children: { table: { disable: true } },
    },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic context menu wraps its children in a `<div>` and opens on right-click.
 */
export const Default: Story = {
    args: {
        children: <div style={TARGET_STYLE}>Right-click anywhere in this box</div>,
    },
};

/**
 * The `content` prop accepts a render function. The function receives the current
 * `isOpen` state, `targetOffset`, and `mouseEvent`, which can be used to render
 * content that reacts to the click location.
 */
export const RenderFunctionContent: Story = {
    name: "Content Render Function",
    args: {
        children: <div style={TARGET_STYLE}>Right-click to see click coordinates</div>,
        content: ({ targetOffset }) => (
            <Menu>
                <MenuItem icon="select" text="Select all" />
                <MenuItem icon="insert" text="Insert..." />
                <MenuItem icon="layout" text="Layout..." />
                {targetOffset === undefined ? undefined : (
                    <>
                        <MenuDivider />
                        <MenuItem
                            disabled={true}
                            text={`Clicked at (${Math.round(targetOffset.left)}, ${Math.round(targetOffset.top)})`}
                        />
                    </>
                )}
            </Menu>
        ),
    },
};

/**
 * Provide `children` as a render function to take full control of the wrapper element.
 * This is useful when the default `<div>` wrapper breaks layout. You must wire up the
 * `className`, `onContextMenu`, `ref`, and embed the `popover` element yourself.
 */
export const AdvancedChildren: Story = {
    name: "Advanced Children Render",
    args: {
        children: (props: ContextMenuChildrenProps) => (
            <div
                className={props.className}
                onContextMenu={props.onContextMenu}
                ref={props.ref}
                style={{
                    background: props.contentProps.isOpen ? "rgba(45, 114, 210, 0.2)" : TARGET_STYLE.background,
                }}
            >
                {props.popover}
                Render-function child — background changes when menu opens
            </div>
        ),
    },
};

/**
 * Use the `tagName` prop to customize the HTML tag of the generated wrapper element.
 */
export const CustomTagName: Story = {
    name: "Custom Tag Name",
    args: {
        tagName: "section",
        children: <div style={TARGET_STYLE}>{"Wrapped in a <section> element"}</div>,
    },
};

/**
 * Override the popover placement via `popoverProps.placement`. The default is
 * `right-start`, but you may need a different placement near viewport edges.
 */
export const CustomPlacement: Story = {
    name: "Custom Placement",
    args: {
        children: <div style={TARGET_STYLE}>Right-click — menu opens above-left</div>,
        popoverProps: { placement: "top-end" },
    },
};

/**
 * When `disabled` is true, right-clicking the target falls back to the browser's
 * native context menu instead of opening the Blueprint menu.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        children: <div style={TARGET_STYLE}>Disabled — browser context menu shows instead</div>,
    },
};

/**
 * Interactive playground — toggle `disabled` and adjust other props via the controls panel.
 */
export const Playground: Story = {
    args: {
        children: <div style={TARGET_STYLE}>Right-click me!</div>,
    },
};

/**
 * Demonstrates the menu opening on a right-click (contextmenu) event.
 */
export const RightClickOpen: Story = {
    name: "Right Click Open",
    args: {
        children: <div style={TARGET_STYLE}>Right-click to open menu</div>,
        popoverProps: { transitionDuration: 0 },
    },
    play: async ({ canvas, userEvent, step }) => {
        await step("Right-click target to open menu", async () => {
            const target = canvas.getByText("Right-click to open menu");
            const rect = target.getBoundingClientRect();
            const coords = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
            await userEvent.pointer({ keys: "[MouseRight]", target, coords });
            await waitFor(() => expect(screen.getByText("Select all")).toBeVisible());
        });
    },
};

/**
 * When `disabled` is true, right-clicking does not open the Blueprint context menu.
 */
export const DisabledNoOpen: Story = {
    name: "Disabled No Open",
    args: {
        disabled: true,
        children: <div style={TARGET_STYLE}>Disabled target</div>,
    },
    play: async ({ canvas, userEvent, step }) => {
        await step("Right-click disabled target — menu does not open", async () => {
            const target = canvas.getByText("Disabled target");
            const rect = target.getBoundingClientRect();
            const coords = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
            await userEvent.pointer({ keys: "[MouseRight]", target, coords });
            await expect(screen.queryByText("Select all")).not.toBeInTheDocument();
        });
    },
};
