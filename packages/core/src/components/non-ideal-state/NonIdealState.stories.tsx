/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashedPaddedContainer, StoryLabel } from "@storybook-common";

import { Button } from "../button/buttons";

import { NonIdealState, NonIdealStateIconSize } from "./nonIdealState";

const meta: Meta<typeof NonIdealState> = {
    title: "Core/NonIdealState",
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
 * Horizontal vs vertical layout.
 */
export const LayoutExample: Story = {
    name: "Layout",
    argTypes: {
        layout: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div>
                <StoryLabel title="Vertical (default)" />
                <DashedPaddedContainer>
                    <NonIdealState {...args} layout="vertical" />
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Horizontal" />
                <DashedPaddedContainer>
                    <NonIdealState {...args} layout="horizontal" />
                </DashedPaddedContainer>
            </div>
        </div>
    ),
};

/**
 * Icon size options available for the visual element.
 */
export const IconSizeExample: Story = {
    name: "Icon Size",
    argTypes: {
        iconSize: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "flex-start" }}>
            {(
                [
                    { size: NonIdealStateIconSize.EXTRA_SMALL, label: "Extra Small" },
                    { size: NonIdealStateIconSize.SMALL, label: "Small" },
                    { size: NonIdealStateIconSize.STANDARD, label: "Standard" },
                ] as const
            ).map(({ size, label }) => (
                <div key={label}>
                    <StoryLabel title={label} />
                    <DashedPaddedContainer>
                        <NonIdealState {...args} iconSize={size} />
                    </DashedPaddedContainer>
                </div>
            ))}
        </div>
    ),
};

/**
 * Icon size options available for the visual element.
 */
export const IconMutedExample: Story = {
    name: "Icon Muted",
    argTypes: {
        iconSize: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "flex-start" }}>
            {(
                [
                    { iconMuted: true, label: "iconMuted={true} (Default)" },
                    { iconMuted: false, label: "iconMuted={false}" },
                ] as const
            ).map(({ iconMuted, label }) => (
                <div key={label}>
                    <StoryLabel title={label} />
                    <DashedPaddedContainer>
                        <NonIdealState {...args} iconMuted={iconMuted} />
                    </DashedPaddedContainer>
                </div>
            ))}
        </div>
    ),
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
