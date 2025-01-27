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

/* eslint-disable react/jsx-no-bind */

import classNames from "classnames";
import * as React from "react";

import {
    Button,
    type ButtonProps,
    Classes,
    Divider,
    FocusStyleManager,
    H4,
    H6,
    HTMLSelect,
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
    CopyCellsMenuItem,
    EditableCell2,
    EditableName,
    type FocusedCellCoordinates,
    JSONFormat,
    type MenuContext,
    type Region,
    RegionCardinality,
    Regions,
    RenderMode,
    RowHeaderCell,
    type StyledRegionGroup,
    Table2,
    TableLoadingOption,
    TruncatedFormat,
    TruncatedPopoverMode,
    Utils,
} from "@blueprintjs/table";
import { type FocusedRegion, FocusMode } from "@blueprintjs/table/src/common/cellTypes";
import type { ColumnIndices, RowIndices } from "@blueprintjs/table/src/common/grid";

import { DenseGridMutableStore } from "./denseGridMutableStore";
import { LocalStore } from "./localStore";
import { SlowLayoutStack } from "./slowLayoutStack";

export enum FocusStyle {
    TAB = "tab",
    TAB_OR_CLICK = "tab-or-click",
}

export enum CellContent {
    EMPTY = "empty",
    CELL_NAMES = "cell-names",
    LONG_TEXT = "long-text",
    LARGE_JSON = "large-json",
}

export enum SelectedRegionTransformPreset {
    CELL = "cell",
    ROW = "row",
    COLUMN = "column",
}

type MutableStateUpdateCallback = (stateKey: keyof MutableTableState) => (event: React.FormEvent<HTMLElement>) => void;

const COLUMN_COUNTS = [0, 1, 5, 20, 100, 1000];
const ROW_COUNTS = [0, 1, 5, 20, 100, 1000, 100000];
const FROZEN_COLUMN_COUNTS = [0, 1, 2, 5, 20, 100, 1000];
const FROZEN_ROW_COUNTS = [0, 1, 2, 5, 20, 100, 1000];

const REGION_CARDINALITIES: RegionCardinality[] = [
    RegionCardinality.CELLS,
    RegionCardinality.FULL_ROWS,
    RegionCardinality.FULL_COLUMNS,
    RegionCardinality.FULL_TABLE,
];

const FOCUS_MODES: Array<FocusMode | undefined> = [undefined, FocusMode.CELL, FocusMode.ROW];

const RENDER_MODES: RenderMode[] = [RenderMode.BATCH_ON_UPDATE, RenderMode.BATCH, RenderMode.NONE];

const SELECTION_MODES: SelectedRegionTransformPreset[] = [
    SelectedRegionTransformPreset.CELL,
    SelectedRegionTransformPreset.ROW,
    SelectedRegionTransformPreset.COLUMN,
];

const CELL_CONTENTS: CellContent[] = [
    CellContent.EMPTY,
    CellContent.CELL_NAMES,
    CellContent.LONG_TEXT,
    CellContent.LARGE_JSON,
];

const TRUNCATED_POPOVER_MODES: TruncatedPopoverMode[] = [
    TruncatedPopoverMode.ALWAYS,
    TruncatedPopoverMode.NEVER,
    TruncatedPopoverMode.WHEN_TRUNCATED,
    TruncatedPopoverMode.WHEN_TRUNCATED_APPROX,
];

const FOCUS_STYLES: FocusStyle[] = [FocusStyle.TAB, FocusStyle.TAB_OR_CLICK];

const TRUNCATION_LENGTHS: number[] = [20, 80, 100, 1000];
const TRUNCATION_LENGTH_DEFAULT_INDEX = 1;

const SLOW_LAYOUT_STACK_DEPTH = 120;

const COLUMN_COUNT_DEFAULT_INDEX = 3;
const ROW_COUNT_DEFAULT_INDEX = 4;

const FROZEN_COLUMN_COUNT_DEFAULT_INDEX = 0;
const FROZEN_ROW_COUNT_DEFAULT_INDEX = 0;

const LONG_TEXT_MIN_LENGTH = 5;
const LONG_TEXT_MAX_LENGTH = 120;
const LONG_TEXT_WORD_SPLIT_REGEXP = /.{1,5}/g;

const LARGE_JSON_PROP_COUNT = 3;
const LARGE_JSON_OBJECT_DEPTH = 2;

const CELL_CONTENT_GENERATORS: { [name: string]: (ri: number, ci: number) => string | Record<string, unknown> } = {
    /* eslint-disable-next-line @typescript-eslint/unbound-method */
    [CellContent.CELL_NAMES]: Utils.toBase26CellName,
    [CellContent.EMPTY]: () => "",
    [CellContent.LONG_TEXT]: () => {
        const randomLength = getRandomInteger(LONG_TEXT_MIN_LENGTH, LONG_TEXT_MAX_LENGTH);
        return getRandomString(randomLength).match(LONG_TEXT_WORD_SPLIT_REGEXP).join(" ");
    },
    [CellContent.LARGE_JSON]: () => {
        return getRandomObject(LARGE_JSON_PROP_COUNT, LARGE_JSON_OBJECT_DEPTH);
    },
};

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
    return handleStringChange(value => handler(+value));
}

