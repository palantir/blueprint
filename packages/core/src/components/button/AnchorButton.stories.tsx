/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";

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
    decorators: [storybookLayoutDecorator],
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
        icon: "link",
        target: "_blank",
    },
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
