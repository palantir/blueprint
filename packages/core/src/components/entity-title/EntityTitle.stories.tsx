/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { H1, H2, H3, H4, H5, H6 } from "../html/html";
import { Tag } from "../tag/tag";

import { EntityTitle } from "./entityTitle";

const meta: Meta<typeof EntityTitle> = {
    title: "Core/EntityTitle",
    component: EntityTitle,
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
        title: "Entity Title",
        icon: undefined,
        heading: undefined,
        subtitle: undefined,
        ellipsize: false,
        fill: false,
        loading: false,
        titleURL: undefined,
    },
    argTypes: {
        title: {
            control: "text",
        },
        subtitle: {
            control: "text",
        },
        icon: {
            control: "text",
        },
        heading: {
            control: "select",
            options: ["Text", "H1", "H2", "H3", "H4", "H5", "H6"],
            mapping: {
                Text: undefined,
                H1,
                H2,
                H3,
                H4,
                H5,
                H6,
            },
        },
        ellipsize: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        loading: {
            control: "boolean",
        },
        titleURL: {
            control: "text",
        },
    },
} satisfies Meta<typeof EntityTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic entity title with default styling.
 */
export const Default: Story = {
    args: {
        title: "Entity Title",
    },
};

/**
 * Use the `icon` prop to render an icon alongside the title.
 */
export const WithIcon: Story = {
    args: {
        title: "Entity Title",
        icon: "document",
    },
};

/**
 * Use the `subtitle` prop to render descriptive text below the title.
 */
export const WithSubtitle: Story = {
    args: {
        title: "Entity Title",
        subtitle: "A short description of this entity",
        icon: "document",
    },
};

/**
 * Use Blueprint heading components (`H1`-`H6`) via the `heading` prop to control the title size.
 */
export const AllHeadingLevels: Story = {
    argTypes: {
        heading: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
                { label: "H1", component: H1 },
                { label: "H2", component: H2 },
                { label: "H3", component: H3 },
                { label: "H4", component: H4 },
                { label: "H5", component: H5 },
                { label: "H6", component: H6 },
                { label: "Text (default)", component: undefined },
            ].map(({ label, component }) => (
                <EntityTitle key={label} {...args} heading={component} title={label} icon="document" />
            ))}
        </div>
    ),
};

/**
 * Use the `titleURL` prop to wrap the title in an anchor link.
 */
export const WithTitleURL: Story = {
    args: {
        title: "Linked Entity",
        titleURL: "https://blueprintjs.com",
        icon: "link",
        subtitle: "Click the title to open the link",
    },
};

/**
 * Use the `loading` prop to render a skeleton loading state.
 */
export const Loading: Story = {
    args: {
        title: "Loading Entity",
        icon: "document",
        subtitle: "Loading subtitle",
        loading: true,
    },
};

/**
 * Use the `ellipsize` prop to truncate overflowing text with an ellipsis.
 */
export const Ellipsize: Story = {
    decorators: [
        Story => (
            <div style={{ width: "200px" }}>
                <Story />
            </div>
        ),
    ],
    args: {
        title: "This is a very long entity title that should be ellipsized",
        subtitle: "This is a very long subtitle that should also be ellipsized",
        icon: "document",
        ellipsize: true,
    },
};

/**
 * Use the `fill` prop to make the entity title expand to fill its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "400px", border: "1px dashed #ccc", padding: 8 }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <EntityTitle {...args} fill={true} title="Fill enabled" icon="document" />
            <EntityTitle {...args} fill={false} title="Fill disabled" icon="document" />
        </div>
    ),
};

/**
 * Use the `tags` prop to render tag elements alongside the title.
 */
export const WithTags: Story = {
    args: {
        title: "Entity Title",
        icon: "document",
        subtitle: "An entity with tags",
        tags: (
            <>
                <Tag intent="primary" size="medium">
                    Primary
                </Tag>
                <Tag intent="success" size="medium">
                    Active
                </Tag>
            </>
        ),
    },
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        return (
            <EntityTitle
                ellipsize={args.ellipsize}
                fill={args.fill}
                heading={args.heading}
                icon={args.icon}
                loading={args.loading}
                subtitle={args.subtitle}
                title={args.title}
                titleURL={args.titleURL}
            />
        );
    },
    args: {
        title: "Playground Entity",
        icon: "document",
        subtitle: "A subtitle for the playground",
        heading: undefined,
        ellipsize: false,
        fill: false,
        loading: false,
        titleURL: undefined,
    },
};
