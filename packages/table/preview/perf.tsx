/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 *
 * Demonstrates sample usage of the table component.
 */

import * as classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    Menu,
    MenuDivider,
    MenuItem,
    Switch,
} from "@blueprintjs/core";

import {
    Column,
    ColumnHeaderCell,
    EditableCell,
    EditableName,
    RegionCardinality,
    RowHeaderCell,
    Table,
    Utils,
} from "../src/index";

import { Nav } from "./nav";
ReactDOM.render(<Nav selected="perf" />, document.getElementById("nav"));

import { SparseGridMutableStore } from "./store";

interface IMutableTableState {
    enableColumnNameEditing?: boolean;
    enableColumnReordering?: boolean;
    enableColumnResizing?: boolean;
    enableColumnSelection?: boolean;
    enableContextMenu?: boolean;
    enableFullTableSelection?: boolean;
    enableMultipleSelections?: boolean;
    enableRowReordering?: boolean;
    enableRowResizing?: boolean;
    enableRowSelection?: boolean;
    numCols?: number;
    numRows?: number;
    showColumnInteractionBar?: boolean;
    showColumnMenus?: boolean;
    showFocusCell?: boolean;
    showGhostCells?: boolean;
    showInline?: boolean;
}

const COLUMN_COUNTS = [
    0,
    1,
    10,
    20,
    100,
    1000,
];

const ROW_COUNTS = [
    0,
    1,
    10,
    100,
    10000,
    1000000,
];

const COLUMN_COUNT_DEFAULT_INDEX = 2;
const ROW_COUNT_DEFAULT_INDEX = 2;

class MutableTable extends React.Component<{}, IMutableTableState> {
    private store = new SparseGridMutableStore<string>();

