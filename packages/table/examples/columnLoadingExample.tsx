/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Classes } from "@blueprintjs/core";
import BaseExample, { handleNumberChange } from "@blueprintjs/core/examples/common/baseExample";

import { Cell, Column, ColumnLoadingOption, Table } from "../src";

interface IBigSpaceRock {
    [key: string]: number | string;
}

// tslint:disable-next-line:no-var-requires
const bigSpaceRocks = require("./potentiallyHazardousAsteroids.json") as IBigSpaceRock[];

export interface IColumnLoadingExampleState {
    loadingColumn?: number;
}

export class ColumnLoadingExample extends BaseExample<IColumnLoadingExampleState> {
    public state: IColumnLoadingExampleState = {
        loadingColumn: 1,
    };

    protected className = "docs-column-loading-example";

    private handleLoadingColumnChange = handleNumberChange((loadingColumn) => this.setState({ loadingColumn }));

    public renderExample() {
        return (
            <Table numRows={bigSpaceRocks.length}>
                {this.renderColumns()}
            </Table>
        );
    }

    protected renderOptions() {
        const firstSpaceRock = bigSpaceRocks[0];
        const numColumns = Object.getOwnPropertyNames(firstSpaceRock).length;
        const options: JSX.Element[] = [];
        for (let i = 0; i < numColumns; i++) {
            options.push(
                <option key={i} value={i}>
                    {this.formatColumnName(Object.getOwnPropertyNames(firstSpaceRock)[i])}
                </option>,
            );
        }
        return (
            <label className={Classes.LABEL}>
                Loading column
                <div className={Classes.SELECT}>
                    <select value={this.state.loadingColumn} onChange={this.handleLoadingColumnChange}>
                        {options}
                    </select>
                </div>
            </label>
        );
    }

    private renderColumns() {
        const columns: JSX.Element[] = [];

        Object.getOwnPropertyNames(bigSpaceRocks[0]).forEach((columnName, index) => {
            columns.push(
                <Column
                    key={index}
                    loadingOptions={this.loadingOptions(index)}
                    name={this.formatColumnName(columnName)}
                    renderCell={this.renderCell}
                />,
            );
        });

        return columns;
    }

    private renderCell = (rowIndex: number, columnIndex: number) => {
        const bigSpaceRock = bigSpaceRocks[rowIndex];
        return (
            <Cell>
                {bigSpaceRock[Object.getOwnPropertyNames(bigSpaceRock)[columnIndex]]}
            </Cell>
        );
    }

    private formatColumnName = (columnName: string) => {
        return columnName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (firstCharacter) => firstCharacter.toUpperCase());
    }

    private loadingOptions = (columnIndex: number) => {
        return columnIndex === this.state.loadingColumn
            ? [ ColumnLoadingOption.HEADER, ColumnLoadingOption.CELLS ]
            : undefined;
    }
}
