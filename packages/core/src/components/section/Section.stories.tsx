/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Elevation } from "../../common";

import { Section } from "./section";
import { SectionCard } from "./sectionCard";

const meta: Meta<typeof Section> = {
    title: "Core/Section",
    component: Section,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "500px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        title: "Section title",
        elevation: Elevation.ZERO,
        compact: false,
        collapsible: false,
    },
    argTypes: {
        elevation: {
            control: "select",
            options: [Elevation.ZERO, Elevation.ONE],
        },
        compact: {
            control: "boolean",
        },
        collapsible: {
            control: "boolean",
        },
        icon: {
            control: "text",
        },
        subtitle: {
            control: "text",
        },
    },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic section with a title and some content.
 */
export const Default: Story = {
    args: {
        title: "Section title",
        children: <SectionCard>Section content goes here.</SectionCard>,
    },
};

/**
 * Use the `elevation` prop to control the visual depth of the section.
 * Section supports `Elevation.ZERO` and `Elevation.ONE`.
 */
export const ElevationExample: Story = {
    name: "Elevation",
    argTypes: {
        elevation: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Elevation 0</span>
                <Section {...args} elevation={Elevation.ZERO}>
                    <SectionCard>Content with zero elevation.</SectionCard>
                </Section>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Elevation 1</span>
                <Section {...args} elevation={Elevation.ONE}>
                    <SectionCard>Content with elevation one.</SectionCard>
                </Section>
            </div>
        </div>
    ),
};

/**
 * Use the `compact` prop to render a section with reduced padding.
 */
export const CompactExample: Story = {
    name: "Compact",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <Section {...args} compact={false}>
                    <SectionCard>Default padding.</SectionCard>
                </Section>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Compact</span>
                <Section {...args} compact={true}>
                    <SectionCard>Compact padding.</SectionCard>
                </Section>
            </div>
        </div>
    ),
};

/**
 * Use the `icon` prop to render an icon in the section header,
 * and `subtitle` to display additional context below the title.
 */
export const IconExample: Story = {
    name: "Icon & Subtitle",
    argTypes: {
        icon: { table: { disable: true } },
        subtitle: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
            <Section {...args} icon="settings" title="Settings">
                <SectionCard>Section with an icon.</SectionCard>
            </Section>
            <Section {...args} title="Configuration" subtitle="Manage your application settings">
                <SectionCard>Section with a subtitle.</SectionCard>
            </Section>
            <Section {...args} icon="cog" title="Advanced" subtitle="Expert-level options">
                <SectionCard>Section with both icon and subtitle.</SectionCard>
            </Section>
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        title: "Playground section",
        icon: "folder-open",
        subtitle: "Explore section props",
        elevation: Elevation.ONE,
        children: <SectionCard>Section content goes here.</SectionCard>,
    },
};
