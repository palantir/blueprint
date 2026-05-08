/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Alignment, ButtonVariant, Intent, Size } from "../../common";

import { Button } from "./buttons";

// These props are deprecated on Button — hide them from the Storybook controls panel.
const disabledArgs = [
    "large",
    "minimal",
    "outlined",
    "rightIcon",
    "small",
    "type",
    "children",
] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof Button>>;

const meta: Meta<typeof Button> = {
    title: "Core/Button/Button",
    component: Button,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        text: "Button",
        intent: "none",
        variant: "solid",
        size: "medium",
        alignText: "center",
        icon: undefined,
        endIcon: undefined,
        fill: false,
        active: false,
        loading: false,
        disabled: false,
        ellipsizeText: false,
    },
    argTypes: {
        text: {
            control: "text",
        },
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "select",
            options: Object.values(Size),
        },
        variant: {
            control: "select",
            options: Object.values(ButtonVariant),
        },
        alignText: {
            control: "select",
            options: Object.values(Alignment),
        },
        icon: {
            control: "text",
        },
        endIcon: {
            control: "text",
        },
        active: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        ellipsizeText: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        loading: {
            control: "boolean",
        },
        onClick: { action: "clicked" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = {
                    table: {
                        disable: true,
                    },
                };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic button with default styling.
 */
export const Default: Story = {
    args: {
        text: "Button",
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the button.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Button
                        key={intent}
                        {...args}
                        intent={intent}
                        text={intent.charAt(0).toUpperCase() + intent.slice(1)}
                    />
                ))}
        </Flex>
    ),
};

/**
 * Use the `variant` prop to change the visual style. "solid" (default) renders a filled button,
 * "minimal" renders without a background, and "outlined" adds a border without fill.
 */
export const VariantExample: Story = {
    name: "Variant",
    argTypes: {
        variant: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2}>
            {Object.values(ButtonVariant).map(variant => (
                <Button
                    key={variant}
                    {...args}
                    variant={variant}
                    text={variant.charAt(0).toUpperCase() + variant.slice(1)}
                />
            ))}
        </Flex>
    ),
};

/**
 * Use the `size` prop to adjust the button dimensions.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2} alignItems="center">
            {Object.values(Size).map(size => (
                <Button key={size} {...args} size={size} text={size.charAt(0).toUpperCase() + size.slice(1)} />
            ))}
        </Flex>
    ),
};

/**
 * Buttons support `active`, `disabled`, and `loading` states.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        active: { table: { disable: true } },
        disabled: { table: { disable: true } },
        loading: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2}>
            <Button {...args} text="Default" />
            <Button {...args} active={true} text="Active" />
            <Button {...args} disabled={true} text="Disabled" />
            <Button {...args} loading={true} text="Loading" />
        </Flex>
    ),
};

/**
 * Use `icon` and `endIcon` props to render icons alongside text, or use `icon` alone for icon-only buttons.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        icon: { table: { disable: true } },
        endIcon: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={2}>
            <Button {...args} icon="refresh" text="Reset" />
            <Button {...args} icon="user" endIcon="caret-down" text="Profile" />
            <Button {...args} endIcon="arrow-right" text="Next" />
            <Button {...args} icon="edit" text={undefined} aria-label="edit" />
        </Flex>
    ),
};

/**
 * Use the `alignText` prop to control text alignment within the button.
 */
export const AlignmentExample: Story = {
    name: "Alignment",
    argTypes: {
        alignText: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={2} style={{ minWidth: 300 }}>
            {Object.values(Alignment).map(alignment => (
                <Button
                    key={alignment}
                    {...args}
                    alignText={alignment}
                    fill={true}
                    endIcon="caret-down"
                    text={alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                />
            ))}
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the button expand to the full width of its container.
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
        <Flex flexDirection="column" gap={2}>
            <Button {...args} fill={true} text="Full Width" />
            <Button {...args} fill={false} text="Auto Width" />
        </Flex>
    ),
};

/**
 * All intents across all variants and states.
 */
export const AllIntentsAllVariants: Story = {
    argTypes: {
        intent: { table: { disable: true } },
        variant: { table: { disable: true } },
        active: { table: { disable: true } },
        disabled: { table: { disable: true } },
        loading: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            {Object.values(ButtonVariant).map(variant => (
                <Flex key={variant} flexDirection="column" gap={2}>
                    <StoryLabel title={variant} />
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => (
                            <Button key={intent} {...args} variant={variant} intent={intent} text={intent} />
                        ))}
                    </Flex>
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => (
                            <Button
                                key={intent}
                                {...args}
                                variant={variant}
                                intent={intent}
                                active={true}
                                text={intent}
                            />
                        ))}
                    </Flex>
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => (
                            <Button
                                key={intent}
                                {...args}
                                variant={variant}
                                intent={intent}
                                disabled={true}
                                text={intent}
                            />
                        ))}
                    </Flex>
                    <Flex gap={2}>
                        {Object.values(Intent).map(intent => (
                            <Button
                                key={intent}
                                {...args}
                                variant={variant}
                                intent={intent}
                                loading={true}
                                text={intent}
                            />
                        ))}
                    </Flex>
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        return (
            <Button
                active={args.active}
                alignText={args.alignText}
                disabled={args.disabled}
                ellipsizeText={args.ellipsizeText}
                endIcon={args.endIcon}
                fill={args.fill}
                icon={args.icon}
                intent={args.intent}
                loading={args.loading}
                size={args.size}
                text={args.text}
                variant={args.variant}
            />
        );
    },
    args: {
        text: "Click",
        icon: "refresh",
        endIcon: undefined,
        intent: "none",
        variant: "solid",
        size: "medium",
    },
};
