/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type { HotkeyConfig } from "../../hooks";

import { Hotkey } from "./hotkey";
import { Hotkeys } from "./hotkeys";
import { HotkeysDialog } from "./hotkeysDialog";
import { KeyComboTag } from "./keyComboTag";

const SAMPLE_HOTKEYS: HotkeyConfig[] = [
    { combo: "cmd + s", label: "Save", global: true },
    { combo: "cmd + shift + s", label: "Save as...", global: true },
    { combo: "cmd + z", label: "Undo", global: true },
    { combo: "cmd + shift + z", label: "Redo", global: true },
    { combo: "cmd + c", label: "Copy", group: "Editing" },
    { combo: "cmd + v", label: "Paste", group: "Editing" },
    { combo: "cmd + x", label: "Cut", group: "Editing" },
    { combo: "cmd + f", label: "Find", group: "Navigation" },
    { combo: "cmd + p", label: "Quick open", group: "Navigation" },
];

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
 * KeyComboTag supports a `minimal` rendering mode where keys are shown without wrapper `<kbd>` styles.
 */
export const MinimalExample: Story = {
    name: "Minimal",
    argTypes: {
        minimal: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <KeyComboTag {...args} minimal={false} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Minimal</span>
                <KeyComboTag {...args} minimal={true} />
            </div>
        </div>
    ),
};

/**
 * Various key combinations demonstrating different modifier keys and special keys.
 */
export const KeyCombinations: Story = {
    name: "Key Combinations",
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
            <KeyComboTag {...args} combo="cmd + s" />
            <KeyComboTag {...args} combo="ctrl + shift + k" />
            <KeyComboTag {...args} combo="alt + enter" />
            <KeyComboTag {...args} combo="shift + delete" />
            <KeyComboTag {...args} combo="mod + z" />
            <KeyComboTag {...args} combo="up" />
            <KeyComboTag {...args} combo="shift + ?" />
        </div>
    ),
};

/**
 * Arrow key combinations shown in both default and minimal styles.
 */
export const ArrowKeys: Story = {
    name: "Arrow Keys",
    render: args => (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <div style={{ display: "flex", gap: 8 }}>
                    <KeyComboTag {...args} combo="up" minimal={false} />
                    <KeyComboTag {...args} combo="down" minimal={false} />
                    <KeyComboTag {...args} combo="left" minimal={false} />
                    <KeyComboTag {...args} combo="right" minimal={false} />
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Minimal</span>
                <div style={{ display: "flex", gap: 8 }}>
                    <KeyComboTag {...args} combo="up" minimal={true} />
                    <KeyComboTag {...args} combo="down" minimal={true} />
                    <KeyComboTag {...args} combo="left" minimal={true} />
                    <KeyComboTag {...args} combo="right" minimal={true} />
                </div>
            </div>
        </div>
    ),
};

/**
 * A single Hotkey component displaying a label alongside its key combination.
 */
export const SingleHotkey: Story = {
    name: "Single Hotkey",
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: "300px" }}>
            <Hotkey combo="cmd + s" label="Save" global={true} group="Global" />
            <Hotkey combo="cmd + shift + f" label="Find in files" global={true} group="Global" />
            <Hotkey combo="ctrl + shift + k" label="Delete line" global={false} group="Editing" />
        </div>
    ),
};

/**
 * The Hotkeys component renders a grouped and sorted list of hotkey definitions.
 */
export const GroupedHotkeys: Story = {
    name: "Grouped Hotkeys",
    render: () => (
        <div style={{ minWidth: "400px" }}>
            <Hotkeys>
                <Hotkey combo="cmd + s" label="Save" global={true} group="Global" />
                <Hotkey combo="cmd + z" label="Undo" global={true} group="Global" />
                <Hotkey combo="cmd + c" label="Copy" global={false} group="Editing" />
                <Hotkey combo="cmd + v" label="Paste" global={false} group="Editing" />
                <Hotkey combo="cmd + f" label="Find" global={false} group="Navigation" />
                <Hotkey combo="cmd + p" label="Quick open" global={false} group="Navigation" />
            </Hotkeys>
        </div>
    ),
};

/**
 * HotkeysDialog displays hotkey definitions inside a dialog, grouped by category.
 * Click "Open dialog" to toggle the dialog.
 */
export const DialogExample: Story = {
    name: "Hotkeys Dialog",
    render: function Render() {
        const [isOpen, setIsOpen] = useState(true);
        return (
            <div>
                <button type="button" onClick={() => setIsOpen(true)}>
                    Open dialog
                </button>
                <HotkeysDialog
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    hotkeys={SAMPLE_HOTKEYS}
                    globalGroupName="Global"
                />
            </div>
        );
    },
};

/**
 * Interactive playground for KeyComboTag with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        return <KeyComboTag combo={args.combo} minimal={args.minimal} />;
    },
    args: {
        combo: "cmd + shift + p",
        minimal: false,
    },
};
