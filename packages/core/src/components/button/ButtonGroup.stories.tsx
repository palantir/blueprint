/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Alignment, ButtonVariant, Intent, Size } from "../../common";
import { PopoverNext } from "../popover-next/popoverNext";

import { ButtonGroup } from "./buttonGroup";
import { Button } from "./buttons";

// These props are deprecated on ButtonGroup — hide them from the Storybook controls panel.
const disabledArgs = ["large", "minimal", "outlined", "children", "className"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof ButtonGroup>
>;

const ALIGNMENT = [Alignment.START, Alignment.CENTER, Alignment.END];

const meta: Meta<typeof ButtonGroup> = {
    title: "Core/Button/ButtonGroup",
    component: ButtonGroup,
    tags: ["autodocs"],
    args: {
        variant: "solid",
        size: "medium",
        fill: false,
        vertical: false,
        alignText: "center",
    },
    argTypes: {
        variant: {
            control: "select",
            options: Object.values(ButtonVariant),
        },
        size: {
            control: "select",
            options: Object.values(Size),
        },
        alignText: {
            control: "select",
            options: Object.values(ALIGNMENT),
        },
        fill: {
            control: "boolean",
        },
        vertical: {
            control: "boolean",
        },
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
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic button group with default styling.
 */
export const Default: Story = {
    render: args => (
        <ButtonGroup {...args}>
            <Button text="First" />
            <Button text="Second" />
            <Button text="Third" />
        </ButtonGroup>
    ),
};

/**
 * Use the `variant` prop to change the visual style of all child buttons.
 */
export const VariantExample: Story = {
    name: "Variant",
    argTypes: {
        variant: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={10} alignItems="center">
            {Object.values(ButtonVariant).map(variant => (
                <Flex key={variant} flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title={variant} />
                    <ButtonGroup {...args} variant={variant}>
                        <Button text="First" />
                        <Button text="Second" />
                        <Button text="Third" />
                    </ButtonGroup>
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * Use the `size` prop to adjust the size of all child buttons.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={10} alignItems="center">
            {Object.values(Size).map(size => (
                <Flex key={size} flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title={size} />
                    <ButtonGroup {...args} size={size}>
                        <Button text="First" />
                        <Button text="Second" />
                        <Button text="Third" />
                    </ButtonGroup>
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the button group expand to the full width of its container.
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
        <Flex flexDirection="column" gap={5}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="fill={true}" />
                <ButtonGroup {...args} fill={true}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="fill={false}" />
                <ButtonGroup {...args} fill={false}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `vertical` prop to arrange buttons in a vertical stack.
 */
export const VerticalExample: Story = {
    name: "Vertical",
    argTypes: {
        vertical: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={6} alignItems="start">
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="horizontal" />
                <ButtonGroup {...args} vertical={false}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="vertical" />
                <ButtonGroup {...args} vertical={true}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `alignText` prop to control text alignment within the buttons. Best used with `fill`.
 */
export const AlignmentExample: Story = {
    name: "Alignment",
    argTypes: {
        alignText: { table: { disable: true } },
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
        <Flex flexDirection="column" gap={6}>
            {Object.values(ALIGNMENT).map(alignment => (
                <Flex key={alignment} flexDirection="column" gap={1}>
                    <StoryLabel title={alignment} />
                    <ButtonGroup {...args} alignText={alignment} fill={true}>
                        <Button text="First" />
                        <Button text="Second" />
                        <Button text="Third" />
                    </ButtonGroup>
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * All intents across all variants.
 */
export const AllIntentsAllVariants: Story = {
    argTypes: {
        variant: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="row" gap={10}>
            {Object.values(ButtonVariant).map(variant => (
                <Flex key={variant} flexDirection="column" gap={2}>
                    <StoryLabel title={variant} />
                    {Object.values(Intent).map(intent => (
                        <ButtonGroup key={intent} {...args} variant={variant}>
                            <Button intent={intent} text={intent} />
                            <Button intent={intent} text={intent} />
                            <Button intent={intent} text={intent} />
                        </ButtonGroup>
                    ))}
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * Wrap buttons with Popover to provide additional context on hover.
 */
export const WithPopover: Story = {
    argTypes: {
        variant: { table: { disable: true } },
    },
    render: args => {
        const BUTTONS = [
            { icon: "floppy-disk", label: "Save" },
            { icon: "export", label: "Export as PDF" },
            { icon: "archive", label: "Archive" },
        ] as const;

        return (
            <Flex gap={10} alignItems="center">
                {Object.values(ButtonVariant).map(variant => (
                    <Flex key={variant} flexDirection="column" gap={1} alignItems="center">
                        <StoryLabel title={variant} />
                        <ButtonGroup {...args} variant={variant}>
                            {BUTTONS.map(({ icon, label }) => (
                                <PopoverNext
                                    key={icon}
                                    content={<span style={{ padding: 10 }}>{label}</span>}
                                    placement="bottom"
                                >
                                    <Button icon={icon} aria-label={label} />
                                </PopoverNext>
                            ))}
                        </ButtonGroup>
                    </Flex>
                ))}
            </Flex>
        );
    },
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: args => (
        <ButtonGroup
            alignText={args.alignText}
            fill={args.fill}
            size={args.size}
            variant={args.variant}
            vertical={args.vertical}
        >
            <Button text="First" />
            <Button text="Second" />
            <Button text="Third" />
        </ButtonGroup>
    ),
};
