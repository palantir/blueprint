/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";

import { Checkbox } from "./controls";

const disabledArgs = ["large", "tagName", "labelElement", "inputRef"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof Checkbox>
>;

const meta: Meta<typeof Checkbox> = {
    title: "Core/Form/Controls/Checkbox",
    component: Checkbox,
    decorators: [storybookLayoutDecorator],
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
 * Use the `size` prop to adjust the checkbox dimensions.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4} alignItems="center">
            <Checkbox {...args} size="medium" label="Medium" defaultChecked={true} />
            <Checkbox {...args} size="large" label="Large" defaultChecked={true} />
        </Flex>
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
        <Flex gap={4} flexDirection="column">
            <StoryLabel title="Unchecked" />
            <Flex gap={4}>
                <Checkbox {...args} label="Default" />
                <Checkbox {...args} label="Disabled" disabled={true} />
            </Flex>
            <StoryLabel title="Checked" />
            <Flex gap={4}>
                <Checkbox {...args} label="Checked" defaultChecked={true} />
                <Checkbox {...args} label="Checked Disabled" defaultChecked={true} disabled={true} />
            </Flex>
            <StoryLabel title="Indeterminate" />
            <Flex gap={4}>
                <Checkbox {...args} label="Indeterminate" indeterminate={true} />
                <Checkbox {...args} label="Indeterminate Disabled" indeterminate={true} disabled={true} />
            </Flex>
            <StoryLabel title="Inline" />
            <div>
                <Checkbox {...args} inline={true} label="Option A" />
                <Checkbox {...args} inline={true} label="Option B" />
                <Checkbox {...args} inline={true} label="Option C" />
            </div>
        </Flex>
    ),
};

/**
 * All states across all sizes.
 */
export const AllStatesAllSizes: Story = {
    name: "All States All Sizes",
    render: args => (
        <Flex gap={6} flexDirection="column">
            {(["medium", "large"] as const).map(size => (
                <div key={size}>
                    <StoryLabel title={size} />
                    <Flex gap={4} flexDirection="column">
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
                    </Flex>
                </div>
            ))}
        </Flex>
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
