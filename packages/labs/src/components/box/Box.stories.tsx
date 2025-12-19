/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box } from "./box";

const meta = {
    title: "Labs/Box",
    component: Box,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Box with padding and horizontal margin.
 */
export const Basic: Story = {
    args: {
        marginX: 3,
        padding: 5,
        children: "Content",
    },
};

/**
 * Box with different spacing.
 */
export const Compact: Story = {
    args: {
        marginX: 1,
        padding: 2,
        children: "Compact content",
    },
};
