/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";

import { Callout } from "./callout";

const meta: Meta<typeof Callout> = {
    title: "Core/Callout",
    component: Callout,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        children: "This is a callout with some informational content.",
        intent: undefined,
        icon: undefined,
        title: undefined,
        compact: false,
        minimal: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: [...Object.values(Intent)],
        },
        icon: {
            control: "text",
        },
        compact: {
            control: "boolean",
        },
        minimal: {
            control: "boolean",
        },
        title: {
            control: "text",
        },
    },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic callout with default styling.
 */
export const Default: Story = {
    args: {
        children: "This is a callout with some informational content.",
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the callout.
 * When an intent is set, a default icon is also rendered.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={2}>
            {Object.values(Intent).map(intent => (
                <Callout key={intent} {...args} intent={intent}>
                    {intent.charAt(0).toUpperCase() + intent.slice(1)} intent callout.
                </Callout>
            ))}
        </Flex>
    ),
};

/**
 * Use the `minimal` prop to render a callout without a background color fill.
 */
export const VariantExample: Story = {
    name: "Variant",
    argTypes: {
        minimal: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Default" />
                <Callout {...args} minimal={false}>
                    Default callout with background fill.
                </Callout>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Minimal" />
                <Callout {...args} minimal={true}>
                    Minimal callout without background fill.
                </Callout>
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `compact` prop to reduce the visual padding around callout content.
 */
export const CompactExample: Story = {
    name: "Compact",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Default" />
                <Callout {...args} compact={false}>
                    Default padding callout.
                </Callout>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Compact" />
                <Callout {...args} compact={true}>
                    Compact padding callout.
                </Callout>
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `icon` prop to render an icon on the left side. If omitted, the intent prop determines a default icon.
 * Set `icon={null}` to explicitly hide the icon.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        icon: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={2}>
            <Callout {...args} icon="home">
                Custom icon callout.
            </Callout>
            <Callout {...args} intent="primary">
                Intent-driven default icon.
            </Callout>
            <Callout {...args} intent="primary" icon={null}>
                Intent with icon explicitly hidden.
            </Callout>
        </Flex>
    ),
};

/**
 * All intents across default and minimal variants.
 */
export const AllIntentsAllVariants: Story = {
    argTypes: {
        intent: { table: { disable: true } },
        minimal: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            {[false, true].map(minimal => (
                <Flex key={String(minimal)} flexDirection="column" gap={2}>
                    <StoryLabel title={minimal ? "Minimal" : "Default"} />
                    <Callout {...args} minimal={minimal}>
                        No intent callout.
                    </Callout>
                    {Object.values(Intent).map(intent => (
                        <Callout key={intent} {...args} minimal={minimal} intent={intent} title={intent}>
                            {intent.charAt(0).toUpperCase() + intent.slice(1)} intent callout content.
                        </Callout>
                    ))}
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        children: "Adjust the controls to customize this callout.",
        intent: "primary",
        title: "Playground Callout",
        icon: undefined,
        compact: false,
        minimal: false,
    },
};
