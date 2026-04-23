/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";
import { type ChangeEvent, useCallback, useState } from "react";
import { useArgs } from "storybook/preview-api";

import { Flex } from "@blueprintjs/labs";

import { RadioGroup } from "./radioGroup";

const sampleOptions = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
];

const meta: Meta<typeof RadioGroup> = {
    title: "Core/Form/Controls/RadioGroup",
    component: RadioGroup,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        label: "Choose an option",
        options: sampleOptions,
        disabled: false,
        inline: false,
    },
    argTypes: {
        disabled: {
            control: "boolean",
        },
        inline: {
            control: "boolean",
        },
        onChange: { action: "changed" },
    },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic radio group with default styling.
 */
export const Default: Story = {
    render: function Render(args) {
        const [selectedValue, setSelectedValue] = useState<string>("a");
        const handleChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                setSelectedValue(e.currentTarget.value);
                args.onChange?.(e);
            },
            [args],
        );
        return <RadioGroup {...args} selectedValue={selectedValue} onChange={handleChange} />;
    },
};

/**
 * Radio groups support `disabled` and `inline` states.
 */
export const StateExample: Story = {
    name: "State",
    args: {
        selectedValue: "a",
    },
    argTypes: {
        disabled: { table: { disable: true } },
        inline: { table: { disable: true } },
    },
    render: function Render(args) {
        const [, updateArgs] = useArgs();
        const handleChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                updateArgs({ selectedValue: e.currentTarget.value });
            },
            [updateArgs],
        );
        return (
            <Flex gap={8}>
                <RadioGroup {...args} label="Enabled" onChange={handleChange} />
                <RadioGroup {...args} label="Disabled" disabled={true} onChange={handleChange} />
                <RadioGroup {...args} label="Inline" inline={true} onChange={handleChange} />
            </Flex>
        );
    },
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render({ onChange, ...args }) {
        const [selectedValue, setSelectedValue] = useState<string>("a");
        const handleChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                setSelectedValue(e.currentTarget.value);
                onChange?.(e);
            },
            [onChange],
        );
        return <RadioGroup {...args} selectedValue={selectedValue} onChange={handleChange} />;
    },
};
