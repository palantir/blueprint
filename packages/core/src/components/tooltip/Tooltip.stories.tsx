/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/buttons";
import { Intent } from "../../common/intent";
import { Tooltip } from "./tooltip";

const meta = {
    title: "Core/Tooltip",
    component: Tooltip,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        content: "Tooltip content",
        compact: false,
        disabled: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: [Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER, undefined],
        },
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Hover over the button to see the tooltip.
 */
export const Default: Story = {
    render: args => (
        <Tooltip {...args}>
            <Button text="Hover me" />
        </Tooltip>
    ),
};

/**
 * Tooltip on a link-style element.
 */
export const OnLink: Story = {
    render: args => (
        <Tooltip {...args} content="Navigate to example">
            <a href="#">Link with tooltip</a>
        </Tooltip>
    ),
};

/**
 * Compact tooltip with less padding.
 */
export const Compact: Story = {
    args: {
        content: "Compact tooltip",
        compact: true,
    },
    render: args => (
        <Tooltip {...args}>
            <Button text="Compact" />
        </Tooltip>
    ),
};

/**
 * Tooltip with intent (e.g. danger).
 */
export const WithIntent: Story = {
    args: {
        content: "Danger action",
        intent: Intent.DANGER,
    },
    render: args => (
        <Tooltip {...args}>
            <Button text="Delete" intent="danger" />
        </Tooltip>
    ),
};

/**
 * Disabled tooltip (does not show on hover).
 */
export const Disabled: Story = {
    args: {
        content: "This tooltip is disabled",
        disabled: true,
    },
    render: args => (
        <Tooltip {...args}>
            <Button text="Disabled tooltip" disabled={true} />
        </Tooltip>
    ),
};
