/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Switch } from "@blueprintjs/core";
import BaseExample from "@blueprintjs/core/examples/common/baseExample";

import { Cell, Column, EditableCell, RegionCardinality, RowHeaderCell, Table, TableLoadingOption } from "../src";

interface IFuelConsumption {
    country: string;
    [ index: number ]: any;
}

// tslint:disable-next-line:no-var-requires
const fuelConsumptionData = require("./fuelConsumption.json") as IFuelConsumption[];

export interface ITableLoadingExampleState {
    tableLoadingOptions?: RegionCardinality[];
}

export class TableLoadingExample extends BaseExample<ITableLoadingExampleState> {
    public state: ITableLoadingExampleState = {
        tableLoadingOptions: [ TableLoadingOption.CELLS ],
    };

    protected className = "docs-table-loading-example";

    protected renderExample() {
        return (
            <Table
                loadingOptions={this.state.tableLoadingOptions}
                numRows={fuelConsumptionData.length}
                renderRowHeader={this.renderRowHeader}
            >
                {this.renderColumns()}
            </Table>
        );
    }

    protected renderOptions() {
        /* tslint:disable:jsx-no-lambda */
        return [
            [
                <Switch
                    checked={this.hasLoadingOption(TableLoadingOption.CELLS)}
                    key="cells"
                    label="Cell Loading"
                    onChange={() => this.toggleLoadingOption(TableLoadingOption.CELLS)}
                />,
                <Switch
                    checked={this.hasLoadingOption(TableLoadingOption.COLUMN_HEADERS)}
                    key="column-headers"
                    label="Column Header Loading"
                    onChange={() => this.toggleLoadingOption(TableLoadingOption.COLUMN_HEADERS)}
                />,
                <Switch
                    checked={this.hasLoadingOption(TableLoadingOption.ROW_HEADERS)}
                    key="row-headers"
                    label="Row Header Loading"
                    onChange={() => this.toggleLoadingOption(TableLoadingOption.ROW_HEADERS)}
                />,
            ],
        ];
        /* tslint:enable:jsx-no-lambda */
    }

    private renderColumns() {
        const columns: JSX.Element[] = [];
        const renderCell = (rowIndex: number, columnIndex: number) => {
            return <EditableCell isLoading={true} value={fuelConsumptionData[rowIndex][columnIndex + 2000]} />;
        };

        Object.keys(fuelConsumptionData[0]).forEach((key) => {
            if (key !== "country") {
                columns.push(
                    <Column
                        name={key}
                        key={key}
                        renderCell={renderCell}
                    />,
                );
            }
        });

        return columns;
    }

    private renderRowHeader = (rowIndex: number) => {
        return <RowHeaderCell name={fuelConsumptionData[rowIndex].country} style={{ width: 150 }}/>;
    }

    private hasLoadingOption = (loadingOption: RegionCardinality) => {
        return this.state.tableLoadingOptions.indexOf(loadingOption) !== -1;
    }

    private toggleLoadingOption = (loadingOption: RegionCardinality) => {
        const tableLoadingOptions = this.state.tableLoadingOptions.slice();
        const optionIndex = tableLoadingOptions.indexOf(loadingOption);
        if (optionIndex !== -1) {
            tableLoadingOptions.splice(optionIndex, 1);
        } else {
            tableLoadingOptions.push(loadingOption);
        }

        this.setState({ tableLoadingOptions });
    }
}
