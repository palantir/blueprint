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

const inputVisualProperties = [
    "backgroundColor",
    "color",
    "boxShadow",
    "borderRadius",
    "fontFamily",
    "fontSize",
    "height",
] as const;

const getInputVisualStyle = (input: HTMLElement) => {
    const style = getComputedStyle(input);
    const placeholderStyle = getComputedStyle(input, "::placeholder");
    return [...inputVisualProperties.map(property => style[property]), placeholderStyle.color];
};

const inputCompatibilityStates = [
    { label: "Rest", inputProps: {} },
    { label: "Focused", inputProps: { inputClassName: Classes.ACTIVE } },
    { label: "Readonly", inputProps: { readOnly: true } },
    { label: "Disabled", inputProps: { disabled: true } },
] as const;

const renderInputTokenComparison = ({ id, label, className }: { id: string; label: string; className: string }) => {
    const searchInputId = `${id}-search`;
    const searchHintId = `${searchInputId}-hint`;

    return (
        <section aria-labelledby={id} className={className} style={{ flex: "0 0 300px" }}>
            <H5 id={id}>{label}</H5>
            <Flex flexDirection="column" gap={3}>
                <div className="token-compatibility-search-control">
                    <label className="token-compatibility-search-label" htmlFor={searchInputId}>
                        Search
                    </label>
                    <span className="token-compatibility-search-hint" id={searchHintId}>
                        Enter a keyword to find results
                    </span>
                    <InputGroup
                        aria-describedby={searchHintId}
                        id={searchInputId}
                        rightElement={
                            <Button
                                aria-label="Submit search"
                                icon="search"
                                size="small"
                                type="button"
                                variant="minimal"
                            />
                        }
                    />
                </div>
                {inputCompatibilityStates.map(({ label: stateLabel, inputProps }) => (
                    <Flex key={stateLabel} flexDirection="column" gap={1}>
                        <StoryLabel title={stateLabel} />
                        <InputGroup
                            {...inputProps}
                            aria-label={`${stateLabel} search input`}
                            defaultValue="Search query"
                            rightElement={
                                <Button
                                    aria-label={`Submit ${stateLabel.toLowerCase()} search`}
                                    disabled={"disabled" in inputProps && inputProps.disabled}
                                    icon="search"
                                    size="small"
                                    type="button"
                                    variant="minimal"
                                />
                            }
                        />
                    </Flex>
                ))}
            </Flex>
        </section>
    );
};

/** Compares the BP6 baseline with BP7's defaults and a complete NHS Digital form-input theme. */
export const TokenCompatibility: Story = {
    name: "BP6 baseline → BP7 defaults → NHS Digital theme",
    parameters: {
        layout: "padded",
    },
    render: () => (
        <Flex alignItems="flex-start" gap={6}>
            {renderInputTokenComparison({
                id: "input-comparison-bp6",
                label: "BP6 baseline",
                className: "token-compatibility-baseline",
            })}
            {renderInputTokenComparison({
                id: "input-comparison-bp7",
                label: "BP7 defaults: new palette",
                className: "bp-next token-compatibility-bp7-defaults",
            })}
            {renderInputTokenComparison({
                id: "input-comparison-nhsd-theme",
                label: "NHS Digital theme",
                className: "bp-next token-compatibility-nhsd-theme token-compatibility-nhsd-input-overrides",
            })}
        </Flex>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const baselineRegion = canvas.getByRole("region", { name: "BP6 baseline" });
        const defaultRegion = canvas.getByRole("region", { name: /BP7 defaults:/ });
        const nhsdRegion = canvas.getByRole("region", { name: "NHS Digital theme" });
        const baselineInputs = within(baselineRegion).getAllByRole("textbox");
        const defaultInputs = within(defaultRegion).getAllByRole("textbox");
        const nhsdInputs = within(nhsdRegion).getAllByRole("textbox");
        const baselineSearchButtons = within(baselineRegion).getAllByRole("button", { name: /^Submit / });
        const defaultSearchButtons = within(defaultRegion).getAllByRole("button", { name: /^Submit / });
        const nhsdSearchButtons = within(nhsdRegion).getAllByRole("button", { name: /^Submit / });

        await expect(defaultInputs).toHaveLength(baselineInputs.length);
        await expect(nhsdInputs).toHaveLength(defaultInputs.length);
        await expect(baselineSearchButtons).toHaveLength(baselineInputs.length);
        await expect(defaultSearchButtons).toHaveLength(defaultInputs.length);
        await expect(nhsdSearchButtons).toHaveLength(nhsdInputs.length);

        await expect(
            defaultInputs.some((input, index) => {
                return getInputVisualStyle(input).join("|") !== getInputVisualStyle(baselineInputs[index]).join("|");
            }),
        ).toBe(true);
        await expect(
            nhsdInputs.some((input, index) => {
                return getInputVisualStyle(input).join("|") !== getInputVisualStyle(defaultInputs[index]).join("|");
            }),
        ).toBe(true);

        const nhsdRestInput = within(nhsdRegion).getByRole("textbox", { name: "Rest search input" });
        const nhsdRestStyle = getComputedStyle(nhsdRestInput);
        await expect(nhsdRestInput.getBoundingClientRect().height).toBeCloseTo(63.984, 1);
        await expect(nhsdRestStyle.backgroundColor).toBe("rgb(255, 255, 255)");
        await expect(nhsdRestStyle.borderRadius).toBe("5.994px");
        await expect(nhsdRestStyle.fontFamily).toContain("Frutiger W01");
        await expect(nhsdRestStyle.fontSize).toBe("18px");

        const nhsdSearchInput = within(nhsdRegion).getByRole("textbox", { name: "Search" });
        const nhsdSearchButton = within(nhsdRegion).getByRole("button", { name: "Submit search" });
        await expect(nhsdSearchInput.getBoundingClientRect().height).toBeCloseTo(63.984, 1);
        await expect(nhsdSearchButton).toBeVisible();

        const nhsdFocusedInput = within(nhsdRegion).getByRole("textbox", { name: "Focused search input" });
        await expect(getComputedStyle(nhsdFocusedInput).boxShadow).toContain("rgb(250, 225, 0)");

        const nhsdDisabledSearchButton = within(nhsdRegion).getByRole("button", { name: "Submit disabled search" });
        await expect(nhsdDisabledSearchButton).toBeDisabled();
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
