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
    title: "Core/Form/RadioGroup",
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

export const Default: Story = {
    render: function Render(args) {
        const [selectedValue, setSelectedValue] = useState<string>("a");
        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedValue(e.currentTarget.value);
            args.onChange?.(e);
        }, [args]);
        return <RadioGroup {...args} selectedValue={selectedValue} onChange={handleChange} />;
    },
};

export const State: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: function Render(args) {
        const [value1, setValue1] = useState<string>("a");
        const [value2, setValue2] = useState<string>("a");
        const handleChange1 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setValue1(e.currentTarget.value);
        }, []);
        const handleChange2 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setValue2(e.currentTarget.value);
        }, []);
        return (
            <div style={{ display: "flex", gap: 32 }}>
                <RadioGroup
                    {...args}
                    label="Enabled"
                    selectedValue={value1}
                    onChange={handleChange1}
                />
                <RadioGroup
                    {...args}
                    label="Disabled"
                    disabled={true}
                    selectedValue={value2}
                    onChange={handleChange2}
                />
            </div>
        );
    },
};

export const Inline: Story = {
    name: "Inline",
    argTypes: {
        inline: { table: { disable: true } },
    },
    render: function Render(args) {
        const [selectedValue, setSelectedValue] = useState<string>("a");
        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedValue(e.currentTarget.value);
        }, []);
        return (
            <RadioGroup
                {...args}
                inline={true}
                selectedValue={selectedValue}
                onChange={handleChange}
            />
        );
    },
};

export const WithLabel: Story = {
    name: "With Label",
    render: function Render(args) {
        const [selectedValue, setSelectedValue] = useState<string>("a");
        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedValue(e.currentTarget.value);
        }, []);
        return (
            <RadioGroup
                {...args}
                label="Select your preference"
                selectedValue={selectedValue}
                onChange={handleChange}
            />
        );
    },
};

export const ManyOptions: Story = {
    name: "Many Options",
    render: function Render(args) {
        const [selectedValue, setSelectedValue] = useState<string>("1");
        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedValue(e.currentTarget.value);
        }, []);
        const manyOptions = [
            { label: "Small", value: "1" },
            { label: "Medium", value: "2" },
            { label: "Large", value: "3" },
            { label: "X-Large", value: "4" },
            { label: "XX-Large", value: "5" },
        ];
        return (
            <RadioGroup
                {...args}
                label="Select size"
                options={manyOptions}
                selectedValue={selectedValue}
                onChange={handleChange}
            />
        );
    },
};

export const Playground: Story = {
    render: function Render(args) {
        const [selectedValue, setSelectedValue] = useState<string>("a");
        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedValue(e.currentTarget.value);
            args.onChange?.(e);
        }, [args]);
        return <RadioGroup {...args} selectedValue={selectedValue} onChange={handleChange} />;
    },
};
