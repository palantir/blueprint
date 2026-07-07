/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Buggy, IconNames } from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";

import { Colors, Intent } from "../../common";

import { Icon, IconSize } from "./icon";

const meta: Meta<typeof Icon> = {
    title: "Core/Icon",
    component: Icon,
    decorators: [storybookLayoutDecorator],
    args: {
        icon: IconNames.BUGGY,
        intent: Intent.NONE,
        size: IconSize.STANDARD,
        color: undefined,
        title: undefined,
        tagName: "span",
        autoLoad: true,
    },
    argTypes: {
        icon: {
            control: "text",
        },
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "number",
        },
        color: {
            control: "color",
        },
        title: {
            control: "text",
        },
        tagName: {
            control: "text",
        },
        autoLoad: {
            control: "boolean",
        },
        className: { table: { disable: true } },
        svgProps: { table: { disable: true } },
    },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic icon with default styling.
 */
export const Default: Story = {};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the icon.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={6}>
            {Object.values(Intent).map(intent => (
                <Icon key={intent} {...args} intent={intent} />
            ))}
        </Flex>
    ),
};

/**
 * Use the `size` prop to adjust the icon dimensions. Icon supports `STANDARD` (16px) and `LARGE` (20px).
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={5}>
            <Icon {...args} size={IconSize.STANDARD} />
            <Icon {...args} size={IconSize.LARGE} />
            <Icon {...args} size={48} />
        </Flex>
    ),
};

/**
 * Use the `color` prop to override the icon fill with a custom CSS color.
 * This takes precedence over `intent`.
 */
export const ColorExample: Story = {
    name: "Color",
    render: args => (
        <Flex gap={4} alignItems="center">
            {[Colors.BLUE3, Colors.FOREST3, Colors.GOLD3, Colors.RED3, Colors.INDIGO4].map(color => (
                <Flex key={color} flexDirection="column" gap={1} alignItems="center">
                    <Icon {...args} color={color} />
                    <StoryLabel title={color} />
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * The `icon` prop accepts either a string icon name or a React element (typically an icon
 * component from `@blueprintjs/icons`). When an element is provided, `<Icon>` clones it and
 * merges the parent-provided `className` and intent class onto its root.
 */
export const ElementIcon: Story = {
    name: "Element icon",
    render: args => (
        <Flex gap={4} alignItems="center">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Icon {...args} icon={IconNames.BUGGY} />
                <StoryLabel title='icon="buggy"' />
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <Icon {...args} icon={<Buggy size={args.size} />} />
                <StoryLabel title="icon={<Buggy />}" />
            </Flex>
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        icon: IconNames.BUGGY,
        size: IconSize.STANDARD,
        intent: "none",
        color: undefined,
    },
};
