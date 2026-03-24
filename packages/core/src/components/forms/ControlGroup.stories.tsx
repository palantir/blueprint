/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/buttons";
import { InputGroup } from "./inputGroup";

import { ControlGroup } from "./controlGroup";

const meta: Meta<typeof ControlGroup> = {
    title: "Core/ControlGroup",
    component: ControlGroup,
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
        fill: false,
        vertical: false,
    },
    argTypes: {
        fill: {
            control: "boolean",
        },
        vertical: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof ControlGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic control group with default styling containing an input and a button.
 */
export const Default: Story = {
    render: args => (
        <ControlGroup {...args}>
            <InputGroup placeholder="Enter text..." />
            <Button text="Submit" />
        </ControlGroup>
    ),
};

/**
 * Use the `vertical` prop to stack controls vertically instead of horizontally.
 */
export const Vertical: Story = {
    args: {
        vertical: true,
    },
    render: args => (
        <ControlGroup {...args}>
            <InputGroup placeholder="First input" />
            <InputGroup placeholder="Second input" />
            <Button text="Submit" />
        </ControlGroup>
    ),
};

/**
 * Use the `fill` prop to make the control group expand to the full width of its container.
 */
export const Fill: Story = {
    args: {
        fill: true,
    },
    decorators: [
        Story => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <ControlGroup {...args}>
            <InputGroup placeholder="Full width input" />
            <Button text="Submit" />
        </ControlGroup>
    ),
};

/**
 * A control group with multiple controls showing a combination of buttons and inputs.
 */
export const WithMultipleControls: Story = {
    render: args => (
        <ControlGroup {...args}>
            <Button text="Action" icon="search" />
            <InputGroup placeholder="Search..." />
            <Button text="Go" intent="primary" />
            <Button icon="arrow-right" />
        </ControlGroup>
    ),
};
