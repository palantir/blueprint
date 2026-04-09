/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Intent } from "../../common";

import { EditableText } from "./editableText";

const disabledArgs = ["customInputAttributes", "elementRef", "contentId"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof EditableText>
>;

const meta: Meta<typeof EditableText> = {
    title: "Core/EditableText",
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
            {Object.values(Intent).map(intent => (
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
    args: {
        multiline: true,
        minLines: 3,
        maxLines: 5,
        placeholder: "Click to edit multiple lines...",
    },
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

/**
 * Clicking an editable text enters edit mode (focus ring appears). Clicking outside
 * confirms the value and removes the editing state.
 */
export const FocusExample: Story = {
    name: "Focus",
    args: {
        defaultValue: "Click to Edit",
    },
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);

        await step("Click editable text to enter edit mode", async () => {
            const editableText = canvas.getByText("Click to Edit");
            await userEvent.click(editableText);
            const root = canvasElement.querySelector(".bp6-editable-text");
            await expect(root).toHaveClass("bp6-editable-text-editing");
        });

        await step("Click outside to confirm and exit edit mode", async () => {
            await userEvent.click(canvasElement);
            const root = canvasElement.querySelector(".bp6-editable-text");
            await expect(root).not.toHaveClass("bp6-editable-text-editing");
        });
    },
};

/**
 * Hovering over each intent variant reveals the highlight ring (CSS-driven).
 * The editing class is only applied on click, not on hover.
 */
export const HoverExample: Story = {
    name: "Hover",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.values(Intent).map(intent => (
                <div key={intent} data-testid={`editable-${intent || "none"}`}>
                    <EditableText
                        {...args}
                        intent={intent}
                        placeholder={intent.charAt(0).toUpperCase() + intent.slice(1) || "None"}
                    />
                </div>
            ))}
        </div>
    ),
    play: async ({ canvasElement, step }) => {
        const canvas = within(canvasElement);

        for (const intent of Object.values(Intent)) {
            const testId = `editable-${intent || "none"}`;

            await step(`Hover over ${intent || "none"} intent`, async () => {
                const wrapper = canvas.getByTestId(testId);
                const root = wrapper.querySelector(".bp6-editable-text")!;
                await userEvent.hover(root);
                await expect(root).not.toHaveClass("bp6-editable-text-editing");
            });

            await step(`Unhover ${intent || "none"} intent`, async () => {
                const wrapper = canvas.getByTestId(testId);
                const root = wrapper.querySelector(".bp6-editable-text")!;
                await userEvent.unhover(root);
                await expect(root).not.toHaveClass("bp6-editable-text-editing");
            });
        }
    },
};
