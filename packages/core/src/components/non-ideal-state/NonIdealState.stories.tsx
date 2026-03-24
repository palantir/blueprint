/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/buttons";
import { NonIdealState, NonIdealStateIconSize } from "./nonIdealState";

const meta: Meta<typeof NonIdealState> = {
    title: "Core/NonIdealState/NonIdealState",
    component: NonIdealState,
    decorators: [
        Story => (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "400px",
                    minHeight: "300px",
                }}
            >
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        icon: "search",
        title: "No search results",
        description: "Try a different search query or check your filters.",
        layout: "vertical",
        iconMuted: true,
        iconSize: NonIdealStateIconSize.STANDARD,
    },
    argTypes: {
        icon: {
            control: "text",
        },
        iconSize: {
            control: "select",
            options: Object.values(NonIdealStateIconSize).filter(v => typeof v === "number"),
        },
        iconMuted: {
            control: "boolean",
        },
        layout: {
            control: "select",
            options: ["vertical", "horizontal"],
        },
    },
} satisfies Meta<typeof NonIdealState>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic NonIdealState with an icon, title, and description.
 */
export const Default: Story = {};

/**
 * NonIdealState with an action button.
 */
export const WithAction: Story = {
    name: "With Action",
    args: {
        icon: "folder-open",
        title: "This folder is empty",
        description: "Create a new file to get started.",
        action: <Button icon="plus" text="Create new file" intent="primary" />,
    },
};

/**
 * Icon size options available for the visual element.
 */
export const IconSizes: Story = {
    name: "Icon Size",
    argTypes: {
        iconSize: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
            {(
                [
                    { size: NonIdealStateIconSize.EXTRA_SMALL, label: "Extra Small" },
                    { size: NonIdealStateIconSize.SMALL, label: "Small" },
                    { size: NonIdealStateIconSize.STANDARD, label: "Standard" },
                ] as const
            ).map(({ size, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>{label}</div>
                    <NonIdealState {...args} iconSize={size} />
                </div>
            ))}
        </div>
    ),
};

/**
 * Horizontal vs vertical layout.
 */
export const Layout: Story = {
    argTypes: {
        layout: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%" }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Vertical (default)</div>
                <NonIdealState {...args} layout="vertical" />
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Horizontal</div>
                <NonIdealState {...args} layout="horizontal" />
            </div>
        </div>
    ),
};

/**
 * Muted vs non-muted icon styling.
 */
export const IconMuted: Story = {
    name: "Icon Muted",
    argTypes: {
        iconMuted: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Muted (default)</div>
                <NonIdealState {...args} iconMuted={true} />
            </div>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Not muted</div>
                <NonIdealState {...args} iconMuted={false} />
            </div>
        </div>
    ),
};

/**
 * NonIdealState with only a title and no icon.
 */
export const TitleOnly: Story = {
    name: "Title Only",
    args: {
        icon: undefined,
        title: "Nothing here yet",
        description: undefined,
    },
};

/**
 * Interactive playground for experimenting with NonIdealState props.
 */
export const Playground: Story = {
    args: {
        icon: "search",
        title: "No search results",
        description: "Your search didn't match any files. Try searching for something else.",
        action: <Button icon="refresh" text="Clear search" intent="primary" />,
    },
};
