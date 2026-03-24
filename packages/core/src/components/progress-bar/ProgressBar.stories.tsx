/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { ProgressBar } from "./progressBar";

const meta: Meta<typeof ProgressBar> = {
    title: "Core/Progress/ProgressBar",
    component: ProgressBar,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "400px", width: "100%" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        intent: "none",
        animate: true,
        stripes: true,
        value: undefined,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        animate: {
            control: "boolean",
        },
        stripes: {
            control: "boolean",
        },
        value: {
            control: { type: "range", min: 0, max: 1, step: 0.05 },
        },
    },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic indeterminate progress bar with default styling.
 */
export const Default: Story = {};

/**
 * Use the `intent` prop to apply a semantic color to the progress bar.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <div key={intent} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: 12, opacity: 0.6, textTransform: "capitalize" }}>{intent}</span>
                        <ProgressBar {...args} intent={intent} value={0.6} />
                    </div>
                ))}
        </div>
    ),
};

/**
 * Use the `value` prop to show determinate progress. Omit it for an indeterminate bar that fills entirely.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        value: { table: { disable: true } },
        animate: { table: { disable: true } },
        stripes: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Indeterminate</span>
                <ProgressBar {...args} value={undefined} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>0%</span>
                <ProgressBar {...args} value={0} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>50%</span>
                <ProgressBar {...args} value={0.5} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>100%</span>
                <ProgressBar {...args} value={1} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>No stripes</span>
                <ProgressBar {...args} value={0.6} stripes={false} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>No animation</span>
                <ProgressBar {...args} value={0.6} animate={false} />
            </div>
        </div>
    ),
};

/**
 * All intents showing determinate progress at various levels.
 */
export const AllIntents: Story = {
    name: "All Intents",
    argTypes: {
        intent: { table: { disable: true } },
        value: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Default (no intent)</div>
                <ProgressBar {...args} intent="none" value={0.4} />
            </div>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <div key={intent} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontSize: 12, opacity: 0.6, textTransform: "capitalize" }}>{intent}</div>
                        <ProgressBar {...args} intent={intent} value={0.6} />
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
        intent: "primary",
        value: 0.65,
        animate: true,
        stripes: true,
    },
};
