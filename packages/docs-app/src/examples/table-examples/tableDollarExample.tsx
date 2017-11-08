/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { BaseExample } from "@blueprintjs/docs";
import { Cell, Column, Table } from "@blueprintjs/table";

export class TableDollarExample extends BaseExample<{}> {
    public renderExample() {
        const renderCell = (rowIndex: number) => <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>;
        return (
            <Table numRows={10}>
                <Column name="Dollars" renderCell={renderCell} />
            </Table>
        );
    }
}
