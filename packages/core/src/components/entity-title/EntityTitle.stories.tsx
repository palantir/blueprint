/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { H1, H2, H3, H4, H5, H6 } from "../html/html";

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
        ellipsize: false,
        fill: false,
        loading: false,
    },
    argTypes: {
        title: {
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
export const IconExample: Story = {
    name: "Icon",
    argTypes: {
        icon: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <EntityTitle {...args} icon="document" title="Document" />
            <EntityTitle {...args} icon="folder-close" title="Folder" />
            <EntityTitle {...args} icon="user" title="User" />
            <EntityTitle {...args} icon={undefined} title="No icon" />
        </div>
    ),
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
 * Use the `loading` and `ellipsize` props to control loading state and text overflow.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        loading: { table: { disable: true } },
        ellipsize: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Loading</div>
                <EntityTitle {...args} loading={true} icon="document" title="Loading Entity" />
            </div>
            <div style={{ width: "200px" }}>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Ellipsize</div>
                <EntityTitle
                    {...args}
                    ellipsize={true}
                    icon="document"
                    title="This is a very long entity title that should be ellipsized"
                />
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        title: "Playground Entity",
        icon: "document",
        heading: undefined,
        ellipsize: false,
        fill: false,
        loading: false,
    },
};
