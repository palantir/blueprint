/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { EditableText } from "./editableText";

const disabledArgs = ["customInputAttributes", "elementRef", "contentId"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof EditableText>
>;

const meta: Meta<typeof EditableText> = {
    title: "Core/EditableText/EditableText",
    component: EditableText,
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
        placeholder: "Click to Edit",
        disabled: false,
        multiline: false,
        selectAllOnFocus: false,
        confirmOnEnterKey: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        disabled: {
            control: "boolean",
        },
        multiline: {
            control: "boolean",
        },
        selectAllOnFocus: {
            control: "boolean",
        },
        confirmOnEnterKey: {
            control: "boolean",
        },
        placeholder: {
            control: "text",
        },
        maxLength: {
            control: "number",
        },
        onCancel: { action: "cancelled" },
        onChange: { action: "changed" },
        onConfirm: { action: "confirmed" },
        onEdit: { action: "editing" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof EditableText>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic editable text field with default styling.
 */
export const Default: Story = {
    args: {
        placeholder: "Click to Edit",
    },
};

/**
 * Use the `intent` prop to apply semantic color to the editable text.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <EditableText
                        key={intent}
                        {...args}
                        intent={intent}
                        placeholder={intent.charAt(0).toUpperCase() + intent.slice(1)}
                    />
                ))}
        </div>
    ),
};

/**
 * EditableText supports `disabled` state where editing is prevented.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <EditableText {...args} placeholder="Click to Edit" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Disabled</span>
                <EditableText {...args} disabled={true} placeholder="Disabled" />
            </div>
        </div>
    ),
};

/**
 * Use the `multiline` prop to allow multi-line editing with a textarea.
 */
export const Multiline: Story = {
    argTypes: {
        multiline: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", minWidth: "400px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Single line</span>
                <EditableText {...args} multiline={false} placeholder="Single line" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Multiline</span>
                <EditableText {...args} multiline={true} placeholder="Multiline text" minLines={3} maxLines={6} />
            </div>
        </div>
    ),
};

/**
 * All intents with disabled state shown for visual comparison.
 */
export const AllIntents: Story = {
    name: "All Intents",
    argTypes: {
        intent: { table: { disable: true } },
        disabled: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Default</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {Object.values(Intent).map(intent => (
                        <EditableText
                            key={intent}
                            {...args}
                            intent={intent}
                            placeholder={intent === "none" ? "None" : intent}
                        />
                    ))}
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.6 }}>Disabled</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {Object.values(Intent).map(intent => (
                        <EditableText
                            key={intent}
                            {...args}
                            intent={intent}
                            disabled={true}
                            placeholder={intent === "none" ? "None" : intent}
                        />
                    ))}
                </div>
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        placeholder: "Click to Edit",
        defaultValue: "Hello, world!",
    },
};
