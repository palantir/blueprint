/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { BaseExample } from "@blueprintjs/docs";

import { Cell, Column, Table } from "../src";

export class TableDollarExample extends BaseExample<{}> {
    public renderExample() {
        const renderCell = (rowIndex: number) => <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>;
        return (
            <Table numRows={10}>
                <Column name="Dollars" renderCell={renderCell}/>
            </Table>
        );
    }
}
