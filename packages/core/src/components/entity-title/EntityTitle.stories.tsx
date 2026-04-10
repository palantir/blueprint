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
            options: ["Text", "H6", "H5", "H4", "H3", "H2", "H1"],
            mapping: {
                Text: undefined,
                H6,
                H5,
                H4,
                H3,
                H2,
                H1,
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
 * Use the `heading` prop to control the size of the entity title by rendering it as an HTML heading element.
 */
export const SizesExample: Story = {
    name: "Heading",
    argTypes: {
        heading: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <EntityTitle {...args} icon="document" title="Default (no heading)" />
            <EntityTitle {...args} icon="document" title="Heading H6" heading={H6} />
            <EntityTitle {...args} icon="document" title="Heading H5" heading={H5} />
            <EntityTitle {...args} icon="document" title="Heading H4" heading={H4} />
            <EntityTitle {...args} icon="document" title="Heading H3" heading={H3} />
            <EntityTitle {...args} icon="document" title="Heading H2" heading={H2} />
            <EntityTitle {...args} icon="document" title="Heading H1" heading={H1} />
        </div>
    ),
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
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Fill enabled</div>
                <div style={{ width: 400, border: "1px dashed #ccc", padding: 8 }}>
                    <div style={{ background: "#FFCCC4", borderRadius: 4, padding: "4px" }}>
                        <EntityTitle {...args} fill={true} title="Fill enabled" icon="document" />
                    </div>
                </div>
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Fill disabled</div>
                <div style={{ width: 400, border: "1px dashed #ccc", padding: 8 }}>
                    <div style={{ background: "#C4E1FF", borderRadius: 4, display: "inline-block", padding: "4px" }}>
                        <EntityTitle {...args} fill={false} title="Fill disabled" icon="document" />
                    </div>
                </div>
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
 * Use the `tags` prop to render `Tag` components alongside the title.
 */
export const TagsExample: Story = {
    name: "Tags",
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>With tag</div>
                <div style={{ border: "1px dashed #ccc", padding: 8 }}>
                    <EntityTitle {...args} icon="document" title="Document" tags={<Tag minimal={true}>Draft</Tag>} />
                </div>
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Without tag</div>
                <div style={{ border: "1px dashed #ccc", padding: 8 }}>
                    <EntityTitle {...args} icon="document" title="Document" />
                </div>
            </div>
        </div>
    ),
};

/**
 * Use the `subtitle` prop to render secondary descriptive text below the title.
 */
export const SubtitleExample: Story = {
    name: "Subtitle",
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <EntityTitle {...args} icon="document" title="Annual Report" subtitle="Last edited 2 hours ago" />
            <EntityTitle {...args} icon="folder-close" title="Project Files" subtitle="12 items" />
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
