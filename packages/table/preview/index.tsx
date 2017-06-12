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
    FocusStyleManager,
    Menu,
    MenuDivider,
    MenuItem,
    Switch,
} from "@blueprintjs/core";

import {
    Cell,
    Column,
    ColumnHeaderCell,
    EditableCell,
    EditableName,
    IStyledRegionGroup,
    RegionCardinality,
    Regions,
    RowHeaderCell,
    Table,
    TableLoadingOption,
    Utils,
} from "../src/index";

import { Nav } from "./nav";
ReactDOM.render(<Nav selected="perf" />, document.getElementById("nav"));

import { IFocusedCellCoordinates } from "../src/common/cell";
import { IRegion } from "../src/regions";
import { SparseGridMutableStore } from "./store";

enum FocusStyle {
    TAB,
    TAB_OR_CLICK,
};

interface IMutableTableState {
    enableCellEditing?: boolean;
    enableCellSelection?: boolean;
    enableColumnNameEditing?: boolean;
    enableColumnReordering?: boolean;
    enableColumnResizing?: boolean;
    enableColumnSelection?: boolean;
    enableContextMenu?: boolean;
    enableFullTableSelection?: boolean;
    enableMultiSelection?: boolean;
    enableRowReordering?: boolean;
    enableRowResizing?: boolean;
    enableRowSelection?: boolean;
    numCols?: number;
    numRows?: number;
    showCallbackLogs?: boolean;
    showCellsLoading?: boolean;
    showColumnHeadersLoading?: boolean;
    showColumnInteractionBar?: boolean;
    showColumnMenus?: boolean;
    showCustomRegions?: boolean;
    showFocusCell?: boolean;
    selectedFocusStyle?: FocusStyle;
    showGhostCells?: boolean;
    showInline?: boolean;
    showRowHeaders?: boolean;
    showRowHeadersLoading?: boolean;
    showZebraStriping?: boolean;
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
const ROW_COUNT_DEFAULT_INDEX = 3;

class MutableTable extends React.Component<{}, IMutableTableState> {
    private store = new SparseGridMutableStore<string>();

