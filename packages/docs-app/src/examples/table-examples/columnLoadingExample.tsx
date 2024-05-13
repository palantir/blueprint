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

import { FormGroup, HTMLSelect } from "@blueprintjs/core";
import { Example, type ExampleProps, handleNumberChange } from "@blueprintjs/docs-theme";
import { Cell, Column, ColumnLoadingOption, Table2 } from "@blueprintjs/table";

interface BigSpaceRock {
    [key: string]: number | string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bigSpaceRocks: BigSpaceRock[] = require("./potentiallyHazardousAsteroids.json");

export interface ColumnLoadingExampleState {
    loadingColumn?: number;
}

export class ColumnLoadingExample extends React.PureComponent<ExampleProps, ColumnLoadingExampleState> {
    public state: ColumnLoadingExampleState = {
        loadingColumn: 1,
    };

    private handleLoadingColumnChange = handleNumberChange(loadingColumn => this.setState({ loadingColumn }));

    public render() {
        return (
            <Example options={this.renderOptions()} showOptionsBelowExample={true} {...this.props}>
                <Table2 numRows={bigSpaceRocks.length}>{this.renderColumns()}</Table2>
            </Example>
        );
    }

    protected renderOptions() {
        const firstSpaceRock = bigSpaceRocks[0];
        const numColumns = Object.keys(firstSpaceRock).length;
        const options: React.JSX.Element[] = [];
        for (let i = 0; i < numColumns; i++) {
            const label = this.formatColumnName(Object.keys(firstSpaceRock)[i]);
            options.push(<option key={i} value={i} label={label} />);
        }
        return (
            <FormGroup label="Loading column">
                <HTMLSelect value={this.state.loadingColumn} onChange={this.handleLoadingColumnChange}>
                    {options}
                </HTMLSelect>
            </FormGroup>
        );
    }

    private renderColumns() {
        const columns: React.JSX.Element[] = [];

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
