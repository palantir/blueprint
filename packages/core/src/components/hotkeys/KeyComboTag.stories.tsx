/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashedPaddedContainer, storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { KeyComboTag } from "./keyComboTag";

const meta: Meta<typeof KeyComboTag> = {
    title: "Core/Hotkeys/KeyComboTag",
    component: KeyComboTag,
    decorators: [storybookLayoutDecorator],
    args: {
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
export const CommandExample: Story = {
    name: "Command",
    args: {
        combo: "cmd + s",
    },
};

/**
 * Shift modifier key.
 */
export const ShiftExample: Story = {
    name: "Shift",
    args: {
        combo: "shift + a",
    },
};

/**
 * Space key with special icon.
 */
export const SpaceExample: Story = {
    name: "Space",
    args: {
        combo: "space",
    },
};

/**
 * Control modifier key.
 */
export const ControlExample: Story = {
    name: "Control",
    args: {
        combo: "ctrl + c",
    },
};

/**
 * Alt/Option modifier key.
 */
export const OptionExample: Story = {
    name: "Option",
    args: {
        combo: "option + delete",
    },
};

const MINIMAL_COMBOS = ["cmd + s", "shift + a", "ctrl + c", "option + delete", "space", "cmd + shift + p"];

/**
 * Minimal rendering shows compact key combos, useful when displayed inline or in a row.
 */
export const MinimalExample: Story = {
    name: "Minimal",
    argTypes: {
        minimal: { table: { disable: true } },
        combo: { table: { disable: true } },
    },
    render: () => (
        <Flex flexWrap="wrap" gap={2}>
            {MINIMAL_COMBOS.map(combo => (
                <div key={combo} style={{ width: 100 }}>
                    <StoryLabel title={combo} />
                    <DashedPaddedContainer width={100}>
                        <KeyComboTag combo={combo} minimal={true} />
                    </DashedPaddedContainer>
                </div>
            ))}
        </Flex>
    ),
};

const COMMON_COMBOS = [
    "cmd + s",
    "cmd + shift + p",
    "cmd + del",
    "alt + tab",
    "option + delete",
    "ctrl + z",
    "shift + enter",
];

/**
 * Grid of common real-world key combos.
 */
export const AllKeysExample: Story = {
    name: "Common key combos",
    args: {
        minimal: false,
    },
    render: args => (
        <Flex flexDirection="row" gap={2}>
            {COMMON_COMBOS.map(combo => (
                <div key={combo}>
                    <StoryLabel title={combo} />
                    <DashedPaddedContainer width={160}>
                        <KeyComboTag combo={combo} minimal={args.minimal} />
                    </DashedPaddedContainer>
                </div>
            ))}
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const PlaygroundExample: Story = {
    name: "Playground",
    argTypes: {
        combo: { table: { disable: false } },
    },
    args: {
        combo: "cmd + shift + p",
        minimal: false,
    },
};
