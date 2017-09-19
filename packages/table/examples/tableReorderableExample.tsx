/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

import { Cell, Column, Table, Utils } from "../src";

export interface ITableReorderableExampleState {
    columns?: JSX.Element[];
    data?: any[];
    useInteractionBar?: boolean;
}

const REORDERABLE_TABLE_DATA = [
    ["A", "Apple", "Ape", "Albania", "Anchorage"],
    ["B", "Banana", "Boa", "Brazil", "Boston"],
    ["C", "Cranberry", "Cougar", "Croatia", "Chicago"],
    ["D", "Dragonfruit", "Deer", "Denmark", "Denver"],
    ["E", "Eggplant", "Elk", "Eritrea", "El Paso"],
].map(([letter, fruit, animal, country, city]) => ({ letter, fruit, animal, country, city }));

export class TableReorderableExample extends BaseExample<ITableReorderableExampleState> {
    public state: ITableReorderableExampleState = {
        data: REORDERABLE_TABLE_DATA,
        useInteractionBar: false,
    };

    private toggleUseInteractionBar = handleBooleanChange(useInteractionBar => this.setState({ useInteractionBar }));

    public componentDidMount() {
        const { useInteractionBar } = this.state;
        const columns = [
            <Column key="1" name="Letter" renderCell={this.renderLetterCell} useInteractionBar={useInteractionBar} />,
            <Column key="2" name="Fruit" renderCell={this.renderFruitCell} useInteractionBar={useInteractionBar} />,
            <Column key="3" name="Animal" renderCell={this.renderAnimalCell} useInteractionBar={useInteractionBar} />,
            <Column key="4" name="Country" renderCell={this.renderCountryCell} useInteractionBar={useInteractionBar} />,
            <Column key="5" name="City" renderCell={this.renderCityCell} useInteractionBar={useInteractionBar} />,
        ];
        this.setState({ columns });
    }

    public componentDidUpdate(_nextProps: {}, nextState: ITableReorderableExampleState) {
        const { useInteractionBar } = this.state;
        if (nextState.useInteractionBar !== useInteractionBar) {
            const nextColumns = React.Children.map(this.state.columns, (column: JSX.Element) => {
                return React.cloneElement(column, { useInteractionBar });
            });
            this.setState({ columns: nextColumns });
        }
    }

    public renderExample() {
        return (
            <Table
                isColumnReorderable={true}
                isColumnResizable={false}
                isRowReorderable={true}
                isRowResizable={false}
                numRows={this.state.data.length}
                onColumnsReordered={this.handleColumnsReordered}
                onRowsReordered={this.handleRowsReordered}
            >
                {this.state.columns}
            </Table>
        );
    }

    protected renderOptions() {
        return (
            <Switch
                checked={this.state.useInteractionBar}
                label="Interaction bar"
                onChange={this.toggleUseInteractionBar}
            />
        );
    }

    private renderLetterCell = (row: number) => <Cell>{this.state.data[row].letter}</Cell>;
    private renderFruitCell = (row: number) => <Cell>{this.state.data[row].fruit}</Cell>;
    private renderAnimalCell = (row: number) => <Cell>{this.state.data[row].animal}</Cell>;
    private renderCountryCell = (row: number) => <Cell>{this.state.data[row].country}</Cell>;
    private renderCityCell = (row: number) => <Cell>{this.state.data[row].city}</Cell>;

    private handleColumnsReordered = (oldIndex: number, newIndex: number, length: number) => {
        if (oldIndex === newIndex) {
            return;
        }
        const nextChildren = Utils.reorderArray(this.state.columns, oldIndex, newIndex, length);
        this.setState({ columns: nextChildren });
    };

    private handleRowsReordered = (oldIndex: number, newIndex: number, length: number) => {
        if (oldIndex === newIndex) {
            return;
        }
        this.setState({ data: Utils.reorderArray(this.state.data, oldIndex, newIndex, length) });
    };
}
