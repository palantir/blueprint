/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../card/card";

import { CardList } from "./cardList";

const meta: Meta<typeof CardList> = {
    title: "Core/Card/CardList",
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
 * Use the `bordered` prop to control the visual border and elevation around the list.
 * Set `bordered={false}` when embedding the CardList inside another bordered container.
 */
export const BorderedExample: Story = {
    name: "Bordered",
    argTypes: {
        bordered: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Bordered</span>
                <CardList {...args} bordered={true} style={{ maxWidth: 200 }}>
                    <Card>Bread</Card>
                    <Card>Cheese</Card>
                    <Card>Butter</Card>
                </CardList>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Not bordered</span>
                <CardList {...args} bordered={false} style={{ maxWidth: 200 }}>
                    <Card>Honey</Card>
                    <Card>Jam</Card>
                    <Card>Peanut Butter</Card>
                </CardList>
            </div>
        </div>
    ),
};

/**
 * Use the `compact` prop to render a denser list with reduced padding.
 */
export const CompactExample: Story = {
    name: "Compact",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
                <CardList {...args} compact={false} style={{ maxWidth: 200 }}>
                    <Card>Apples</Card>
                    <Card>Oranges</Card>
                    <Card>Bananas</Card>
                </CardList>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Compact</span>
                <CardList {...args} compact={true} style={{ maxWidth: 200 }}>
                    <Card>Apples</Card>
                    <Card>Oranges</Card>
                    <Card>Bananas</Card>
                </CardList>
            </div>
        </div>
    ),
};

/**
 * Card children can be made interactive with hover and active states.
 */
export const InteractiveCards: Story = {
    name: "Interactive Cards",
    render: args => (
        <CardList {...args} style={{ maxWidth: 300 }}>
            {FRUITS.map(fruit => (
                <Card key={fruit} interactive={true}>
                    {fruit}
                </Card>
            ))}
        </CardList>
    ),
};

/**
 * Card children can use the `selected` prop to display a selected visual state.
 */
export const SelectedCards: Story = {
    name: "Selected Cards",
    render: args => (
        <CardList {...args} style={{ maxWidth: 300 }}>
            <Card>Apples</Card>
            <Card selected={true}>Oranges (selected)</Card>
            <Card>Bananas</Card>
            <Card selected={true}>Grapes (selected)</Card>
            <Card>Mangoes</Card>
        </CardList>
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
