/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { Callout } from "./callout";

const meta: Meta<typeof Callout> = {
    title: "Core/Callout",
    component: Callout,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "400px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
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
            options: [undefined, ...Object.values(Intent).filter(i => i !== "none")],
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Callout key={intent} {...args} intent={intent}>
                        {intent.charAt(0).toUpperCase() + intent.slice(1)} intent callout.
                    </Callout>
                ))}
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <Callout {...args} minimal={false}>
                    Default callout with background fill.
                </Callout>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Minimal</span>
                <Callout {...args} minimal={true}>
                    Minimal callout without background fill.
                </Callout>
            </div>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <Callout {...args} compact={false}>
                    Default padding callout.
                </Callout>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Compact</span>
                <Callout {...args} compact={true}>
                    Compact padding callout.
                </Callout>
            </div>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Callout {...args} icon="home">
                Custom icon callout.
            </Callout>
            <Callout {...args} intent="primary">
                Intent-driven default icon.
            </Callout>
            <Callout {...args} intent="primary" icon={null}>
                Intent with icon explicitly hidden.
            </Callout>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[false, true].map(minimal => (
                <div key={String(minimal)} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{minimal ? "Minimal" : "Default"}</div>
                    <Callout {...args} minimal={minimal}>
                        No intent callout.
                    </Callout>
                    {Object.values(Intent)
                        .filter(i => i !== "none")
                        .map(intent => (
                            <Callout key={intent} {...args} minimal={minimal} intent={intent} title={intent}>
                                {intent.charAt(0).toUpperCase() + intent.slice(1)} intent callout content.
                            </Callout>
                        ))}
                </div>
            ))}
        </div>
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