function getRandomObject(propCount: number, depth = 0): Record<string, unknown> {
    const childPropCount = propCount;
    const obj: any = {};
    for (let i = 0; i < propCount; i++) {
        obj[getRandomString(5)] = depth === 0 ? getRandomValue() : getRandomObject(childPropCount, depth - 1);
    }
    return obj;
}

function getRandomValue(): number | string | number[] | string[] | null {
    switch (getRandomInteger(0, 4)) {
        case 0:
            return Math.random();
        case 1:
            return getRandomString(5);
        case 2:
            return Utils.times(5, () => Math.random());
        case 3:
            return Utils.times(5, () => getRandomString(5));
        default:
            return null;
    }
}

function getRandomInteger(min: number, max: number): number {
    // min and max are inclusive
    return Math.floor(min + Math.random() * (max - min + 1));
}

function getRandomString(length: number): string {
    let str = "";
    while (str.length < length) {
        const part = Math.random().toString(36);
        str += part.substring(2);
    }
    return str.substring(0);
}

function contains(arr: any[], value: any) {
    return arr.indexOf(value) >= 0;
}

function enforceWholeColumnSelection(region: Region) {
    delete region.rows;
    return region;
}

function enforceWholeRowSelection(region: Region) {
    delete region.cols;
    return region;
}

export interface MutableTableState {
    cellContent?: CellContent;
    cellTruncatedPopoverMode?: TruncatedPopoverMode;
    cellTruncationLength?: number;
    enableCellEditing?: boolean;
    enableCellSelection?: boolean;
    enableCellTruncation?: boolean;
    enableCellTruncationFixed?: boolean;
    enableCellWrap?: boolean;
    enableColumnCustomHeaders?: boolean;
    enableColumnHeader?: boolean;
    enableColumnNameEditing?: boolean;
    enableColumnReordering?: boolean;
    enableColumnResizing?: boolean;
    enableColumnSelection?: boolean;
    enableContextMenu?: boolean;
    enableFullTableSelection?: boolean;
    enableLayoutBoundary?: boolean;
    enableMultiSelection?: boolean;
    enableRowHeader?: boolean;
    enableRowReordering?: boolean;
    enableRowResizing?: boolean;
    enableRowSelection?: boolean;
    enableSlowLayout?: boolean;
    enableScrollingApi?: boolean;
    focusMode?: FocusMode;
    numCols?: number;
    numFrozenCols?: number;
    numFrozenRows?: number;
    numRows?: number;
    renderMode?: RenderMode;
    scrollToColumnIndex?: number;
    scrollToRegionType?: RegionCardinality;
    scrollToRowIndex?: number;
    selectedFocusStyle?: FocusStyle;
    selectedRegionTransformPreset?: SelectedRegionTransformPreset;
    selectedRegions?: Region[];
    showCallbackLogs?: boolean;
    showCellsLoading?: boolean;
    showColumnHeadersLoading?: boolean;
    showColumnMenus?: boolean;
    showCustomRegions?: boolean;
    showGhostCells?: boolean;
    showInline?: boolean;
    showRowHeadersLoading?: boolean;
    showTableInteractionBar?: boolean;
    showZebraStriping?: boolean;
}

const DEFAULT_STATE: MutableTableState = {
    cellContent: CellContent.LONG_TEXT,
    cellTruncatedPopoverMode: TruncatedPopoverMode.WHEN_TRUNCATED,
    cellTruncationLength: TRUNCATION_LENGTHS[TRUNCATION_LENGTH_DEFAULT_INDEX],
    enableCellEditing: false,
    enableCellSelection: true,
    enableCellTruncation: false,
    enableCellTruncationFixed: false,
    enableCellWrap: false,
    enableColumnCustomHeaders: true,
    enableColumnHeader: true,
    enableColumnNameEditing: false,
    enableColumnReordering: true,
    enableColumnResizing: true,
    enableColumnSelection: true,
    enableContextMenu: false,
    enableFullTableSelection: true,
    enableLayoutBoundary: false,
    enableMultiSelection: true,
    enableRowHeader: true,
    enableRowReordering: false,
    enableRowResizing: false,
    enableRowSelection: true,
    enableScrollingApi: false,
    enableSlowLayout: false,
    numCols: COLUMN_COUNTS[COLUMN_COUNT_DEFAULT_INDEX],
    numFrozenCols: FROZEN_COLUMN_COUNTS[FROZEN_COLUMN_COUNT_DEFAULT_INDEX],
    numFrozenRows: FROZEN_ROW_COUNTS[FROZEN_ROW_COUNT_DEFAULT_INDEX],
    numRows: ROW_COUNTS[ROW_COUNT_DEFAULT_INDEX],
    renderMode: RenderMode.BATCH_ON_UPDATE,
    scrollToColumnIndex: 0,
    scrollToRegionType: RegionCardinality.CELLS,
    scrollToRowIndex: 0,
    selectedFocusStyle: FocusStyle.TAB,
    selectedRegionTransformPreset: SelectedRegionTransformPreset.CELL,
    selectedRegions: [],
    showCallbackLogs: true,
    showCellsLoading: false,
    showColumnHeadersLoading: false,
    showColumnMenus: false,
    showCustomRegions: false,
    showGhostCells: true,
    showInline: false,
    showRowHeadersLoading: false,
    showTableInteractionBar: false,
    showZebraStriping: false,
};

