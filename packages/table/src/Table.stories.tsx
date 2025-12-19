/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Cell, Column, ColumnHeaderCell, Table } from "./index";

const meta = {
    title: "Table/Table",
    component: Table,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic table with 10 rows and 3 columns. No loading, no selection.
 */
export const Basic: Story = {
    render: () => (
        <Table numRows={10}>
            <Column
                cellRenderer={rowIndex => <Cell>Row {rowIndex}</Cell>}
                columnHeaderCellRenderer={() => <ColumnHeaderCell name="Index" />}
            />
            <Column
                cellRenderer={rowIndex => <Cell>Col A – {rowIndex}</Cell>}
                columnHeaderCellRenderer={() => <ColumnHeaderCell name="Col A" />}
            />
            <Column
                cellRenderer={rowIndex => <Cell>Col B – {rowIndex}</Cell>}
                columnHeaderCellRenderer={() => <ColumnHeaderCell name="Col B" />}
            />
        </Table>
    ),
};
