/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Cell, Column, Table, Utils } from "@blueprintjs/table";

export interface ITableFreezingExampleState {
    numFrozenColumns?: number;
    numFrozenRows?: number;
}

const NUM_ROWS = 20;
const NUM_COLUMNS = 20;
const NUM_FROZEN_ROWS = 2;
const NUM_FROZEN_COLUMNS = 1;

export class TableFreezingExample extends React.PureComponent<IExampleProps, ITableFreezingExampleState> {
    public render() {
        return (
            <Example options={false} showOptionsBelowExample={true} {...this.props}>
                <Table numRows={NUM_ROWS} numFrozenRows={NUM_FROZEN_ROWS} numFrozenColumns={NUM_FROZEN_COLUMNS}>
                    {this.renderColumns()}
                </Table>
            </Example>
        );
    }

    public renderCell = (rowIndex: number, columnIndex: number) => {
        return <Cell>{Utils.toBase26CellName(rowIndex, columnIndex)}</Cell>;
    };

    public renderColumns = () => {
        return Utils.times(NUM_COLUMNS, (columnIndex: number) => {
            return (
                <Column
                    key={columnIndex}
                    name={`Column ${Utils.toBase26Alpha(columnIndex)}`}
                    cellRenderer={this.renderCell}
                />
            );
        });
    };
}
