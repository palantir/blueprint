/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useEffect, useRef, useState } from "react";

import { Alignment, ButtonVariant, Intent, Size } from "../../common";

import { AnchorButton, Button } from "./buttons";

// These props are deprecated on Button — hide them from the Storybook controls panel.
const disabledArgs = ["large", "minimal", "outlined", "rightIcon", "small", "type"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof Button>
>;

const meta: Meta<typeof Button> = {
    title: "Core/Button",
    component: Button,
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
 *
 * Matches the docs ButtonIntentExample.
 */
export const IntentExample: Story = {
    name: "Intent",
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Button intent="primary">Primary</Button>
            <Button intent="success">Success</Button>
            <Button intent="warning">Warning</Button>
            <Button intent="danger">Danger</Button>
        </div>
    ),
};

/**
 * Use the `variant` prop to change the visual style. "solid" (default) renders a filled button,
 * "minimal" renders without a background, and "outlined" adds a border without fill.
 *
 * Matches the docs ButtonVariantExample.
 */
export const VariantExample: Story = {
    name: "Variant",
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Button>Default</Button>
            <Button variant="minimal">Minimal</Button>
            <Button variant="outlined">Outlined</Button>
        </div>
    ),
};

/**
 * Use the `size` prop to adjust the button dimensions.
 *
 * Matches the docs ButtonSizeExample.
 */
export const SizeExample: Story = {
    name: "Size",
    render: () => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
        </div>
    ),
};

/**
 * Buttons support `active`, `disabled`, and `loading` states.
 *
 * Matches the docs ButtonStatesExample.
 */
export const States: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Button>Default</Button>
            <Button active={true}>Active</Button>
            <Button disabled={true}>Disabled</Button>
            <Button loading={true}>Loading...</Button>
        </div>
    ),
};

/**
 * Use `icon` and `endIcon` props to render icons alongside text, or use `icon` alone for icon-only buttons.
 *
 * Matches the docs ButtonIconWithTextExample.
 */
export const IconsWithText: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Button icon="refresh" intent="danger" text="Reset" />
            <Button icon="user" endIcon="caret-down" text="Profile settings" />
            <Button endIcon="arrow-right" intent="success" text="Next step" />
        </div>
    ),
};

/**
 * Icon-only buttons omit the `text` prop. Always provide an `aria-label` for accessibility.
 *
 * Matches the docs ButtonIconExample.
 */
export const IconOnly: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Button icon="edit" aria-label="edit" />
            <Button icon="share" variant="outlined" aria-label="share" />
            <Button icon="filter" intent="primary" variant="minimal" aria-label="filter" />
            <Button icon="add" intent="success" aria-label="add" />
            <Button icon="trash" disabled={true} intent="danger" aria-label="delete" />
        </div>
    ),
};

/**
 * Use the `fill` prop to make the button expand to the full width of its container.
 *
 * Matches the docs ButtonFillExample.
 */
export const Fill: Story = {
    render: () => (
        <div style={{ width: "100%" }}>
            <Button fill={true}>Full Width Button</Button>
        </div>
    ),
    decorators: [
        Story => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
};

/**
 * Use the `alignText` prop to control text alignment within the button.
 * Best combined with `fill` or `icon`/`endIcon` to visualize the effect.
 *
 * Matches the docs ButtonAlignTextExample.
 */
export const AlignText: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }}>
            <Button alignText="start" icon="align-left" endIcon="caret-down">
                Start
            </Button>
            <Button alignText="center" icon="align-center" endIcon="caret-down">
                Center
            </Button>
            <Button alignText="end" icon="align-right" endIcon="caret-down">
                End
            </Button>
        </div>
    ),
};

/**
 * Use the `ellipsizeText` prop to truncate overflowing text with an ellipsis.
 *
 * Matches the docs ButtonEllipsizeTextExample.
 */
export const EllipsizeText: Story = {
    render: () => (
        <div style={{ display: "flex", maxWidth: 300 }}>
            <Button ellipsizeText={true}>This is a very long button label that will be truncated</Button>
        </div>
    ),
};

/**
 * All intents across all variants — solid, minimal, and outlined.
 *
 * Matches the docs overview of button intents × variants.
 */
export const AllIntentsAllVariants: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
                {Object.values(Intent).map(intent => (
                    <Button key={intent} intent={intent}>
                        {intent || "None"}
                    </Button>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                {Object.values(Intent).map(intent => (
                    <Button key={intent} variant="minimal" intent={intent}>
                        {intent || "None"}
                    </Button>
                ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                {Object.values(Intent).map(intent => (
                    <Button key={intent} variant="outlined" intent={intent}>
                        {intent || "None"}
                    </Button>
                ))}
            </div>
        </div>
    ),
};

/**
 * Interactive playground matching the docs-app ButtonPlaygroundExample.
 *
 * Shows both a `Button` and an `AnchorButton` with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [wiggling, setWiggling] = useState(false);
        const wiggleTimeoutId = useRef<number>();

        useEffect(() => {
            return () => window.clearTimeout(wiggleTimeoutId.current);
        }, []);

        const beginWiggling = useCallback(() => {
            window.clearTimeout(wiggleTimeoutId.current);
            setWiggling(true);
            wiggleTimeoutId.current = window.setTimeout(() => setWiggling(false), 300);
        }, []);

        return (
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>Button</span>
                    <Button
                        active={args.active}
                        alignText={args.alignText}
                        className={wiggling ? "docs-wiggle" : undefined}
                        disabled={args.disabled}
                        ellipsizeText={args.ellipsizeText}
                        endIcon={args.endIcon}
                        fill={args.fill}
                        icon={args.icon}
                        intent={args.intent}
                        loading={args.loading}
                        onClick={beginWiggling}
                        size={args.size}
                        text={args.text}
                        variant={args.variant}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>AnchorButton</span>
                    <AnchorButton
                        active={args.active}
                        alignText={args.alignText}
                        disabled={args.disabled}
                        ellipsizeText={args.ellipsizeText}
                        endIcon="share"
                        fill={args.fill}
                        href="#"
                        icon="duplicate"
                        intent={args.intent}
                        loading={args.loading}
                        size={args.size}
                        target="_blank"
                        text={args.text ?? "Duplicate"}
                        variant={args.variant}
                    />
                </div>
            </div>
        );
    },
    args: {
        text: "Click to wiggle",
        icon: "refresh",
        endIcon: undefined,
        intent: "none",
        variant: "solid",
        size: "medium",
    },
};
