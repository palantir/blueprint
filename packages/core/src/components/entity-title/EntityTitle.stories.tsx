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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Fill enabled</div>
                <EntityTitle {...args} fill={true} title="Fill enabled" icon="document" />
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Fill disabled</div>
                <EntityTitle {...args} fill={false} title="Fill disabled" icon="document" />
            </div>
        </div>
    ),
};

/**
 * Use the `ellipsize` prop to truncate long titles with an ellipsis when they overflow their container.
 */
export const EllipsizeExample: Story = {
    name: "Ellipsize",
    argTypes: {
        ellipsize: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "250px", border: "1px dashed #ccc", padding: 8 }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Ellipsize enabled</div>
                <EntityTitle
                    {...args}
                    ellipsize={true}
                    icon="document"
                    title="This is a very long entity title that should be ellipsized"
                />
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Ellipsize disabled</div>
                <EntityTitle
                    {...args}
                    ellipsize={false}
                    icon="document"
                    title="This is a very long entity title that will not be ellipsized"
                />
            </div>
        </div>
    ),
};

/**
 * Use the `loading` prop to show a skeleton loading state.
 */
export const LoadingExample: Story = {
    name: "Loading",
    argTypes: {
        loading: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Loading</div>
                <EntityTitle {...args} loading={true} icon="document" title="Loading Entity" />
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Not loading</div>
                <EntityTitle {...args} loading={false} icon="document" title="Loaded Entity" />
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
