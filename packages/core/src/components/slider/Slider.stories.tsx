/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Intent } from "../../common";

import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
    title: "Core/Slider",
    component: Slider,
    decorators: [
        Story => (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "400px",
                    padding: "40px 20px",
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
    args: {
        min: 0,
        max: 10,
        stepSize: 1,
        value: 5,
        disabled: false,
        vertical: false,
        showTrackFill: true,
        intent: "primary",
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        min: {
            control: "number",
        },
        max: {
            control: "number",
        },
        stepSize: {
            control: "number",
        },
        value: {
            control: "number",
        },
        disabled: {
            control: "boolean",
        },
        vertical: {
            control: "boolean",
        },
        showTrackFill: {
            control: "boolean",
        },
        labelRenderer: {
            control: "boolean",
        },
        onChange: { action: "changed" },
        onRelease: { action: "released" },
    },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic slider with default styling.
 */
export const Default: Story = {
    args: {
        value: 5,
    },
};

/**
 * Use the `intent` prop to apply a semantic color to the slider track fill.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
            {Object.values(Intent).map(intent => (
                <div key={intent} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, opacity: 0.6, textTransform: "capitalize" }}>{intent}</span>
                    <Slider {...args} intent={intent} value={7} />
                </div>
            ))}
        </div>
    ),
};

/**
 * Use the `disabled` and `vertical` props to control slider state and orientation.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        vertical: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <Slider {...args} disabled={false} value={5} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Disabled</span>
                <Slider {...args} disabled={true} value={5} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Vertical</span>
                <div style={{ height: "200px" }}>
                    <Slider {...args} vertical={true} value={7} />
                </div>
            </div>
        </div>
    ),
};

/**
 * Interactive playground with full state management.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [value, setValue] = useState(5);

        const handleChange = useCallback(
            (newValue: number) => {
                setValue(newValue);
                args.onChange?.(newValue);
            },
            [args],
        );

        return <Slider {...args} value={value} onChange={handleChange} />;
    },
    args: {
        value: 5,
    },
};
