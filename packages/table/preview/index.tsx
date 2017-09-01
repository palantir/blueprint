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
    Button,
    Classes,
    FocusStyleManager,
    Intent,
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
    TruncatedFormat,
    TruncatedPopoverMode,
    Utils,
} from "../src/index";

import { Nav } from "./nav";
ReactDOM.render(<Nav selected="perf" />, document.getElementById("nav"));

import { IFocusedCellCoordinates } from "../src/common/cell";
import { IColumnIndices, IRowIndices } from "../src/common/grid";
import { RenderMode } from "../src/common/renderMode";
import { IRegion } from "../src/regions";
import { DenseGridMutableStore } from "./denseGridMutableStore";

enum FocusStyle {
    TAB,
    TAB_OR_CLICK,
};

type IMutableStateUpdateCallback =
    (stateKey: keyof IMutableTableState) => ((event: React.FormEvent<HTMLElement>) => void);

interface IMutableTableState {
    cellContent?: CellContent;
    cellTruncatedPopoverMode?: TruncatedPopoverMode;
    enableBatchRendering?: boolean;
    enableCellEditing?: boolean;
    enableCellSelection?: boolean;
    enableCellTruncation?: boolean;
    enableColumnCustomHeaders?: boolean;
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
    numFrozenCols?: number;
    numFrozenRows?: number;
    numRows?: number;
    scrollToColumnIndex?: number;
    scrollToRegionType?: RegionCardinality;
    scrollToRowIndex?: number;
    selectedFocusStyle?: FocusStyle;
    showCallbackLogs?: boolean;
    showCellsLoading?: boolean;
    showColumnHeadersLoading?: boolean;
    showColumnInteractionBar?: boolean;
    showColumnMenus?: boolean;
    showCustomRegions?: boolean;
    showFocusCell?: boolean;
    showGhostCells?: boolean;
    showInline?: boolean;
    showRowHeaders?: boolean;
    showRowHeadersLoading?: boolean;
    showZebraStriping?: boolean;
}

const COLUMN_COUNTS = [
    0,
    1,
    5,
    20,
    100,
    1000,
];

const ROW_COUNTS = [
    0,
    1,
    5,
    20,
    100,
    1000,
    100000,
];

const FROZEN_COLUMN_COUNTS = [0, 1, 2, 5, 20, 100, 1000];
const FROZEN_ROW_COUNTS = [0, 1, 2, 5, 20, 100, 1000];

const REGION_CARDINALITIES = [
    RegionCardinality.CELLS,
    RegionCardinality.FULL_ROWS,
    RegionCardinality.FULL_COLUMNS,
    RegionCardinality.FULL_TABLE,
];

enum CellContent {
    EMPTY,
    CELL_NAMES,
    LONG_TEXT,
};

const CELL_CONTENTS = [
    CellContent.EMPTY,
    CellContent.CELL_NAMES,
    CellContent.LONG_TEXT,
];

const TRUNCATED_POPOVER_MODES = [
    TruncatedPopoverMode.ALWAYS,
    TruncatedPopoverMode.NEVER,
    TruncatedPopoverMode.WHEN_TRUNCATED,
] as TruncatedPopoverMode[];

const COLUMN_COUNT_DEFAULT_INDEX = 3;
const ROW_COUNT_DEFAULT_INDEX = 4;

const FROZEN_COLUMN_COUNT_DEFAULT_INDEX = 0;
const FROZEN_ROW_COUNT_DEFAULT_INDEX = 0;

const LONG_TEXT_MIN_LENGTH = 5;
const LONG_TEXT_MAX_LENGTH = 40;
const ALPHANUMERIC_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const CELL_CONTENT_GENERATORS = {
    [CellContent.CELL_NAMES]: Utils.toBase26CellName,
    [CellContent.EMPTY]: () => "",
    [CellContent.LONG_TEXT]: () => {
        const randomLength = getRandomInteger(LONG_TEXT_MIN_LENGTH, LONG_TEXT_MAX_LENGTH);
        return Utils.times(randomLength, () => {
            const randomIndex = getRandomInteger(0, ALPHANUMERIC_CHARS.length - 1);
            return ALPHANUMERIC_CHARS[randomIndex];
        }).join("");
    },
};

class MutableTable extends React.Component<{}, IMutableTableState> {
    private store = new DenseGridMutableStore<string>();

    private tableInstance: Table;

    private refHandlers = {
        table: (ref: Table) => this.tableInstance = ref,
    };

