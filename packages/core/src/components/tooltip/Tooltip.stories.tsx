/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashedPaddedContainer, storybookLayoutDecorator } from "@storybook-common";
import { expect, screen, waitFor } from "storybook/test";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";
import { Button } from "../button/buttons";

import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip> = {
    title: "Core/Overlays/Tooltip",
    component: Tooltip,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        content: "This is a tooltip",
        intent: Intent.NONE,
        compact: false,
        minimal: false,
        disabled: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        compact: {
            control: "boolean",
        },
        minimal: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        content: {
            control: "text",
        },
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic tooltip that appears on hover.
 */
export const Default: Story = {
    args: {
        content: "This is a tooltip",
        isOpen: true,
        children: <Button>Hover me</Button>,
    },
};

/**
 * Use the `intent` prop to apply a semantic color to the tooltip background.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => {
        const intents = Object.values(Intent);
        const mid = Math.ceil(intents.length / 2);
        const columns = [intents.slice(0, mid), intents.slice(mid)];
        return (
            <Flex flexDirection="row" gap={10}>
                {columns.map((col, i) => (
                    <Flex key={i} flexDirection="column" gap={10} alignItems="center">
                        {col.map(intent => (
                            <div key={intent} style={{ padding: 80 }}>
                                <Tooltip {...args} intent={intent} placement="bottom" isOpen={true}>
                                    <Button>{intent.charAt(0).toUpperCase() + intent.slice(1)}</Button>
                                </Tooltip>
                            </div>
                        ))}
                    </Flex>
                ))}
            </Flex>
        );
    },
};

/**
 * The `compact` prop renders a more condensed tooltip, and the `minimal` prop removes the arrow.
 */
export const VariantExample: Story = {
    name: "Variant",
    argTypes: {
        compact: { table: { disable: true } },
        minimal: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="row" gap={10}>
            <Flex flexDirection="column" gap={10} alignItems="center">
                <div style={{ padding: 80 }}>
                    <Tooltip {...args} compact={false} placement="bottom" minimal={false} isOpen={true}>
                        <Button>Default</Button>
                    </Tooltip>
                </div>
                <div style={{ padding: 80 }}>
                    <Tooltip {...args} compact={true} placement="bottom" minimal={false} isOpen={true}>
                        <Button>Compact</Button>
                    </Tooltip>
                </div>
            </Flex>
            <Flex flexDirection="column" gap={10} alignItems="center">
                <div style={{ padding: 80 }}>
                    <Tooltip {...args} compact={false} placement="bottom" minimal={true} isOpen={true}>
                        <Button>Minimal</Button>
                    </Tooltip>
                </div>
                <div style={{ padding: 80 }}>
                    <Tooltip {...args} compact={true} placement="bottom" minimal={true} isOpen={true}>
                        <Button>Compact + Minimal</Button>
                    </Tooltip>
                </div>
            </Flex>
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        content: "Tooltip content",
        children: <Button>Hover over me</Button>,
    },
};

/**
 * Demonstrates the tooltip appearing on hover. The `play` function simulates
 * a user hovering over the target, causing the tooltip to open.
 */
export const HoverOpen: Story = {
    name: "Hover Open",
    args: {
        content: "I appeared on hover!",
        hoverOpenDelay: 0,
        children: <Button>Hover me</Button>,
    },
    play: async ({ canvas, userEvent, step }) => {
        await step("Hover target to open tooltip", async () => {
            const target = canvas.getByRole("button", { name: "Hover me" });
            await userEvent.hover(target);
            await waitFor(() => expect(screen.getByText("I appeared on hover!")).toBeVisible());
        });
    },
};

/**
 * Demonstrates the tooltip closing when the user moves the cursor away.
 * After hovering to open, the cursor is moved off and the tooltip disappears.
 */
export const HoverClose: Story = {
    name: "Hover Close",
    args: {
        content: "Now you see me",
        hoverOpenDelay: 0,
        hoverCloseDelay: 0,
        transitionDuration: 0,
        children: <Button>Hover then leave</Button>,
    },
    play: async ({ canvas, userEvent, step }) => {
        const target = canvas.getByRole("button", { name: "Hover then leave" });

        await step("Hover to open tooltip", async () => {
            await userEvent.hover(target);
            await waitFor(() => expect(screen.getByText("Now you see me")).toBeVisible());
        });

        await step("Unhover to close tooltip", async () => {
            await userEvent.unhover(target);
            await waitFor(() => expect(screen.queryByText("Now you see me")).not.toBeInTheDocument());
        });
    },
};

/**
 * When `disabled` is true, hovering over the target does not open the tooltip.
 */
export const HoverDisabled: Story = {
    name: "Hover Disabled",
    args: {
        content: "You should not see this",
        disabled: true,
        hoverOpenDelay: 0,
        children: <Button>Tooltip is disabled</Button>,
    },
    play: async ({ canvas, userEvent, step }) => {
        await step("Hover disabled tooltip — nothing appears", async () => {
            const target = canvas.getByRole("button", { name: "Tooltip is disabled" });
            await userEvent.hover(target);
            await expect(screen.queryByText("You should not see this")).not.toBeInTheDocument();
        });
    },
};

/**
 * Demonstrates `hoverOpenDelay` — the tooltip waits before appearing.
 * With a 500ms delay, the tooltip is not yet visible immediately after hover.
 */
export const HoverOpenDelay: Story = {
    name: "Hover Open Delay",
    args: {
        content: "Delayed tooltip",
        hoverOpenDelay: 500,
        children: <Button>500ms delay</Button>,
    },
    play: async ({ canvas, userEvent, step }) => {
        await step("Hover — tooltip not visible immediately due to delay", async () => {
            const target = canvas.getByRole("button", { name: "500ms delay" });
            await userEvent.hover(target);
            await expect(screen.queryByText("Delayed tooltip")).not.toBeInTheDocument();
        });

        await step("Wait for delay — tooltip becomes visible", async () => {
            await waitFor(() => expect(screen.getByText("Delayed tooltip")).toBeVisible());
        });
    },
};
