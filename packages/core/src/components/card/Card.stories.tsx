/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Elevation } from "../../common";
import { Card } from "./card";

const meta = {
    title: "Core/Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        elevation: Elevation.ZERO,
        interactive: false,
        selected: undefined,
        compact: false,
    },
    argTypes: {
        elevation: {
            control: "select",
            options: [Elevation.ZERO, Elevation.ONE, Elevation.TWO, Elevation.THREE, Elevation.FOUR],
        },
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card with default elevation.
 */
export const Default: Story = {
    args: {
        children: "Card content goes here.",
    },
};

/**
 * Card with elevation for visual depth.
 */
export const WithElevation: Story = {
    args: {
        elevation: Elevation.TWO,
        children: "This card has a drop shadow.",
    },
};

/**
 * Interactive card that responds to hover and click.
 */
export const Interactive: Story = {
    args: {
        interactive: true,
        onClick: () => {},
        children: "Click or hover me.",
    },
};

/**
 * Selected card state.
 */
export const Selected: Story = {
    args: {
        selected: true,
        children: "This card is selected.",
    },
};

/**
 * Compact card with reduced padding.
 */
export const Compact: Story = {
    args: {
        compact: true,
        children: "Compact card content.",
    },
};

/**
 * All elevation levels.
 */
export const AllElevations: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[Elevation.ZERO, Elevation.ONE, Elevation.TWO, Elevation.THREE, Elevation.FOUR].map(e => (
                <Card key={e} elevation={e} style={{ width: 120, padding: 12 }}>
                    Elevation {e}
                </Card>
            ))}
        </div>
    ),
};
