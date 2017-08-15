/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { BaseExample } from "@blueprintjs/docs";

import { Cell, Column, Table, Utils } from "../src";

export interface ITableFreezingExampleState {
    numFrozenColumns?: number;
    numFrozenRows?: number;
}

const NUM_ROWS = 20;
const NUM_COLUMNS = 20;
const NUM_FROZEN_ROWS = 2;
const NUM_FROZEN_COLUMNS = 1;

export class TableFreezingExample extends BaseExample<ITableFreezingExampleState> {
    public render() {
        return (
            <Table
                numRows={NUM_ROWS}
                numFrozenRows={NUM_FROZEN_ROWS}
                numFrozenColumns={NUM_FROZEN_COLUMNS}
            >
                {this.renderColumns()}
            </Table>
        );
    }

    public renderCell = (rowIndex: number, columnIndex: number) => {
        return <Cell>{Utils.toBase26CellName(rowIndex, columnIndex)}</Cell>;
    }

    public renderColumns = () => {
        return Utils.times(NUM_COLUMNS, (columnIndex: number) => {
            return (
                <Column
                    key={columnIndex}
                    name={`Column ${Utils.toBase26Alpha(columnIndex)}`}
                    renderCell={this.renderCell}
                />
            );
        });
    }
}
