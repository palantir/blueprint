/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Intent } from "../../common";

import { Tag } from "./tag";

// These props are deprecated on Tag — hide them from the Storybook controls panel.
const disabledArgs = ["large", "rightIcon"] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof Tag>>;

const meta: Meta<typeof Tag> = {
    title: "Core/Tag/Tag",
    component: Tag,
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
        children: "Tag",
        intent: "none",
        size: "medium",
        icon: undefined,
        endIcon: undefined,
        fill: false,
        active: false,
        minimal: false,
        round: false,
        interactive: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "select",
            options: ["medium", "large"],
        },
        icon: {
            control: "text",
        },
        endIcon: {
            control: "text",
        },
        active: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        interactive: {
            control: "boolean",
        },
        minimal: {
            control: "boolean",
        },
        multiline: {
            control: "boolean",
        },
        round: {
            control: "boolean",
        },
        onClick: { action: "clicked" },
        onRemove: { action: "removed" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = {
                    table: {
                        disable: true,
                    },
                };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic tag with default styling.
 */
export const Default: Story = {
    args: {
        children: "Tag",
    },
};

/**
 * Default tags across all intents, with and without remove buttons.
 *
 * Matches the demo-app TagExample "Default" card.
 */
export const DefaultAllIntents: Story = {
    render: function Render() {
        const handleRemove = useCallback(() => {
            return;
        }, []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 8 }}>
                    {Object.values(Intent).map(intent => (
                        <Tag key={intent} intent={intent} interactive={true} onRemove={handleRemove}>
                            Tag
                        </Tag>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {Object.values(Intent).map(intent => (
                        <Tag key={intent} intent={intent} interactive={false}>
                            Tag
                        </Tag>
                    ))}
                </div>
            </div>
        );
    },
};

/**
 * Minimal tags across all intents, with and without remove buttons.
 *
 * Matches the demo-app TagExample "Minimal" card.
 */
export const MinimalAllIntents: Story = {
    render: function Render() {
        const handleRemove = useCallback(() => {
            return;
        }, []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 8 }}>
                    {Object.values(Intent).map(intent => (
                        <Tag key={intent} minimal={true} intent={intent} interactive={true} onRemove={handleRemove}>
                            Tag
                        </Tag>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {Object.values(Intent).map(intent => (
                        <Tag key={intent} minimal={true} intent={intent} interactive={false}>
                            Tag
                        </Tag>
                    ))}
                </div>
            </div>
        );
    },
};

/**
 * Interactive playground matching the docs-app TagExample.
 *
 * Shows a list of removable city tags with all tag props togglable via Storybook controls.
 */
const PLAYGROUND_INITIAL_TAGS = ["London", "New York", "San Francisco", "Seattle"];

export const Playground: Story = {
    render: function Render(args) {
        const [tags, setTags] = useState(PLAYGROUND_INITIAL_TAGS);

        const handleRemove = useCallback((tag: string) => () => setTags(prev => prev.filter(t => t !== tag)), []);

        const handleReset = useCallback(() => setTags(PLAYGROUND_INITIAL_TAGS), []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {tags.map(tag => (
                        <Tag
                            key={tag}
                            active={args.active}
                            endIcon={args.endIcon}
                            fill={args.fill}
                            icon={args.icon}
                            intent={args.intent}
                            interactive={args.interactive}
                            minimal={args.minimal}
                            onRemove={args.onRemove != null ? handleRemove(tag) : undefined}
                            round={args.round}
                            size={args.size}
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
                {tags.length === 0 && (
                    <button type="button" onClick={handleReset}>
                        Reset tags
                    </button>
                )}
            </div>
        );
    },
    args: {
        children: undefined,
        icon: "home",
        endIcon: "map",
        interactive: true,
    },
};
