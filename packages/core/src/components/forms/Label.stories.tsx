/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "../html/html";

import { InputGroup } from "./inputGroup";

const meta: Meta<typeof Label> = {
    title: "Core/Form/Label",
    component: Label,
    decorators: [
        Story => (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    width: "100%",
                    minWidth: "400px",
                }}
            >
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic label with text content.
 */
export const Default: Story = {
    args: {
        children: "Label text",
    },
};

/**
 * Labels are commonly used alongside input elements.
 */
export const WithInput: Story = {
    name: "With Input",
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <Label>
                Username
                <InputGroup placeholder="Enter username..." />
            </Label>
            <Label>
                Email
                <InputGroup placeholder="Enter email..." type="email" />
            </Label>
        </div>
    ),
};

/**
 * Labels support disabled styling through the `bp-disabled` class.
 */
export const StateExample: Story = {
    name: "State",
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <Label>
                Enabled label
                <InputGroup placeholder="Enabled..." />
            </Label>
            <Label className="bp5-disabled">
                Disabled label
                <InputGroup disabled={true} placeholder="Disabled..." />
            </Label>
        </div>
    ),
};

/**
 * Interactive playground.
 */
export const Playground: Story = {
    render: args => (
        <Label {...args}>
            <InputGroup placeholder="Enter value..." />
        </Label>
    ),
    args: {
        children: "Field label",
    },
};
