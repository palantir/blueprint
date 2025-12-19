/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common/intent";
import { Spinner, SpinnerSize } from "./spinner";

const meta = {
    title: "Core/Spinner",
    component: Spinner,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        size: SpinnerSize.STANDARD,
        intent: Intent.PRIMARY,
    },
    argTypes: {
        intent: {
            control: "select",
            options: [Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER, undefined],
        },
        size: {
            control: "select",
            options: [SpinnerSize.SMALL, SpinnerSize.STANDARD, SpinnerSize.LARGE],
        },
    },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default indeterminate spinner.
 */
export const Default: Story = {};

/**
 * Small spinner.
 */
export const Small: Story = {
    args: {
        size: SpinnerSize.SMALL,
    },
};

/**
 * Large spinner.
 */
export const Large: Story = {
    args: {
        size: SpinnerSize.LARGE,
    },
};

/**
 * Determinate spinner (value 0–1).
 */
export const Determinate: Story = {
    args: {
        value: 0.65,
    },
};

/**
 * Intent variants.
 */
export const AllIntents: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Spinner size={SpinnerSize.SMALL} intent={Intent.PRIMARY} />
            <Spinner size={SpinnerSize.SMALL} intent={Intent.SUCCESS} />
            <Spinner size={SpinnerSize.SMALL} intent={Intent.WARNING} />
            <Spinner size={SpinnerSize.SMALL} intent={Intent.DANGER} />
        </div>
    ),
};
