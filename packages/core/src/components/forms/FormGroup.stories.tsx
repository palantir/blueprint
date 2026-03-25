/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { FormGroup } from "./formGroup";
import { InputGroup } from "./inputGroup";

const meta: Meta<typeof FormGroup> = {
    title: "Core/Form/FormGroup",
    component: FormGroup,
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
        label: "Label",
        helperText: undefined,
        labelInfo: undefined,
        subLabel: undefined,
        intent: "none",
        disabled: false,
        fill: false,
        inline: false,
    },
    argTypes: {
        label: {
            control: "text",
        },
        helperText: {
            control: "text",
        },
        labelInfo: {
            control: "text",
        },
        subLabel: {
            control: "text",
        },
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        disabled: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        inline: {
            control: "boolean",
        },
    },
} satisfies Meta<typeof FormGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic form group with a label and input.
 */
export const Default: Story = {
    args: {
        label: "Label",
    },
    render: args => (
        <FormGroup {...args}>
            <InputGroup placeholder="Enter value..." />
        </FormGroup>
    ),
};

/**
 * Use the `intent` prop to apply a semantic color to the helper text and sub label.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <FormGroup
                        key={intent}
                        {...args}
                        intent={intent}
                        label={intent.charAt(0).toUpperCase() + intent.slice(1)}
                        helperText={`This is ${intent} helper text`}
                    >
                        <InputGroup intent={intent} placeholder={`${intent} input...`} />
                    </FormGroup>
                ))}
        </div>
    ),
};

/**
 * FormGroup supports `disabled` state which visually dims the label and helper text.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <FormGroup {...args} label="Enabled" helperText="This field is enabled">
                <InputGroup placeholder="Enabled input..." />
            </FormGroup>
            <FormGroup {...args} disabled={true} label="Disabled" helperText="This field is disabled">
                <InputGroup disabled={true} placeholder="Disabled input..." />
            </FormGroup>
        </div>
    ),
};

/**
 * Use `helperText`, `labelInfo`, and `subLabel` to add additional context to the form group.
 */
export const LabelsExample: Story = {
    name: "Labels & Helper Text",
    argTypes: {
        helperText: { table: { disable: true } },
        labelInfo: { table: { disable: true } },
        subLabel: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <FormGroup {...args} label="Basic label">
                <InputGroup placeholder="Basic..." />
            </FormGroup>
            <FormGroup {...args} label="With helper text" helperText="This is a helpful description">
                <InputGroup placeholder="With helper..." />
            </FormGroup>
            <FormGroup {...args} label="With label info" labelInfo="(required)">
                <InputGroup placeholder="Required field..." />
            </FormGroup>
            <FormGroup {...args} label="With sub label" subLabel="Additional context below the label">
                <InputGroup placeholder="With sub label..." />
            </FormGroup>
            <FormGroup
                {...args}
                label="All label options"
                labelInfo="(optional)"
                subLabel="More details about this field"
                helperText="This helper text provides further guidance"
            >
                <InputGroup placeholder="Full example..." />
            </FormGroup>
        </div>
    ),
};

/**
 * Use the `inline` prop to render the label and input on a single line.
 */
export const InlineExample: Story = {
    name: "Inline",
    argTypes: {
        inline: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <FormGroup {...args} inline={false} label="Stacked (default)" helperText="Label above input">
                <InputGroup placeholder="Stacked layout..." />
            </FormGroup>
            <FormGroup {...args} inline={true} label="Inline" helperText="Label beside input">
                <InputGroup placeholder="Inline layout..." />
            </FormGroup>
        </div>
    ),
};

/**
 * Use the `fill` prop to make the form group expand to the full width of its container.
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
            <FormGroup {...args} fill={true} label="Full Width">
                <InputGroup fill={true} placeholder="Full Width" />
            </FormGroup>
            <FormGroup {...args} fill={false} label="Auto Width">
                <InputGroup placeholder="Auto Width" />
            </FormGroup>
        </div>
    ),
};

/**
 * All intents with helper text for visual comparison.
 */
export const AllIntents: Story = {
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.values(Intent).map(intent => (
                <FormGroup
                    key={intent}
                    {...args}
                    intent={intent}
                    label={intent === "none" ? "None" : intent.charAt(0).toUpperCase() + intent.slice(1)}
                    helperText={`Helper text with ${intent} intent`}
                >
                    <InputGroup intent={intent} placeholder={`${intent} intent...`} />
                </FormGroup>
            ))}
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: args => (
        <FormGroup
            disabled={args.disabled}
            fill={args.fill}
            helperText={args.helperText}
            inline={args.inline}
            intent={args.intent}
            label={args.label}
            labelFor="playground-input"
            labelInfo={args.labelInfo}
            subLabel={args.subLabel}
        >
            <InputGroup
                id="playground-input"
                intent={args.intent}
                disabled={args.disabled}
                placeholder="Enter value..."
            />
        </FormGroup>
    ),
    args: {
        label: "Full Name",
        helperText: "Enter your full legal name",
        labelInfo: "(required)",
        intent: "none",
    },
};
