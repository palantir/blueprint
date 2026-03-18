/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alignment, ButtonVariant, Intent, Size } from "../../common";

import { AnchorButton } from "./buttons";

// These props are deprecated on AnchorButton — hide them from the Storybook controls panel.
const disabledArgs = [
    "large",
    "minimal",
    "outlined",
    "rightIcon",
    "small",
    "children",
] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof AnchorButton>>;

const meta: Meta<typeof AnchorButton> = {
    title: "Core/Button/AnchorButton",
    component: AnchorButton,
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
        text: "Link",
        href: "#",
        target: undefined,
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
        href: {
            control: "text",
        },
        target: {
            control: "select",
            options: ["_self", "_blank", "_parent", "_top"],
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
} satisfies Meta<typeof AnchorButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic anchor button with default styling. Renders an `<a>` element styled as a button.
 */
export const Default: Story = {
    args: {
        text: "Link",
        href: "#",
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
        <div style={{ display: "flex", gap: 8 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <AnchorButton
                        key={intent}
                        {...args}
                        intent={intent}
                        text={intent.charAt(0).toUpperCase() + intent.slice(1)}
                    />
                ))}
        </div>
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
        <div style={{ display: "flex", gap: 8 }}>
            {Object.values(ButtonVariant).map(variant => (
                <AnchorButton
                    key={variant}
                    {...args}
                    variant={variant}
                    text={variant.charAt(0).toUpperCase() + variant.slice(1)}
                />
            ))}
        </div>
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
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {Object.values(Size).map(size => (
                <AnchorButton key={size} {...args} size={size} text={size.charAt(0).toUpperCase() + size.slice(1)} />
            ))}
        </div>
    ),
};

/**
 * AnchorButtons support `active`, `disabled`, and `loading` states.
 * When disabled, the `href` is removed so the link is not navigable.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        active: { table: { disable: true } },
        disabled: { table: { disable: true } },
        loading: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8 }}>
            <AnchorButton {...args} text="Default" />
            <AnchorButton {...args} active={true} text="Active" />
            <AnchorButton {...args} disabled={true} text="Disabled" />
            <AnchorButton {...args} loading={true} text="Loading" />
        </div>
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
        <div style={{ display: "flex", gap: 8 }}>
            <AnchorButton {...args} icon="share" text="Share" />
            <AnchorButton {...args} icon="duplicate" endIcon="share" text="Copy link" />
            <AnchorButton {...args} endIcon="arrow-right" text="Next" />
            <AnchorButton {...args} icon="link" text={undefined} aria-label="link" />
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            {Object.values(Alignment).map(alignment => (
                <AnchorButton
                    key={alignment}
                    {...args}
                    alignText={alignment}
                    fill={true}
                    endIcon="caret-down"
                    text={alignment.charAt(0).toUpperCase() + alignment.slice(1)}
                />
            ))}
        </div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <AnchorButton {...args} fill={true} text="Full Width" />
            <AnchorButton {...args} fill={false} text="Auto Width" />
        </div>
    ),
};

/**
 * All intents across all variants and states.
 */
export const AllIntentsAllVariants: Story = {
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.values(ButtonVariant).map(variant => (
                <div key={variant} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 12, opacity: 0.6, textTransform: "capitalize" }}>{variant}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                        {Object.values(Intent).map(intent => (
                            <AnchorButton key={intent} {...args} variant={variant} intent={intent}>
                                {intent || "None"}
                            </AnchorButton>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        {Object.values(Intent).map(intent => (
                            <AnchorButton key={intent} {...args} variant={variant} intent={intent} active={true}>
                                {intent || "None"}
                            </AnchorButton>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        {Object.values(Intent).map(intent => (
                            <AnchorButton key={intent} {...args} variant={variant} intent={intent} disabled={true}>
                                {intent || "None"}
                            </AnchorButton>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        {Object.values(Intent).map(intent => (
                            <AnchorButton key={intent} {...args} variant={variant} intent={intent} loading={true}>
                                {intent || "None"}
                            </AnchorButton>
                        ))}
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
        text: "Open link",
        href: "#",
        target: "_blank",
        icon: "share",
        endIcon: undefined,
        intent: "primary",
        variant: "solid",
        size: "medium",
    },
};
