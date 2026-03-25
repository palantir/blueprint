/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Elevation } from "../../common";

import { Button } from "../button/button";
import { Section } from "./section";
import { SectionCard } from "./sectionCard";

const meta: Meta<typeof Section> = {
    title: "Core/Section/Section",
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
export const IconAndSubtitle: Story = {
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
 * Use the `rightElement` prop to render a custom element on the right side of the section header.
 */
export const RightElement: Story = {
    name: "Right Element",
    render: args => (
        <Section
            {...args}
            title="Users"
            rightElement={<Button text="Add user" icon="plus" size="small" variant="outlined" />}
        >
            <SectionCard>Section with a right element in the header.</SectionCard>
        </Section>
    ),
};

/**
 * Use the `collapsible` prop to make the section content collapsible.
 */
export const Collapsible: Story = {
    name: "Collapsible",
    argTypes: {
        collapsible: { table: { disable: true } },
    },
    args: {
        collapsible: true,
        title: "Collapsible section",
        children: <SectionCard>This content can be collapsed by clicking the section header.</SectionCard>,
    },
};

/**
 * Multiple SectionCard children create visually divided content areas.
 */
export const MultipleSectionCards: Story = {
    name: "Multiple Section Cards",
    render: args => (
        <Section {...args} title="Details">
            <SectionCard>First card content.</SectionCard>
            <SectionCard>Second card content.</SectionCard>
            <SectionCard>Third card content.</SectionCard>
        </Section>
    ),
};

/**
 * Controlled collapsible section with external state management.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(true);
        const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
                <Section
                    {...args}
                    title="Controlled collapsible"
                    icon="folder-open"
                    subtitle="Click the header to toggle"
                    collapsible={true}
                    collapseProps={{ isOpen, onToggle: handleToggle }}
                    rightElement={<Button text="Edit" icon="edit" size="small" variant="outlined" />}
                >
                    <SectionCard>First section of content.</SectionCard>
                    <SectionCard>Second section of content.</SectionCard>
                </Section>
            </div>
        );
    },
};
