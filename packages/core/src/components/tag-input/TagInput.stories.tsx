/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";
import { useCallback, useState } from "react";

import { Home } from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";
import { Button } from "../button/buttons";

import { TagInput } from "./tagInput";

// These props are deprecated on TagInput — hide them from the Storybook controls panel.
const disabledArgs = ["large", "children"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof TagInput>
>;

const INITIAL_VALUES = ["London", "New York", "San Francisco"];

const meta: Meta<typeof TagInput> = {
    title: "Core/Form/Inputs/TagInput",
    component: TagInput,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        values: INITIAL_VALUES,
        intent: "none",
        size: "medium",
        placeholder: "Add tags...",
        leftIcon: undefined,
        fill: false,
        disabled: false,
        autoResize: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "select",
            options: ["medium", "large"],
        },
        leftIcon: {
            control: "text",
        },
        placeholder: {
            control: "text",
        },
        autoResize: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        onAdd: { action: "added" },
        onChange: { action: "changed" },
        onRemove: { action: "removed" },
        onInputChange: { action: "changed" },
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
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic tag input with default styling and pre-populated values.
 */
export const Default: Story = {
    args: {
        values: INITIAL_VALUES,
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the tag input.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
        placeholder: { table: { disable: true } },
        rightElement: { table: { disable: true } },
        separator: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            {Object.values(Intent).map(intent => (
                <TagInput
                    key={intent}
                    {...args}
                    intent={intent}
                    values={[intent.charAt(0).toUpperCase() + intent.slice(1)]}
                    placeholder={`${intent} intent...`}
                />
            ))}
        </Flex>
    ),
};

/**
 * Use the `size` prop to adjust the tag input dimensions. TagInput supports `"medium"` (default) and `"large"`.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
        placeholder: { table: { disable: true } },
        rightElement: { table: { disable: true } },
        separator: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            <TagInput {...args} size="medium" values={["Medium"]} placeholder="Medium size..." />
            <TagInput {...args} size="large" values={["Large"]} placeholder="Large size..." />
        </Flex>
    ),
};

/**
 * TagInput supports `disabled` state which prevents all interaction.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        placeholder: { table: { disable: true } },
        rightElement: { table: { disable: true } },
        separator: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            <TagInput {...args} values={["Enabled"]} placeholder="Enabled..." />
            <TagInput {...args} disabled={true} values={["Disabled"]} placeholder="Disabled..." />
        </Flex>
    ),
};

/**
 * Use the `leftIcon` prop to render an icon on the left side of the input.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        leftIcon: { table: { disable: true } },
        placeholder: { table: { disable: true } },
        rightElement: { table: { disable: true } },
        separator: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3} style={{ width: "100%" }}>
            <TagInput {...args} leftIcon="search" values={["Search"]} placeholder="With left icon..." />
            <TagInput {...args} leftIcon="tag" values={["Tags"]} placeholder="With tag icon..." />
            <TagInput {...args} leftIcon={<Home />} values={["Element icon"]} placeholder="leftIcon={<Home />}" />
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the tag input expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
        placeholder: { table: { disable: true } },
        rightElement: { table: { disable: true } },
        separator: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <Flex flexDirection="column" gap={3}>
            <TagInput {...args} fill={true} values={["Full Width"]} placeholder="Fill..." />
            <TagInput {...args} fill={false} values={["Auto Width"]} placeholder="Auto..." />
        </Flex>
    ),
};

/**
 * Use the `autoResize` prop to automatically resize the input as the user types.
 * This has no effect when `fill={true}`.
 */
export const AutoResizeExample: Story = {
    name: "Auto Resize",
    argTypes: {
        autoResize: { table: { disable: true } },
        placeholder: { table: { disable: true } },
        rightElement: { table: { disable: true } },
        separator: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3}>
            <TagInput {...args} autoResize={true} values={["Auto Resize"]} placeholder="Type to resize..." />
            <TagInput {...args} autoResize={false} values={["Fixed Width"]} placeholder="Fixed input width..." />
        </Flex>
    ),
};

/**
 * Interactive playground with fully functional add/remove and all props togglable via Storybook controls.
 */
export const Playground: Story = {
    argTypes: {
        values: {
            table: { disable: true },
        },
    },
    render: function Render(args) {
        const [values, setValues] = useState<string[]>([...INITIAL_VALUES]);

        const handleAdd = useCallback(
            (newValues: string[]) => {
                setValues(prev => [...prev, ...newValues]);
                args.onAdd?.(newValues, "default");
            },
            [args],
        );

        const handleRemove = useCallback(
            (_value: React.ReactNode, index: number) => {
                setValues(prev => prev.filter((_, i) => i !== index));
                args.onRemove?.(_value, index);
            },
            [args],
        );

        const handleClear = useCallback(() => setValues([]), []);

        const handleReset = useCallback(() => setValues([...INITIAL_VALUES]), []);

        return (
            <Flex flexDirection="column" gap={3} style={{ minWidth: "400px" }}>
                <TagInput
                    addOnBlur={args.addOnBlur}
                    addOnPaste={args.addOnPaste}
                    autoResize={args.autoResize}
                    disabled={args.disabled}
                    fill={args.fill}
                    intent={args.intent}
                    leftIcon={args.leftIcon}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                    placeholder={args.placeholder}
                    rightElement={
                        values.length > 0 ? (
                            <Button icon="cross" variant="minimal" size="small" onClick={handleClear} />
                        ) : undefined
                    }
                    size={args.size}
                    values={values}
                />
                {values.length === 0 && (
                    <Button icon="refresh" variant="outlined" size="small" text="Reset tags" onClick={handleReset} />
                )}
            </Flex>
        );
    },
    args: {
        leftIcon: "tag",
        placeholder: "Add cities...",
    },
};