// eslint-disable-next-line @typescript-eslint/ban-types
export class MutableTable extends React.Component<{}, MutableTableState> {
    private store = new DenseGridMutableStore<any>();

    private tableInstance: Table2;

    private tableWrapperRef: HTMLDivElement;

    private stateStore: LocalStore<MutableTableState>;

    private scrollDirection: "UP" | "DOWN";

    private animationRequestId: number;

    private previousTime: number;

    private refHandlers = {
        table: (ref: Table2) => (this.tableInstance = ref),
        tableWrapperRef: (ref: HTMLDivElement) => (this.tableWrapperRef = ref),
    };

    // eslint-disable-next-line @typescript-eslint/ban-types
    public constructor(props: {}) {
        super(props);
        this.stateStore = new LocalStore<MutableTableState>("BP_TABLE_MUTABLE_TABLE_DEV_PREVIEW", true);
        this.state = this.stateStore.getWithDefaults(DEFAULT_STATE);
        this.resetCellContent();
    }

    // React Lifecycle
    // ===============

    public render() {
        const layoutBoundary = this.state.enableLayoutBoundary;
        return (
            <div className="container">
                <SlowLayoutStack
                    depth={SLOW_LAYOUT_STACK_DEPTH}
                    enabled={this.state.enableSlowLayout}
                    rootClassName={classNames("table", { "is-inline": this.state.showInline })}
                    branchClassName="layout-passthrough-fill"
                >
                    <div
                        className={layoutBoundary ? "layout-boundary" : "layout-passthrough-fill"}
                        ref={this.refHandlers.tableWrapperRef}
                        onMouseOver={event => this.checkScrolling(event)}
                        onMouseLeave={this.cancelAnimation}
                    >
                        {this.renderTable()};
                    </div>
                </SlowLayoutStack>
                {this.renderSidebar()}
            </div>
        );
    }

    public componentDidMount() {
        this.syncFocusStyle();
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    public componentWillUpdate(_nextProps: {}, nextState: MutableTableState) {
        if (
            nextState.cellContent !== this.state.cellContent ||
            nextState.numRows !== this.state.numRows ||
            nextState.numCols !== this.state.numCols
        ) {
            this.resetCellContent(nextState);
        }
    }

    public componentDidUpdate() {
        this.syncFocusStyle();
        this.syncDependentBooleanStates();
        this.stateStore.set(this.state);
    }

    // Generators
    // ==========

    private generateColumnKey = () => {
        return Math.random().toString(36).substring(7);
    };

    private animate = (time: number) => {
        this.previousTime = this.previousTime ?? time;
        if (this.tableInstance) {
            const deltaTime = time - this.previousTime;
            if (deltaTime > 100) {
                if (this.scrollDirection === "UP") {
                    this.tableInstance.scrollByOffset({ left: 0, top: -10 });
                } else {
                    this.tableInstance.scrollByOffset({ left: 0, top: +10 });
                }
                this.previousTime = (this.previousTime ?? 0) + 100;
            }
        }
        this.animationRequestId = requestAnimationFrame(this.animate);
    };

    private cancelAnimation = () => {
        cancelAnimationFrame(this.animationRequestId);
        this.animationRequestId = undefined;
        this.previousTime = undefined;
        this.tableInstance.scrollByOffset(null);
    };

    private checkScrolling = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!this.state.enableScrollingApi) {
            return;
        }
        const top = this.tableWrapperRef.getBoundingClientRect().top;
        const bottom = this.tableWrapperRef.getBoundingClientRect().bottom;
        const scrollAbove = top + 0.3 * (bottom - top);
        const scrollBelow = bottom - 0.3 * (bottom - top);
        const pos = event.clientY;

