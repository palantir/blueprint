/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashedPaddedContainer, storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Button } from "../button/buttons";
import { Spinner } from "../spinner/spinner";

import { NonIdealState, NonIdealStateIconSize } from "./nonIdealState";

const meta: Meta<typeof NonIdealState> = {
    title: "Core/NonIdealState",
    component: NonIdealState,
    decorators: [storybookLayoutDecorator],
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
        iconMuted: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "flex-start" }}>
            {(
                [
                    { iconMuted: true, label: "Icon muted (Default)" },
                    { iconMuted: false, label: "Icon isn't muted" },
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
 * Pass a `<Spinner>` as the `icon` to communicate a loading state.
 */
export const LoadingExample: Story = {
    name: "Loading",
    args: {
        icon: <Spinner />,
        title: "Loading search results",
        description: "This may take a moment.",
    },
    argTypes: {
        icon: { table: { disable: true } },
    },
    render: args => <NonIdealState {...args} icon={<Spinner size={args.iconSize} />} />,
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
