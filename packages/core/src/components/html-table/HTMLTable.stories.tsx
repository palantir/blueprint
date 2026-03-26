/*!
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { HTMLTable } from "./htmlTable";

const sampleRows = [
    { name: "Blueprint", role: "UI Framework", location: "GitHub" },
    { name: "TSX", role: "Type-safe JSX", location: "TypeScript" },
    { name: "Sass", role: "CSS Preprocessor", location: "Node" },
    { name: "Storybook", role: "Component Explorer", location: "Browser" },
    { name: "React", role: "View Library", location: "npm" },
];

function renderTable(props: React.ComponentProps<typeof HTMLTable>) {
    return (
        <HTMLTable {...props}>
            <thead>
                <tr>
                    <th>Project</th>
                    <th>Role</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                {sampleRows.map(row => (
                    <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.role}</td>
                        <td>{row.location}</td>
                    </tr>
                ))}
            </tbody>
        </HTMLTable>
    );
}

const meta: Meta<typeof HTMLTable> = {
    title: "Core/HTMLTable",
    component: HTMLTable,
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
    render: args => renderTable(args),
};

/**
 * Use the `bordered`, `compact`, `interactive`, and `striped` props to control table appearance.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        bordered: { table: { disable: true } },
        compact: { table: { disable: true } },
        interactive: { table: { disable: true } },
        striped: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Bordered</div>
                {renderTable({ ...args, bordered: true })}
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Compact</div>
                {renderTable({ ...args, compact: true })}
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Striped</div>
                {renderTable({ ...args, striped: true })}
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Interactive (hover rows)</div>
                {renderTable({ ...args, interactive: true })}
            </div>
        </div>
    ),
};

/**
 * All prop combinations displayed together for visual comparison.
 */
export const AllCombinations: Story = {
    name: "All Combinations",
    argTypes: {
        bordered: { table: { disable: true } },
        compact: { table: { disable: true } },
        interactive: { table: { disable: true } },
        striped: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Default</div>
                {renderTable(args)}
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Bordered + Striped</div>
                {renderTable({ ...args, bordered: true, striped: true })}
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Bordered + Compact</div>
                {renderTable({ ...args, bordered: true, compact: true })}
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Bordered + Striped + Interactive</div>
                {renderTable({ ...args, bordered: true, striped: true, interactive: true })}
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
                    Bordered + Striped + Compact + Interactive
                </div>
                {renderTable({ ...args, bordered: true, striped: true, compact: true, interactive: true })}
            </div>
        </div>
    ),
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    args: {
        bordered: true,
        compact: false,
        interactive: true,
        striped: true,
    },
    render: args => renderTable(args),
};
