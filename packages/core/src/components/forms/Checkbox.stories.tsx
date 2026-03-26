/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Intent } from "../../common";

import { Checkbox } from "./controls";

const disabledArgs = ["large", "tagName", "labelElement", "inputRef"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof Checkbox>
>;

const meta: Meta<typeof Checkbox> = {
    title: "Core/Form/Controls/Checkbox",
    component: Checkbox,
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
        label: "Checkbox",
        disabled: false,
        inline: false,
        size: "medium",
    },
    argTypes: {
        size: {
            control: "select",
            options: ["medium", "large"],
        },
        disabled: {
            control: "boolean",
        },
        inline: {
            control: "boolean",
        },
        indeterminate: {
            control: "boolean",
        },
        defaultChecked: {
            control: "boolean",
        },
        onChange: { action: "changed" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic checkbox with default styling.
 */
export const Default: Story = {
    args: {
        label: "Enable notifications",
    },
};

/**
 * Use the `intent` prop to apply a semantic color to the checkbox.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
            <Checkbox {...args} label="Default (no intent)" defaultChecked={true} />
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Checkbox
                        key={intent}
                        {...args}
                        intent={intent}
                        label={intent.charAt(0).toUpperCase() + intent.slice(1)}
                        defaultChecked={true}
                    />
                ))}
        </div>
    ),
};

/**
 * Use the `size` prop to adjust the checkbox dimensions.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Checkbox {...args} size="medium" label="Medium" defaultChecked={true} />
            <Checkbox {...args} size="large" label="Large" defaultChecked={true} />
        </div>
    ),
};

/**
 * Checkboxes support `disabled`, `indeterminate`, and `inline` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        indeterminate: { table: { disable: true } },
        inline: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Unchecked</div>
            <div style={{ display: "flex", gap: 16 }}>
                <Checkbox {...args} label="Default" />
                <Checkbox {...args} label="Disabled" disabled={true} />
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Checked</div>
            <div style={{ display: "flex", gap: 16 }}>
                <Checkbox {...args} label="Checked" defaultChecked={true} />
                <Checkbox {...args} label="Checked Disabled" defaultChecked={true} disabled={true} />
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Indeterminate</div>
            <div style={{ display: "flex", gap: 16 }}>
                <Checkbox {...args} label="Indeterminate" indeterminate={true} />
                <Checkbox {...args} label="Indeterminate Disabled" indeterminate={true} disabled={true} />
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>Inline</div>
            <div>
                <Checkbox {...args} inline={true} label="Option A" />
                <Checkbox {...args} inline={true} label="Option B" />
                <Checkbox {...args} inline={true} label="Option C" />
            </div>
        </div>
    ),
};

/**
 * All states across all sizes.
 */
export const AllStates: Story = {
    name: "All States",
    render: args => (
        <div style={{ display: "flex", gap: 24, flexDirection: "column" }}>
            {(["medium", "large"] as const).map(size => (
                <div key={size}>
                    <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, textTransform: "capitalize" }}>
                        {size}
                    </div>
                    <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
                        <Checkbox {...args} size={size} label="Unchecked" />
                        <Checkbox {...args} size={size} label="Checked" defaultChecked={true} />
                        <Checkbox {...args} size={size} label="Indeterminate" indeterminate={true} />
                        <Checkbox {...args} size={size} label="Disabled" disabled={true} />
                        <Checkbox
                            {...args}
                            size={size}
                            label="Checked Disabled"
                            defaultChecked={true}
                            disabled={true}
                        />
                        <Checkbox
                            {...args}
                            size={size}
                            label="Indeterminate Disabled"
                            indeterminate={true}
                            disabled={true}
                        />
                    </div>
                </div>
            ))}
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        label: "Enable feature",
        defaultChecked: false,
    },
};
