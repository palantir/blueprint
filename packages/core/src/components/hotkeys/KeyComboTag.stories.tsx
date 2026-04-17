/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashedPaddedContainer, StoryLabel, StorybookLayout } from "@storybook-common";

import { H4 } from "../html/html";

import { KeyComboTag } from "./keyComboTag";

const meta: Meta<typeof KeyComboTag> = {
    title: "Core/Hotkeys/KeyComboTag",
    component: KeyComboTag,
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
    render: args => (
        <StorybookLayout>
            <div>
                <StoryLabel title="Command" />
                <KeyComboTag {...args} />
            </div>
        </StorybookLayout>
    ),
};

/**
 * Shift modifier key.
 */
export const Shift: Story = {
    args: {
        combo: "shift + a",
    },
    render: args => (
        <StorybookLayout>
            <div>
                <StoryLabel title="Shift" />
                <KeyComboTag {...args} />
            </div>
        </StorybookLayout>
    ),
};

/**
 * Space key with special icon.
 */
export const Space: Story = {
    args: {
        combo: "space",
    },
    render: args => (
        <StorybookLayout>
            <div>
                <StoryLabel title="Space" />
                <KeyComboTag {...args} />
            </div>
        </StorybookLayout>
    ),
};

/**
 * Control modifier key.
 */
export const Control: Story = {
    args: {
        combo: "ctrl + c",
    },
    render: args => (
        <StorybookLayout>
            <div>
                <StoryLabel title="Control" />
                <KeyComboTag {...args} />
            </div>
        </StorybookLayout>
    ),
};

/**
 * Alt/Option modifier key.
 */
export const Option: Story = {
    args: {
        combo: "option + delete",
    },
    render: args => (
        <StorybookLayout>
            <div>
                <StoryLabel title="Option" />
                <KeyComboTag {...args} />
            </div>
        </StorybookLayout>
    ),
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
        <StorybookLayout>
            <div>
                <StoryLabel title="Minimal" />
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <KeyComboTag combo="cmd + s" minimal={true} />
                    <KeyComboTag combo="shift + a" minimal={true} />
                    <KeyComboTag combo="ctrl + c" minimal={true} />
                    <KeyComboTag combo="option + delete" minimal={true} />
                    <KeyComboTag combo="space" minimal={true} />
                    <KeyComboTag combo="cmd + shift + p" minimal={true} />
                </div>
            </div>
        </StorybookLayout>
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
    render: args => (
        <StorybookLayout>
            <div>
                <StoryLabel title="Playground" />
                <KeyComboTag {...args} />
            </div>
        </StorybookLayout>
    ),
};

// ---------------------------------------------------------------------------
// AllKeys gallery
// ---------------------------------------------------------------------------

const KEY_SECTIONS: Array<{
    title: string;
    combos: string[] | Array<{ combo: string; resolves: string }>;
    labelFn?: (entry: { combo: string; resolves: string }) => string;
}> = [
    { title: "Modifier Keys", combos: ["shift", "ctrl", "alt", "meta"] },
    {
        title: "Named Keys",
        combos: [
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
        ],
    },
    {
        title: "Special Keys",
        combos: [
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
        ],
    },
    {
        title: "Aliased Keys",
        combos: [
            { combo: "option", resolves: "alt" },
            { combo: "cmd", resolves: "meta" },
            { combo: "command", resolves: "meta" },
            { combo: "return", resolves: "enter" },
            { combo: "esc", resolves: "escape" },
            { combo: "win", resolves: "meta" },
        ],
        labelFn: entry => `${entry.combo} \u2192 ${entry.resolves}`,
    },
    { title: "Letters", combos: Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)) },
    { title: "Digits", combos: Array.from({ length: 10 }, (_, i) => String(i)) },
];

function KeySection({
    title,
    combos,
    labelFn,
}: {
    title: string;
    combos: string[] | Array<{ combo: string; resolves: string }>;
    labelFn?: (entry: { combo: string; resolves: string }) => string;
}) {
    return (
        <section>
            <H4>{title}</H4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {combos.map(entry => {
                    const combo = typeof entry === "string" ? entry : entry.combo;
                    const label = typeof entry === "string" ? entry : (labelFn?.(entry) ?? entry.combo);
                    return (
                        <div key={combo} style={{ width: 100 }}>
                            <StoryLabel title={label} />
                            <DashedPaddedContainer width={100}>
                                <KeyComboTag combo={combo} />
                            </DashedPaddedContainer>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/**
 * Comprehensive gallery showing all supported key combos, organized by category.
 */
export const AllKeys: Story = {
    argTypes: {
        minimal: { table: { disable: true } },
        combo: { table: { disable: true } },
    },
    render: () => (
        <div style={{ maxWidth: 600, padding: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {KEY_SECTIONS.map(section => (
                    <KeySection key={section.title} {...section} />
                ))}
            </div>
        </div>
    ),
};
