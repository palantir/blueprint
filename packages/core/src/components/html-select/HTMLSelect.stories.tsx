/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { HTMLSelectIconName } from "./htmlSelect";
import { HTMLSelect } from "./htmlSelect";

const SAMPLE_OPTIONS = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
    { label: "Option 4", value: "4" },
    { label: "Option 5", value: "5" },
];

const meta: Meta<typeof HTMLSelect> = {
    title: "Core/HTMLSelect",
    component: HTMLSelect,
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
 * Use the `fill` prop to make the select expand to the full width of its container.
 */
export const Fill: Story = {
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <HTMLSelect {...args} fill={true} />
            <HTMLSelect {...args} fill={false} />
        </div>
    ),
};

/**
 * Use the `disabled` prop to make the select non-interactive.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

/**
 * Use the `large` prop to render a larger select element.
 */
export const Sizes: Story = {
    argTypes: {
        large: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <HTMLSelect {...args} large={false} />
            <HTMLSelect {...args} large={true} />
        </div>
    ),
};

/**
 * Use the `iconName` prop to change the icon displayed on the right side of the select.
 */
export const WithIcon: Story = {
    argTypes: {
        iconName: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <HTMLSelect {...args} iconName="double-caret-vertical" />
            <HTMLSelect {...args} iconName="caret-down" />
        </div>
    ),
};

/**
 * All size and style combinations displayed together.
 */
export const AllSizes: Story = {
    argTypes: {
        large: { table: { disable: true } },
        minimal: { table: { disable: true } },
        disabled: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Default</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <HTMLSelect {...args} large={false} />
                    <HTMLSelect {...args} large={true} />
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Minimal</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <HTMLSelect {...args} minimal={true} large={false} />
                    <HTMLSelect {...args} minimal={true} large={true} />
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Disabled</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <HTMLSelect {...args} disabled={true} large={false} />
                    <HTMLSelect {...args} disabled={true} large={true} />
                </div>
            </div>
        </div>
    ),
};
