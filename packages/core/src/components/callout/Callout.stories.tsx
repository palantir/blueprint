/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common/intent";
import { Callout } from "./callout";

const meta = {
    title: "Core/Callout",
    component: Callout,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        title: "Callout title",
        children: "Callout body content. You can include multiple paragraphs or other content here.",
        intent: Intent.PRIMARY,
        icon: undefined,
        compact: false,
        minimal: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: [Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER, undefined],
        },
    },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary intent callout with default icon.
 */
export const Default: Story = {};

/**
 * Callout with explicit title and description.
 */
export const WithTitle: Story = {
    args: {
        title: "Success",
        children: "Your changes have been saved successfully.",
        intent: Intent.SUCCESS,
    },
};

/**
 * Warning callout.
 */
export const Warning: Story = {
    args: {
        title: "Warning",
        children: "Please review your configuration before proceeding.",
        intent: Intent.WARNING,
    },
};

/**
 * Danger callout.
 */
export const Danger: Story = {
    args: {
        title: "Error",
        children: "An error occurred while processing your request.",
        intent: Intent.DANGER,
    },
};

/**
 * Compact callout with reduced padding.
 */
export const Compact: Story = {
    args: {
        title: "Compact callout",
        children: "Less visual padding.",
        compact: true,
    },
};

/**
 * Minimal callout without background fill.
 */
export const Minimal: Story = {
    args: {
        title: "Minimal callout",
        children: "No background color.",
        minimal: true,
    },
};

/**
 * Callout without icon (icon set to null).
 */
export const NoIcon: Story = {
    args: {
        title: "No icon",
        children: "This callout has icon={null}.",
        icon: null,
    },
};
