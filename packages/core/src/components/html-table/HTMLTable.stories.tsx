/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";

import { HTMLTable } from "./htmlTable";

const SAMPLE_ROWS = [
    { name: "Blueprint", role: "UI Framework", location: "GitHub" },
    { name: "TSX", role: "Type-safe JSX", location: "TypeScript" },
    { name: "Sass", role: "CSS Preprocessor", location: "Node" },
    { name: "Storybook", role: "Component Explorer", location: "Browser" },
    { name: "React", role: "View Library", location: "npm" },
] as const;

function TableContents() {
    return (
        <>
            <thead>
                <tr>
                    <th>Project</th>
                    <th>Role</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                {SAMPLE_ROWS.map(row => (
                    <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.role}</td>
                        <td>{row.location}</td>
                    </tr>
                ))}
            </tbody>
        </>
    );
}

const meta: Meta<typeof HTMLTable> = {
    title: "Core/HTMLTable",
    component: HTMLTable,
    decorators: [storybookLayoutDecorator],
    tags: ["autodocs"],
    args: {
        bordered: false,
        compact: false,
        interactive: false,
        striped: false,
    },
    argTypes: {
        bordered: { control: "boolean" },
        compact: { control: "boolean" },
        interactive: { control: "boolean" },
        striped: { control: "boolean" },
    },
} satisfies Meta<typeof HTMLTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic HTML table with default styling.
 */
export const Default: Story = {
    render: args => (
        <HTMLTable {...args}>
            <TableContents />
        </HTMLTable>
    ),
};

/**
 * Use the `bordered` prop to add borders between rows and cells.
 */
export const BorderedExample: Story = {
    name: "Bordered",
    argTypes: { bordered: { table: { disable: true } } },
    render: args => (
        <HTMLTable {...args} bordered={true}>
            <TableContents />
        </HTMLTable>
    ),
};

/**
 * Use the `striped` prop to apply an alternate background color on odd-numbered rows.
 */
export const StripedExample: Story = {
    name: "Striped",
    argTypes: { striped: { table: { disable: true } } },
    render: args => (
        <HTMLTable {...args} striped={true}>
            <TableContents />
        </HTMLTable>
    ),
};

/**
 * Use the `compact` prop for a denser appearance with less padding.
 */
export const CompactExample: Story = {
    name: "Compact",
    argTypes: { compact: { table: { disable: true } } },
    render: args => (
        <HTMLTable {...args} compact={true}>
            <TableContents />
        </HTMLTable>
    ),
};

/**
 * Use the `interactive` prop to enable hover styles on rows.
 */
export const InteractiveExample: Story = {
    name: "Interactive",
    argTypes: { interactive: { table: { disable: true } } },
    render: args => (
        <HTMLTable {...args} interactive={true}>
            <TableContents />
        </HTMLTable>
    ),
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        bordered: true,
        compact: false,
        interactive: true,
        striped: true,
    },
    render: args => (
        <HTMLTable {...args}>
            <TableContents />
        </HTMLTable>
    ),
};
