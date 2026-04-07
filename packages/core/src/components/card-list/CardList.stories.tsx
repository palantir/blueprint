/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../card/card";
import { Section } from "../section/section";
import { SectionCard } from "../section/sectionCard";

import { CardList } from "./cardList";

const meta: Meta<typeof CardList> = {
    title: "Core/CardList",
    component: CardList,
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
        bordered: true,
        compact: false,
    },
    argTypes: {
        bordered: { control: "boolean" },
        compact: { control: "boolean" },
    },
} satisfies Meta<typeof CardList>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUITS = ["Apples", "Oranges", "Bananas", "Grapes", "Mangoes"];

/**
 * A basic CardList with simple Card children.
 */
export const Default: Story = {
    render: args => (
        <CardList {...args} style={{ maxWidth: 300 }}>
            {FRUITS.map(fruit => (
                <Card key={fruit}>{fruit}</Card>
            ))}
        </CardList>
    ),
};

/**
 * CardList supports `bordered`, `compact`, `interactive`, and `selected` states across its Card children.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        bordered: { table: { disable: true } },
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Bordered</span>
                <CardList {...args} bordered={true} compact={false} style={{ maxWidth: 200 }}>
                    <Card>Plain</Card>
                    <Card interactive={true}>Interactive</Card>
                    <Card selected={true}>Selected</Card>
                </CardList>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Compact</span>
                <CardList {...args} bordered={true} compact={true} style={{ maxWidth: 200 }}>
                    <Card>Plain</Card>
                    <Card interactive={true}>Interactive</Card>
                    <Card selected={true}>Selected</Card>
                </CardList>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Not bordered</span>
                <CardList {...args} bordered={false} compact={false} style={{ maxWidth: 200 }}>
                    <Card>Plain</Card>
                    <Card interactive={true}>Interactive</Card>
                    <Card selected={true}>Selected</Card>
                </CardList>
            </div>
        </div>
    ),
};

/**
 * All configurations: bordered vs non-bordered, default vs compact, with interactive and selected states.
 */
export const AllConfigurations: Story = {
    argTypes: {
        bordered: { table: { disable: true } },
        compact: { table: { disable: true } },
    },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[false, true].map(compact => (
                <div key={String(compact)} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{compact ? "Compact" : "Default"}</div>
                    <div style={{ display: "flex", gap: 16 }}>
                        {[true, false].map(bordered => (
                            <CardList
                                key={String(bordered)}
                                bordered={bordered}
                                compact={compact}
                                style={{ maxWidth: 200 }}
                            >
                                <Card>Plain</Card>
                                <Card interactive={true}>Interactive</Card>
                                <Card selected={true}>Selected</Card>
                            </CardList>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ),
};

const INGREDIENTS = ["Tomatoes", "Garlic", "Olive Oil", "Basil", "Parmesan", "Pine Nuts"];

/**
 * CardList can be embedded inside a Section → SectionCard to create a scrollable list within a section.
 * Set the same value for `SectionCard padded` and `CardList bordered` for a consistent appearance.
 */
export const CombiningWithSection: Story = {
    argTypes: {
        bordered: { table: { disable: true } },
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24, width: 800 }}>
            <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>padded=false, bordered=false</span>
                <Section title="Fresh Ingredients" style={{ width: 350 }}>
                    <SectionCard padded={false} style={{ height: 152, overflowY: "auto" }}>
                        <CardList {...args} bordered={false}>
                            {INGREDIENTS.map(item => (
                                <Card key={item}>{item}</Card>
                            ))}
                        </CardList>
                    </SectionCard>
                </Section>
            </div>
            <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>padded=true, bordered=true</span>
                <Section title="Fresh Ingredients" style={{ width: 350 }}>
                    <SectionCard padded={true} style={{ height: 152, overflowY: "auto" }}>
                        <CardList {...args} bordered={true}>
                            {INGREDIENTS.map(item => (
                                <Card key={item}>{item}</Card>
                            ))}
                        </CardList>
                    </SectionCard>
                </Section>
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all props exposed via Storybook controls.
 */
export const Playground: Story = {
    render: args => (
        <CardList {...args} style={{ maxWidth: 300 }}>
            <Card interactive={true}>First item</Card>
            <Card interactive={true}>Second item</Card>
            <Card interactive={true} selected={true}>
                Third item (selected)
            </Card>
            <Card interactive={true}>Fourth item</Card>
        </CardList>
    ),
};
