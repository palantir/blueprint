/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";
import { useArgs, useCallback } from "storybook/preview-api";

import { Flex } from "@blueprintjs/labs";

import { Alignment, Elevation } from "../../common";

import { RadioCard } from "./radioCard";

const meta: Meta<typeof RadioCard> = {
    title: "Core/Control Card/RadioCard",
    component: RadioCard,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        label: "Radio option",
        checked: false,
        disabled: false,
        showAsSelectedWhenChecked: true,
        compact: false,
        elevation: Elevation.ZERO,
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
} satisfies Meta<typeof RadioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic radio card with default styling.
 */
export const Default: Story = {
    args: {
        label: "Radio option",
    },
    render: function RenderDefault(args) {
        const [, updateArgs] = useArgs();
        const handleChange = useCallback(() => updateArgs({ checked: !args.checked }), [args.checked, updateArgs]);
        return <RadioCard {...args} onChange={handleChange} />;
    },
};

/**
 * Use the `compact` prop to render a more condensed radio card.
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
                <RadioCard {...args} label="Default" defaultChecked={true} onChange={handleChange} />
                <RadioCard {...args} compact={true} label="Compact" defaultChecked={true} onChange={handleChange} />
            </Flex>
        );
    },
};

/**
 * Radio cards support `disabled`, `checked`, and `selected` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        disabled: { table: { disable: true } },
        checked: { table: { disable: true } },
    },
    render: function RenderState(args) {
        return (
            <Flex flexDirection="column" gap={2} style={{ minWidth: 300 }}>
                <RadioCard {...args} label="Default" />
                <RadioCard {...args} label="Checked" checked={true} />
                <RadioCard {...args} label="Disabled" disabled={true} />
                <RadioCard {...args} label="Disabled Checked" disabled={true} checked={true} />
                <RadioCard {...args} label="No selected styling" checked={true} showAsSelectedWhenChecked={false} />
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
                <RadioCard
                    {...args}
                    alignIndicator={Alignment.START}
                    label="Align start"
                    defaultChecked={true}
                    onChange={handleChange}
                />
                <RadioCard
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
        label: "Playground radio card",
    },
    render: function RenderPlayground(args) {
        const [, updateArgs] = useArgs();
        const handleChange = useCallback(() => updateArgs({ checked: !args.checked }), [args.checked, updateArgs]);
        return <RadioCard {...args} onChange={handleChange} />;
    },
};
