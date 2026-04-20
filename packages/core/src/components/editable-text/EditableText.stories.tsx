/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashedPaddedContainer, StorybookLayout, storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Intent } from "../../common";

import { EditableText } from "./editableText";

const disabledArgs = ["customInputAttributes", "elementRef", "contentId"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof EditableText>
>;

const meta: Meta<typeof EditableText> = {
    title: "Core/EditableText",
    component: EditableText,
    decorators: [storybookLayoutDecorator],
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
        onCancel: { table: { disable: true } },
        onChange: { table: { disable: true } },
        onConfirm: { table: { disable: true } },
        onEdit: { table: { disable: true } },
        className: { table: { disable: true } },
        alwaysRenderInput: { table: { disable: true } },
        defaultValue: { table: { disable: true } },
        isEditing: { table: { disable: true } },
        maxLength: { table: { disable: true } },
        minWidth: { table: { disable: true } },
        maxLines: { table: { disable: true } },
        minLines: { table: { disable: true } },
        type: { table: { disable: true } },
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
        <StorybookLayout style={{ flexDirection: "column", gap: 16 }}>
            {Object.values(Intent).map(intent => (
                <EditableText
                    key={intent}
                    {...args}
                    intent={intent}
                    placeholder={intent.charAt(0).toUpperCase() + intent.slice(1)}
                />
            ))}
        </StorybookLayout>
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
        <StorybookLayout style={{ flexDirection: "column", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="Default" />
                <DashedPaddedContainer>
                    <EditableText {...args} placeholder="Click to Edit" />
                </DashedPaddedContainer>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="Disabled" />
                <DashedPaddedContainer>
                    <EditableText {...args} disabled={true} placeholder="Disabled" />
                </DashedPaddedContainer>
            </div>
        </StorybookLayout>
    ),
};

/**
 * Enabling the `multiline` prop transforms EditableText into a `<textarea>` that grows and shrinks
 * vertically as content changes. Use `minLines` and `maxLines` to constrain the height.
 *
 * In multiline mode, press **Ctrl+Enter** (or **Cmd+Enter** on Mac) to confirm. Pressing **Enter**
 * alone inserts a newline. This behavior can be inverted with the `confirmOnEnterKey` prop.
 */
export const MultilineExample: Story = {
    name: "Multiline",
    argTypes: {
        multiline: { table: { disable: true } },
    },
    render: args => (
        <StorybookLayout style={{ flexDirection: "column", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="Single line" />
                <DashedPaddedContainer>
                    <EditableText {...args} multiline={false} placeholder="Click to Edit" />
                </DashedPaddedContainer>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="Multiline [4 lines minimum, 6 lines maximum]" />
                <DashedPaddedContainer>
                    <EditableText
                        {...args}
                        multiline={true}
                        minLines={4}
                        maxLines={6}
                        placeholder="Click to edit multiple lines..."
                    />
                </DashedPaddedContainer>
            </div>
        </StorybookLayout>
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
