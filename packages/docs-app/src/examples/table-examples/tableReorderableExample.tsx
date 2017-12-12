/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";
import { Cell, Column, Table, Utils } from "@blueprintjs/table";

export interface ITableReorderableExampleState {
    columns?: JSX.Element[];
    data?: any[];
    enableColumnInteractionBar?: boolean;
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
        enableColumnInteractionBar: false,
    };

    private toggleUseInteractionBar = handleBooleanChange(enableColumnInteractionBar =>
        this.setState({ enableColumnInteractionBar }),
    );

    public componentDidMount() {
        const columns = [
            <Column key="1" name="Letter" cellRenderer={this.renderLetterCell} />,
            <Column key="2" name="Fruit" cellRenderer={this.renderFruitCell} />,
            <Column key="3" name="Animal" cellRenderer={this.renderAnimalCell} />,
            <Column key="4" name="Country" cellRenderer={this.renderCountryCell} />,
            <Column key="5" name="City" cellRenderer={this.renderCityCell} />,
        ];
        this.setState({ columns });
    }

    public componentDidUpdate(_nextProps: {}, nextState: ITableReorderableExampleState) {
        const { enableColumnInteractionBar } = this.state;
        if (nextState.enableColumnInteractionBar !== enableColumnInteractionBar) {
            const nextColumns = React.Children.map(this.state.columns, (column: JSX.Element) => {
                return React.cloneElement(column, { enableColumnInteractionBar });
            });
            this.setState({ columns: nextColumns });
        }
    }

    public renderExample() {
        const { enableColumnInteractionBar } = this.state;
        return (
            <Table
                enableColumnReordering={true}
                enableColumnResizing={false}
                enableRowReordering={true}
                enableRowResizing={false}
                numRows={this.state.data.length}
                onColumnsReordered={this.handleColumnsReordered}
                onRowsReordered={this.handleRowsReordered}
                enableColumnInteractionBar={enableColumnInteractionBar}
            >
                {this.state.columns}
            </Table>
        );
    }

    protected renderOptions() {
        return (
            <Switch
                checked={this.state.enableColumnInteractionBar}
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
