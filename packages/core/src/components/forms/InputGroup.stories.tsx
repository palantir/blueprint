/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ChangeEvent, useCallback, useState } from "react";

import { Flex } from "@blueprintjs/labs";

import { Intent, Size } from "../../common";
import { Button } from "../button/buttons";
import { Tag } from "../tag/tag";

import { InputGroup } from "./inputGroup";

const meta: Meta<typeof InputGroup> = {
    title: "Core/Form/Inputs/InputGroup",
    component: InputGroup,
    decorators: [
        Story => (
            <Flex flexDirection="column" gap={3} style={{ width: "100%", minWidth: "400px" }}>
                <Story />
            </Flex>
        ),
    ],
    tags: ["autodocs"],
    args: {
        intent: "none",
        size: "medium",
        placeholder: "Enter text...",
        disabled: false,
        readOnly: false,
        fill: false,
        round: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "select",
            options: Object.values(Size),
        },
        placeholder: {
            control: "text",
        },
        disabled: {
            control: "boolean",
        },
        readOnly: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        round: {
            control: "boolean",
        },
        leftIcon: {
            control: "text",
        },
        onChange: { action: "changed" },
        // deprecated props
        large: { table: { disable: true } },
        small: { table: { disable: true } },
    },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic input group with default styling.
 */
export const Default: Story = {};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the input.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            {Object.values(Intent).map(intent => (
                <InputGroup
                    key={intent}
                    {...args}
                    intent={intent}
                    placeholder={`${intent.charAt(0).toUpperCase() + intent.slice(1)} intent...`}
                />
            ))}
        </Flex>
    ),
};

/**
 * Use the `size` prop to adjust the input dimensions.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            {Object.values(Size).map(size => (
                <InputGroup
                    key={size}
                    {...args}
                    size={size}
                    placeholder={`${size.charAt(0).toUpperCase() + size.slice(1)} size...`}
                />
            ))}
        </Flex>
    ),
};

/**
 * InputGroup supports `disabled` and `readOnly` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        readOnly: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            <InputGroup {...args} placeholder="Enabled..." />
            <InputGroup {...args} disabled={true} placeholder="Disabled..." />
            <InputGroup {...args} readOnly={true} defaultValue="Read only" />
        </Flex>
    ),
};

/**
 * Use `leftIcon`, `leftElement`, and `rightElement` to add content around the input.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        leftIcon: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            <InputGroup {...args} leftIcon="search" placeholder="Search..." />
            <InputGroup {...args} leftIcon="user" placeholder="Username..." />
            <InputGroup
                {...args}
                leftIcon="lock"
                rightElement={<Button icon="eye-open" variant="minimal" size="small" />}
                placeholder="Password..."
                type="password"
            />
        </Flex>
    ),
};

/**
 * Use `leftElement`, and `rightElement` to add content around the input.
 */
export const LeftRightElementsExample: Story = {
    name: "Left & Right Elements",
    argTypes: {
        leftElement: { table: { disable: true } },
        rightElement: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            <InputGroup {...args} leftElement={<Tag interactive={true}>Left</Tag>} placeholder="Search..." />
            <InputGroup
                {...args}
                leftElement={<Tag interactive={true}>Left</Tag>}
                rightElement={<Tag interactive={true}>Right</Tag>}
                placeholder="Search..."
            />
            <InputGroup
                {...args}
                rightElement={<Tag interactive={true}>Right</Tag>}
                placeholder="With right element..."
            />
        </Flex>
    ),
};

/**
 * Use the `round` prop to render the input with rounded caps.
 */
export const RoundExample: Story = {
    name: "Round",
    argTypes: {
        round: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            <InputGroup {...args} round={false} placeholder="Default shape..." />
            <InputGroup {...args} round={true} placeholder="Round shape..." />
            <InputGroup {...args} round={true} leftIcon="search" placeholder="Round with icon..." />
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the input expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
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
        <Flex flexDirection="column" gap={2} alignItems="start">
            <InputGroup {...args} fill={true} placeholder="Full Width" />
            <InputGroup {...args} fill={false} placeholder="Auto Width" />
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [value, setValue] = useState("");

        const handleChange = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value);
                args.onChange?.(e);
            },
            [args],
        );

        const handleClear = useCallback(() => setValue(""), []);

        return (
            <Flex flexDirection="column" gap={3} style={{ minWidth: "400px" }}>
                <InputGroup
                    disabled={args.disabled}
                    fill={args.fill}
                    intent={args.intent}
                    leftIcon={args.leftIcon}
                    onChange={handleChange}
                    placeholder={args.placeholder}
                    readOnly={args.readOnly}
                    rightElement={
                        value.length > 0 ? (
                            <Button icon="cross" variant="minimal" size="small" onClick={handleClear} />
                        ) : undefined
                    }
                    round={args.round}
                    size={args.size}
                    value={value}
                />
            </Flex>
        );
    },
    args: {
        leftIcon: "search",
        placeholder: "Type to search...",
    },
};
