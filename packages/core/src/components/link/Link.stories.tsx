/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common/intent";
import { Link } from "./link";

const meta = {
    title: "Core/Link",
    component: Link,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        href: "#",
        children: "Link text",
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
            options: [Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER, "inherit"],
        },
    },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default link with primary color and underline.
 */
export const Default: Story = {};

/**
 * Underline on hover only.
 */
export const UnderlineHover: Story = {
    args: {
        underline: "hover",
    },
};

/**
 * No underline.
 */
export const NoUnderline: Story = {
    args: {
        underline: "none",
    },
};

/**
 * Inherit text color from parent.
 */
export const InheritColor: Story = {
    args: {
        color: "inherit",
    },
    render: args => (
        <p style={{ color: "var(--text-color)" }}>
            Text with <Link {...args} /> in the middle.
        </p>
    ),
};

/**
 * Intent variants.
 */
export const AllIntents: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="#" intent={Intent.PRIMARY}>
                Primary
            </Link>
            <Link href="#" intent={Intent.SUCCESS}>
                Success
            </Link>
            <Link href="#" intent={Intent.WARNING}>
                Warning
            </Link>
            <Link href="#" intent={Intent.DANGER}>
                Danger
            </Link>
        </div>
    ),
};
