/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Boundary } from "../../common";
import { type BreadcrumbProps } from "./breadcrumb";
import { Breadcrumbs } from "./breadcrumbs";

const SAMPLE_ITEMS: BreadcrumbProps[] = [
    { text: "Home", href: "#", icon: "home" },
    { text: "Projects", href: "#", icon: "projects" },
    { text: "Blueprint", href: "#" },
    { text: "Components", href: "#" },
    { text: "Breadcrumbs" },
];

const meta: Meta<typeof Breadcrumbs> = {
    title: "Core/Breadcrumbs",
    component: Breadcrumbs,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "400px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        items: SAMPLE_ITEMS,
        collapseFrom: Boundary.START,
    },
    argTypes: {
        collapseFrom: {
            control: "select",
            options: Object.values(Boundary),
        },
        minVisibleItems: {
            control: "number",
        },
    },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic breadcrumbs component with default styling.
 */
export const Default: Story = {
    args: {
        items: SAMPLE_ITEMS,
    },
};

/**
 * Use the `collapseFrom` prop to control which end of the breadcrumb trail is collapsed when items overflow.
 */
export const CollapseFromExample: Story = {
    name: "Collapse From",
    argTypes: {
        collapseFrom: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Collapse from start (default)</div>
                <div style={{ width: 300 }}>
                    <Breadcrumbs {...args} collapseFrom={Boundary.START} />
                </div>
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Collapse from end</div>
                <div style={{ width: 300 }}>
                    <Breadcrumbs {...args} collapseFrom={Boundary.END} />
                </div>
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
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Constrained width (300px)</div>
                <div style={{ width: 300 }}>
                    <Breadcrumbs {...args} />
                </div>
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Full width</div>
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
};
