/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";

import { KeyComboTag } from "./keyComboTag";

const meta: Meta<typeof KeyComboTag> = {
    title: "Core/Hotkeys/KeyComboTag",
    component: KeyComboTag,
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        combo: "cmd + s",
        minimal: false,
    },
    argTypes: {
        minimal: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof KeyComboTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Command/meta modifier key.
 */
export const Command: Story = {
    args: {
        combo: "cmd + s",
    },
};

/**
 * Shift modifier key.
 */
export const Shift: Story = {
    args: {
        combo: "shift + a",
    },
};

/**
 * Space key with special icon.
 */
export const Space: Story = {
    args: {
        combo: "space",
    },
};

/**
 * Control modifier key.
 */
export const Control: Story = {
    args: {
        combo: "ctrl + c",
    },
};

/**
 * Alt/Option modifier key.
 */
export const Option: Story = {
    args: {
        combo: "option + delete",
    },
};

/**
 * Minimal rendering shows compact key combos, useful when displayed inline or in a row.
 */
export const Minimal: Story = {
    argTypes: {
        minimal: { table: { disable: true } },
        combo: { table: { disable: true } },
    },
    render: () => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <KeyComboTag combo="cmd + s" minimal={true} />
            <KeyComboTag combo="shift + a" minimal={true} />
            <KeyComboTag combo="ctrl + c" minimal={true} />
            <KeyComboTag combo="option + delete" minimal={true} />
            <KeyComboTag combo="space" minimal={true} />
            <KeyComboTag combo="cmd + shift + p" minimal={true} />
        </div>
    ),
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
