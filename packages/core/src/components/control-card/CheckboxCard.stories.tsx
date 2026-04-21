/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";
import { useArgs, useCallback } from "storybook/preview-api";

import { Flex } from "@blueprintjs/labs";

import { Alignment, Elevation } from "../../common";

import { CheckboxCard } from "./checkboxCard";

const meta: Meta<typeof CheckboxCard> = {
    title: "Core/Control Card/CheckboxCard",
    component: CheckboxCard,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        label: "Checkbox option",
        checked: false,
        disabled: false,
        showAsSelectedWhenChecked: true,
        compact: false,
        elevation: Elevation.ZERO,
        alignIndicator: Alignment.START,
    },
    argTypes: {
        label: {
            control: "text",
        },
        checked: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        showAsSelectedWhenChecked: {
            control: "boolean",
        },
        compact: {
            control: "boolean",
        },
        elevation: {
            control: "select",
            options: Object.values(Elevation),
        },
        alignIndicator: {
            control: "select",
            options: Object.values(Alignment),
        },
        onChange: { action: "changed" },
    },
} satisfies Meta<typeof CheckboxCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic checkbox card with default styling.
 */
export const Default: Story = {
    args: {
        label: "Checkbox option",
    },
    render: function RenderDefault(args) {
        const [, updateArgs] = useArgs();
        const handleChange = useCallback(() => updateArgs({ checked: !args.checked }), [args.checked, updateArgs]);
        return <CheckboxCard {...args} onChange={handleChange} />;
    },
};

/**
 * Use the `compact` prop to render a medium or large checkbox card.
 */
export const CompactExample: Story = {
    name: "Compact",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: function RenderCompact(args) {
        const [, updateArgs] = useArgs();
        const handleChange = useCallback(() => updateArgs({ checked: !args.checked }), [args.checked, updateArgs]);

        return (
            <Flex flexDirection="column" gap={2} style={{ minWidth: 300 }}>
                <CheckboxCard {...args} label="Default" defaultChecked={true} onChange={handleChange} />
                <CheckboxCard {...args} compact={true} label="Compact" defaultChecked={true} onChange={handleChange} />
            </Flex>
        );
    },
};

/**
 * Checkbox cards support `disabled`, `checked`, and `selected` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        checked: { table: { disable: true } },
    },
    render: function RenderState(args) {
        const [, updateArgs] = useArgs();
        const handleChange = useCallback(() => updateArgs({ checked: !args.checked }), [args.checked, updateArgs]);

        return (
            <Flex flexDirection="column" gap={2} style={{ minWidth: 300 }}>
                <CheckboxCard {...args} label="Default" onChange={handleChange} />
                <CheckboxCard {...args} label="Checked" checked={true} onChange={handleChange} />
                <CheckboxCard {...args} label="Disabled" disabled={true} />
                <CheckboxCard {...args} label="Disabled Checked" disabled={true} checked={true} />
                <CheckboxCard
                    {...args}
                    label="No selected styling"
                    checked={true}
                    showAsSelectedWhenChecked={false}
                    onChange={handleChange}
                />
            </Flex>
        );
    },
};

/**
 * Use the `alignIndicator` prop to render start or end-aligned.
 */
export const AlignIndicatorExample: Story = {
    name: "Align Indicator",
    argTypes: {
        alignIndicator: { table: { disable: true } },
    },
    render: function RenderAlignIndicator(args) {
        const [, updateArgs] = useArgs();
        const handleChange = useCallback(() => updateArgs({ checked: !args.checked }), [args.checked, updateArgs]);

        return (
            <Flex flexDirection="column" gap={2} style={{ minWidth: 300 }}>
                <CheckboxCard
                    {...args}
                    alignIndicator={Alignment.START}
                    label="Align start"
                    defaultChecked={true}
                    onChange={handleChange}
                />
                <CheckboxCard
                    {...args}
                    alignIndicator={Alignment.END}
                    label="Align end"
                    defaultChecked={true}
                    onChange={handleChange}
                />
            </Flex>
        );
    },
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        label: "Playground checkbox card",
    },
    render: function RenderPlayground(args) {
        const [, updateArgs] = useArgs();
        const handleChange = useCallback(() => updateArgs({ checked: !args.checked }), [args.checked, updateArgs]);
        return <CheckboxCard {...args} onChange={handleChange} />;
    },
};
