/*!
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { KeyComboTag } from "./keyComboTag";

const meta: Meta<typeof KeyComboTag> = {
    title: "Core/Hotkeys",
    component: KeyComboTag,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "300px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        combo: "cmd + s",
        minimal: false,
    },
    argTypes: {
        combo: {
            control: "text",
        },
        minimal: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof KeyComboTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic KeyComboTag rendering a key combination.
 */
export const Default: Story = {
    args: {
        combo: "cmd + s",
    },
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        combo: "cmd + shift + p",
        minimal: false,
    },
};
