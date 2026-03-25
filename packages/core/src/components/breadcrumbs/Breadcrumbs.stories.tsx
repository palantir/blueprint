/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Boundary } from "../../common";
import { Breadcrumb, type BreadcrumbProps } from "./breadcrumb";
import { Breadcrumbs } from "./breadcrumbs";

const SAMPLE_ITEMS: BreadcrumbProps[] = [
    { text: "Home", href: "#", icon: "home" },
    { text: "Projects", href: "#", icon: "projects" },
    { text: "Blueprint", href: "#" },
    { text: "Components", href: "#" },
    { text: "Breadcrumbs" },
];

const meta: Meta<typeof Breadcrumbs> = {
    title: "Core/Breadcrumbs/Breadcrumbs",
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

export const Default: Story = {
    args: {
        items: SAMPLE_ITEMS,
    },
};

export const CollapseFrom: Story = {
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

export const WithIcons: Story = {
    name: "With Icons",
    args: {
        items: [
            { text: "Home", href: "#", icon: "home" },
            { text: "Settings", href: "#", icon: "cog" },
            { text: "Profile", href: "#", icon: "person" },
            { text: "Notifications" },
        ],
    },
};

export const DisabledItems: Story = {
    name: "Disabled Items",
    args: {
        items: [
            { text: "Home", href: "#" },
            { text: "Archived", href: "#", disabled: true },
            { text: "Projects", href: "#" },
            { text: "Current Page" },
        ],
    },
};

export const Overflow: Story = {
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

export const MinVisibleItems: Story = {
    name: "Min Visible Items",
    argTypes: {
        minVisibleItems: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 250 }}>
            {[0, 1, 2, 3].map(minVisibleItems => (
                <div key={minVisibleItems}>
                    <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                        minVisibleItems: {minVisibleItems}
                    </div>
                    <Breadcrumbs {...args} minVisibleItems={minVisibleItems} />
                </div>
            ))}
        </div>
    ),
};

export const CustomRenderer: Story = {
    name: "Custom Breadcrumb Renderer",
    args: {
        items: SAMPLE_ITEMS,
        breadcrumbRenderer: (props: BreadcrumbProps) => (
            <Breadcrumb {...props} icon={props.icon ?? "folder-close"} />
        ),
    },
};

export const Playground: Story = {
    args: {
        items: SAMPLE_ITEMS,
        collapseFrom: Boundary.START,
        minVisibleItems: 0,
    },
};
