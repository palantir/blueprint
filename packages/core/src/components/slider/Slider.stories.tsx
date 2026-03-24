/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Intent } from "../../common";

import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
    title: "Core/Slider/Slider",
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
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <div key={intent} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ fontSize: 12, opacity: 0.6, textTransform: "capitalize" }}>{intent}</span>
                        <Slider {...args} intent={intent} value={7} />
                    </div>
                ))}
        </div>
    ),
};

/**
 * Use the `disabled` prop to render a non-interactive slider.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
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
        </div>
    ),
};

/**
 * Use the `vertical` prop to render the slider vertically.
 */
export const VerticalExample: Story = {
    name: "Vertical",
    argTypes: {
        vertical: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", height: "200px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <div style={{ display: "flex", gap: 40 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Slider key={intent} {...args} vertical={true} intent={intent} value={7} />
                ))}
        </div>
    ),
};

/**
 * Use the `showTrackFill` prop to control whether the filled portion of the track is visible.
 */
export const TrackFillExample: Story = {
    name: "Track Fill",
    argTypes: {
        showTrackFill: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>With track fill</span>
                <Slider {...args} showTrackFill={true} value={5} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Without track fill</span>
                <Slider {...args} showTrackFill={false} value={5} />
            </div>
        </div>
    ),
};

/**
 * Use the `labelRenderer` prop to customize or hide labels.
 */
export const LabelsExample: Story = {
    name: "Labels",
    argTypes: {
        labelRenderer: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>With labels</span>
                <Slider {...args} labelRenderer={true} value={5} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Without labels</span>
                <Slider {...args} labelRenderer={false} value={5} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Custom label renderer (percentage)</span>
                <Slider {...args} labelRenderer={v => `${v * 10}%`} value={5} />
            </div>
        </div>
    ),
};

/**
 * All intents shown together for visual comparison.
 */
export const AllIntents: Story = {
    name: "All Intents",
    argTypes: {
        intent: { table: { disable: true } },
        disabled: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Default</div>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Slider key={intent} {...args} intent={intent} value={7} />
                ))}
            <div style={{ fontSize: 12, opacity: 0.6 }}>Disabled</div>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Slider key={`disabled-${intent}`} {...args} intent={intent} value={7} disabled={true} />
                ))}
        </div>
    ),
};

/**
 * Interactive playground with full state management.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [value, setValue] = useState(5);

        const handleChange = useCallback((newValue: number) => {
            setValue(newValue);
            args.onChange?.(newValue);
        }, [args]);

        return <Slider {...args} value={value} onChange={handleChange} />;
    },
    args: {
        value: 5,
    },
};
