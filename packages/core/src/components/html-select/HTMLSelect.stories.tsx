/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { HTMLSelect, type HTMLSelectIconName } from "./htmlSelect";

const SAMPLE_OPTIONS = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
    { label: "Option 4", value: "4" },
    { label: "Option 5", value: "5" },
];

const meta: Meta<typeof HTMLSelect> = {
    title: "Core/Form/HTMLSelect",
    component: HTMLSelect,
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        options: SAMPLE_OPTIONS,
        fill: false,
        large: false,
        minimal: false,
        disabled: false,
        iconName: "double-caret-vertical",
    },
    argTypes: {
        fill: {
            control: "boolean",
        },
        large: {
            control: "boolean",
        },
        minimal: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        iconName: {
            control: "select",
            options: ["double-caret-vertical", "caret-down"] satisfies HTMLSelectIconName[],
        },
        onChange: { action: "changed" },
    },
} satisfies Meta<typeof HTMLSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic HTML select with default styling.
 */
export const Default: Story = {};

/**
 * Use the `large` prop to render a larger select element.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        large: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="default" />
                <HTMLSelect {...args} large={false} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="large" />
                <HTMLSelect {...args} large={true} />
            </div>
        </div>
    ),
};

/**
 * Use the `disabled` prop to make the select non-interactive.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="enabled" />
                <HTMLSelect {...args} disabled={false} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="disabled" />
                <HTMLSelect {...args} disabled={true} />
            </div>
        </div>
    ),
};

/**
 * Use the `fill` prop to make the select expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
                <StoryLabel title="fill={true}" />
                <HTMLSelect {...args} fill={true} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="fill={false}" />
                <HTMLSelect {...args} fill={false} />
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        options: SAMPLE_OPTIONS,
        fill: false,
        large: false,
        minimal: false,
        disabled: false,
    },
};
