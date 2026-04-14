/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryLabel } from "@storybook-common";
import { Intent } from "../../common";

import { Link } from "./link";

const meta: Meta<typeof Link> = {
    title: "Core/Link",
    component: Link,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        children: "Blueprint Link",
        href: "#",
        underline: "always",
        color: Intent.PRIMARY,
    },
    argTypes: {
        underline: {
            control: "select",
            options: ["always", "hover", "none"],
        },
        color: {
            control: "select",
            options: [...Object.values(Intent), "inherit"],
        },
        href: {
            control: "text",
        },
        onClick: { action: "clicked" },
    },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic link with default styling.
 */
export const Default: Story = {
    args: {
        children: "Blueprint Link",
    },
};

/**
 * Use the `color` prop to apply intent-based colors to the link.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        color: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            {Object.values(Intent).map(intent => (
                <Link key={intent} {...args} color={intent}>
                    {intent.charAt(0).toUpperCase() + intent.slice(1)}
                </Link>
            ))}
        </div>
    ),
};

/**
 * Use the `underline` prop to control when the link underline appears.
 */
export const UnderlineExample: Story = {
    name: "Underline",
    argTypes: {
        underline: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            {(["always", "hover", "none"] as const).map(underline => (
                <div key={underline} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <StoryLabel title={underline} />
                    <Link {...args} underline={underline}>
                        Link
                    </Link>
                </div>
            ))}
        </div>
    ),
};

/**
 * All intent colors across all underline styles.
 */
export const AllIntentsAllUnderlines: Story = {
    name: "All Intents / All Underlines",
    argTypes: {
        color: { table: { disable: true } },
        underline: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(["always", "hover", "none"] as const).map(underline => (
                <div key={underline} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <StoryLabel title={underline} />
                    <div style={{ display: "flex", gap: 16 }}>
                        {Object.values(Intent).map(intent => (
                            <Link key={intent} {...args} color={intent} underline={underline}>
                                {intent.charAt(0).toUpperCase() + intent.slice(1)}
                            </Link>
                        ))}
                        <Link {...args} color="inherit" underline={underline}>
                            Inherit
                        </Link>
                    </div>
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
        children: "Click this link",
        href: "#",
    },
};