    public constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            enableCellEditing: true,
            enableCellSelection: true,
            enableColumnNameEditing: true,
            enableColumnReordering: true,
            enableColumnResizing: true,
            enableColumnSelection: true,
            enableContextMenu: true,
            enableFullTableSelection: true,
            enableMultiSelection: true,
            enableRowReordering: true,
            enableRowResizing: true,
            enableRowSelection: true,
            numCols: COLUMN_COUNTS[COLUMN_COUNT_DEFAULT_INDEX],
            numRows: ROW_COUNTS[ROW_COUNT_DEFAULT_INDEX],
            selectedFocusStyle: FocusStyle.TAB,
            showCallbackLogs: false,
            showCellsLoading: false,
            showColumnHeadersLoading: false,
            showColumnInteractionBar: true,
            showColumnMenus: true,
            showCustomRegions: false,
            showFocusCell: true,
            showGhostCells: true,
            showInline: false,
            showRowHeaders: true,
            showRowHeadersLoading: false,
        };
    }

    // React Lifecycle
    // ===============

    public render() {
        return (
            <div className="container">
                <Table
                    allowMultipleSelection={this.state.enableMultiSelection}
                    className={classNames("table", { "is-inline": this.state.showInline })}
                    enableFocus={this.state.showFocusCell}
                    fillBodyWithGhostCells={this.state.showGhostCells}
                    isColumnResizable={this.state.enableColumnResizing}
                    isColumnReorderable={this.state.enableColumnReordering}
                    isRowReorderable={this.state.enableRowReordering}
                    isRowResizable={this.state.enableRowResizing}
                    loadingOptions={this.getEnabledLoadingOptions()}
                    numRows={this.state.numRows}
                    renderBodyContextMenu={this.renderBodyContextMenu}
                    renderRowHeader={this.renderRowHeader}
                    selectionModes={this.getEnabledSelectionModes()}
                    isRowHeaderShown={this.state.showRowHeaders}
                    styledRegionGroups={this.getStyledRegionGroups()}

                    onSelection={this.onSelection}
                    onColumnsReordered={this.onColumnsReordered}
                    onColumnWidthChanged={this.onColumnWidthChanged}
                    onCopy={this.onCopy}
                    onFocus={this.onFocus}
                    onRowHeightChanged={this.onRowHeightChanged}
                    onRowsReordered={this.onRowsReordered}
                >
                    {this.renderColumns()}
                </Table>
                {this.renderSidebar()}
            </div>
        );
    }

    public componentDidMount() {
        this.syncFocusStyle();
    }

    public componentDidUpdate() {
        this.syncFocusStyle();
    }

    // Renderers
    // =========

    private renderColumns = () => {
        return Utils.times(this.state.numCols, (index) => {
            return <Column
                key={index}
                renderColumnHeader={this.renderColumnHeader}
                renderCell={this.renderCell}
            />;
        });
    }

    private renderColumnHeader = (columnIndex: number) => {
        const name = `Column ${Utils.toBase26Alpha(columnIndex)}`;
        return (<ColumnHeaderCell
            index={columnIndex}
            name={name}
            renderMenu={this.state.showColumnMenus ? this.renderColumnMenu : undefined}
            renderName={this.state.enableColumnNameEditing ? this.renderEditableColumnName : undefined}
            useInteractionBar={this.state.showColumnInteractionBar}
        />);
    }

    private renderEditableColumnName = (name: string) => {
        return (
            <EditableName
                name={name == null ? "" : name}
                onConfirm={this.handleEditableColumnCellConfirm}
            />
        );
    }

    private renderColumnMenu = (columnIndex: number) => {
        // tslint:disable:jsx-no-multiline-js jsx-no-lambda
        return (
            <Menu>
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
            </Menu>
        );
    }

    private renderRowHeader = (rowIndex: number) => {
        return <RowHeaderCell
            index={rowIndex}
            name={`${rowIndex + 1}`}
            renderMenu={this.renderRowMenu}
        />;
    }

    private renderRowMenu = (rowIndex: number) => {
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

    private renderCell = (rowIndex: number, columnIndex: number) => {
        const value = this.store.get(rowIndex, columnIndex);
        const valueAsString = value == null ? "" : value;

        const isEvenRow = rowIndex % 2 === 0;
        const classes = classNames({ "tbl-zebra-stripe": this.state.showZebraStriping && isEvenRow });

        return this.state.enableCellEditing ? (
            <EditableCell
                className={classes}
                columnIndex={columnIndex}
                loading={this.state.showCellsLoading}
                onConfirm={this.handleEditableBodyCellConfirm}
                rowIndex={rowIndex}
                value={valueAsString}
            />
        ) : (
            <Cell className={classes} columnIndex={columnIndex} rowIndex={rowIndex}>
                {valueAsString}
            </Cell>
        );
    }

    private renderSidebar = () => {
        return (
            <div className="sidebar pt-elevation-0">
                <h4>Table</h4>
                <h6>Display</h6>
                {this.renderSwitch("Inline", "showInline")}
                {this.renderSwitch("Focus cell", "showFocusCell")}
                {this.renderSwitch("Ghost cells", "showGhostCells")}
                <h6>Interactions</h6>
                {this.renderSwitch("Body context menu", "enableContextMenu")}
                {this.renderSwitch("Callback logs", "showCallbackLogs")}
                {this.renderSwitch("Full-table selection", "enableFullTableSelection")}
                {this.renderSwitch("Multi-selection", "enableMultiSelection")}

                <h4>Columns</h4>
                <h6>Display</h6>
                {this.renderNumberSelectMenu("Number of columns", "numCols", COLUMN_COUNTS)}
                {this.renderSwitch("Loading state", "showColumnHeadersLoading")}
                {this.renderSwitch("Interaction bar", "showColumnInteractionBar")}
                {this.renderSwitch("Menus", "showColumnMenus")}
                <h6>Interactions</h6>
                {this.renderSwitch("Editing", "enableColumnNameEditing")}
                {this.renderSwitch("Reordering", "enableColumnReordering")}
                {this.renderSwitch("Resizing", "enableColumnResizing")}
                {this.renderSwitch("Selection", "enableColumnSelection")}

                <h4>Rows</h4>
                <h6>Display</h6>
                {this.renderNumberSelectMenu("Number of rows", "numRows", ROW_COUNTS)}
                {this.renderSwitch("Headers", "showRowHeaders")}
                {this.renderSwitch("Loading state", "showRowHeadersLoading")}
                {this.renderSwitch("Zebra striping", "showZebraStriping")}
                <h6>Interactions</h6>
                {this.renderSwitch("Reordering", "enableRowReordering")}
                {this.renderSwitch("Resizing", "enableRowResizing")}
                {this.renderSwitch("Selection", "enableRowSelection")}

                <h4>Cells</h4>
                <h6>Display</h6>
                {this.renderSwitch("Loading state", "showCellsLoading")}
                {this.renderSwitch("Custom regions", "showCustomRegions")}
                <h6>Interactions</h6>
                {this.renderSwitch("Editing", "enableCellEditing")}
                {this.renderSwitch("Selection", "enableCellSelection")}

                <h4>Page</h4>
                <h6>Display</h6>
                {this.renderFocusStyleSelectMenu()}
            </div>
        );
    }

    private renderSwitch = (label: string, stateKey: keyof IMutableTableState) => {
        return (
            <Switch
                checked={this.state[stateKey] as boolean}
                className="pt-align-right"
                label={label}
                onChange={this.updateBooleanState(stateKey)}
            />
        );
    }

    private renderFocusStyleSelectMenu = () => {
        const { selectedFocusStyle } = this.state;
        return (
            <label className="pt-label pt-inline tbl-select-label">
                {"Focus outlines"}
                <div className="pt-select">
                    <select onChange={this.updateFocusStyleState()} value={selectedFocusStyle}>
                        <option value={"tab"}>
                            On tab
                        </option>
                        <option value={"tabOrClick"}>
                            On tab or click
                        </option>
                    </select>
                </div>
            </label>
        );
    }

    private renderNumberSelectMenu = (label: string, stateKey: keyof IMutableTableState, values: number[]) => {
        const selectedValue = this.state[stateKey] as number;
        const options = values.map((value) => {
            return (
                <option key={value} value={value}>
                    {value}
                </option>
            );
        });
        return (
            <label className="pt-label pt-inline tbl-select-label">
                {label}
                <div className="pt-select">
                    <select onChange={this.updateNumberState(stateKey)} value={selectedValue}>
                        {options}
                    </select>
                </div>
            </label>
        );
    }

    // Callbacks
    // =========

    // allow console.log for these callbacks so devs can see exactly when they fire
    private onSelection = (selectedRegions: IRegion[]) => {
        this.maybeLogCallback(`[onSelection] selectedRegions =`, ...selectedRegions);
    }

    private onColumnsReordered = (oldIndex: number, newIndex: number, length: number) => {
        this.maybeLogCallback(`[onColumnsReordered] oldIndex = ${oldIndex} newIndex = ${newIndex} length = ${length}`);
    }

    private onRowsReordered = (oldIndex: number, newIndex: number, length: number) => {
        this.maybeLogCallback(`[onRowsReordered] oldIndex = ${oldIndex} newIndex = ${newIndex} length = ${length}`);
    }

    private onColumnWidthChanged = (index: number, size: number) => {
        this.maybeLogCallback(`[onColumnWidthChanged] index = ${index} size = ${size}`);
    }

    private onRowHeightChanged = (index: number, size: number) => {
        this.maybeLogCallback(`[onRowHeightChanged] index = ${index} size = ${size}`);
    }

    private onFocus = (focusedCell: IFocusedCellCoordinates) => {
        this.maybeLogCallback("[onFocus] focusedCell =", focusedCell);
    }

    private onCopy = (success: boolean) => {
        this.maybeLogCallback(`[onCopy] success = ${success}`);
    }

    private maybeLogCallback = (message?: any, ...optionalParams: any[]) => {
        if (this.state.showCallbackLogs) {
            // tslint:disable-next-line no-console
            console.log(message, ...optionalParams);
        }
    }

    private handleEditableBodyCellConfirm = (value: string, rowIndex?: number, columnIndex?: number) => {
        this.store.set(rowIndex, columnIndex, value);
    }

    private handleEditableColumnCellConfirm = (value: string, columnIndex?: number) => {
        // set column name
        this.store.set(-1, columnIndex, value);
    }

    // State updates
    // =============

    private syncFocusStyle = () => {
        const { selectedFocusStyle } = this.state;
        const isFocusStyleManagerActive = FocusStyleManager.isActive();

        if (selectedFocusStyle === FocusStyle.TAB_OR_CLICK && isFocusStyleManagerActive) {
            FocusStyleManager.alwaysShowFocus();
        } else if (selectedFocusStyle === FocusStyle.TAB && !isFocusStyleManagerActive) {
            FocusStyleManager.onlyShowFocusOnTabs();
        }
    }

    private updateBooleanState = (stateKey: keyof IMutableTableState) => {
        return handleBooleanChange((value: boolean) => {
            this.setState({ [stateKey]: value });
        });
    }

    private updateNumberState = (stateKey: keyof IMutableTableState) => {
        return handleNumberChange((value: number) => {
            this.setState({ [stateKey]: value });
        });
    }

    private updateFocusStyleState = () => {
        return handleStringChange((value: string) => {
            const selectedFocusStyle = value === "tab" ? FocusStyle.TAB : FocusStyle.TAB_OR_CLICK;
            this.setState({ selectedFocusStyle });
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

    private getEnabledSelectionModes = () => {
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
        if (this.state.enableCellSelection) {
            selectionModes.push(RegionCardinality.CELLS);
        }
        return selectionModes;
    }

    private getEnabledLoadingOptions = () => {
        const loadingOptions: TableLoadingOption[] = [];
        if (this.state.showColumnHeadersLoading) {
            loadingOptions.push(TableLoadingOption.COLUMN_HEADERS);
        }
        if (this.state.showRowHeadersLoading) {
            loadingOptions.push(TableLoadingOption.ROW_HEADERS);
        }
        if (this.state.showCellsLoading) {
            loadingOptions.push(TableLoadingOption.CELLS);
        }
        return loadingOptions;
    }

    private getStyledRegionGroups = () => {
        // show 3 styled regions as samples
        return !this.state.showCustomRegions ? [] : [
            {
                className: "tbl-styled-region-success",
                regions: [Regions.cell(0, 0, 3, 3)],
            },
            {
                className: "tbl-styled-region-warning",
                regions: [Regions.cell(2, 1, 8, 1)],
            },
            {
                className: "tbl-styled-region-danger",
                regions: [Regions.cell(5, 3, 7, 7)],
            },
        ] as IStyledRegionGroup[];
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
