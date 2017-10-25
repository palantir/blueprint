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

import * as React from "react";

import { Classes } from "@blueprintjs/core";
import { BaseExample, handleNumberChange } from "@blueprintjs/docs";

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

    private handleLoadingColumnChange = handleNumberChange(loadingColumn => this.setState({ loadingColumn }));

    public renderExample() {
        return <Table numRows={bigSpaceRocks.length}>{this.renderColumns()}</Table>;
    }

    protected renderOptions() {
        const firstSpaceRock = bigSpaceRocks[0];
        const numColumns = Object.keys(firstSpaceRock).length;
        const options: JSX.Element[] = [];
        for (let i = 0; i < numColumns; i++) {
            options.push(
                <option key={i} value={i}>
                    {this.formatColumnName(Object.keys(firstSpaceRock)[i])}
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

        Object.keys(bigSpaceRocks[0]).forEach((columnName, index) => {
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
        return <Cell>{bigSpaceRock[Object.keys(bigSpaceRock)[columnIndex]]}</Cell>;
    };

    private formatColumnName = (columnName: string) => {
        return columnName.replace(/([A-Z])/g, " $1").replace(/^./, firstCharacter => firstCharacter.toUpperCase());
    };

    private loadingOptions = (columnIndex: number) => {
        return columnIndex === this.state.loadingColumn
            ? [ColumnLoadingOption.HEADER, ColumnLoadingOption.CELLS]
            : undefined;
    };
}
