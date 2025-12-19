/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Alignment } from "../../common";
import { Radio } from "./controls";
import { RadioGroup } from "./radioGroup";

const meta = {
    title: "Core/Radio",
    component: Radio,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        label: "Option",
        checked: false,
        disabled: false,
        inline: false,
        alignIndicator: Alignment.START,
        size: "medium",
    },
    argTypes: {
        alignIndicator: {
            control: "select",
            options: [Alignment.START, Alignment.CENTER, Alignment.END],
        },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
    },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single radio (unchecked).
 */
export const Default: Story = {};

/**
 * Checked radio.
 */
export const Checked: Story = {
    args: {
        checked: true,
    },
};

/**
 * Disabled radio.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        label: "Disabled",
    },
};

/**
 * Radio group with multiple options.
 */
export const RadioGroupExample: Story = {
    render: function RadioGroupStory() {
        const [value, setValue] = useState("one");
        return (
            <RadioGroup label="Choose one" selectedValue={value} onChange={e => setValue(e.currentTarget.value)}>
                <Radio label="Option one" value="one" />
                <Radio label="Option two" value="two" />
                <Radio label="Option three" value="three" />
            </RadioGroup>
        );
    },
};

/**
 * Inline radio group.
 */
export const InlineGroup: Story = {
    render: function InlineRadioGroup() {
        const [value, setValue] = useState("a");
        return (
            <RadioGroup inline={true} selectedValue={value} onChange={e => setValue(e.currentTarget.value)}>
                <Radio label="A" value="a" />
                <Radio label="B" value="b" />
                <Radio label="C" value="c" />
            </RadioGroup>
        );
    },
};
