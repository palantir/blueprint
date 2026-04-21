/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";

import { Icon, IconSize } from "./icon";

const meta: Meta<typeof Icon> = {
    title: "Core/Icon",
    component: Icon,
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        icon: "buggy",
        size: IconSize.STANDARD,
        intent: "none",
        color: undefined,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "select",
            options: [IconSize.STANDARD, IconSize.LARGE],
        },
        icon: {
            control: "text",
        },
        color: {
            control: "text",
        },
        className: { table: { disable: true } },
        autoLoad: { table: { disable: true } },
        svgProps: { table: { disable: true } },
    },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic icon with default styling.
 */
export const Default: Story = {
    args: {
        icon: "buggy",
    },
};

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
        <Flex flexDirection="column" gap={10}>
            <Flex flexDirection="column" gap={2} alignItems="center">
                <StoryLabel title="standard size - 16px" />
                <Icon {...args} size={IconSize.STANDARD} />
            </Flex>

            <Flex flexDirection="column" gap={2} alignItems="center">
                <StoryLabel title="standard size - 20px" />
                <Icon {...args} size={IconSize.LARGE} />
            </Flex>
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        icon: "buggy",
        size: IconSize.STANDARD,
        intent: "none",
        color: undefined,
    },
};