    public constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            numCols : COLUMN_COUNTS[COLUMN_COUNT_DEFAULT_INDEX],
            numRows : ROW_COUNTS[ROW_COUNT_DEFAULT_INDEX],
        };
    }

    public render() {
        return (
            <div className="container">
                <Table
                    allowMultipleSelection={this.state.enableMultipleSelections}
                    className={classNames("table", { "is-inline": this.state.showInline })}
                    enableFocus={this.state.showFocusCell}
                    fillBodyWithGhostCells={this.state.showGhostCells}
                    isColumnResizable={this.state.enableColumnResizing}
                    isColumnReorderable={this.state.enableColumnReordering}
                    isRowReorderable={this.state.enableRowReordering}
                    isRowResizable={this.state.enableRowResizing}
                    numRows={this.state.numRows}
                    renderBodyContextMenu={this.renderBodyContextMenu}
                    renderRowHeader={this.renderRowHeader.bind(this)}
                    selectionModes={this.getEnabledSelectionModes()}
                >
                    {this.renderColumns()}
                </Table>
                {this.renderSidebar()}
            </div>
        );
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
        const name = `Column ${Utils.toBase26Alpha(columnIndex)}`;
        const renderName = () => {
            return (<EditableName
                name={name == null ? "" : name}
                onConfirm={this.setColumnName.bind(this, columnIndex)}
            />);
        };

        return (<ColumnHeaderCell
            menu={this.renderColumnMenu(columnIndex)}
            name={name}
            renderName={this.state.enableColumnNameEditing ? renderName : undefined}
            useInteractionBar={this.state.showColumnInteractionBar}
        />);
    }

    private renderColumnMenu(columnIndex: number) {
        // tslint:disable:jsx-no-multiline-js jsx-no-lambda
        const menu = <Menu>
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

        return this.state.showColumnMenus ? menu : undefined;
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

    private renderSidebar() {
        const columnCountSelect = this.renderNumberSelectMenu("Number of columns", "numCols", COLUMN_COUNTS);
        const rowCountSelect = this.renderNumberSelectMenu("Number of rows", "numRows", ROW_COUNTS);
        return (
            <div className="sidebar pt-elevation-2">
                <h4>Table</h4>
                <h6>Display</h6>
                {this.renderSwitch("Show inline", "showInline")}
                {this.renderSwitch("Show focus cell", "showFocusCell")}
                {this.renderSwitch("Show ghost cells", "showGhostCells")}
                <h6>Interactions</h6>
                {this.renderSwitch("Enable context menu", "enableContextMenu")}
                {this.renderSwitch("Enable full-table selection", "enableFullTableSelection")}
                {this.renderSwitch("Enable multiple selections", "enableMultipleSelections")}

                <h4>Columns</h4>
                <h6>Display</h6>
                {columnCountSelect}
                {this.renderSwitch("Show interaction bar", "showColumnInteractionBar")}
                {this.renderSwitch("Show menus", "showColumnMenus")}
                <h6>Interactions</h6>
                {this.renderSwitch("Enable name editing", "enableColumnNameEditing")}
                {this.renderSwitch("Enable drag-reordering", "enableColumnReordering")}
                {this.renderSwitch("Enable drag-resizing", "enableColumnResizing")}
                {this.renderSwitch("Enable selection", "enableColumnSelection")}

                <h4>Row</h4>
                <h6>Display</h6>
                {rowCountSelect}
                <h6>Interactions</h6>
                {this.renderSwitch("Enable drag-reordering", "enableRowReordering")}
                {this.renderSwitch("Enable drag-resizing", "enableRowResizing")}
                {this.renderSwitch("Enable selection", "enableRowSelection")}
            </div>
        );
    }

    private renderSwitch(label: string, stateKey: keyof IMutableTableState) {
        return (
            <Switch
                className="pt-align-right"
                label={label}
                onChange={this.updateBooleanState(stateKey)}
            />
        );
    }

    private renderNumberSelectMenu(label: string, stateKey: keyof IMutableTableState, values: number[]) {
        const selectedValue = this.state[stateKey];
        const options = values.map((value) => {
            return (
                <option selected={value === selectedValue} value={value.toString()}>
                    {value}
                </option>
            );
        });
        return (
            <label className="pt-label pt-inline tbl-select-label">
                {label}
                <div className="pt-select">
                    <select onChange={this.updateNumberState(stateKey)}>
                        {options}
                    </select>
                </div>
            </label>
        );
    }

    private setColumnName(columnIndex: number, value: string) {
        return this.store.set(-1, columnIndex, value);
    }

    private setCellValue(rowIndex: number, columnIndex: number, value: string) {
        return this.store.set(rowIndex, columnIndex, value);
    }

    private updateBooleanState(stateKey: keyof IMutableTableState) {
        return handleBooleanChange((value: boolean) => {
            this.setState({ [stateKey]: value });
        });
    }

    private updateNumberState(stateKey: keyof IMutableTableState) {
        return handleNumberChange((value: number) => {
            this.setState({ [stateKey]: value });
        });
    }

    private renderBodyContextMenu = () => {
        const menu = (
            <Menu>
                <MenuItem iconName="search-around" text="Item 1" />
                <MenuItem iconName="search" text="Item 2" />
                <MenuItem iconName="graph-remove" text="Item 3" />
                <MenuItem iconName="group-objects" text="Item 4" />
                <MenuDivider />
                <MenuItem disabled={true} text="Disabled item" />
            </Menu>
        );
        return this.state.enableContextMenu ? menu : undefined;
    }

    private getEnabledSelectionModes() {
        const selectionModes: RegionCardinality[] = [];
        if (this.state.enableFullTableSelection) {
            selectionModes.push(RegionCardinality.FULL_TABLE);
        }
        if (this.state.enableColumnSelection) {
            selectionModes.push(RegionCardinality.FULL_COLUMNS);
        }
        if (this.state.enableRowSelection) {
            selectionModes.push(RegionCardinality.FULL_ROWS);
        }
        return selectionModes;
    }
}

ReactDOM.render(
    <MutableTable/>,
    document.querySelector("#page-content"),
);

// TODO: Pull these from @blueprintjs/docs

/** Event handler that exposes the target element's value as a boolean. */
function handleBooleanChange(handler: (checked: boolean) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).checked);
}

// /** Event handler that exposes the target element's value as a string. */
function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
}

// /** Event handler that exposes the target element's value as a number. */
function handleNumberChange(handler: (value: number) => void) {
    return handleStringChange((value) => handler(+value));
}
