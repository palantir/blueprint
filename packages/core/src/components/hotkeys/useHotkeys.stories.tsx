/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";
import { useMemo, useState } from "react";

import { Flex } from "@blueprintjs/labs";

import { type HotkeyConfig, useHotkeys, type UseHotkeysOptions } from "../../hooks";
import { Code } from "../html/html";

import { KeyComboTag } from "./keyComboTag";

interface UseHotkeysStoryProps {
    showDialogKeyCombo?: UseHotkeysOptions["showDialogKeyCombo"];
}

function UseHotkeysStory({ showDialogKeyCombo }: UseHotkeysStoryProps) {
    const [lastFired, setLastFired] = useState<string>();

    const hotkeys = useMemo<readonly HotkeyConfig[]>(
        () => [
            {
                combo: "mod + c",
                global: true,
                group: "Edit",
                label: "Copy",
                onKeyDown: () => setLastFired("Copy"),
            },
            {
                combo: "mod + v",
                global: true,
                group: "Edit",
                label: "Paste",
                onKeyDown: () => setLastFired("Paste"),
            },
            {
                combo: "mod + z",
                global: true,
                group: "Edit",
                label: "Undo",
                onKeyDown: () => setLastFired("Undo"),
            },
            {
                combo: "mod + shift + z",
                global: true,
                group: "Edit",
                label: "Redo",
                onKeyDown: () => setLastFired("Redo"),
            },
        ],
        [],
    );

    useHotkeys(hotkeys, { showDialogKeyCombo });

    return (
        <Flex flexDirection="column" gap={4} style={{ width: 320 }}>
            <Flex alignItems="center" gap={3}>
                <span>Dialog trigger:</span>
                {showDialogKeyCombo === false ? (
                    <KeyComboTag combo="(disabled)" />
                ) : (
                    <KeyComboTag combo={showDialogKeyCombo ?? "?"} />
                )}
            </Flex>
            <Flex flexDirection="column" gap={2}>
                {hotkeys.map(({ combo, label }) => (
                    <Flex key={combo} alignItems="center" gap={3}>
                        <div style={{ minWidth: 140 }}>
                            <KeyComboTag combo={combo} />
                        </div>
                        <span>{label}</span>
                    </Flex>
                ))}
            </Flex>
            <Flex alignItems="center" gap={3}>
                <span>Last fired:</span>
                <Code>{lastFired ?? "(none)"}</Code>
            </Flex>
        </Flex>
    );
}

const meta: Meta<typeof UseHotkeysStory> = {
    title: "Core/Hotkeys/useHotkeys",
    component: UseHotkeysStory,
    decorators: [storybookLayoutDecorator],
    args: {
        showDialogKeyCombo: "?",
    },
    argTypes: {
        showDialogKeyCombo: {
            description:
                "Key combo that opens the built-in help dialog. Pass `false` to disable the trigger entirely; the dialog can still be opened programmatically via `HotkeysContext`.",
            control: { type: "radio" },
            options: ["?", "shift + h", "Disabled (false)"],
            mapping: {
                "?": "?",
                "shift + h": "shift + h",
                "Disabled (false)": false,
            },
        },
    },
} satisfies Meta<typeof UseHotkeysStory>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Registers Copy, Paste, Undo, and Redo as global hotkeys. Use the
 * `showDialogKeyCombo` control to customize or disable the help dialog trigger.
 */
export const Default: Story = {};