    public constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            cellContent: CellContent.LONG_TEXT,
            cellTruncatedPopoverMode: TruncatedPopoverMode.WHEN_TRUNCATED,
            enableBatchRendering: true,
            enableCellEditing: false,
            enableCellSelection: true,
            enableCellTruncation: false,
            enableColumnCustomHeaders: true,
            enableColumnNameEditing: false,
            enableColumnReordering: true,
            enableColumnResizing: true,
            enableColumnSelection: true,
            enableContextMenu: false,
            enableFullTableSelection: true,
            enableMultiSelection: true,
            enableRowReordering: false,
            enableRowResizing: false,
            enableRowSelection: true,
            numCols: COLUMN_COUNTS[COLUMN_COUNT_DEFAULT_INDEX],
            numFrozenCols: FROZEN_COLUMN_COUNTS[FROZEN_COLUMN_COUNT_DEFAULT_INDEX],
            numFrozenRows: FROZEN_ROW_COUNTS[FROZEN_ROW_COUNT_DEFAULT_INDEX],
            numRows: ROW_COUNTS[ROW_COUNT_DEFAULT_INDEX],
            scrollToColumnIndex: 0,
            scrollToRegionType: RegionCardinality.CELLS,
            scrollToRowIndex: 0,
            selectedFocusStyle: FocusStyle.TAB,
            showCallbackLogs: true,
            showCellsLoading: false,
            showColumnHeadersLoading: false,
            showColumnInteractionBar: false,
            showColumnMenus: false,
            showCustomRegions: false,
            showFocusCell: false,
            showGhostCells: true,
            showInline: false,
            showRowHeaders: true,
            showRowHeadersLoading: false,
            showZebraStriping: false,
        };
    }

    // React Lifecycle
    // ===============

    public render() {
        const renderMode = this.state.enableBatchRendering
            ? RenderMode.BATCH
            : RenderMode.NONE;

        return (
            <div className="container">
                <Table
                    allowMultipleSelection={this.state.enableMultiSelection}
                    className={classNames("table", { "is-inline": this.state.showInline })}
                    enableFocus={this.state.showFocusCell}
                    fillBodyWithGhostCells={this.state.showGhostCells}
                    isColumnResizable={this.state.enableColumnResizing}
                    isColumnReorderable={this.state.enableColumnReordering}
                    isRowHeaderShown={this.state.showRowHeaders}
                    isRowReorderable={this.state.enableRowReordering}
                    isRowResizable={this.state.enableRowResizing}
                    loadingOptions={this.getEnabledLoadingOptions()}
                    numFrozenColumns={this.state.numFrozenCols}
                    numFrozenRows={this.state.numFrozenRows}
                    numRows={this.state.numRows}
                    onSelection={this.onSelection}
                    onCompleteRender={this.onCompleteRender}
                    onColumnsReordered={this.onColumnsReordered}
                    onColumnWidthChanged={this.onColumnWidthChanged}
                    onCopy={this.onCopy}
                    onFocus={this.onFocus}
                    onVisibleCellsChange={this.onVisibleCellsChange}
                    onRowHeightChanged={this.onRowHeightChanged}
                    onRowsReordered={this.onRowsReordered}
                    ref={this.refHandlers.table}
                    renderBodyContextMenu={this.renderBodyContextMenu}
                    renderMode={renderMode}
                    renderRowHeader={this.renderRowHeader}
                    selectionModes={this.getEnabledSelectionModes()}
                    styledRegionGroups={this.getStyledRegionGroups()}
                >
                    {this.renderColumns()}
                </Table>
                {this.renderSidebar()}
            </div>
        );
    }

    public componentWillMount() {
        this.resetCellContent();
    }

    public componentDidMount() {
        this.syncFocusStyle();
    }

    public componentWillUpdate(_nextProps: {}, nextState: IMutableTableState) {
        if (nextState.cellContent !== this.state.cellContent
            || nextState.numRows !== this.state.numRows
            || nextState.numCols !== this.state.numCols
        ) {
            this.resetCellContent(nextState);
        }
    }

    public componentDidUpdate() {
        this.syncFocusStyle();
        this.syncDependentBooleanStates();
    }

    // Generators
    // ==========

    private generateColumnKey = () => {
        return Math.random().toString(36).substring(7);
    }

    // Renderers
    // =========

    private renderColumns() {
        return Utils.times(this.state.numCols, (columnIndex) => {
            return <Column
                key={this.store.getColumnKey(columnIndex)}
                renderColumnHeader={this.renderColumnHeaderCell}
                renderCell={this.renderCell}
            />;
        });
    }

    private renderColumnHeaderCell = (columnIndex: number) => {
        return (<ColumnHeaderCell
            index={columnIndex}
            name={this.store.getColumnName(columnIndex)}
            renderMenu={this.state.showColumnMenus ? this.renderColumnMenu : undefined}
            renderName={this.getColumnNameRenderer()}
            useInteractionBar={this.state.showColumnInteractionBar}
        />);
    }

    private getColumnNameRenderer = () => {
        if (this.state.enableColumnCustomHeaders) {
            return this.renderCustomColumnName;
        } else if (this.state.enableColumnNameEditing) {
            return this.renderEditableColumnName;
        } else {
            return undefined;
        }
    }

    private renderCustomColumnName = (name: string) => {
        return (
            <div className="tbl-custom-column-header">
                <div className="tbl-custom-column-header-name">
                    {name}
                </div>
                <div className="tbl-custom-column-header-type">
                    string
                </div>
            </div>
        )
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
        const menu = <Menu>
            <MenuItem
                iconName="insert"
                onClick={() => {
                    this.store.addColumnBefore(columnIndex);
                    this.setState({numCols : this.state.numCols + 1} as IMutableTableState);
                }}
                text="Insert column before"
            />
            <MenuItem
                iconName="insert"
                onClick={() => {
                    this.store.addColumnAfter(columnIndex);
                    this.setState({numCols : this.state.numCols + 1} as IMutableTableState);
                }}
                text="Insert column after"
            />
            <MenuItem
                iconName="remove"
                onClick={() => {
                    this.store.removeColumn(columnIndex);
                    this.setState({numCols : this.state.numCols - 1} as IMutableTableState);
                }}
                text="Remove column"
            />
        </Menu>;

        return this.state.showColumnMenus ? menu : undefined;
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
                    this.store.addRowBefore(rowIndex);
                    this.setState({numRows : this.state.numRows + 1} as IMutableTableState);
                }}
                text="Insert row before"
            />
            <MenuItem
                iconName="insert"
                onClick={() => {
                    this.store.addRowAfter(rowIndex);
                    this.setState({numRows : this.state.numRows + 1} as IMutableTableState);
                }}
                text="Insert row after"
            />
            <MenuItem
                iconName="remove"
                onClick={() => {
                    this.store.removeRow(rowIndex);
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

        if (this.state.enableCellEditing) {
            return <EditableCell
                className={classes}
                columnIndex={columnIndex}
                loading={this.state.showCellsLoading}
                onConfirm={this.handleEditableBodyCellConfirm}
                rowIndex={rowIndex}
                value={valueAsString}
            />;
        } else if (this.state.enableCellTruncation) {
            return (
                <Cell className={classes}>
                    <TruncatedFormat
                        detectTruncation={true}
                        preformatted={false}
                        showPopover={this.state.cellTruncatedPopoverMode}
                        truncateLength={80}
                        truncationSuffix="..."
                    >
                        {valueAsString}
                    </TruncatedFormat>
                </Cell>
            );
        } else {
            return (
                <Cell className={classes} columnIndex={columnIndex} rowIndex={rowIndex}>
                    {valueAsString}
                </Cell>
            );
        }
    }

    private renderSidebar() {
        const cellContentMenu = this.renderSelectMenu(
            "Cell content",
            "cellContent",
            CELL_CONTENTS,
            this.toCellContentLabel,
            this.handleNumberStateChange,
        );
        const truncatedPopoverModeMenu = this.renderSelectMenu(
            "Popover",
            "cellTruncatedPopoverMode",
            TRUNCATED_POPOVER_MODES,
            this.toTruncatedPopoverModeLabel,
            this.handleNumberStateChange,
            "enableCellTruncation",
            true,
        );

        return (
            <div className="sidebar pt-elevation-0">
                <h4>Table</h4>
                <h6>Display</h6>
                {this.renderSwitch("Inline", "showInline")}
                {this.renderSwitch("Focus cell", "showFocusCell")}
                {this.renderSwitch("Ghost cells", "showGhostCells")}
                {this.renderSwitch("Batch rendering", "enableBatchRendering")}
                <h6>Interactions</h6>
                {this.renderSwitch("Body context menu", "enableContextMenu")}
                {this.renderSwitch("Callback logs", "showCallbackLogs")}
                {this.renderSwitch("Full-table selection", "enableFullTableSelection")}
                {this.renderSwitch("Multi-selection", "enableMultiSelection")}
                <h6>Scroll to</h6>
                {this.renderScrollToSection()}

                <h4>Columns</h4>
                <h6>Display</h6>
                {this.renderNumberSelectMenu("Num. columns", "numCols", COLUMN_COUNTS)}
                {this.renderNumberSelectMenu("Num. frozen columns", "numFrozenCols", FROZEN_COLUMN_COUNTS)}
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
                {this.renderNumberSelectMenu("Num. rows", "numRows", ROW_COUNTS)}
                {this.renderNumberSelectMenu("Num. frozen rows", "numFrozenRows", FROZEN_ROW_COUNTS)}
                {this.renderSwitch("Headers", "showRowHeaders")}
                {this.renderSwitch("Loading state", "showRowHeadersLoading")}
                {this.renderSwitch("Zebra striping", "showZebraStriping")}
                <h6>Interactions</h6>
                {this.renderSwitch("Reordering", "enableRowReordering")}
                {this.renderSwitch("Resizing", "enableRowResizing")}
                {this.renderSwitch("Selection", "enableRowSelection")}

                <h4>Cells</h4>
                <h6>Display</h6>
                {cellContentMenu}
                {this.renderSwitch("Loading state", "showCellsLoading")}
                {this.renderSwitch("Custom regions", "showCustomRegions")}
                <h6>Interactions</h6>
                {this.renderSwitch("Editing", "enableCellEditing")}
                {this.renderSwitch("Selection", "enableCellSelection")}
                {this.renderSwitch("Truncation", "enableCellTruncation", "enableCellEditing", false)}

                <div className="sidebar-indented-group">
                    {truncatedPopoverModeMenu}
                </div>

                <h4>Page</h4>
                <h6>Display</h6>
                {this.renderFocusStyleSelectMenu()}
            </div>
        );
    }

    private renderScrollToSection() {
        const { scrollToRegionType } = this.state;

        const scrollToRegionTypeSelectMenu = this.renderSelectMenu(
            "Region type",
            "scrollToRegionType",
            REGION_CARDINALITIES,
            this.getRegionCardinalityLabel,
            this.handleRegionCardinalityChange,
        );
        const scrollToRowSelectMenu = this.renderSelectMenu(
            "Row",
            "scrollToRowIndex",
            Utils.times(this.state.numRows, (rowIndex) => rowIndex),
            (rowIndex) => `${rowIndex + 1}`,
            this.handleNumberStateChange,
        );
        const scrollToColumnSelectMenu = this.renderSelectMenu(
            "Column",
            "scrollToColumnIndex",
            Utils.times(this.state.numCols, (columnIndex) => columnIndex),
            (columnIndex) => this.store.getColumnName(columnIndex),
            this.handleNumberStateChange,
        );

        const ROW_MENU_CARDINALITIES = [RegionCardinality.CELLS, RegionCardinality.FULL_ROWS];
        const COLUMN_MENU_CARDINALITIES = [RegionCardinality.CELLS, RegionCardinality.FULL_COLUMNS];

        const shouldShowRowSelectMenu = contains(ROW_MENU_CARDINALITIES, scrollToRegionType);
        const shouldShowColumnSelectMenu = contains(COLUMN_MENU_CARDINALITIES, scrollToRegionType);

        return (
            <div>
                {scrollToRegionTypeSelectMenu}
                <div className="sidebar-indented-group">
                    {shouldShowRowSelectMenu ? scrollToRowSelectMenu : undefined}
                    {shouldShowColumnSelectMenu ? scrollToColumnSelectMenu : undefined}
                </div>
                <Button intent={Intent.PRIMARY} className={Classes.FILL} onClick={this.handleScrollToButtonClick}>
                    Scroll
                </Button>
            </div>
        );
    }

    private getRegionCardinalityLabel(cardinality: RegionCardinality) {
        switch (cardinality) {
            case RegionCardinality.CELLS:
                return "Cell";
            case RegionCardinality.FULL_ROWS:
                return "Row";
            case RegionCardinality.FULL_COLUMNS:
                return "Column";
            case RegionCardinality.FULL_TABLE:
                return "Full table";
            default:
                return "";
        }
    }

    private renderSwitch(
        label: string,
        stateKey: keyof IMutableTableState,
        prereqStateKey?: keyof IMutableTableState,
        prereqStateKeyValue?: any,
    ) {
        const isDisabled = !this.isPrereqStateKeySatisfied(prereqStateKey, prereqStateKeyValue);

        const child = <Switch
            checked={this.state[stateKey] as boolean}
            className={Classes.ALIGN_RIGHT}
            disabled={isDisabled}
            label={label}
            onChange={this.handleBooleanStateChange(stateKey)}
        />;

        if (isDisabled) {
            return this.wrapDisabledControlWithTooltip(child, prereqStateKey, prereqStateKeyValue);
        } else {
            return child;
        }
    }

    private renderFocusStyleSelectMenu() {
        const { selectedFocusStyle } = this.state;
        return (
            <label className={classNames(Classes.LABEL, Classes.INLINE, "tbl-select-label")}>
                {"Focus outlines"}
                <div className={Classes.SELECT}>
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

    private renderNumberSelectMenu(label: string, stateKey: keyof IMutableTableState, values: number[]) {
        return this.renderSelectMenu(
            label,
            stateKey,
            values,
            this.toValueLabel,
            this.handleNumberStateChange,
        );
    }

    private renderSelectMenu<T>(
        label: string,
        stateKey: keyof IMutableTableState,
        values: T[],
        generateValueLabel: (value: any) => string,
        handleChange: IMutableStateUpdateCallback,
        prereqStateKey?: keyof IMutableTableState,
        prereqStateKeyValue?: any,
    ) {
        const isDisabled = !this.isPrereqStateKeySatisfied(prereqStateKey, prereqStateKeyValue);

        // need to explicitly cast generic type T to string
        const selectedValue = this.state[stateKey].toString();
        const options = values.map((value) => {
            return (
                <option key={value.toString()} value={value.toString()}>
                    {generateValueLabel(value)}
                </option>
            );
        });

        const labelClasses = classNames(Classes.LABEL, Classes.INLINE, "tbl-select-label", {
            [Classes.DISABLED]: isDisabled,
        });

        const child = (
            <label className={labelClasses}>
                {label}
                <div className={Classes.SELECT}>
                    <select onChange={handleChange(stateKey)} value={selectedValue} disabled={isDisabled}>
                        {options}
                    </select>
                </div>
            </label>
        );

        if (isDisabled) {
            return this.wrapDisabledControlWithTooltip(child, prereqStateKey, prereqStateKeyValue);
        } else {
            return child;
        }
    }

    // Disabled control helpers
    // ========================

    private isPrereqStateKeySatisfied(key?: keyof IMutableTableState, value?: any) {
        return key == null || this.state[key] === value;
    }

    private wrapDisabledControlWithTooltip(
        element: JSX.Element,
        prereqStateKey: keyof IMutableTableState,
        prereqStateKeyValue: any,
    ) {
        // Blueprint Tooltip affects the layout, so just show a native title on hover
        return (
            <div title={`Requires ${prereqStateKey}=${prereqStateKeyValue}`}>
                {element}
            </div>
        );
    }

    // Select menu - label generators
    // ==============================

    private toCellContentLabel(cellContent: CellContent) {
        switch (cellContent) {
            case CellContent.CELL_NAMES:
                return "Cell names";
            case CellContent.EMPTY:
                return "Empty";
            case CellContent.LONG_TEXT:
                return "Long text";
            default:
                return "";
        }
    }

    private toTruncatedPopoverModeLabel(truncatedPopoverMode: TruncatedPopoverMode) {
        switch (truncatedPopoverMode) {
            case TruncatedPopoverMode.ALWAYS:
                return "Always";
            case TruncatedPopoverMode.NEVER:
                return "Never";
            case TruncatedPopoverMode.WHEN_TRUNCATED:
                return "When truncated";
            default:
                return "";
        }
    }

    private toValueLabel(value: any) {
        return value.toString();
    }

    // Callbacks
    // =========

    private onCompleteRender = () => {
        this.maybeLogCallback("[onCompleteRender]");
    }

    private onSelection = (selectedRegions: IRegion[]) => {
        this.maybeLogCallback(`[onSelection] selectedRegions =`, ...selectedRegions);
    }

    private onColumnsReordered = (oldIndex: number, newIndex: number, length: number) => {
        this.maybeLogCallback(`[onColumnsReordered] oldIndex = ${oldIndex} newIndex = ${newIndex} length = ${length}`);
        this.store.reorderColumns(oldIndex, newIndex, length);
        this.forceUpdate();
    }

    private onRowsReordered = (oldIndex: number, newIndex: number, length: number) => {
        this.maybeLogCallback(`[onRowsReordered] oldIndex = ${oldIndex} newIndex = ${newIndex} length = ${length}`);
        this.store.reorderRows(oldIndex, newIndex, length);
        this.forceUpdate();
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

    private onVisibleCellsChange = (rowIndices: IRowIndices, columnIndices: IColumnIndices) => {
        const { rowIndexStart, rowIndexEnd } = rowIndices;
        const { columnIndexStart, columnIndexEnd } = columnIndices;
        this.maybeLogCallback(`[onVisibleCellsChange] rowIndexStart=${rowIndexStart} rowIndexEnd=${rowIndexEnd} ` +
            `columnIndexStart=${columnIndexStart} columnIndexEnd=${columnIndexEnd}`);
    }

    private maybeLogCallback = (message?: any, ...optionalParams: any[]) => {
        if (this.state.showCallbackLogs) {
            // allow console.log for these callbacks so devs can see exactly when they fire
            // tslint:disable-next-line no-console
            console.log(message, ...optionalParams);
        }
    }

    private handleEditableBodyCellConfirm = (value: string, rowIndex?: number, columnIndex?: number) => {
        this.store.set(rowIndex, columnIndex, value);
    }

    private handleEditableColumnCellConfirm = (value: string, columnIndex?: number) => {
        this.store.setColumnName(columnIndex, value);
    }

    private handleScrollToButtonClick = () => {
        const { scrollToRowIndex, scrollToColumnIndex, scrollToRegionType } = this.state;

        let region: IRegion;
        switch (scrollToRegionType) {
            case RegionCardinality.CELLS:
                region = Regions.cell(scrollToRowIndex, scrollToColumnIndex);
                break;
            case RegionCardinality.FULL_ROWS:
                region = Regions.row(scrollToRowIndex);
                break;
            case RegionCardinality.FULL_COLUMNS:
                region = Regions.column(scrollToColumnIndex);
                break;
            case RegionCardinality.FULL_TABLE:
                region = Regions.table();
                break;
            default:
                return;
        }

        this.tableInstance.scrollToRegion(region);
    }

    // State updates
    // =============

    private resetCellContent = (nextState = this.state) => {
        const orderedColumnKeys = Utils.times(nextState.numCols, this.generateColumnKey);
        this.store.setOrderedColumnKeys(orderedColumnKeys);

        const generator = CELL_CONTENT_GENERATORS[nextState.cellContent];
        Utils.times(nextState.numCols, (columnIndex) => {
            this.store.setColumnName(columnIndex, `Column ${Utils.toBase26Alpha(columnIndex)}`);
            Utils.times(nextState.numRows, (rowIndex) => {
                this.store.set(rowIndex, columnIndex, generator(rowIndex, columnIndex));
            });
        });
    }

    private syncFocusStyle() {
        const { selectedFocusStyle } = this.state;
        const isFocusStyleManagerActive = FocusStyleManager.isActive();

        if (selectedFocusStyle === FocusStyle.TAB_OR_CLICK && isFocusStyleManagerActive) {
            FocusStyleManager.alwaysShowFocus();
        } else if (selectedFocusStyle === FocusStyle.TAB && !isFocusStyleManagerActive) {
            FocusStyleManager.onlyShowFocusOnTabs();
        }
    }

    private syncDependentBooleanStates = () => {
        if (this.state.enableCellEditing && this.state.enableCellTruncation) {
            this.setState({ enableCellTruncation: false });
        }
    }

    private handleBooleanStateChange = (stateKey: keyof IMutableTableState) => {
        return handleBooleanChange((value) => this.setState({ [stateKey]: value }));
    }

    private handleNumberStateChange = (stateKey: keyof IMutableTableState) => {
        return handleNumberChange((value) => this.setState({ [stateKey]: value }));
    }

    private handleRegionCardinalityChange = (stateKey: keyof IMutableTableState) => {
        return handleNumberChange((value) => this.setState({ [stateKey]: value }));
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
        if (this.state.enableCellSelection) {
            selectionModes.push(RegionCardinality.CELLS);
        }
        return selectionModes;
    }

    private getEnabledLoadingOptions() {
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

    private getStyledRegionGroups() {
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

/** Event handler that exposes the target element's value as a string. */
function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
}

/** Event handler that exposes the target element's value as a number. */
function handleNumberChange(handler: (value: number) => void) {
    return handleStringChange((value) => handler(+value));
}

function getRandomInteger(min: number, max: number) {
    // min and max are inclusive
    return Math.floor(min + (Math.random() * (max - min + 1)));
}

function contains(arr: any[], value: any) {
    return arr.indexOf(value) >= 0;
}
