/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";

import { Cell } from "./cell/cell";
import { Column } from "./column";
import { Table } from "./table";

const COLUMN_NAMES = [
    "Title",
    "Model Type",
    "Owner",
    ...Array.from({ length: 12 }, (_, index) => `Column ${index + 4}`),
];

function renderCell(name: string) {
    return function CellRenderer(rowIndex: number) {
        return <Cell>{`${name} ${rowIndex + 1}`}</Cell>;
    };
}

const meta: Meta<typeof Table> = {
    title: "Table/Table",
    component: Table,
    decorators: [storybookLayoutDecorator],
    args: {
        enableColumnResizing: true,
        enableRowResizing: true,
        numFrozenColumns: 0,
        numFrozenRows: 0,
        numRows: 30,
    },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function TableStory(args) {
        return (
            <div style={{ height: 240, maxWidth: 600 }}>
                <Table {...args}>
                    {COLUMN_NAMES.map(name => (
                        <Column key={name} name={name} cellRenderer={renderCell(name)} />
                    ))}
                </Table>
            </div>
        );
    },
};

/** Scroll the table: the first column and first row stay in place. */
export const FrozenColumnsAndRows: Story = {
    args: {
        numFrozenColumns: 1,
        numFrozenRows: 1,
    },
    render: Default.render,
};
