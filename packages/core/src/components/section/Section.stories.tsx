/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/buttons";
import { Elevation } from "../../common";
import { Section } from "./section";

const meta = {
    title: "Core/Section",
    component: Section,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        title: "Section title",
        compact: false,
        elevation: Elevation.ZERO,
    },
    argTypes: {
        elevation: {
            control: "select",
            options: [Elevation.ZERO, Elevation.ONE],
        },
    },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic section with title and content.
 */
export const Default: Story = {
    args: {
        children: "Section body content goes here.",
    },
};

/**
 * Section with subtitle and icon.
 */
export const WithSubtitleAndIcon: Story = {
    args: {
        title: "Settings",
        subtitle: "Configure your preferences",
        icon: "cog",
        children: "Section content.",
    },
};

/**
 * Collapsible section.
 */
export const Collapsible: Story = {
    args: {
        title: "Collapsible section",
        collapsible: true,
        collapseProps: { defaultIsOpen: true },
        children: "This content can be collapsed by clicking the header.",
    },
};

/**
 * Section with right element (e.g. button).
 */
export const WithRightElement: Story = {
    args: {
        title: "Section with action",
        rightElement: <Button size="small" text="Edit" />,
        children: "Content with a header action.",
    },
};

/**
 * Compact section.
 */
export const Compact: Story = {
    args: {
        title: "Compact",
        compact: true,
        children: "Reduced padding.",
    },
};

/**
 * Section with elevation.
 */
export const WithElevation: Story = {
    args: {
        title: "Elevated section",
        elevation: Elevation.ONE,
        children: "This section has a subtle shadow.",
    },
};
