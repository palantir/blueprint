/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { type ChangeEvent, useCallback, useState } from "react";
import { expect, within } from "storybook/test";

import { Flex } from "@blueprintjs/labs";

import { Classes, Intent, Size } from "../../common";
import { Button } from "../button/buttons";
import { H5 } from "../html/html";
import { Tag } from "../tag/tag";

import { InputGroup } from "./inputGroup";

const meta: Meta<typeof InputGroup> = {
    title: "Core/Form/Inputs/InputGroup",
    component: InputGroup,
    decorators: [storybookLayoutDecorator],
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
 * An input in the focused state, showing the focus ring. Use controls to change the intent.
 */
export const FocusedExample: Story = {
    name: "Focused",
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByPlaceholderText("Click to focus...");
        await userEvent.click(input);
    },
    render: args => <InputGroup {...args} placeholder="Click to focus..." />,
};

const inputVisualProperties = ["backgroundColor", "color", "boxShadow", "borderRadius", "fontSize", "height"] as const;

const getInputVisualStyle = (input: HTMLElement) => {
    const style = getComputedStyle(input);
    const placeholderStyle = getComputedStyle(input, "::placeholder");
    return [...inputVisualProperties.map(property => style[property]), placeholderStyle.color];
};

const inputCompatibilityStates = [
    { label: "Rest", inputProps: {} },
    { label: "Focused", inputProps: { inputClassName: Classes.ACTIVE } },
    { label: "Readonly", inputProps: { defaultValue: "Readonly value", readOnly: true } },
    { label: "Disabled", inputProps: { disabled: true } },
] as const;

const renderInputTokenComparison = ({ id, label, className }: { id: string; label: string; className: string }) => (
    <section aria-labelledby={id} className={className}>
        <H5 id={id}>{label}</H5>
        <Flex flexDirection="column" gap={3}>
            {inputCompatibilityStates.map(({ label: stateLabel, inputProps }) => (
                <Flex key={stateLabel} flexDirection="column" gap={1}>
                    <StoryLabel title={stateLabel} />
                    {Object.values(Intent).map(intent => {
                        const accessibleLabel = `${intent} ${stateLabel.toLowerCase()} input`;
                        return (
                            <InputGroup
                                key={intent}
                                {...inputProps}
                                aria-label={accessibleLabel}
                                intent={intent}
                                leftIcon="edit"
                                placeholder={accessibleLabel}
                            />
                        );
                    })}
                </Flex>
            ))}
        </Flex>
    </section>
);

/** Proves that BP6-compatible input tokens preserve current pixels, then previews the original BP7 proposal. */
export const TokenCompatibility: Story = {
    name: "BP6 literals → BP6 tokens → BP7 proposal",
    parameters: {
        layout: "padded",
    },
    render: () => (
        <Flex alignItems="flex-start" gap={6}>
            {renderInputTokenComparison({
                id: "input-comparison-bp6",
                label: "BP6 literals: current component CSS",
                className: "token-compatibility-legacy",
            })}
            {renderInputTokenComparison({
                id: "input-comparison-bp7",
                label: "BP6 tokens: same values through aliases",
                className: "token-compatibility-bp6-tokens",
            })}
            {renderInputTokenComparison({
                id: "input-comparison-bp7-proposal",
                label: "BP7 proposal: original PR values",
                className: "bp-next token-compatibility-bp7-proposal",
            })}
        </Flex>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const legacyRegion = canvas.getByRole("region", { name: /BP6 literals:/ });
        const bp6TokenRegion = canvas.getByRole("region", { name: /BP6 tokens:/ });
        const proposedRegion = canvas.getByRole("region", { name: /BP7 proposal:/ });
        const legacyInputs = within(legacyRegion).getAllByRole("textbox");
        const bp6TokenInputs = within(bp6TokenRegion).getAllByRole("textbox");
        const proposedInputs = within(proposedRegion).getAllByRole("textbox");

        await expect(
            getComputedStyle(bp6TokenRegion).getPropertyValue("--bp-private-component-input-background-rest").trim(),
        ).not.toBe("");
        await expect(bp6TokenInputs).toHaveLength(legacyInputs.length);
        await expect(proposedInputs).toHaveLength(bp6TokenInputs.length);

        for (const [index, legacyInput] of legacyInputs.entries()) {
            await expect(getInputVisualStyle(bp6TokenInputs[index])).toEqual(getInputVisualStyle(legacyInput));
        }

        await expect(
            proposedInputs.some((input, index) => {
                return getInputVisualStyle(input).join("|") !== getInputVisualStyle(bp6TokenInputs[index]).join("|");
            }),
        ).toBe(true);
    },
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