        if (pos < scrollAbove && pos > top) {
            this.scrollDirection = "UP";
            if (this.animationRequestId === undefined) {
                requestAnimationFrame(this.animate);
            }
        } else if (pos > scrollBelow && pos < bottom) {
            this.scrollDirection = "DOWN";
            if (this.animationRequestId === undefined) {
                requestAnimationFrame(this.animate);
            }
        } else {
            this.cancelAnimation();
        }
    };

    // Renderers
    // =========

    private renderTable() {
        return (
            <Table2
                bodyContextMenuRenderer={this.renderBodyContextMenu}
                enableColumnHeader={this.state.enableColumnHeader}
                enableColumnInteractionBar={this.state.showTableInteractionBar}
                enableColumnReordering={this.state.enableColumnReordering}
                enableColumnResizing={this.state.enableColumnResizing}
                enableGhostCells={this.state.showGhostCells}
                enableMultipleSelection={this.state.enableMultiSelection}
                enableRowHeader={this.state.enableRowHeader}
                enableRowReordering={this.state.enableRowReordering}
                enableRowResizing={this.state.enableRowResizing}
                focusMode={this.state.focusMode}
                getCellClipboardData={this.getCellValue}
                loadingOptions={this.getEnabledLoadingOptions()}
                numFrozenColumns={this.state.numFrozenCols}
                numFrozenRows={this.state.numFrozenRows}
                numRows={this.state.numRows}
                onColumnsReordered={this.onColumnsReordered}
                onColumnWidthChanged={this.onColumnWidthChanged}
                onCompleteRender={this.onCompleteRender}
                onCopy={this.onCopy}
                onFocusedCell={this.onFocus}
                onFocusedRegion={this.onFocusRegion}
                onRowHeightChanged={this.onRowHeightChanged}
                onRowsReordered={this.onRowsReordered}
                onSelection={this.onSelection}
                onVisibleCellsChange={this.onVisibleCellsChange}
                ref={this.refHandlers.table}
                renderMode={this.state.renderMode}
                rowHeaderCellRenderer={this.renderRowHeader}
                selectedRegionTransform={this.getSelectedRegionTransform()}
                selectionModes={this.getEnabledSelectionModes()}
                selectedRegions={this.state.selectedRegions}
                styledRegionGroups={this.getStyledRegionGroups()}
                cellRendererDependencies={[this.state.cellContent]}
            >
                {this.renderColumns()}
            </Table2>
        );
    }

    private renderColumns() {
        return Utils.times(this.state.numCols, columnIndex => {
            return (
                <Column
                    key={this.store.getColumnKey(columnIndex)}
                    columnHeaderCellRenderer={this.renderColumnHeaderCell}
                    cellRenderer={this.renderCell}
                />
            );
        });
    }

    private renderColumnHeaderCell = (columnIndex: number) => {
        return (
            <ColumnHeaderCell
                index={columnIndex}
                name={this.store.getColumnName(columnIndex)}
                menuRenderer={this.state.showColumnMenus ? this.renderColumnMenu : undefined}
                nameRenderer={this.getColumnNameRenderer()}
            />
        );
    };

    private getColumnNameRenderer = () => {
        if (this.state.enableColumnCustomHeaders) {
            return this.renderCustomColumnName;
        } else if (this.state.enableColumnNameEditing) {
            return this.renderEditableColumnName;
        } else {
            return undefined;
        }
    };

    private renderCustomColumnName = (name: string, index: number) => {
        // show taller, multi-line column names after an arbitrary threshold
        // just to allow us to check if column headers resize appropriately.
        const COLUMN_Z_INDEX = 25; // 0-indexed
        const maybeMultilineName =
            index > COLUMN_Z_INDEX ? [<span key="1">{name}</span>, <br key="2" />, <span key="3">{name}</span>] : name;
        return (
            <div className="tbl-custom-column-header">
                <div className="tbl-custom-column-header-name">{maybeMultilineName}</div>
                <div className="tbl-custom-column-header-type">string</div>
            </div>
        );
    };

    private renderEditableColumnName = (name: string) => {
        return <EditableName name={name == null ? "" : name} onConfirm={this.handleEditableColumnCellConfirm} />;
    };

    private renderColumnMenu = (columnIndex: number) => {
        const menu = (
            <Menu>
                <MenuItem
                    icon="insert"
                    onClick={() => {
                        this.store.addColumnBefore(columnIndex);
                        this.setState({ numCols: this.state.numCols + 1 });
                    }}
                    text="Insert column before"
                />
                <MenuItem
                    icon="insert"
                    onClick={() => {
                        this.store.addColumnAfter(columnIndex);
                        this.setState({ numCols: this.state.numCols + 1 });
                    }}
                    text="Insert column after"
                />
                <MenuItem
                    icon="remove"
                    onClick={() => {
                        this.store.removeColumn(columnIndex);
                        this.setState({ numCols: this.state.numCols - 1 });
                    }}
                    text="Remove column"
                />
            </Menu>
        );

        return this.state.showColumnMenus ? menu : undefined;
    };

    private renderRowHeader = (rowIndex: number) => {
        return <RowHeaderCell index={rowIndex} name={`${rowIndex + 1}`} menuRenderer={this.renderRowMenu} />;
    };

    private renderRowMenu = (rowIndex: number) => {
        return (
            <Menu>
                <MenuItem
                    icon="insert"
                    onClick={() => {
                        this.store.addRowBefore(rowIndex);
                        this.setState({ numRows: this.state.numRows + 1 });
                    }}
                    text="Insert row before"
                />
                <MenuItem
                    icon="insert"
                    onClick={() => {
                        this.store.addRowAfter(rowIndex);
                        this.setState({ numRows: this.state.numRows + 1 });
                    }}
                    text="Insert row after"
                />
                <MenuItem
                    icon="remove"
                    onClick={() => {
                        this.store.removeRow(rowIndex);
                        this.setState({ numRows: this.state.numRows - 1 });
                    }}
                    text="Remove row"
                />
            </Menu>
        );
    };

    private getCellValue = (rowIndex: number, columnIndex: number) => {
        return this.store.get(rowIndex, columnIndex);
    };

    private renderCell = (rowIndex: number, columnIndex: number) => {
        const value = this.store.get(rowIndex, columnIndex);
        const valueAsString = value == null ? "" : value;

        const isEvenRow = rowIndex % 2 === 0;
        const classes = classNames({
            "tbl-zebra-stripe": this.state.showZebraStriping && isEvenRow,
        });

        if (this.state.enableCellEditing) {
            return (
                <EditableCell2
                    className={classes}
                    columnIndex={columnIndex}
                    loading={this.state.showCellsLoading}
                    onConfirm={this.handleEditableBodyCellConfirm}
                    rowIndex={rowIndex}
                    value={valueAsString}
                />
            );
        } else if (this.state.cellContent === CellContent.LARGE_JSON) {
            return (
                <Cell className={classes} wrapText={this.state.enableCellWrap}>
                    <JSONFormat
                        detectTruncation={this.state.enableCellTruncation}
                        preformatted={true}
                        showPopover={this.state.cellTruncatedPopoverMode}
                        truncateLength={1e10}
                    >
                        {valueAsString}
                    </JSONFormat>
                </Cell>
            );
        } else if (this.state.enableCellTruncation) {
            return (
                <Cell className={classes} wrapText={this.state.enableCellWrap}>
                    <TruncatedFormat
                        detectTruncation={!this.state.enableCellTruncationFixed}
                        preformatted={false}
                        showPopover={this.state.cellTruncatedPopoverMode}
                        truncateLength={this.state.cellTruncationLength}
                        truncationSuffix="..."
                    >
                        {valueAsString}
                    </TruncatedFormat>
                </Cell>
            );
        } else {
            return (
                <Cell
                    className={classes}
                    columnIndex={columnIndex}
                    rowIndex={rowIndex}
                    wrapText={this.state.enableCellWrap}
                >
                    {valueAsString}
                </Cell>
            );
        }
    };

    private renderSidebar() {
        const focusModeMenu = this.renderSelectMenu(
            "Focus mode",
            "focusMode",
            FOCUS_MODES,
            toFocusModeLabel,
            this.handleStringStateChange,
        );
        const renderModeMenu = this.renderSelectMenu(
            "Render mode",
            "renderMode",
            RENDER_MODES,
            toRenderModeLabel,
            this.handleStringStateChange,
        );
        const selectedRegionTransformPresetMenu = this.renderSelectMenu(
            "Selection",
            "selectedRegionTransformPreset",
            SELECTION_MODES,
            toSelectedRegionTransformPresetLabel,
            this.handleStringStateChange,
        );
        const cellContentMenu = this.renderSelectMenu(
            "Cell content",
            "cellContent",
            CELL_CONTENTS,
            toCellContentLabel,
            this.handleStringStateChange,
        );
        const truncatedPopoverModeMenu = this.renderSelectMenu(
            "Popover",
            "cellTruncatedPopoverMode",
            TRUNCATED_POPOVER_MODES,
            toTruncatedPopoverModeLabel,
            this.handleStringStateChange,
            "enableCellTruncation",
            true,
        );
        const truncatedLengthMenu = this.renderSelectMenu(
            "Length",
            "cellTruncationLength",
            TRUNCATION_LENGTHS,
            toValueLabel,
            this.handleNumberStateChange,
            "enableCellTruncationFixed",
            true,
        );

        const renderFocusStyleSelectMenu = this.renderSelectMenu(
            "Focus outlines",
            "selectedFocusStyle",
            FOCUS_STYLES,
            toFocusStyleLabel,
            this.handleStringStateChange,
        );

        return (
            <div className={classNames("sidebar", Classes.ELEVATION_0)}>
                <H4>Table</H4>
                <H6>Display</H6>
                {this.renderSwitch("Inline", "showInline")}
                {focusModeMenu}
                {this.renderSwitch("Ghost cells", "showGhostCells")}
                {renderModeMenu}
                {this.renderSwitch("Interaction bar", "showTableInteractionBar")}
                <H6>Interactions</H6>
                {this.renderSwitch("Body context menu", "enableContextMenu")}
                {this.renderSwitch("Callback logs", "showCallbackLogs")}
                {this.renderSwitch("Full-table selection", "enableFullTableSelection")}
                {this.renderSwitch("Multi-selection", "enableMultiSelection")}
                {this.renderSwitch("Demo programmatic scrolling API", "enableScrollingApi")}
                {selectedRegionTransformPresetMenu}
                <H6>Scroll to</H6>
                {this.renderScrollToSection()}
                <Divider />

                <H4>Columns</H4>
                <H6>Display</H6>
                {this.renderNumberSelectMenu("Num. columns", "numCols", COLUMN_COUNTS)}
                {this.renderNumberSelectMenu("Num. frozen columns", "numFrozenCols", FROZEN_COLUMN_COUNTS)}
                {this.renderSwitch("Column headers", "enableColumnHeader")}
                {this.renderSwitch("Column headers loading", "showColumnHeadersLoading", "enableColumnHeader", true)}
                {this.renderSwitch("Column header menus", "showColumnMenus", "enableColumnHeader", true)}
                {this.renderSwitch("Custom headers", "enableColumnCustomHeaders", "enableColumnHeader", true)}
                <H6>Interactions</H6>
                {this.renderSwitch("Editing", "enableColumnNameEditing", "enableColumnCustomHeaders", false)}
                {this.renderSwitch("Reordering", "enableColumnReordering", "enableColumnHeader", true)}
                {this.renderSwitch("Resizing", "enableColumnResizing", "enableColumnHeader", true)}
                {this.renderSwitch("Selection", "enableColumnSelection", "enableColumnHeader", true)}
                <Divider />

                <H4>Rows</H4>
                <H6>Display</H6>
                {this.renderNumberSelectMenu("Num. rows", "numRows", ROW_COUNTS)}
                {this.renderNumberSelectMenu("Num. frozen rows", "numFrozenRows", FROZEN_ROW_COUNTS)}
                {this.renderSwitch("Row headers", "enableRowHeader")}
                {this.renderSwitch("Row headers loading", "showRowHeadersLoading", "enableRowHeader", true)}
                {this.renderSwitch("Zebra striping", "showZebraStriping")}
                <H6>Interactions</H6>
                {this.renderSwitch("Reordering", "enableRowReordering", "enableRowHeader", true)}
                {this.renderSwitch("Resizing", "enableRowResizing", "enableRowHeader", true)}
                {this.renderSwitch("Selection", "enableRowSelection", "enableRowHeader", true)}
                <H6>Instance methods</H6>
                {this.renderButton("Resize rows by tallest cell", {
                    onClick: this.handleResizeRowsByTallestCellButtonClick,
                })}
                {this.renderButton("Resize rows by approx height", {
                    onClick: this.handleResizeRowsByApproxHeightButtonClick,
                })}
                <Divider />

                <H4>Cells</H4>
                <H6>Display</H6>
                {cellContentMenu}
                {this.renderSwitch("Loading state", "showCellsLoading")}
                {this.renderSwitch("Custom regions", "showCustomRegions")}
                <H6>Interactions</H6>
                {this.renderSwitch("Editing", "enableCellEditing")}
                {this.renderSwitch("Selection", "enableCellSelection")}
                <H6>Text Layout</H6>
                {this.renderSwitch("Truncation", "enableCellTruncation", "enableCellEditing", false)}
                <div className="sidebar-indented-group">{truncatedPopoverModeMenu}</div>
                {this.renderSwitch("Fixed truncation", "enableCellTruncationFixed", "enableCellTruncation", true)}
                <div className="sidebar-indented-group">{truncatedLengthMenu}</div>
                {this.renderSwitch("Wrap text", "enableCellWrap")}
                <Divider />

                <H4>Page</H4>
                <H6>Display</H6>
                {renderFocusStyleSelectMenu}
                <H6>Perf</H6>
                {this.renderSwitch("Slow layout", "enableSlowLayout")}
                {this.renderSwitch("Isolate layout boundary", "enableLayoutBoundary")}
                <Divider />

                <H4>Settings</H4>
                {this.renderButton("Reset all", {
                    icon: "undo",
                    onClick: this.handleDefaultsButtonClick,
                })}
            </div>
        );
    }

    private renderButton(label: string, props: ButtonProps) {
        return <Button fill={true} intent={Intent.PRIMARY} text={label} {...props} />;
    }

    private renderScrollToSection() {
        const { scrollToRegionType } = this.state;

        const scrollToRegionTypeSelectMenu = this.renderSelectMenu(
            "Region type",
            "scrollToRegionType",
            REGION_CARDINALITIES,
            getRegionCardinalityLabel,
            this.handleStringStateChange,
        );
        const scrollToRowSelectMenu = this.renderSelectMenu(
            "Row",
            "scrollToRowIndex",
            Utils.times(this.state.numRows, rowIndex => rowIndex),
            rowIndex => `${rowIndex + 1}`,
            this.handleNumberStateChange,
        );
        const scrollToColumnSelectMenu = this.renderSelectMenu(
            "Column",
            "scrollToColumnIndex",
            Utils.times(this.state.numCols, columnIndex => columnIndex),
            columnIndex => this.store.getColumnName(columnIndex),
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
                <Button fill={true} intent={Intent.PRIMARY} onClick={this.handleScrollToButtonClick} text="Scroll" />
            </div>
        );
    }

    private renderSwitch(
        label: string,
        stateKey: keyof MutableTableState,
        prereqStateKey?: keyof MutableTableState,
        prereqStateKeyValue?: any,
    ) {
        const isDisabled = !this.isPrereqStateKeySatisfied(prereqStateKey, prereqStateKeyValue);

        const child = (
            <Switch
                checked={this.state[stateKey] as boolean}
                className={Classes.ALIGN_RIGHT}
                disabled={isDisabled}
                label={label}
                onChange={this.handleBooleanStateChange(stateKey)}
            />
        );

        if (isDisabled) {
            return this.wrapDisabledControlWithTooltip(child, prereqStateKey, prereqStateKeyValue);
        } else {
            return child;
        }
    }

    private renderNumberSelectMenu(label: string, stateKey: keyof MutableTableState, values: number[]) {
        return this.renderSelectMenu(label, stateKey, values, toValueLabel, this.handleNumberStateChange);
    }

    private renderSelectMenu<T>(
        label: string,
        stateKey: keyof MutableTableState,
        values: T[],
        generateValueLabel: (value: any) => string,
        handleChange: MutableStateUpdateCallback,
        prereqStateKey?: keyof MutableTableState,
        prereqStateKeyValue?: any,
    ) {
        const isDisabled = !this.isPrereqStateKeySatisfied(prereqStateKey, prereqStateKeyValue);

        // need to explicitly cast generic type T to string
        const selectedValue = this.state[stateKey]?.toString();
        const options = values.map(value => {
            return (
                <option key={value?.toString()} value={value?.toString()}>
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
                <HTMLSelect disabled={isDisabled} onChange={handleChange(stateKey)} value={selectedValue}>
                    {options}
                </HTMLSelect>
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

    private isPrereqStateKeySatisfied(key?: keyof MutableTableState, value?: any) {
        return key == null || this.state[key] === value;
    }

    private wrapDisabledControlWithTooltip(
        element: React.JSX.Element,
        prereqStateKey: keyof MutableTableState,
        prereqStateKeyValue: any,
    ) {
        // Blueprint Tooltip affects the layout, so just show a native title on hover
        return <div title={`Requires ${prereqStateKey}=${prereqStateKeyValue}`}>{element}</div>;
    }

    // Callbacks
    // =========

    private onCompleteRender = () => {
        this.maybeLogCallback("[onCompleteRender]");
    };

    private onSelection = (selectedRegions: Region[]) => {
        this.maybeLogCallback(`[onSelection] selectedRegions =`, ...selectedRegions);
        this.setState({ selectedRegions });
    };

    private onColumnsReordered = (oldIndex: number, newIndex: number, length: number) => {
        this.maybeLogCallback(`[onColumnsReordered] oldIndex = ${oldIndex} newIndex = ${newIndex} length = ${length}`);
        this.store.reorderColumns(oldIndex, newIndex, length);
        this.forceUpdate();
    };

    private onRowsReordered = (oldIndex: number, newIndex: number, length: number) => {
        this.maybeLogCallback(`[onRowsReordered] oldIndex = ${oldIndex} newIndex = ${newIndex} length = ${length}`);
        this.store.reorderRows(oldIndex, newIndex, length);
        this.forceUpdate();
    };

    private onColumnWidthChanged = (index: number, size: number) => {
        this.maybeLogCallback(`[onColumnWidthChanged] index = ${index} size = ${size}`);
    };

    private onRowHeightChanged = (index: number, size: number) => {
        this.maybeLogCallback(`[onRowHeightChanged] index = ${index} size = ${size}`);
    };

    private onFocus = (focusedCell: FocusedCellCoordinates) => {
        this.maybeLogCallback("[onFocusedCell] focusedCell =", focusedCell);
    };

    private onFocusRegion = (focusedRegion: FocusedRegion) => {
        this.maybeLogCallback("[onFocusedRegion] focusedRegion =", focusedRegion);
    };

    private onCopy = (success: boolean) => {
        this.maybeLogCallback(`[onCopy] success = ${success}`);
    };

    private onVisibleCellsChange = (rowIndices: RowIndices, columnIndices: ColumnIndices) => {
        const { rowIndexStart, rowIndexEnd } = rowIndices;
        const { columnIndexStart, columnIndexEnd } = columnIndices;
        this.maybeLogCallback(
            `[onVisibleCellsChange] rowIndexStart=${rowIndexStart} rowIndexEnd=${rowIndexEnd} ` +
                `columnIndexStart=${columnIndexStart} columnIndexEnd=${columnIndexEnd}`,
        );
    };

    private maybeLogCallback = (message?: any, ...optionalParams: any[]) => {
        if (this.state.showCallbackLogs) {
            // allow console.log for these callbacks so devs can see exactly when they fire
            // eslint-disable-next-line no-console
            console.log(message, ...optionalParams);
        }
    };

    private handleEditableBodyCellConfirm = (value: string, rowIndex?: number, columnIndex?: number) => {
        this.store.set(rowIndex, columnIndex, value);
    };

    private handleEditableColumnCellConfirm = (value: string, columnIndex?: number) => {
        this.store.setColumnName(columnIndex, value);
    };

    private handleDefaultsButtonClick = () => {
        this.setState(DEFAULT_STATE);
    };

    private handleScrollToButtonClick = () => {
        const { scrollToRowIndex, scrollToColumnIndex, scrollToRegionType } = this.state;

        let region: Region;
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
    };

    private handleResizeRowsByTallestCellButtonClick = () => {
        this.tableInstance.resizeRowsByTallestCell();
    };

    private handleResizeRowsByApproxHeightButtonClick = () => {
        this.tableInstance.resizeRowsByApproximateHeight(this.getCellText);
    };

    private getCellText = (rowIndex: number, columnIndex: number) => {
        const content = this.store.get(rowIndex, columnIndex);
        return this.state.cellContent === CellContent.LARGE_JSON ? JSON.stringify(content) : content;
    };

    // State updates
    // =============

    private resetCellContent = (nextState = this.state) => {
        const orderedColumnKeys = Utils.times(nextState.numCols, this.generateColumnKey);
        this.store.setOrderedColumnKeys(orderedColumnKeys);

        const generator = CELL_CONTENT_GENERATORS[nextState.cellContent];
        Utils.times(nextState.numCols, columnIndex => {
            this.store.setColumnName(columnIndex, `Column ${Utils.toBase26Alpha(columnIndex)}`);
            Utils.times(nextState.numRows, rowIndex => {
                this.store.set(rowIndex, columnIndex, generator(rowIndex, columnIndex));
            });
        });
    };

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

        if (this.state.enableColumnNameEditing && this.state.enableColumnCustomHeaders) {
            this.setState({ enableColumnNameEditing: false });
        }
    };

    private handleBooleanStateChange = (stateKey: keyof MutableTableState) => {
        return handleBooleanChange(value => this.setState({ [stateKey]: value }));
    };

    private handleNumberStateChange = (stateKey: keyof MutableTableState) => {
        return handleNumberChange(value => this.setState({ [stateKey]: value }));
    };

    private handleStringStateChange = (stateKey: keyof MutableTableState) => {
        return handleStringChange(value => this.setState({ [stateKey]: value }));
    };

    private renderBodyContextMenu = (context: MenuContext) => {
        const menu = (
            <Menu>
                <CopyCellsMenuItem context={context} icon="clipboard" getCellData={this.getCellValue} text="Copy" />
                <MenuItem icon="search-around" text="Item 1" />
                <MenuItem icon="search" text="Item 2" />
                <MenuItem icon="graph-remove" text="Item 3" />
                <MenuItem icon="group-objects" text="Item 4" />
                <MenuDivider />
                <MenuItem disabled={true} text="Disabled item" />
            </Menu>
        );
        return this.state.enableContextMenu ? menu : undefined;
    };

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

    private getSelectedRegionTransform() {
        switch (this.state.selectedRegionTransformPreset) {
            case SelectedRegionTransformPreset.CELL:
                return undefined;

            case SelectedRegionTransformPreset.ROW:
                return enforceWholeRowSelection;

            case SelectedRegionTransformPreset.COLUMN:
                return enforceWholeColumnSelection;

            default:
                return undefined;
        }
    }

    private getStyledRegionGroups() {
        // show 3 styled regions as samples
        return !this.state.showCustomRegions
            ? []
            : ([
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
              ] as StyledRegionGroup[]);
    }
}

// Select menu - label generators
// ==============================

function toFocusModeLabel(focusMode: FocusMode | undefined) {
    switch (focusMode) {
        case FocusMode.CELL:
            return "Cells";
        case FocusMode.ROW:
            return "Rows";
        case undefined:
            return "None";
    }
}

function toRenderModeLabel(renderMode: RenderMode) {
    switch (renderMode) {
        case RenderMode.BATCH:
            return "Batch";
        case RenderMode.BATCH_ON_UPDATE:
            return "Batch on update";
        default:
            return "None";
    }
}

function toSelectedRegionTransformPresetLabel(selectedRegionTransformPreset: SelectedRegionTransformPreset) {
    switch (selectedRegionTransformPreset) {
        case SelectedRegionTransformPreset.CELL:
            return "Unconstrained";
        case SelectedRegionTransformPreset.ROW:
            return "Whole rows only";
        case SelectedRegionTransformPreset.COLUMN:
            return "Whole columns only";
        default:
            return "None";
    }
}

function toCellContentLabel(cellContent: CellContent) {
    switch (cellContent) {
        case CellContent.CELL_NAMES:
            return "Cell names";
        case CellContent.EMPTY:
            return "Empty";
        case CellContent.LONG_TEXT:
            return "Long text";
        case CellContent.LARGE_JSON:
            return "Large JSON (~5KB)";
        default:
            return "";
    }
}

function toTruncatedPopoverModeLabel(truncatedPopoverMode: TruncatedPopoverMode) {
    switch (truncatedPopoverMode) {
        case TruncatedPopoverMode.ALWAYS:
            return "Always";
        case TruncatedPopoverMode.NEVER:
            return "Never";
        case TruncatedPopoverMode.WHEN_TRUNCATED:
            return "When truncated";
        case TruncatedPopoverMode.WHEN_TRUNCATED_APPROX:
            return "Truncated approx";
        default:
            return "";
    }
}

function toFocusStyleLabel(focusStyle: FocusStyle) {
    switch (focusStyle) {
        case FocusStyle.TAB:
            return "On tab";
        default:
            return "On tab or click";
    }
}

function getRegionCardinalityLabel(cardinality: RegionCardinality) {
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

function toValueLabel(value: any) {
    return value.toString();
}
