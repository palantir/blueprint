/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common/intent";
import { CompoundTag } from "./compoundTag";

const meta = {
    title: "Core/CompoundTag",
    component: CompoundTag,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        leftContent: "Key",
        children: "Value",
        intent: undefined,
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
} satisfies Meta<typeof CompoundTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Key-value compound tag.
 */
export const Default: Story = {};

/**
 * With remove handler.
 */
export const Removable: Story = {
    args: {
        leftContent: "Status",
        children: "Active",
        onRemove: () => {},
    },
};

/**
 * With icon on left content side.
 */
export const WithIcon: Story = {
    args: {
        leftContent: "Type",
        children: "Document",
        icon: "document",
    },
};

/**
 * Intent variants.
 */
export const Intents: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <CompoundTag leftContent="Default" children="Value" />
            <CompoundTag leftContent="Primary" children="Value" intent={Intent.PRIMARY} />
            <CompoundTag leftContent="Success" children="Value" intent={Intent.SUCCESS} />
            <CompoundTag leftContent="Warning" children="Value" intent={Intent.WARNING} />
            <CompoundTag leftContent="Danger" children="Value" intent={Intent.DANGER} />
        </div>
    ),
};

/**
 * Minimal style.
 */
export const Minimal: Story = {
    args: {
        leftContent: "Minimal",
        children: "Outlined",
        minimal: true,
        intent: Intent.PRIMARY,
    },
};
