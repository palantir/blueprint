/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { RadioGroup } from "./radioGroup";

const sampleOptions = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
];

const meta: Meta<typeof RadioGroup> = {
    title: "Core/Form/Controls/RadioGroup",
    component: RadioGroup,
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
            (e: React.ChangeEvent<HTMLInputElement>) => {
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
    argTypes: {
        disabled: { table: { disable: true } },
        inline: { table: { disable: true } },
    },
    render: function Render(args) {
        const [value1, setValue1] = useState<string>("a");
        const [value2, setValue2] = useState<string>("a");
        const [value3, setValue3] = useState<string>("a");
        const handleChange1 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setValue1(e.currentTarget.value);
        }, []);
        const handleChange2 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setValue2(e.currentTarget.value);
        }, []);
        const handleChange3 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setValue3(e.currentTarget.value);
        }, []);
        return (
            <div style={{ display: "flex", gap: 32 }}>
                <RadioGroup {...args} label="Enabled" selectedValue={value1} onChange={handleChange1} />
                <RadioGroup
                    {...args}
                    label="Disabled"
                    disabled={true}
                    selectedValue={value2}
                    onChange={handleChange2}
                />
                <RadioGroup {...args} label="Inline" inline={true} selectedValue={value3} onChange={handleChange3} />
            </div>
        );
    },
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [selectedValue, setSelectedValue] = useState<string>("a");
        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setSelectedValue(e.currentTarget.value);
                args.onChange?.(e);
            },
            [args],
        );
        return <RadioGroup {...args} selectedValue={selectedValue} onChange={handleChange} />;
    },
};
