/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common/intent";
import { ProgressBar } from "./progressBar";

const meta = {
    title: "Core/ProgressBar",
    component: ProgressBar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        value: 0.35,
        animate: true,
        stripes: true,
        intent: Intent.PRIMARY,
    },
    argTypes: {
        intent: {
            control: "select",
            options: [Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER, undefined],
        },
        value: {
            control: { type: "range", min: 0, max: 1, step: 0.05 },
        },
    },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Determinate progress bar at 35%.
 */
export const Default: Story = {
    decorators: [
        Story => (
            <div style={{ width: 300 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Indeterminate progress (no value).
 */
export const Indeterminate: Story = {
    args: {
        value: undefined,
    },
    decorators: [
        Story => (
            <div style={{ width: 300 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * No animation or stripes.
 */
export const NoAnimation: Story = {
    args: {
        animate: false,
        stripes: false,
    },
    decorators: [
        Story => (
            <div style={{ width: 300 }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Intent variants.
 */
export const AllIntents: Story = {
    render: () => (
        <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 12 }}>
            <ProgressBar value={0.6} intent={Intent.PRIMARY} />
            <ProgressBar value={0.8} intent={Intent.SUCCESS} />
            <ProgressBar value={0.4} intent={Intent.WARNING} />
            <ProgressBar value={0.2} intent={Intent.DANGER} />
        </div>
    ),
};
