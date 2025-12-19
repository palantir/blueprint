/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common/intent";
import { Tag } from "./tag";

const meta = {
    title: "Core/Tag",
    component: Tag,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        children: "Tag",
        intent: undefined,
        interactive: false,
        minimal: false,
        round: false,
        size: "medium",
    },
    argTypes: {
        intent: {
            control: "select",
            options: [Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER, undefined],
        },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
    },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic tag.
 */
export const Default: Story = {};

/**
 * Tag with icon.
 */
export const WithIcon: Story = {
    args: {
        icon: "tag",
        children: "Labeled",
    },
};

/**
 * Removable tag (with onRemove).
 */
export const Removable: Story = {
    args: {
        children: "Removable",
        onRemove: () => {},
    },
};

/**
 * Intent variants.
 */
export const Intents: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag>Default</Tag>
            <Tag intent={Intent.PRIMARY}>Primary</Tag>
            <Tag intent={Intent.SUCCESS}>Success</Tag>
            <Tag intent={Intent.WARNING}>Warning</Tag>
            <Tag intent={Intent.DANGER}>Danger</Tag>
        </div>
    ),
};

/**
 * Minimal (outline) style.
 */
export const Minimal: Story = {
    args: {
        minimal: true,
        intent: Intent.PRIMARY,
        children: "Minimal",
    },
};

/**
 * Round tag.
 */
export const Round: Story = {
    args: {
        round: true,
        children: "Round",
    },
};

/**
 * Small and large sizes.
 */
export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Tag size="small">Small</Tag>
            <Tag size="medium">Medium</Tag>
            <Tag size="large">Large</Tag>
        </div>
    ),
};
