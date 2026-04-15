/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StorybookLayout, storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import React from "react";

import { Boundary } from "../../common/boundary";

import { type BreadcrumbProps } from "./breadcrumb";
import { Breadcrumbs } from "./breadcrumbs";

const SAMPLE_ITEMS: BreadcrumbProps[] = [
    { text: "Home", href: "#", icon: "home" },
    { text: "Projects", href: "#", icon: "projects" },
    { text: "Blueprint", href: "#" },
    { text: "Components", href: "#" },
    { text: "Breadcrumbs" },
];

// Adding extra width arg to showcase Breadcrumbs dynamically
type StoryArgs = React.ComponentProps<typeof Breadcrumbs> & { width?: number };

const meta: Meta<StoryArgs> = {
    title: "Core/Breadcrumbs",
    component: Breadcrumbs,
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "centered",
    },
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
            <Breadcrumbs {...args} />
        </div>
    ),
};

/**
 * Use the `collapseFrom` prop to control which end of the breadcrumb trail is collapsed when items overflow.
 */
export const CollapseFromExample: Story = {
    name: "Collapse From",
    argTypes: {
        collapseFrom: { table: { disable: true } },
    },
    render: ({ width, ...args }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width }}>
                <StoryLabel title="Collapse from start (default)" />
                <Breadcrumbs {...args} collapseFrom={Boundary.START} />
            </div>
            <div style={{ width }}>
                <StoryLabel title="Collapse from end" />
                <Breadcrumbs {...args} collapseFrom={Boundary.END} />
            </div>
        </div>
    ),
};

/**
 * When the breadcrumb trail contains many items, overflow is handled by collapsing items into a dropdown.
 */
export const OverflowExample: Story = {
    name: "Overflow",
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <StoryLabel title="Constrained width (300px)" />
                <div style={{ width: 300 }}>
                    <Breadcrumbs {...args} />
                </div>
            </div>
            <div>
                <StoryLabel title="Full width" />
                <div style={{ width: 600 }}>
                    <Breadcrumbs {...args} />
                </div>
            </div>
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
            <Breadcrumbs {...args} />
        </div>
    ),
};
