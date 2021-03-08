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

import { Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IBaseExampleProps, IExampleProps } from "@blueprintjs/docs-theme";
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

export class TableReorderableExample extends React.PureComponent<IExampleProps, ITableReorderableExampleState> {
    public state: ITableReorderableExampleState = {
        columns: [
            // these cellRenderers are only created once and then cloned on updates
            <Column key="1" name="Letter" cellRenderer={this.getCellRenderer("letter")} />,
            <Column key="2" name="Fruit" cellRenderer={this.getCellRenderer("fruit")} />,
            <Column key="3" name="Animal" cellRenderer={this.getCellRenderer("animal")} />,
            <Column key="4" name="Country" cellRenderer={this.getCellRenderer("country")} />,
            <Column key="5" name="City" cellRenderer={this.getCellRenderer("city")} />,
        ],
        data: REORDERABLE_TABLE_DATA,
        enableColumnInteractionBar: false,
    };

    private toggleUseInteractionBar = handleBooleanChange(enableColumnInteractionBar =>
        this.setState({ enableColumnInteractionBar }),
    );

    public componentDidUpdate(_nextProps: IBaseExampleProps, nextState: ITableReorderableExampleState) {
        const { enableColumnInteractionBar } = this.state;
        if (nextState.enableColumnInteractionBar !== enableColumnInteractionBar) {
            const nextColumns = React.Children.map(this.state.columns, (column: JSX.Element) => {
                return React.cloneElement(column, { enableColumnInteractionBar });
            });
            this.setState({ columns: nextColumns });
        }
    }

    public render() {
        const { enableColumnInteractionBar } = this.state;
        const options = (
            <Switch
                checked={enableColumnInteractionBar}
                label="Interaction bar"
                onChange={this.toggleUseInteractionBar}
            />
        );
        return (
            <Example options={options} showOptionsBelowExample={true} {...this.props}>
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
            </Example>
        );
    }

    private getCellRenderer(key: string) {
        return (row: number) => <Cell>{this.state.data[row][key]}</Cell>;
    }

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
