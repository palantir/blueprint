/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StorybookLayout, storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { useArgs, useCallback } from "storybook/preview-api";

import { Card } from "../card/card";

import { CardList } from "./cardList";

type CardListStoryArgs = React.ComponentProps<typeof CardList> & { selectedIndex: number };

const meta: Meta<CardListStoryArgs> = {
    title: "Core/CardList",
    component: CardList,
    decorators: [storybookLayoutDecorator],
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
} satisfies Meta<CardListStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRUITS = ["Apples", "Oranges", "Bananas", "Grapes", "Mangoes"];

/**
 * A basic CardList with simple Card children.
 */
export const Default: Story = {
    render: args => (
        <CardList {...args}>
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
                <StoryLabel title="Bordered" />
                <CardList {...args} bordered={true} compact={false}>
                    <Card>Plain</Card>
                    <Card interactive={true}>Interactive</Card>
                    <Card selected={true}>Selected</Card>
                </CardList>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="Compact" />
                <CardList {...args} bordered={true} compact={true}>
                    <Card>Plain</Card>
                    <Card interactive={true}>Interactive</Card>
                    <Card selected={true}>Selected</Card>
                </CardList>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="Not bordered" />
                <CardList {...args} bordered={false} compact={false}>
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
                    <StoryLabel title={compact ? "Compact" : "Default"} />
                    <div style={{ display: "flex", gap: 16 }}>
                        {[true, false].map(bordered => (
                            <CardList key={String(bordered)} bordered={bordered} compact={compact}>
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
 * Click a card to select it. Click again to deselect.
 */
export const Playground: Story = {
    args: {
        selectedIndex: -1,
    },
    argTypes: {
        selectedIndex: { control: "number", description: "Index of the currently selected card (-1 for none)" },
    },
    render: function Render(args) {
        const { selectedIndex, ...cardListProps } = args;
        const [, updateArgs] = useArgs();

        const handleCardClick = useCallback(
            (index: number) => () => {
                updateArgs({ selectedIndex: selectedIndex === index ? -1 : index });
            },
            [selectedIndex, updateArgs],
        );

        return (
            <CardList {...cardListProps}>
                {FRUITS.map((fruit, i) => (
                    <Card key={fruit} interactive={true} selected={selectedIndex === i} onClick={handleCardClick(i)}>
                        {fruit}
                    </Card>
                ))}
            </CardList>
        );
    },
};
