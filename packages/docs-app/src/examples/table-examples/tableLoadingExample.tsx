/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import React from "react";

import { Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, ExampleProps } from "@blueprintjs/docs-theme";
import { Cell, Column, Table, TableLoadingOption } from "@blueprintjs/table";

interface BigSpaceRock {
    [key: string]: number | string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bigSpaceRocks: BigSpaceRock[] = require("./potentiallyHazardousAsteroids.json");

export interface TableLoadingExampleState {
    cellsLoading?: boolean;
    columnHeadersLoading?: boolean;
    rowHeadersLoading?: boolean;
}

export class TableLoadingExample extends React.PureComponent<ExampleProps, TableLoadingExampleState> {
    public state: TableLoadingExampleState = {
        cellsLoading: true,
        columnHeadersLoading: true,
        rowHeadersLoading: true,
    };

    private handleCellsLoading = handleBooleanChange(cellsLoading => this.setState({ cellsLoading }));

    private handleColumnHeadersLoading = handleBooleanChange(columnHeadersLoading => {
        this.setState({ columnHeadersLoading });
    });

    private handleRowHeadersLoading = handleBooleanChange(rowHeadersLoading => this.setState({ rowHeadersLoading }));

    public render() {
        const columns = Object.keys(bigSpaceRocks[0]).map((columnName, index) => (
            <Column key={index} name={this.formatColumnName(columnName)} cellRenderer={this.renderCell} />
        ));
        return (
            <Example options={this.renderOptions()} showOptionsBelowExample={true} {...this.props}>
                <Table numRows={bigSpaceRocks.length} loadingOptions={this.getLoadingOptions()}>
                    {columns}
                </Table>
            </Example>
        );
    }

    protected renderOptions() {
        return (
            <>
                <Switch checked={this.state.cellsLoading} label="Cells" onChange={this.handleCellsLoading} />
                <Switch
                    checked={this.state.columnHeadersLoading}
                    label="Column headers"
                    onChange={this.handleColumnHeadersLoading}
                />
                <Switch
                    checked={this.state.rowHeadersLoading}
                    label="Row headers"
                    onChange={this.handleRowHeadersLoading}
                />
            </>
        );
    }

    private renderCell = (rowIndex: number, columnIndex: number) => {
        const bigSpaceRock = bigSpaceRocks[rowIndex];
        return <Cell>{bigSpaceRock[Object.keys(bigSpaceRock)[columnIndex]]}</Cell>;
    };

    private formatColumnName = (columnName: string) => {
        return columnName.replace(/([A-Z])/g, " $1").replace(/^./, firstCharacter => firstCharacter.toUpperCase());
    };

    private getLoadingOptions() {
        const loadingOptions: TableLoadingOption[] = [];
        if (this.state.cellsLoading) {
            loadingOptions.push(TableLoadingOption.CELLS);
        }
        if (this.state.columnHeadersLoading) {
            loadingOptions.push(TableLoadingOption.COLUMN_HEADERS);
        }
        if (this.state.rowHeadersLoading) {
            loadingOptions.push(TableLoadingOption.ROW_HEADERS);
        }
        return loadingOptions;
    }
}
