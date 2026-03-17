/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Intent } from "../../common";
import { Button } from "../button/buttons";

import { CompoundTag } from "./compoundTag";

// These props are deprecated on CompoundTag — hide them from the Storybook controls panel.
const disabledArgs = ["large", "rightIcon"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof CompoundTag>
>;

const meta: Meta<typeof CompoundTag> = {
    title: "Core/Tag/CompoundTag",
    component: CompoundTag,
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
        leftContent: "Key",
        children: "Value",
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
} satisfies Meta<typeof CompoundTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic compound tag displaying a key-value pair.
 *
 * Matches the docs CompoundTagBasicExample.
 */
export const Basic: Story = {
    args: {
        leftContent: "Key",
        children: "Value",
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the tag.
 *
 * Matches the docs CompoundTagIntentExample.
 */
export const IntentExample: Story = {
    name: "Intent",
    render: () => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <CompoundTag leftContent="Status" intent="primary">
                Active
            </CompoundTag>
            <CompoundTag leftContent="Status" intent="success">
                Healthy
            </CompoundTag>
            <CompoundTag leftContent="Status" intent="warning">
                Degraded
            </CompoundTag>
            <CompoundTag leftContent="Status" intent="danger">
                Down
            </CompoundTag>
        </div>
    ),
};

/**
 * Use the `minimal` prop to render a tag with reduced visual weight, without a filled background.
 *
 * Matches the docs CompoundTagMinimalExample.
 */
export const Minimal: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <CompoundTag leftContent="Env" minimal={true}>
                Production
            </CompoundTag>
            <CompoundTag leftContent="Env" minimal={true} intent="primary">
                Staging
            </CompoundTag>
        </div>
    ),
};

/**
 * Use the `size` prop to adjust the tag dimensions. CompoundTag supports `"medium"` (default) and `"large"`.
 *
 * Matches the docs CompoundTagSizeExample.
 */
export const Size: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CompoundTag leftContent="Size">Medium</CompoundTag>
            <CompoundTag leftContent="Size" size="large">
                Large
            </CompoundTag>
        </div>
    ),
};

/**
 * Use the `fill` prop to make the tag expand to the full width of its container.
 *
 * Matches the docs CompoundTagFillExample.
 */
export const Fill: Story = {
    render: () => (
        <div style={{ width: "100%" }}>
            <CompoundTag leftContent="Region" fill={true}>
                US East (N. Virginia)
            </CompoundTag>
        </div>
    ),
    decorators: [
        Story => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Use the `round` prop to render the tag with rounded ends.
 *
 * Matches the docs CompoundTagRoundExample.
 */
export const Round: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <CompoundTag leftContent="City" round={true}>
                London
            </CompoundTag>
            <CompoundTag leftContent="City" round={true} intent="success">
                New York
            </CompoundTag>
        </div>
    ),
};

/**
 * Use the `icon` prop to render an icon before the left content
 * and the `endIcon` prop to render an icon after the right content.
 *
 * Matches the docs CompoundTagIconExample.
 */
export const Icons: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <CompoundTag leftContent="City" icon="globe">
                London
            </CompoundTag>
            <CompoundTag leftContent="City" endIcon="map-marker">
                Seattle
            </CompoundTag>
            <CompoundTag leftContent="City" icon="globe" endIcon="map-marker">
                New York
            </CompoundTag>
        </div>
    ),
};

/**
 * Define the `onRemove` prop to render a remove button on the right side of the tag.
 * The remove button will only appear when this handler is provided.
 *
 * Matches the docs CompoundTagRemovableExample.
 */
const REMOVABLE_INITIAL_TAGS = ["London", "New York", "Seattle"];

export const Removable: Story = {
    render: function Render() {
        const [tags, setTags] = useState(REMOVABLE_INITIAL_TAGS);

        const handleRemove = useCallback((tag: string) => () => setTags(prev => prev.filter(t => t !== tag)), []);

        const handleReset = useCallback(() => setTags(REMOVABLE_INITIAL_TAGS), []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {tags.map(tag => (
                        <CompoundTag key={tag} leftContent="City" onRemove={handleRemove(tag)}>
                            {tag}
                        </CompoundTag>
                    ))}
                </div>
                {tags.length === 0 && (
                    <Button icon="refresh" variant="outlined" size="small" text="Reset tags" onClick={handleReset} />
                )}
            </div>
        );
    },
};

/**
 * Use the `interactive` prop to enable hover and cursor styling.
 * This is recommended when pairing with an `onClick` handler.
 *
 * Matches the docs CompoundTagInteractiveExample.
 */
export const Interactive: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <CompoundTag leftContent="Filter" interactive={true}>
                Region
            </CompoundTag>
            <CompoundTag leftContent="Filter" interactive={true} intent="primary">
                Status
            </CompoundTag>
        </div>
    ),
};

/**
 * Interactive playground matching the docs-app CompoundTagPlaygroundExample.
 *
 * Shows a list of removable city tags with all CompoundTag props togglable via Storybook controls.
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
                        <CompoundTag
                            key={tag}
                            active={args.active}
                            endIcon={args.endIcon}
                            fill={args.fill}
                            icon={args.icon}
                            intent={args.intent}
                            interactive={args.interactive}
                            leftContent="City"
                            minimal={args.minimal}
                            onRemove={args.onRemove != null ? handleRemove(tag) : undefined}
                            round={args.round}
                            size={args.size}
                        >
                            {tag}
                        </CompoundTag>
                    ))}
                </div>
                {tags.length === 0 && (
                    <Button icon="refresh" variant="outlined" size="small" text="Reset tags" onClick={handleReset} />
                )}
            </div>
        );
    },
    args: {
        leftContent: "City",
        children: undefined,
        icon: "globe",
        endIcon: "map-marker",
        interactive: true,
    },
};
