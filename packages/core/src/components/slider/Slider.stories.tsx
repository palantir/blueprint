/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Intent } from "../../common/intent";
import { Slider } from "./slider";

const meta = {
    title: "Core/Slider",
    component: Slider,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        min: 0,
        max: 100,
        stepSize: 1,
        value: 50,
        initialValue: 0,
        intent: Intent.PRIMARY,
    },
    argTypes: {
        intent: {
            control: "select",
            options: [Intent.PRIMARY, Intent.SUCCESS, Intent.WARNING, Intent.DANGER],
        },
    },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controlled slider.
 */
export const Default: Story = {
    render: function SliderDefault() {
        const [value, setValue] = useState(50);
        return (
            <div style={{ width: 300 }}>
                <Slider min={0} max={100} value={value} onChange={setValue} />
                <div style={{ marginTop: 8, fontSize: 12 }}>Value: {value}</div>
            </div>
        );
    },
};

/**
 * With initial value (range fill from initial to value).
 */
export const WithInitialValue: Story = {
    render: function SliderWithInitial() {
        const [value, setValue] = useState(75);
        return (
            <div style={{ width: 300 }}>
                <Slider min={0} max={100} initialValue={25} value={value} onChange={setValue} />
            </div>
        );
    },
};

/**
 * With step size.
 */
export const WithStepSize: Story = {
    render: function SliderWithStep() {
        const [value, setValue] = useState(2);
        return (
            <div style={{ width: 300 }}>
                <Slider min={0} max={10} stepSize={1} value={value} onChange={setValue} />
                <div style={{ marginTop: 8, fontSize: 12 }}>Value: {value}</div>
            </div>
        );
    },
};

/**
 * Intent variants.
 */
export const AllIntents: Story = {
    render: function SliderIntents() {
        const [v1, setV1] = useState(60);
        const [v2, setV2] = useState(70);
        const [v3, setV3] = useState(40);
        const [v4, setV4] = useState(30);
        return (
            <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 16 }}>
                <Slider min={0} max={100} value={v1} onChange={setV1} intent={Intent.PRIMARY} />
                <Slider min={0} max={100} value={v2} onChange={setV2} intent={Intent.SUCCESS} />
                <Slider min={0} max={100} value={v3} onChange={setV3} intent={Intent.WARNING} />
                <Slider min={0} max={100} value={v4} onChange={setV4} intent={Intent.DANGER} />
            </div>
        );
    },
};
