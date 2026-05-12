/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashedPaddedContainer, storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Colors } from "@blueprintjs/colors";
import { Home } from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";

import { H1, H2, H3, H4, H5, H6 } from "../html/html";
import { Tag } from "../tag/tag";

import { EntityTitle } from "./entityTitle";

const HEADINGS = [
    { heading: H1, label: "H1" },
    { heading: H2, label: "H2" },
    { heading: H3, label: "H3" },
    { heading: H4, label: "H4" },
    { heading: H5, label: "H5" },
    { heading: H6, label: "H6" },
] as const satisfies ReadonlyArray<{ heading: React.FC; label: string }>;

const meta: Meta<typeof EntityTitle> = {
    title: "Core/EntityTitle",
    component: EntityTitle,
    decorators: [storybookLayoutDecorator],
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
            table: { disable: true },
        },
        heading: {
            control: "select",
            options: ["Text", ...HEADINGS.map(h => h.label)],
            mapping: {
                Text: undefined,
                ...Object.fromEntries(HEADINGS.map(({ label, heading }) => [label, heading])),
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
        subtitle: {
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
 * Use the `heading` prop to control the size of the entity title by rendering it as an HTML heading element.
 */
export const HeadingsExample: Story = {
    name: "Heading",
    argTypes: {
        heading: { table: { disable: true } },
        title: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={5}>
            {HEADINGS.map(({ heading, label }) => (
                <EntityTitle key={label} {...args} icon="document" title={`Heading ${label}`} heading={heading} />
            ))}
            <EntityTitle {...args} icon="document" title="Default (no heading)" />
        </Flex>
    ),
};

/**
 * Use the `icon` prop to render an icon alongside the title.
 */
export const IconExample: Story = {
    name: "Icon",
    argTypes: {
        title: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3}>
            <EntityTitle {...args} icon="document" title="Document" />
            <EntityTitle {...args} icon="folder-close" title="Folder" />
            <EntityTitle {...args} icon="user" title="User" />
            <EntityTitle {...args} icon={<Home />} title="Element icon" />
            <EntityTitle {...args} icon={undefined} title="No icon" />
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the entity title expand to fill its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
        title: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <div>
                <StoryLabel title="Fill enabled" />
                <DashedPaddedContainer>
                    <div style={{ background: Colors.RED5, borderRadius: 4, padding: 4 }}>
                        <EntityTitle {...args} fill={true} title="Fill enabled" icon="document" />
                    </div>
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Fill disabled" />
                <DashedPaddedContainer>
                    <div style={{ background: Colors.BLUE5, borderRadius: 4, display: "inline-block", padding: 4 }}>
                        <EntityTitle {...args} fill={false} title="Fill disabled" icon="document" />
                    </div>
                </DashedPaddedContainer>
            </div>
        </Flex>
    ),
};

/**
 * Use the `ellipsize` prop to truncate long titles with an ellipsis when they overflow their container.
 */
export const EllipsizeExample: Story = {
    name: "Ellipsize",
    argTypes: {
        ellipsize: { table: { disable: true } },
        title: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <Flex justifyContent="center" alignItems="center">
                <Story />
            </Flex>
        ),
    ],
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <div>
                <StoryLabel title="Ellipsize enabled" />
                <DashedPaddedContainer width={250}>
                    <EntityTitle
                        {...args}
                        ellipsize={true}
                        icon="document"
                        title="This is a very long entity title that should be ellipsized"
                    />
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Ellipsize disabled" />
                <DashedPaddedContainer width={250}>
                    <EntityTitle
                        {...args}
                        ellipsize={false}
                        icon="document"
                        title="This is a very long entity title that will not be ellipsized"
                    />
                </DashedPaddedContainer>
            </div>
        </Flex>
    ),
};

/**
 * Use the `loading` prop to show a skeleton loading state.
 */
export const LoadingExample: Story = {
    name: "Loading",
    argTypes: {
        loading: { table: { disable: true } },
        title: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <div>
                <StoryLabel title="Loading" />
                <DashedPaddedContainer width={250}>
                    <EntityTitle {...args} loading={true} icon="document" title="Loading Entity" />
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Not loading" />
                <DashedPaddedContainer width={250}>
                    <EntityTitle {...args} loading={false} icon="document" title="Loaded Entity" />
                </DashedPaddedContainer>
            </div>
        </Flex>
    ),
};

/**
 * Use the `tags` prop to render `Tag` components alongside the title.
 */
export const TagsExample: Story = {
    name: "Tags",
    argTypes: {
        title: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <div>
                <StoryLabel title="With tag" />
                <DashedPaddedContainer>
                    <EntityTitle {...args} icon="document" title="Document" tags={<Tag minimal={true}>Draft</Tag>} />
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Without tag" />
                <DashedPaddedContainer>
                    <EntityTitle {...args} icon="document" title="Document" />
                </DashedPaddedContainer>
            </div>
        </Flex>
    ),
};

/**
 * Use the `subtitle` prop to render secondary descriptive text below the title.
 */
export const SubtitleExample: Story = {
    name: "Subtitle",
    argTypes: {
        title: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={3}>
            <EntityTitle {...args} icon="document" title="Annual Report" subtitle="Last edited 2 hours ago" />
            <EntityTitle {...args} icon="folder-close" title="Project Files" subtitle="12 items" />
        </Flex>
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
