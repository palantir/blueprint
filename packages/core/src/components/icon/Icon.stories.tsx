/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
// eslint-disable-next-line import/no-extraneous-dependencies
import { pascalCase } from "change-case";
import classNames from "classnames";
import type { ComponentType } from "react";

import type { IconName } from "@blueprintjs/icons";
import * as BlueprintIcons from "@blueprintjs/icons";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import { Classes, Intent } from "../../common";

import { Icon, IconSize } from "./icon";

const meta: Meta<typeof Icon> = {
    title: "Core/Icon",
    component: Icon,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Story />
            </div>
        ),
    ],
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
        <div style={{ display: "flex", gap: 8 }}>
            {Object.values(Intent).map(intent => (
                <Icon key={intent} {...args} intent={intent} />
            ))}
        </div>
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
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Icon {...args} size={IconSize.STANDARD} />
            <Icon {...args} size={IconSize.LARGE} />
        </div>
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

/**
 * Import the icon SVG component directly from `@blueprintjs/icons` and render it without the `<Icon>` wrapper.
 * This avoids async loading and gives you a plain `<svg>` element.
 */
export const StaticSvg: Story = {
    name: "Static SVG",
    render: args => {
        const name = pascalCase(args.icon as string);
        const IconComponent = (BlueprintIcons as unknown as Record<string, ComponentType<{ size?: number }>>)[name];
        if (IconComponent == null) {
            return <span>Unknown icon: {args.icon as string}</span>;
        }
        return <IconComponent size={args.size} />;
    },
};

/**
 * Render an icon using Blueprint's CSS icon font classes instead of SVG.
 * This approach uses a `<span>` with the appropriate CSS classes and font-family overrides.
 */
export const CssIconFont: Story = {
    name: "CSS Icon Font",
    parameters: {
        chromatic: { delay: 250 },
    },
    play: async () => {
        if (document.fonts != null) {
            await document.fonts.ready;
        }
    },
    render: args => {
        const iconName = args.icon as IconName;
        const size = args.size ?? 16;
        const sizeClass = size < 20 ? Classes.ICON_STANDARD : Classes.ICON_LARGE;
        const fontFamily =
            sizeClass === Classes.ICON_STANDARD
                ? '"blueprint-icons-16", sans-serif'
                : '"blueprint-icons-20", sans-serif';
        return (
            <span
                className={classNames(Classes.ICON, sizeClass, Classes.iconClass(iconName))}
                style={{ fontFamily, fontSize: size, height: size, width: size }}
            />
        );
    },
};
