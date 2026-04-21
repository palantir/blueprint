/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";

import { Flex } from "@blueprintjs/labs";

import { Elevation } from "../../common";
import { H3 } from "../html/html";

import { Card } from "./card";

const meta: Meta<typeof Card> = {
    title: "Core/Card",
    component: Card,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        children: "Card content",
        elevation: Elevation.ZERO,
        interactive: false,
        selected: false,
        compact: false,
    },
    argTypes: {
        elevation: {
            control: "select",
            options: Object.values(Elevation),
        },
        interactive: {
            control: "boolean",
        },
        selected: {
            control: "boolean",
        },
        compact: {
            control: "boolean",
        },
        onClick: { action: "clicked" },
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic card with default styling.
 */
export const Default: Story = {
    args: {
        children: "Card content",
    },
};

/**
 * Cards at each elevation level, showing increasing drop shadow intensity.
 */
export const ElevationExample: Story = {
    name: "Elevation",
    argTypes: {
        elevation: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4}>
            {Object.values(Elevation).map(elevation => (
                <Card key={elevation} {...args} elevation={elevation} style={{ width: 140, padding: 16 }}>
                    <StoryLabel title="Elevation" />
                    {elevation}
                </Card>
            ))}
        </Flex>
    ),
};

/**
 * Cards in all visual states: default, interactive, selected, and compact.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        interactive: { table: { disable: true } },
        selected: { table: { disable: true } },
        compact: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4} alignItems="start">
            <Card {...args} style={{ width: 140, padding: 16 }}>
                Default
            </Card>
            <Card {...args} interactive={true} style={{ width: 140, padding: 16 }}>
                Interactive
            </Card>
            <Card {...args} interactive={true} selected={true} style={{ width: 140, padding: 16 }}>
                Selected
            </Card>
            <Card {...args} compact={true} style={{ width: 140 }}>
                Compact
            </Card>
        </Flex>
    ),
};

/**
 * An interactive card that responds to hover and click events.
 */
export const Interactive: Story = {
    args: {
        children: "Click me",
        interactive: true,
        elevation: Elevation.ONE,
    },
};

/**
 * A selected card with the selected visual treatment.
 */
export const Selected: Story = {
    args: {
        children: "Selected card",
        interactive: true,
        selected: true,
        elevation: Elevation.ONE,
    },
};

/**
 * A compact card with reduced visual padding.
 */
export const Compact: Story = {
    args: {
        children: "Compact card",
        compact: true,
    },
};

/**
 * Comprehensive matrix showing all elevations × all states for visual regression testing.
 */
export const AllElevationsAllStates: Story = {
    render: args => (
        <Flex flexDirection="column" gap={4}>
            {(["Default", "Interactive", "Selected", "Compact"] as const).map(state => (
                <div key={state}>
                    <StoryLabel title={state} />
                    <Flex gap={4}>
                        {Object.values(Elevation).map(elevation => (
                            <Card
                                key={elevation}
                                {...args}
                                elevation={elevation}
                                interactive={state === "Interactive" || state === "Selected" || state === "Compact"}
                                selected={state === "Selected"}
                                compact={state === "Compact"}
                                style={{ width: 120, padding: state === "Compact" ? undefined : 16 }}
                            >
                                Elev {elevation}
                            </Card>
                        ))}
                    </Flex>
                </div>
            ))}
        </Flex>
    ),
};

/**
 * An interactive playground for experimenting with Card props.
 */
export const Playground: Story = {
    args: {
        children: "Customize this card using the controls below.",
        interactive: true,
    },
    render: args => (
        <Card {...args}>
            <H3>Card Title</H3>
            <p>{args.children}</p>
        </Card>
    ),
};
