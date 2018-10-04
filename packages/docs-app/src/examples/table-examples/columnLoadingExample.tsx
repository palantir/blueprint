/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
