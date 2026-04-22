/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";
import React from "react";

import { Boundary } from "../../common/boundary";
import type { BreadcrumbProps } from "../breadcrumbs/breadcrumb";

import { BreadcrumbsNext } from "./breadcrumbsNext";

const SAMPLE_ITEMS: BreadcrumbProps[] = [
    { text: "Home", href: "#", icon: "home" },
    { text: "Projects", href: "#", icon: "projects" },
    { text: "Blueprint", href: "#" },
    { text: "Components", href: "#" },
    { text: "Breadcrumbs" },
];

type StoryArgs = React.ComponentProps<typeof BreadcrumbsNext> & { width?: number };

const meta: Meta<StoryArgs> = {
    title: "Core/BreadcrumbsNext",
    component: BreadcrumbsNext,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        items: SAMPLE_ITEMS,
        collapseFrom: Boundary.START,
        width: 400,
    },
    argTypes: {
        collapseFrom: {
            control: "select",
            options: Object.values(Boundary),
        },
        minVisibleItems: {
            control: "number",
        },
        width: { control: { type: "range", min: 100, max: 800, step: 10 } },
    },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic breadcrumbs component with default styling. Adjust the width slider to see overflow behavior.
 */
export const Default: Story = {
    render: ({ width, ...args }) => (
        <div style={{ width }}>
            <BreadcrumbsNext {...args} />
        </div>
    ),
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        items: SAMPLE_ITEMS,
        collapseFrom: Boundary.START,
        minVisibleItems: 0,
    },
    render: ({ width, ...args }) => (
        <div style={{ width }}>
            <BreadcrumbsNext {...args} />
        </div>
    ),
};
