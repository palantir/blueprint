/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { expect, waitFor } from "storybook/test";

import { Flex } from "@blueprintjs/labs";

import { Elevation } from "../../common";
import { Button } from "../button/buttons";

import { Section } from "./section";
import { SectionCard } from "./sectionCard";

const meta: Meta<typeof Section> = {
    title: "Core/Section",
    component: Section,
    decorators: [storybookLayoutDecorator],
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
        <Flex flexDirection="column" gap={4}>
            <StoryLabel title="Elevation 0" />
            <Section {...args} elevation={Elevation.ZERO}>
                <SectionCard>Content with zero elevation.</SectionCard>
            </Section>
            <StoryLabel title="Elevation 1" />
            <Section {...args} elevation={Elevation.ONE}>
                <SectionCard>Content with elevation one.</SectionCard>
            </Section>
        </Flex>
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
        <Flex flexDirection="column" gap={4}>
            <StoryLabel title="Default" />
            <Section {...args} compact={false}>
                <SectionCard>Default padding.</SectionCard>
            </Section>
            <StoryLabel title="Compact" />
            <Section {...args} compact={true}>
                <SectionCard>Compact padding.</SectionCard>
            </Section>
        </Flex>
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
        title: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <Section {...args} icon="settings" title="Settings">
                <SectionCard>Section with an icon.</SectionCard>
            </Section>
            <Section {...args} title="Configuration" subtitle="Manage your application settings">
                <SectionCard>Section with a subtitle.</SectionCard>
            </Section>
            <Section {...args} icon="cog" title="Advanced" subtitle="Expert-level options">
                <SectionCard>Section with both icon and subtitle.</SectionCard>
            </Section>
        </Flex>
    ),
};

/**
 * Use the `rightElement` prop to render an element on the right side of the section header.
 * This is commonly used for action buttons.
 */
export const RightElementExample: Story = {
    name: "Right Element",
    argTypes: {
        rightElement: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4}>
            <Section {...args} rightElement={<Button intent="primary" text="Edit" variant="minimal" />}>
                <SectionCard>Section with a right element action button.</SectionCard>
            </Section>
        </Flex>
    ),
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
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

/**
 * Use the `collapsible` prop to make the section's contents collapsible.
 * Clicking the section header toggles between expanded and collapsed states.
 */
export const Collapsible: Story = {
    args: {
        title: "Collapsible section",
        collapsible: true,
        children: <SectionCard>This section's content can be toggled by clicking the header.</SectionCard>,
    },
    argTypes: {
        collapsible: { table: { disable: true } },
    },
    play: async ({ canvas, userEvent, step }) => {
        const header = canvas.getByText("Collapsible section").closest(".bp6-section-header")!;
        const section = header.closest(".bp6-section")!;
        const collapseBody = section.querySelector(".bp6-collapse-body")!;
        const caret = canvas.getByRole("button", { name: /collapse section|expand section/ });

        await step("Section starts expanded with content visible", async () => {
            await expect(canvas.getByText(/content can be toggled/)).toBeVisible();
            await expect(collapseBody).toHaveAttribute("aria-hidden", "false");
            await expect(caret).toHaveAttribute("aria-expanded", "false");
        });

        await step("Click header to collapse the section", async () => {
            await userEvent.click(header);
            await waitFor(() => expect(collapseBody).toHaveAttribute("aria-hidden", "true"));
            await expect(section).toHaveClass("bp6-section-collapsed");
            await expect(collapseBody).toHaveAttribute("aria-hidden", "true");
            await expect(caret).toHaveAttribute("aria-expanded", "true");
        });

        await step("Click header again to re-expand the section", async () => {
            await userEvent.click(header);
            await waitFor(() => expect(collapseBody).toHaveAttribute("aria-hidden", "false"));
            await expect(canvas.getByText(/content can be toggled/)).toBeVisible();
            await expect(section).not.toHaveClass("bp6-section-collapsed");
            await expect(caret).toHaveAttribute("aria-expanded", "false");
        });
    },
};
