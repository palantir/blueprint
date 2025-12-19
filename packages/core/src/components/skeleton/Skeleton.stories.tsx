/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Classes } from "../../common";

/**
 * Skeleton is a CSS-only component. Apply `Classes.SKELETON` to elements
 * to show a loading animation that inherits the element's dimensions.
 */
const meta = {
    title: "Core/Skeleton",
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Placeholder blocks using the skeleton class.
 */
export const Default: Story = {
    render: () => (
        <div style={{ width: 280 }}>
            <div className={Classes.SKELETON} style={{ height: 24, width: "80%", marginBottom: 12 }} />
            <div className={Classes.SKELETON} style={{ height: 12, width: "100%", marginBottom: 8 }} />
            <div className={Classes.SKELETON} style={{ height: 12, width: "90%", marginBottom: 8 }} />
            <div className={Classes.SKELETON} style={{ height: 12, width: "60%" }} />
        </div>
    ),
};

/**
 * Skeleton that mimics a list of lines.
 */
export const TextLines: Story = {
    render: () => (
        <div style={{ width: 200 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <div
                    key={i}
                    className={Classes.SKELETON}
                    style={{
                        height: 14,
                        width: i === 4 ? "70%" : "100%",
                        marginBottom: i < 5 ? 8 : 0,
                    }}
                />
            ))}
        </div>
    ),
};

/**
 * Skeleton that mimics a card with image and text.
 */
export const CardPlaceholder: Story = {
    render: () => (
        <div style={{ width: 200, border: "1px solid var(--bp5-divider-color)", borderRadius: 4, overflow: "hidden" }}>
            <div className={Classes.SKELETON} style={{ height: 120, width: "100%" }} />
            <div style={{ padding: 12 }}>
                <div className={Classes.SKELETON} style={{ height: 18, width: "80%", marginBottom: 8 }} />
                <div className={Classes.SKELETON} style={{ height: 12, width: "100%" }} />
            </div>
        </div>
    ),
};
