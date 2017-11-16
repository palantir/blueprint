/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";
import { Cell, Column, Table, TableLoadingOption } from "@blueprintjs/table";

interface IBigSpaceRock {
    [key: string]: number | string;
}

// tslint:disable-next-line:no-var-requires
const bigSpaceRocks = require("./potentiallyHazardousAsteroids.json") as IBigSpaceRock[];

export interface ITableLoadingExampleState {
    cellsLoading?: boolean;
    columnHeadersLoading?: boolean;
    rowHeadersLoading?: boolean;
}

export class TableLoadingExample extends BaseExample<ITableLoadingExampleState> {
    public state: ITableLoadingExampleState = {
        cellsLoading: true,
        columnHeadersLoading: true,
        rowHeadersLoading: true,
    };

    protected className = "docs-table-loading-example";

    private handleCellsLoading = handleBooleanChange(cellsLoading => this.setState({ cellsLoading }));

    private handleColumnHeadersLoading = handleBooleanChange(columnHeadersLoading => {
        this.setState({ columnHeadersLoading });
    });

    private handleRowHeadersLoading = handleBooleanChange(rowHeadersLoading => this.setState({ rowHeadersLoading }));

    public renderExample() {
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

        return (
            <Table numRows={bigSpaceRocks.length} loadingOptions={loadingOptions}>
                {this.renderColumns()}
            </Table>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.cellsLoading}
                    label="Cells"
                    key="cells"
                    onChange={this.handleCellsLoading}
                />,
                <Switch
                    checked={this.state.columnHeadersLoading}
                    label="Column headers"
                    key="columnheaders"
                    onChange={this.handleColumnHeadersLoading}
                />,
                <Switch
                    checked={this.state.rowHeadersLoading}
                    label="Row headers"
                    key="rowheaders"
                    onChange={this.handleRowHeadersLoading}
                />,
            ],
        ];
    }

    private renderColumns() {
        const columns: JSX.Element[] = [];

        Object.keys(bigSpaceRocks[0]).forEach((columnName, index) => {
            columns.push(<Column key={index} name={this.formatColumnName(columnName)} renderCell={this.renderCell} />);
        });

        return columns;
    }

    private renderCell = (rowIndex: number, columnIndex: number) => {
        const bigSpaceRock = bigSpaceRocks[rowIndex];
        return <Cell>{bigSpaceRock[Object.keys(bigSpaceRock)[columnIndex]]}</Cell>;
    };

    private formatColumnName = (columnName: string) => {
        return columnName.replace(/([A-Z])/g, " $1").replace(/^./, firstCharacter => firstCharacter.toUpperCase());
    };
}
