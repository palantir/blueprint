/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "./divider";

const meta: Meta<typeof Divider> = {
    title: "Core/Components/Divider",
    component: Divider,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "300px" }}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        compact: false,
        tagName: "div",
    },
    argTypes: {
        compact: {
            control: "boolean",
        },
        tagName: {
            control: "text",
        },
    },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic horizontal divider rendered inside a column flex container.
 */
export const Default: Story = {
    decorators: [
        Story => (
            <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
                <span>Content above</span>
                <Story />
                <span>Content below</span>
            </div>
        ),
    ],
};

/**
 * When placed inside a flex row container, the Divider renders as a vertical line.
 */
export const Vertical: Story = {
    name: "Vertical",
    decorators: [
        Story => (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "40px" }}>
                <span>Left</span>
                <Story />
                <span>Right</span>
            </div>
        ),
    ],
};

/**
 * Use the `compact` prop to remove the default margin around the Divider,
 * making it flush with adjacent content.
 */
export const CompactExample: Story = {
    name: "Compact",
    argTypes: {
        compact: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "300px" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <span style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Default (with margin)</span>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        border: "1px dashed rgba(0,0,0,0.2)",
                        padding: 8,
                    }}
                >
                    <span>Above</span>
                    <Divider {...args} compact={false} />
                    <span>Below</span>
                </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", width: "100%" }}>
                <span style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Compact (no margin)</span>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        border: "1px dashed rgba(0,0,0,0.2)",
                        padding: 8,
                    }}
                >
                    <span>Above</span>
                    <Divider {...args} compact={true} />
                    <span>Below</span>
                </div>
            </div>
        </div>
    ),
};

/**
 * The Divider adapts its orientation based on the flex direction of its parent container.
 * In a row layout it renders as a vertical separator; in a column layout as a horizontal rule.
 */
export const Orientation: Story = {
    name: "Orientation",
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "300px" }}>
            <div>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Horizontal (column container)</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Above</span>
                    <Divider {...args} />
                    <span>Below</span>
                </div>
            </div>
            <div>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Vertical (row container)</span>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", height: "40px" }}>
                    <span>Left</span>
                    <Divider {...args} />
                    <span>Right</span>
                </div>
            </div>
        </div>
    ),
};

/**
 * The `tagName` prop allows rendering the Divider as a different HTML element.
 */
export const TagNameExample: Story = {
    name: "Tag Name",
    argTypes: {
        tagName: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "300px" }}>
            <div>
                <span style={{ fontSize: 12, opacity: 0.6 }}>div (default)</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Above</span>
                    <Divider {...args} tagName="div" />
                    <span>Below</span>
                </div>
            </div>
            <div>
                <span style={{ fontSize: 12, opacity: 0.6 }}>hr</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Above</span>
                    <Divider {...args} tagName="hr" />
                    <span>Below</span>
                </div>
            </div>
            <div>
                <span style={{ fontSize: 12, opacity: 0.6 }}>span</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Above</span>
                    <Divider {...args} tagName="span" />
                    <span>Below</span>
                </div>
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all Divider props available via Storybook controls.
 */
export const Playground: Story = {
    decorators: [
        Story => (
            <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
                <span>Content above</span>
                <Story />
                <span>Content below</span>
            </div>
        ),
    ],
    args: {
        compact: false,
    },
};
