/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Intent, Position, Size } from "../../common";

import { NumericInput } from "./numericInput";

// These props are deprecated on NumericInput — hide them from the Storybook controls panel.
const disabledArgs = ["large", "small"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof NumericInput>
>;

const meta: Meta<typeof NumericInput> = {
    title: "Core/Form/NumericInput",
    component: NumericInput,
    decorators: [
        Story => (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    width: "100%",
                    minWidth: "400px",
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
        intent: "none",
        size: "medium",
        placeholder: "Enter a number...",
        disabled: false,
        readOnly: false,
        fill: false,
        min: 0,
        max: 100,
        stepSize: 1,
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
        min: {
            control: "number",
        },
        max: {
            control: "number",
        },
        stepSize: {
            control: "number",
        },
        buttonPosition: {
            control: "select",
            options: [Position.LEFT, Position.RIGHT, "none"],
        },
        leftIcon: {
            control: "text",
        },
        onValueChange: { action: "valueChanged" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = {
                    table: {
                        disable: true,
                    },
                };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof NumericInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic numeric input with default styling and increment/decrement buttons.
 */
export const Default: Story = {
    args: {
        placeholder: "Enter a number...",
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the input.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
        placeholder: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <NumericInput
                        key={intent}
                        {...args}
                        intent={intent}
                        placeholder={`${intent.charAt(0).toUpperCase() + intent.slice(1)} intent...`}
                    />
                ))}
        </div>
    ),
};

/**
 * Use the `size` prop to adjust the input dimensions.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
        placeholder: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            {Object.values(Size).map(size => (
                <NumericInput
                    key={size}
                    {...args}
                    size={size}
                    placeholder={`${size.charAt(0).toUpperCase() + size.slice(1)} size...`}
                />
            ))}
        </div>
    ),
};

/**
 * NumericInput supports `disabled` and `readOnly` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        readOnly: { table: { disable: true } },
        placeholder: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <NumericInput {...args} placeholder="Enabled..." />
            <NumericInput {...args} disabled={true} placeholder="Disabled..." />
            <NumericInput {...args} readOnly={true} value={42} />
        </div>
    ),
};

/**
 * Use `buttonPosition` to control the placement of increment/decrement buttons.
 */
export const ButtonPositionExample: Story = {
    name: "Button Position",
    argTypes: {
        buttonPosition: { table: { disable: true } },
        placeholder: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Right (default)</div>
            <NumericInput {...args} buttonPosition={Position.RIGHT} placeholder="Buttons right..." />
            <div style={{ fontSize: 12, opacity: 0.6 }}>Left</div>
            <NumericInput {...args} buttonPosition={Position.LEFT} placeholder="Buttons left..." />
            <div style={{ fontSize: 12, opacity: 0.6 }}>None</div>
            <NumericInput {...args} buttonPosition="none" placeholder="No buttons..." />
        </div>
    ),
};

/**
 * Use `leftIcon` to add an icon to the left side of the input.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        leftIcon: { table: { disable: true } },
        placeholder: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <NumericInput {...args} leftIcon="dollar" placeholder="Price..." />
            <NumericInput {...args} leftIcon="percentage" placeholder="Percentage..." min={0} max={100} />
        </div>
    ),
};

/**
 * Use the `fill` prop to make the input expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
        placeholder: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <NumericInput {...args} fill={true} placeholder="Full width..." />
            <NumericInput {...args} fill={false} placeholder="Auto width..." />
        </div>
    ),
};

/**
 * All intents shown together for visual comparison.
 */
export const AllIntents: Story = {
    argTypes: {
        intent: { table: { disable: true } },
        placeholder: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.values(Intent).map(intent => (
                <NumericInput
                    key={intent}
                    {...args}
                    intent={intent}
                    placeholder={`${intent === "none" ? "None" : intent.charAt(0).toUpperCase() + intent.slice(1)} intent...`}
                />
            ))}
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [value, setValue] = useState<string>("0");

        const handleValueChange = useCallback(
            (_valueAsNumber: number, valueAsString: string) => {
                setValue(valueAsString);
                args.onValueChange?.(_valueAsNumber, valueAsString, null);
            },
            [args],
        );

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: "400px" }}>
                <NumericInput
                    buttonPosition={args.buttonPosition}
                    disabled={args.disabled}
                    fill={args.fill}
                    intent={args.intent}
                    leftIcon={args.leftIcon}
                    max={args.max}
                    min={args.min}
                    onValueChange={handleValueChange}
                    placeholder={args.placeholder}
                    readOnly={args.readOnly}
                    size={args.size}
                    stepSize={args.stepSize}
                    value={value}
                />
                <div style={{ fontSize: 12, opacity: 0.6 }}>Current value: {value}</div>
            </div>
        );
    },
    args: {
        leftIcon: "dollar",
        placeholder: "Enter amount...",
        min: 0,
        max: 1000,
        stepSize: 1,
    },
};
