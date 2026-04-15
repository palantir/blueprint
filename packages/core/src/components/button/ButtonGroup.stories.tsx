/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryLabel } from "@storybook-common";

import { Alignment, ButtonVariant, Intent, Size } from "../../common";
import { Popover } from "../popover/popover";

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
    parameters: {
        layout: "centered",
    },
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
        <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
            {Object.values(ButtonVariant).map(variant => (
                <div key={variant} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <StoryLabel title={variant} />
                    <ButtonGroup {...args} variant={variant}>
                        <Button text="First" />
                        <Button text="Second" />
                        <Button text="Third" />
                    </ButtonGroup>
                </div>
            ))}
        </div>
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
        <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
            {Object.values(Size).map(size => (
                <div key={size} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <StoryLabel title={size} />
                    <ButtonGroup {...args} size={size}>
                        <Button text="First" />
                        <Button text="Second" />
                        <Button text="Third" />
                    </ButtonGroup>
                </div>
            ))}
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="fill={true}" />
                <ButtonGroup {...args} fill={true}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="fill={false}" />
                <ButtonGroup {...args} fill={false}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </div>
        </div>
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
        <div style={{ display: "flex", gap: 24, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="horizontal" />
                <ButtonGroup {...args} vertical={false}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <StoryLabel title="vertical" />
                <ButtonGroup {...args} vertical={true}>
                    <Button text="First" />
                    <Button text="Second" />
                    <Button text="Third" />
                </ButtonGroup>
            </div>
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 25 }}>
            {Object.values(ALIGNMENT).map(alignment => (
                <div key={alignment} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <StoryLabel title={alignment} />
                    <ButtonGroup {...args} alignText={alignment} fill={true}>
                        <Button text="First" />
                        <Button text="Second" />
                        <Button text="Third" />
                    </ButtonGroup>
                </div>
            ))}
        </div>
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
        <div style={{ display: "flex", flexDirection: "row", gap: 50 }}>
            {Object.values(ButtonVariant).map(variant => (
                <div key={variant} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <StoryLabel title={variant} />
                    {Object.values(Intent).map(intent => (
                        <ButtonGroup key={intent} {...args} variant={variant}>
                            <Button intent={intent} text={intent} />
                            <Button intent={intent} text={intent} />
                            <Button intent={intent} text={intent} />
                        </ButtonGroup>
                    ))}
                </div>
            ))}
        </div>
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
            <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
                {Object.values(ButtonVariant).map(variant => (
                    <div
                        key={variant}
                        style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}
                    >
                        <StoryLabel title={variant} />
                        <ButtonGroup {...args} variant={variant}>
                            {BUTTONS.map(({ icon, label }) => (
                                <Popover
                                    key={icon}
                                    content={<span style={{ padding: 10 }}>{label}</span>}
                                    placement="bottom"
                                >
                                    <Button icon={icon} aria-label={label} />
                                </Popover>
                            ))}
                        </ButtonGroup>
                    </div>
                ))}
            </div>
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
