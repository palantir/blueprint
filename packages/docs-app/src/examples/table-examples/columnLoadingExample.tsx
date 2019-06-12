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

import { HTMLSelect, Label } from "@blueprintjs/core";
import { Example, handleNumberChange, IExampleProps } from "@blueprintjs/docs-theme";
import { Cell, Column, ColumnLoadingOption, Table } from "@blueprintjs/table";

interface IBigSpaceRock {
    [key: string]: number | string;
}

// tslint:disable-next-line:no-var-requires
const bigSpaceRocks = require("./potentiallyHazardousAsteroids.json") as IBigSpaceRock[];

export interface IColumnLoadingExampleState {
    loadingColumn?: number;
}

export class ColumnLoadingExample extends React.PureComponent<IExampleProps, IColumnLoadingExampleState> {
    public state: IColumnLoadingExampleState = {
        loadingColumn: 1,
    };

    private handleLoadingColumnChange = handleNumberChange(loadingColumn => this.setState({ loadingColumn }));

    public render() {
        return (
            <Example options={this.renderOptions()} showOptionsBelowExample={true} {...this.props}>
                <Table numRows={bigSpaceRocks.length}>{this.renderColumns()}</Table>
            </Example>
        );
    }

    protected renderOptions() {
        const firstSpaceRock = bigSpaceRocks[0];
        const numColumns = Object.keys(firstSpaceRock).length;
        const options: JSX.Element[] = [];
        for (let i = 0; i < numColumns; i++) {
            const label = this.formatColumnName(Object.keys(firstSpaceRock)[i]);
            options.push(<option key={i} value={i} label={label} />);
        }
        return (
            <Label>
                Loading column
                <HTMLSelect value={this.state.loadingColumn} onChange={this.handleLoadingColumnChange}>
                    {options}
                </HTMLSelect>
            </Label>
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
                    cellRenderer={this.renderCell}
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
