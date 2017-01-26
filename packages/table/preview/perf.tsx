/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 *
 * Demonstrates sample usage of the table component.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    Menu,
    MenuItem,
} from "@blueprintjs/core";

import {
    Column,
    ColumnHeaderCell,
    EditableCell,
    EditableName,
    RowHeaderCell,
    SelectionModes,
    Table,
    Utils,
} from "../src/index";

import { Nav } from "./nav";
ReactDOM.render(<Nav selected="perf" />, document.getElementById("nav"));

import { SparseGridMutableStore } from "./store";

interface IMutableTableState {
    numCols: number;
    numRows: number;
}

class MutableTable extends React.Component<{}, IMutableTableState> {
    private store = new SparseGridMutableStore<string>();

    public constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            numCols : 100,
            numRows : 100 * 1000,
        };

        // Intialize column names
        Utils.times(this.state.numCols, (i) => {
            this.store.set(-1, i, `Column ${Utils.toBase26Alpha(i)}`);
        });
    }

    public render() {
        return <Table
            selectionModes={SelectionModes.ALL}
            numRows={this.state.numRows}
            renderRowHeader={this.renderRowHeader.bind(this)}
        >
            {this.renderColumns()}
        </Table>;
    }

    public renderColumns() {
        return Utils.times(this.state.numCols, (index) => {
            return <Column
                key={index}
                renderColumnHeader={this.renderColumnHeader.bind(this)}
                renderCell={this.renderCell.bind(this)}
            />;
        });
    }

    private renderColumnHeader(columnIndex: number) {
        const renderName = () => {
            const name = this.store.get(-1, columnIndex);
            return (<EditableName
                name={name == null ? "" : name}
                onConfirm={this.setColumnName.bind(this, columnIndex)}
            />);
        };

        return (<ColumnHeaderCell
            menu={this.renderColumnMenu(columnIndex)}
            renderName={renderName}
            useInteractionBar={true}
        />);
    }

    private renderColumnMenu(columnIndex: number) {
        // tslint:disable:jsx-no-multiline-js jsx-no-lambda
        return <Menu>
            <MenuItem
                iconName="insert"
                onClick={() => {
                    this.store.insertJ(columnIndex, 1);
                    this.setState({numCols : this.state.numCols + 1} as IMutableTableState);
                }}
                text="Insert column before"
            />
            <MenuItem
                iconName="insert"
                onClick={() => {
                    this.store.insertJ(columnIndex + 1, 1);
                    this.setState({numCols : this.state.numCols + 1} as IMutableTableState);
                }}
                text="Insert column after"
            />
            <MenuItem
                iconName="remove"
                onClick={() => {
                    this.store.deleteJ(columnIndex, 1);
                    this.setState({numCols : this.state.numCols - 1} as IMutableTableState);
                }}
                text="Remove column"
            />
            <MenuItem
                iconName="new-text-box"
                onClick={() => {
                    Utils.times(this.state.numRows, (i) => {
                        const str = Math.random().toString(36).substring(7);
                        this.store.set(i, columnIndex, str);
                    });
                    this.forceUpdate();
                }}
                text="Fill with random text"
            />
        </Menu>;
    }

    private renderRowHeader(rowIndex: number) {
        return <RowHeaderCell
            name={`${rowIndex + 1}`}
            menu={this.renderRowMenu(rowIndex)}
        />;
    }

    private renderRowMenu(rowIndex: number) {
        return (<Menu>
            <MenuItem
                iconName="insert"
                onClick={() => {
                    this.store.insertI(rowIndex, 1);
                    this.setState({numRows : this.state.numRows + 1} as IMutableTableState);
                }}
                text="Insert row before"
            />
            <MenuItem
                iconName="insert"
                onClick={() => {
                    this.store.insertI(rowIndex + 1, 1);
                    this.setState({numRows : this.state.numRows + 1} as IMutableTableState);
                }}
                text="Insert row after"
            />
            <MenuItem
                iconName="remove"
                onClick={() => {
                    this.store.deleteI(rowIndex, 1);
                    this.setState({numRows : this.state.numRows - 1} as IMutableTableState);
                }}
                text="Remove row"
            />
        </Menu>);
        // tslint:enable:jsx-no-multiline-js jsx-no-lambda
    }

    private renderCell(rowIndex: number, columnIndex: number) {
        const value = this.store.get(rowIndex, columnIndex);
        return (
            <EditableCell
                value={value == null ? "" : value}
                onConfirm={this.setCellValue.bind(this, rowIndex, columnIndex)}
            />
        );
    }

    private setColumnName(columnIndex: number, value: string) {
        return this.store.set(-1, columnIndex, value);
    }

    private setCellValue(rowIndex: number, columnIndex: number, value: string) {
        return this.store.set(rowIndex, columnIndex, value);
    }
}

ReactDOM.render(
    <MutableTable/>,
    document.querySelector(".table"),
);
