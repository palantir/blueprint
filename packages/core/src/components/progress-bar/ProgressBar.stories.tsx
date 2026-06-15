/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";

import { ProgressBar } from "./progressBar";

const meta: Meta<typeof ProgressBar> = {
    title: "Core/ProgressBar",
    component: ProgressBar,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        animate: true,
        intent: Intent.NONE,
        stripes: true,
        value: undefined,
    },
    argTypes: {
        animate: {
            control: "boolean",
        },
        intent: {
            control: "select",
            options: Object.values(Intent),
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
        value: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4} style={{ width: "100%" }}>
            {Object.values(Intent).map(intent => (
                <Flex key={intent} flexDirection="column" gap={1}>
                    <StoryLabel title={intent} />
                    <ProgressBar {...args} intent={intent} value={0.6} />
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * Use the `value` prop to show determinate progress. Omit it for an indeterminate bar that fills entirely.
 * Toggle `animate` and `stripes` to control visual feedback.
 */
export const ValueExample: Story = {
    name: "Value",
    argTypes: {
        animate: { table: { disable: true } },
        stripes: { table: { disable: true } },
        value: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4} style={{ width: "100%" }}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Indeterminate" />
                <ProgressBar {...args} value={undefined} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="0%" />
                <ProgressBar {...args} value={0} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="50%" />
                <ProgressBar {...args} value={0.5} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="100%" />
                <ProgressBar {...args} value={1} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="No stripes" />
                <ProgressBar {...args} stripes={false} value={0.6} />
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="No animation" />
                <ProgressBar {...args} animate={false} value={0.6} />
            </Flex>
        </Flex>
    ),
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        animate: true,
        intent: Intent.PRIMARY,
        stripes: true,
        value: 0.65,
    },
};
