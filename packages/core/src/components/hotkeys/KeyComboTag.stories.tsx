/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashedPaddedContainer, storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { H3 } from "@blueprintjs/core";

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
        minimal: false,
    },
    argTypes: {
        combo: { table: { disable: true } },
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
    },
    render: () => (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {MINIMAL_COMBOS.map(combo => (
                    <div key={combo} style={{ width: 100 }}>
                        <StoryLabel title={combo} />
                        <DashedPaddedContainer width={100}>
                            <KeyComboTag combo={combo} minimal={true} />
                        </DashedPaddedContainer>
                    </div>
                ))}
            </div>
        </div>
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

const MODIFIER_KEYS = ["shift", "ctrl", "alt", "meta"];
const NAMED_KEYS = [
    "plus",
    "minus",
    "backspace",
    "tab",
    "enter",
    "capslock",
    "escape",
    "space",
    "pageup",
    "pagedown",
    "end",
    "home",
    "left",
    "up",
    "right",
    "down",
    "ins",
    "del",
];
const SPECIAL_KEYS = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "-",
    "=",
    "[",
    "]",
    "\\",
    "{",
    "}",
    "|",
    ";",
    "'",
    ",",
    ".",
    "/",
    ":",
    '"',
    "<",
    ">",
    "?",
    "`",
    "~",
];
const ALIASED_KEYS = ["option", "cmd", "command", "return", "esc", "win"];
const LETTER_KEYS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const DIGIT_KEYS = Array.from({ length: 10 }, (_, i) => String(i));

const ALL_KEY_SECTIONS = [
    { label: "Modifier Keys", keys: MODIFIER_KEYS },
    { label: "Named Keys", keys: NAMED_KEYS },
    { label: "Special Keys", keys: SPECIAL_KEYS },
    { label: "Aliased Keys", keys: ALIASED_KEYS },
    { label: "Letters", keys: LETTER_KEYS },
    { label: "Digits", keys: DIGIT_KEYS },
];

/**
 * Comprehensive gallery showing all supported key combos, organized by category.
 */
export const AllKeysExample: Story = {
    name: "All keys",
    args: {
        minimal: false,
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 600 }}>
            {ALL_KEY_SECTIONS.map(({ label, keys }) => (
                <section key={label}>
                    <H3>{label}</H3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {keys.map(combo => (
                            <div key={combo} style={{ width: 100 }}>
                                <StoryLabel title={combo} />
                                <DashedPaddedContainer width={100}>
                                    <KeyComboTag combo={combo} minimal={args.minimal} />
                                </DashedPaddedContainer>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    ),
};
