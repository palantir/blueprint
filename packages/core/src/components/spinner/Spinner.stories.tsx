/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { Spinner, SpinnerSize } from "./spinner";
import { StoryLabel } from "../storybook-components/StoryLabel";

const meta: Meta<typeof Spinner> = {
    title: "Core/Spinner",
    component: Spinner,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "300px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        intent: Intent.NONE,
        size: SpinnerSize.STANDARD,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "number",
        },
        value: {
            control: { type: "range", min: 0, max: 1, step: 0.05 },
        },
        tagName: {
            control: "text",
        },
    },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic spinner with default styling (indeterminate).
 */
export const Default: Story = {};

/**
 * Use the `intent` prop to apply a semantic color to the spinner.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {Object.values(Intent).map(intent => (
                <div key={intent} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <Spinner {...args} intent={intent} size={SpinnerSize.STANDARD} />
                    <StoryLabel title={intent} capitalize />
                </div>
            ))}
        </div>
    ),
};

/**
 * Use the `size` prop to control the spinner dimensions. Common sizes are available as `SpinnerSize` constants.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <Spinner {...args} size={SpinnerSize.SMALL} />
                <StoryLabel title="Small (20px)" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <Spinner {...args} size={SpinnerSize.STANDARD} />
                <StoryLabel title="Standard (50px)" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <Spinner {...args} size={SpinnerSize.LARGE} />
                <StoryLabel title="Large (100px)" />
            </div>
        </div>
    ),
};

/**
 * Use the `value` prop to show determinate progress. Omit it for an indeterminate spinner.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        value: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <Spinner {...args} value={undefined} />
                <StoryLabel title="Indeterminate" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <Spinner {...args} value={0} />
                <StoryLabel title="0%" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <Spinner {...args} value={0.5} />
                <StoryLabel title="50%" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <Spinner {...args} value={1} />
                <StoryLabel title="100%" />
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        intent: Intent.PRIMARY,
        size: SpinnerSize.STANDARD,
        value: 0.7,
    },
};
