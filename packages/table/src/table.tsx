/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import classNames from "classnames";
import * as React from "react";
import { polyfill } from "react-lifecycles-compat";

import {
    AbstractComponent2,
    DISPLAYNAME_PREFIX,
    Hotkey,
    Hotkeys,
    HotkeysTarget,
    IProps,
    Utils as CoreUtils,
} from "@blueprintjs/core";

import { ICellProps } from "./cell/cell";
import { Column, IColumnProps } from "./column";
import { IFocusedCellCoordinates } from "./common/cell";
import * as Classes from "./common/classes";
import { Clipboard } from "./common/clipboard";
import { columnInteractionBarContextTypes, IColumnInteractionBarContextTypes } from "./common/context";
import { Direction } from "./common/direction";
import * as Errors from "./common/errors";
import { Grid, ICellMapper, IColumnIndices, IRowIndices } from "./common/grid";
import * as FocusedCellUtils from "./common/internal/focusedCellUtils";
import * as ScrollUtils from "./common/internal/scrollUtils";
import * as SelectionUtils from "./common/internal/selectionUtils";
import { Rect } from "./common/rect";
import { RenderMode } from "./common/renderMode";
import { Utils } from "./common/utils";
import { ColumnHeader, IColumnWidths } from "./headers/columnHeader";
import { ColumnHeaderCell, IColumnHeaderCellProps } from "./headers/columnHeaderCell";
import { IRowHeaderRenderer, IRowHeights, renderDefaultRowHeader, RowHeader } from "./headers/rowHeader";
import { IContextMenuRenderer } from "./interactions/menus";
import { IIndexedResizeCallback } from "./interactions/resizable";
import { ResizeSensor } from "./interactions/resizeSensor";
import { ISelectedRegionTransform } from "./interactions/selectable";
import { GuideLayer } from "./layers/guides";
import { IRegionStyler, RegionLayer } from "./layers/regions";
import { Locator } from "./locator";
import { QuadrantType } from "./quadrants/tableQuadrant";
import { TableQuadrantStack } from "./quadrants/tableQuadrantStack";
import {
    ColumnLoadingOption,
    IRegion,
    IStyledRegionGroup,
    RegionCardinality,
    Regions,
    SelectionModes,
    TableLoadingOption,
} from "./regions";
import { TableBody } from "./tableBody";

export interface IResizeRowsByApproximateHeightOptions {
    /**
     * Approximate width (in pixels) of an average character of text.
     */
    getApproximateCharWidth?: number | ICellMapper<number>;

    /**
     * Approximate height (in pixels) of an average line of text.
     */
    getApproximateLineHeight?: number | ICellMapper<number>;

    /**
     * Sum of horizontal paddings (in pixels) from the left __and__ right sides
     * of the cell.
     */
    getCellHorizontalPadding?: number | ICellMapper<number>;

    /**
     * Number of extra lines to add in case the calculation is imperfect.
     */
    getNumBufferLines?: number | ICellMapper<number>;
}

interface IResizeRowsByApproximateHeightResolvedOptions {
    getApproximateCharWidth?: number;
    getApproximateLineHeight?: number;
    getCellHorizontalPadding?: number;
    getNumBufferLines?: number;
}

export interface ITableProps extends IProps, IRowHeights, IColumnWidths {
    /**
     * The children of a `Table` component, which must be React elements
     * that use `IColumnProps`.
     */
    children?: React.ReactElement<IColumnProps> | Array<React.ReactElement<IColumnProps>>;

    /**
     * A sparse number array with a length equal to the number of columns. Any
     * non-null value will be used to set the width of the column at the same
     * index. Note that if you want to update these values when the user
     * drag-resizes a column, you may define a callback for `onColumnWidthChanged`.
     */
    columnWidths?: Array<number | null | undefined>;

    /**
     * An optional callback for displaying a context menu when right-clicking
     * on the table body. The callback is supplied with an array of
     * `IRegion`s. If the mouse click was on a selection, the array will
     * contain all selected regions. Otherwise it will have one `IRegion` that
     * represents the clicked cell.
     */
    bodyContextMenuRenderer?: IContextMenuRenderer;

    /**
     * If `true`, adds an interaction bar on top of all column header cells, and
     * moves interaction triggers into it.
     *
     * @default false
     */
    enableColumnInteractionBar?: boolean;

    /**
     * If `false`, disables reordering of columns.
     *
     * @default false
     */
    enableColumnReordering?: boolean;

    /**
     * If `false`, disables resizing of columns.
     *
     * @default true
     */
    enableColumnResizing?: boolean;

    /**
     * If `true`, there will be a single "focused" cell at all times,
     * which can be used to interact with the table as though it is a
     * spreadsheet. When false, no such cell will exist.
     *
     * @default false
     */
    enableFocusedCell?: boolean;

    /**
     * If `true`, empty space in the table container will be filled with empty
     * cells instead of a blank background.
     *
     * @default false
     */
    enableGhostCells?: boolean;

    /**
     * If `false`, only a single region of a single column/row/cell may be
     * selected at one time. Using `ctrl` or `meta` key will have no effect,
     * and a mouse drag will select the current column/row/cell only.
     *
     * @default true
     */
    enableMultipleSelection?: boolean;

    /**
     * If `false`, hides the row headers and settings menu.
     *
     * @default true
     */
    enableRowHeader?: boolean;

    /**
     * If `false`, disables reordering of rows.
     *
     * @default false
     */
    enableRowReordering?: boolean;

    /**
     * If `false`, disables resizing of rows.
     *
     * @default true
     */
    enableRowResizing?: boolean;

    /**
     * If defined, will set the focused cell state. This changes
     * the focused cell to controlled mode, meaning you are in charge of
     * setting the focus in response to events in the `onFocusedCell` callback.
     */
    focusedCell?: IFocusedCellCoordinates;

    /**
     * If `true`, selection state changes will cause the component to re-render.
     * If `false`, selection state is ignored when deciding to re-render.
     *
     * @default false
     */
    forceRerenderOnSelectionChange?: boolean;

    /**
     * If defined, this callback will be invoked for each cell when the user
     * attempts to copy a selection via `mod+c`. The returned data will be copied
     * to the clipboard and need not match the display value of the `<Cell>`.
     * The data will be invisibly added as `textContent` into the DOM before
     * copying. If not defined, keyboard copying via `mod+c` will be disabled.
     */
    getCellClipboardData?: (row: number, col: number) => any;

    /**
     * A list of `TableLoadingOption`. Set this prop to specify whether to
     * render the loading state for the column header, row header, and body
     * sections of the table.
     */
    loadingOptions?: TableLoadingOption[];

    /**
     * The number of columns to freeze to the left side of the table, counting
     * from the leftmost column.
     *
     * @default 0
     */
    numFrozenColumns?: number;

    /**
     * The number of rows to freeze to the top of the table, counting from the
     * topmost row.
     *
     * @default 0
     */
    numFrozenRows?: number;

    /**
     * The number of rows in the table.
     */
    numRows?: number;

    /**
     * If reordering is enabled, this callback will be invoked when the user finishes
     * drag-reordering one or more columns.
     */
    onColumnsReordered?: (oldIndex: number, newIndex: number, length: number) => void;

    /**
     * If resizing is enabled, this callback will be invoked when the user
     * finishes drag-resizing a column.
     */
    onColumnWidthChanged?: IIndexedResizeCallback;

    /**
     * An optional callback invoked when all cells in view have completely rendered.
     * Will be invoked on initial mount and whenever cells update (e.g., on scroll).
     */
    onCompleteRender?: () => void;

    /**
     * If you want to do something after the copy or if you want to notify the
     * user if a copy fails, you may provide this optional callback.
     *
     * Due to browser limitations, the copy can fail. This usually occurs if
     * the selection is too large, like 20,000+ cells. The copy will also fail
     * if the browser does not support the copy method (see
     * `Clipboard.isCopySupported`).
     */
    onCopy?: (success: boolean) => void;

    /**
     * A callback called when the focus is changed in the table.
     */
    onFocusedCell?: (focusedCell: IFocusedCellCoordinates) => void;

    /**
     * If resizing is enabled, this callback will be invoked when the user
     * finishes drag-resizing a row.
     */
    onRowHeightChanged?: IIndexedResizeCallback;

    /**
     * If reordering is enabled, this callback will be invoked when the user finishes
     * drag-reordering one or more rows.
     */
    onRowsReordered?: (oldIndex: number, newIndex: number, length: number) => void;

    /**
     * A callback called when the selection is changed in the table.
     */
    onSelection?: (selectedRegions: IRegion[]) => void;

    /**
     * A callback called when the visible cell indices change in the table.
     */
    onVisibleCellsChange?: (rowIndices: IRowIndices, columnIndices: IColumnIndices) => void;

    /**
     * Dictates how cells should be rendered. Supported modes are:
     * - `RenderMode.BATCH`: renders cells in batches to improve performance
     * - `RenderMode.BATCH_ON_UPDATE`: renders cells synchronously on mount and
     *   in batches on update
     * - `RenderMode.NONE`: renders cells synchronously all at once
     *
     * @default RenderMode.BATCH_ON_UPDATE
     */
    renderMode?: RenderMode;

    /**
     * Render each row's header cell.
     */
    rowHeaderCellRenderer?: IRowHeaderRenderer;

    /**
     * A sparse number array with a length equal to the number of rows. Any
     * non-null value will be used to set the height of the row at the same
     * index. Note that if you want to update these values when the user
     * drag-resizes a row, you may define a callback for `onRowHeightChanged`.
     */
    rowHeights?: Array<number | null | undefined>;

    /**
     * If defined, will set the selected regions in the cells. If defined, this
     * changes table selection to controlled mode, meaning you in charge of
     * setting the selections in response to events in the `onSelection`
     * callback.
     *
     * Note that the `selectionModes` prop controls which types of events are
     * triggered to the `onSelection` callback, but does not restrict what
     * selection you can pass to the `selectedRegions` prop. Therefore you can,
     * for example, convert cell clicks into row selections.
     */
    selectedRegions?: IRegion[];

    /**
     * An optional transform function that will be applied to the located
     * `Region`.
     *
     * This allows you to, for example, convert cell `Region`s into row
     * `Region`s while maintaining the existing multi-select and meta-click
     * functionality.
     */
    selectedRegionTransform?: ISelectedRegionTransform;

    /**
     * A `SelectionModes` enum value indicating the selection mode. You may
     * equivalently provide an array of `RegionCardinality` enum values for
     * precise configuration.
     *
     * The `SelectionModes` enum values are:
     * - `ALL`
     * - `NONE`
     * - `COLUMNS_AND_CELLS`
     * - `COLUMNS_ONLY`
     * - `ROWS_AND_CELLS`
     * - `ROWS_ONLY`
     *
     * The `RegionCardinality` enum values are:
     * - `FULL_COLUMNS`
     * - `FULL_ROWS`
     * - `FULL_TABLE`
     * - `CELLS`
     *
     * @default SelectionModes.ALL
     */
    selectionModes?: RegionCardinality[];

    /**
     * Styled region groups are rendered as overlays above the table and are
     * marked with their own `className` for custom styling.
     */
    styledRegionGroups?: IStyledRegionGroup[];
}

export interface ITableState {
    /**
     * An array of column widths. These are initialized from the column props
     * and updated when the user drags column header resize handles.
     */
    columnWidths?: number[];

    /**
     * The coordinates of the currently focused table cell
     */
    focusedCell?: IFocusedCellCoordinates;

    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a row is being resized.
     */
    horizontalGuides?: number[];

    /**
     * If `true`, will disable updates that will cause re-renders of children
     * components. This is used, for example, to disable layout updates while
     * the user is dragging a resize handle.
     */
    isLayoutLocked?: boolean;

    /**
     * Whether the user is currently dragging to reorder one or more elements.
     * Can be referenced to toggle the reordering-cursor overlay, which
     * displays a `grabbing` CSS cursor wherever the mouse moves in the table
     * for the duration of the dragging interaction.
     */
    isReordering?: boolean;

    /**
     * The number of frozen columns, clamped to [0, num <Column>s].
     */
    numFrozenColumnsClamped?: number;

    /**
     * The number of frozen rows, clamped to [0, numRows].
     */
    numFrozenRowsClamped?: number;

    /**
     * An array of row heights. These are initialized updated when the user
     * drags row header resize handles.
     */
    rowHeights?: number[];

    /**
     * An array of Regions representing the selections of the table.
     */
    selectedRegions?: IRegion[];

    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a column is being resized.
     */
    verticalGuides?: number[];

    /**
     * The `Rect` bounds of the viewport used to perform virtual viewport
     * performance enhancements.
     */
    viewportRect?: Rect;

    columnIdToIndex: { [key: string]: number };

    childrenArray: Array<React.ReactElement<IColumnProps>>;
}

export interface ITableSnapshot {
    nextScrollTop?: number;
    nextScrollLeft?: number;
}

@HotkeysTarget
@polyfill
export class Table extends AbstractComponent2<ITableProps, ITableState, ITableSnapshot> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Table`;

    public static defaultProps: ITableProps = {
        defaultColumnWidth: 150,
        defaultRowHeight: 20,
        enableFocusedCell: false,
        enableGhostCells: false,
        enableMultipleSelection: true,
        enableRowHeader: true,
        forceRerenderOnSelectionChange: false,
        loadingOptions: [],
        minColumnWidth: 50,
        minRowHeight: 20,
        numFrozenColumns: 0,
        numFrozenRows: 0,
        numRows: 0,
        renderMode: RenderMode.BATCH_ON_UPDATE,
        rowHeaderCellRenderer: renderDefaultRowHeader,
        selectionModes: SelectionModes.ALL,
    };

    public static childContextTypes: React.ValidationMap<
        IColumnInteractionBarContextTypes
    > = columnInteractionBarContextTypes;

    public static getDerivedStateFromProps(props: ITableProps, state: ITableState) {
        const {
            children,
            defaultColumnWidth,
            defaultRowHeight,
            enableFocusedCell,
            focusedCell,
            numRows,
            selectedRegions,
            selectionModes,
        } = props;

        // assign values from state if uncontrolled
        let { columnWidths, rowHeights } = props;
        if (columnWidths == null) {
            columnWidths = state.columnWidths;
        }
        if (rowHeights == null) {
            rowHeights = state.rowHeights;
        }

        const newChildrenArray = React.Children.toArray(children) as Array<React.ReactElement<IColumnProps>>;
        const didChildrenChange = newChildrenArray !== state.childrenArray;
        const numCols = newChildrenArray.length;

        let newColumnWidths = columnWidths;
        if (columnWidths !== state.columnWidths || didChildrenChange) {
            // Try to maintain widths of columns by looking up the width of the
            // column that had the same `ID` prop. If none is found, use the
            // previous width at the same index.
            const previousColumnWidths = newChildrenArray.map(
                (child: React.ReactElement<IColumnProps>, index: number) => {
                    const mappedIndex = state.columnIdToIndex[child.props.id];
                    return state.columnWidths[mappedIndex != null ? mappedIndex : index];
                },
            );

            // Make sure the width/height arrays have the correct length, but keep
            // as many existing widths/heights as possible. Also, apply the
            // sparse width/heights from props.
            newColumnWidths = Utils.arrayOfLength(newColumnWidths, numCols, defaultColumnWidth);
            newColumnWidths = Utils.assignSparseValues(newColumnWidths, previousColumnWidths);
            newColumnWidths = Utils.assignSparseValues(newColumnWidths, columnWidths);
        }

        let newRowHeights = rowHeights;
        if (rowHeights !== state.rowHeights || numRows !== state.rowHeights.length) {
            newRowHeights = Utils.arrayOfLength(newRowHeights, numRows, defaultRowHeight);
            newRowHeights = Utils.assignSparseValues(newRowHeights, rowHeights);
        }

        let newSelectedRegions = selectedRegions;
        if (selectedRegions == null) {
            // if we're in uncontrolled mode, filter out all selected regions that don't
            // fit in the current new table dimensions
            newSelectedRegions = state.selectedRegions.filter(region => {
                const regionCardinality = Regions.getRegionCardinality(region);
                return (
                    Table.isSelectionModeEnabled(props, regionCardinality, selectionModes) &&
                    Regions.isRegionValidForTable(region, numRows, numCols)
                );
            });
        }

        const newFocusedCell = FocusedCellUtils.getInitialFocusedCell(
            enableFocusedCell,
            focusedCell,
            state.focusedCell,
            newSelectedRegions,
        );

        const nextState = {
            childrenArray: newChildrenArray,
            columnIdToIndex: didChildrenChange ? Table.createColumnIdIndex(newChildrenArray) : state.columnIdToIndex,
            columnWidths: newColumnWidths,
            focusedCell: newFocusedCell,
            numFrozenColumnsClamped: clampNumFrozenColumns(props),
            numFrozenRowsClamped: clampNumFrozenRows(props),
            rowHeights: newRowHeights,
            selectedRegions: newSelectedRegions,
        };

        if (!CoreUtils.deepCompareKeys(state, nextState, Table.SHALLOW_COMPARE_STATE_KEYS_DENYLIST)) {
            return nextState;
        }

        return null;
    }

    // these default values for `resizeRowsByApproximateHeight` have been
    // fine-tuned to work well with default Table font styles.
    private static resizeRowsByApproximateHeightDefaults: Record<
        keyof IResizeRowsByApproximateHeightOptions,
        number
    > = {
        getApproximateCharWidth: 8,
        getApproximateLineHeight: 18,
        getCellHorizontalPadding: 2 * Locator.CELL_HORIZONTAL_PADDING,
        getNumBufferLines: 1,
    };

    private static SHALLOW_COMPARE_PROP_KEYS_DENYLIST = [
        "selectedRegions", // (intentionally omitted; can be deeply compared to save on re-renders in controlled mode)
    ] as Array<keyof ITableProps>;

    private static SHALLOW_COMPARE_STATE_KEYS_DENYLIST = [
        "selectedRegions", // (intentionally omitted; can be deeply compared to save on re-renders in uncontrolled mode)
        "viewportRect",
    ] as Array<keyof ITableState>;

    private static createColumnIdIndex(children: Array<React.ReactElement<any>>) {
        const columnIdToIndex: { [key: string]: number } = {};
        for (let i = 0; i < children.length; i++) {
            const key = children[i].props.id;
            if (key != null) {
                columnIdToIndex[String(key)] = i;
            }
        }
        return columnIdToIndex;
    }

    private static isSelectionModeEnabled(
        props: ITableProps,
        selectionMode: RegionCardinality,
        selectionModes = props.selectionModes,
    ) {
        const { children, numRows } = props;
        const numColumns = React.Children.count(children);
        return selectionModes.indexOf(selectionMode) >= 0 && numRows > 0 && numColumns > 0;
    }

    public grid: Grid;

    public locator: Locator;

    private resizeSensorDetach: () => void;

    private refHandlers = {
        cellContainer: (ref: HTMLElement) => (this.cellContainerElement = ref),
        columnHeader: (ref: HTMLElement) => (this.columnHeaderElement = ref),
        quadrantStack: (ref: TableQuadrantStack) => (this.quadrantStackInstance = ref),
        rootTable: (ref: HTMLElement) => (this.rootTableElement = ref),
        rowHeader: (ref: HTMLElement) => (this.rowHeaderElement = ref),
        scrollContainer: (ref: HTMLElement) => (this.scrollContainerElement = ref),
    };

    private cellContainerElement: HTMLElement;

    private columnHeaderElement: HTMLElement;

    private quadrantStackInstance: TableQuadrantStack;

    private rootTableElement: HTMLElement;

    private rowHeaderElement: HTMLElement;

    private scrollContainerElement: HTMLElement;

    /*
     * This value is set to `true` when all cells finish mounting for the first
     * time. It serves as a signal that we can switch to batch rendering.
     */
    private didCompletelyMount = false;

    public constructor(props: ITableProps, context?: any) {
        super(props, context);

        const { children, columnWidths, defaultRowHeight, defaultColumnWidth, numRows, rowHeights } = this.props;

        const childrenArray = React.Children.toArray(children) as Array<React.ReactElement<IColumnProps>>;
        const columnIdToIndex = Table.createColumnIdIndex(childrenArray);

        // Create height/width arrays using the lengths from props and
        // children, the default values from props, and finally any sparse
        // arrays passed into props.
        let newColumnWidths = childrenArray.map(() => defaultColumnWidth);
        newColumnWidths = Utils.assignSparseValues(newColumnWidths, columnWidths);
        let newRowHeights = Utils.times(numRows, () => defaultRowHeight);
        newRowHeights = Utils.assignSparseValues(newRowHeights, rowHeights);

        const selectedRegions = props.selectedRegions == null ? ([] as IRegion[]) : props.selectedRegions;
        const focusedCell = FocusedCellUtils.getInitialFocusedCell(
            props.enableFocusedCell,
            props.focusedCell,
            undefined,
            selectedRegions,
        );

        this.state = {
            childrenArray,
            columnIdToIndex,
            columnWidths: newColumnWidths,
            focusedCell,
            isLayoutLocked: false,
            isReordering: false,
            numFrozenColumnsClamped: clampNumFrozenColumns(props),
            numFrozenRowsClamped: clampNumFrozenRows(props),
            rowHeights: newRowHeights,
            selectedRegions,
        };
    }

    // Instance methods
    // ================

    /**
     * __Experimental!__ Resizes all rows in the table to the approximate
     * maximum height of wrapped cell content in each row. Works best when each
     * cell contains plain text of a consistent font style (though font style
     * may vary between cells). Since this function uses approximate
     * measurements, results may not be perfect.
     *
     * Approximation parameters can be configured for the entire table or on a
     * per-cell basis. Default values are fine-tuned to work well with default
     * Table font styles.
     */
    public resizeRowsByApproximateHeight(
        getCellText: ICellMapper<string>,
        options?: IResizeRowsByApproximateHeightOptions,
    ) {
        const { numRows } = this.props;
        const { columnWidths } = this.state;
        const numColumns = columnWidths.length;

        const rowHeights: number[] = [];

        for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
            let maxCellHeightInRow = 0;

            // iterate through each cell in the row
            for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
                // resolve all parameters to raw values
                const {
                    getApproximateCharWidth: approxCharWidth,
                    getApproximateLineHeight: approxLineHeight,
                    getCellHorizontalPadding: horizontalPadding,
                    getNumBufferLines: numBufferLines,
                } = this.resolveResizeRowsByApproximateHeightOptions(options, rowIndex, columnIndex);

                const cellText = getCellText(rowIndex, columnIndex);
                const approxCellHeight = Utils.getApproxCellHeight(
                    cellText,
                    columnWidths[columnIndex],
                    approxCharWidth,
                    approxLineHeight,
                    horizontalPadding,
                    numBufferLines,
                );

                if (approxCellHeight > maxCellHeightInRow) {
                    maxCellHeightInRow = approxCellHeight;
                }
            }

            rowHeights.push(maxCellHeightInRow);
        }

        this.invalidateGrid();
        this.setState({ rowHeights });
    }

    /**
     * Resize all rows in the table to the height of the tallest visible cell in the specified columns.
     * If no indices are provided, default to using the tallest visible cell from all columns in view.
     */
    public resizeRowsByTallestCell(columnIndices?: number | number[]) {
        let tallest = 0;
        if (columnIndices == null) {
            // Consider all columns currently in viewport
            const viewportColumnIndices = this.grid.getColumnIndicesInRect(this.state.viewportRect);
            for (let col = viewportColumnIndices.columnIndexStart; col <= viewportColumnIndices.columnIndexEnd; col++) {
                tallest = Math.max(tallest, this.locator.getTallestVisibleCellInColumn(col));
            }
        } else {
            const columnIndicesArray = Array.isArray(columnIndices) ? columnIndices : [columnIndices];
            const tallestByColumns = columnIndicesArray.map(col => this.locator.getTallestVisibleCellInColumn(col));
            tallest = Math.max(...tallestByColumns);
        }
        const rowHeights = Array(this.state.rowHeights.length).fill(tallest);
        this.invalidateGrid();
        this.setState({ rowHeights });
    }

    /**
     * Scrolls the table to the target region in a fashion appropriate to the target region's
     * cardinality:
     *
     * - CELLS: Scroll the top-left cell in the target region to the top-left corner of the viewport.
     * - FULL_ROWS: Scroll the top-most row in the target region to the top of the viewport.
     * - FULL_COLUMNS: Scroll the left-most column in the target region to the left side of the viewport.
     * - FULL_TABLE: Scroll the top-left cell in the table to the top-left corner of the viewport.
     *
     * If there are active frozen rows and/or columns, the target region will be positioned in the
     * top-left corner of the non-frozen area (unless the target region itself is in the frozen
     * area).
     *
     * If the target region is close to the bottom-right corner of the table, this function will
     * simply scroll the target region as close to the top-left as possible until the bottom-right
     * corner is reached.
     */
    public scrollToRegion(region: IRegion) {
        const { numFrozenColumnsClamped: numFrozenColumns, numFrozenRowsClamped: numFrozenRows } = this.state;
        const { left: currScrollLeft, top: currScrollTop } = this.state.viewportRect;

        const { scrollLeft, scrollTop } = ScrollUtils.getScrollPositionForRegion(
            region,
            currScrollLeft,
            currScrollTop,
            this.grid.getCumulativeWidthBefore,
            this.grid.getCumulativeHeightBefore,
            numFrozenRows,
            numFrozenColumns,
        );

        const correctedScrollLeft = this.shouldDisableHorizontalScroll() ? 0 : scrollLeft;
        const correctedScrollTop = this.shouldDisableVerticalScroll() ? 0 : scrollTop;

        // defer to the quadrant stack to keep all quadrant positions in sync
        this.quadrantStackInstance.scrollToPosition(correctedScrollLeft, correctedScrollTop);
    }

    // React lifecycle
    // ===============

    public getChildContext(): IColumnInteractionBarContextTypes {
        return {
            enableColumnInteractionBar: this.props.enableColumnInteractionBar,
        };
    }

    public shouldComponentUpdate(nextProps: ITableProps, nextState: ITableState) {
        const propKeysDenylist = { exclude: Table.SHALLOW_COMPARE_PROP_KEYS_DENYLIST };
        const stateKeysDenylist = { exclude: Table.SHALLOW_COMPARE_STATE_KEYS_DENYLIST };

        return (
            !CoreUtils.shallowCompareKeys(this.props, nextProps, propKeysDenylist) ||
            !CoreUtils.shallowCompareKeys(this.state, nextState, stateKeysDenylist) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, Table.SHALLOW_COMPARE_PROP_KEYS_DENYLIST) ||
            !CoreUtils.deepCompareKeys(this.state, nextState, Table.SHALLOW_COMPARE_STATE_KEYS_DENYLIST)
        );
    }

    public render() {
        const {
            children,
            className,
            enableRowHeader,
            loadingOptions,
            numRows,
            enableColumnInteractionBar,
        } = this.props;
        const { horizontalGuides, numFrozenColumnsClamped, numFrozenRowsClamped, verticalGuides } = this.state;
        if (!this.gridDimensionsMatchProps()) {
            // Ensure we're rendering the correct number of rows & columns
            this.invalidateGrid();
        }
        this.validateGrid();

        const classes = classNames(
            Classes.TABLE_CONTAINER,
            {
                [Classes.TABLE_REORDERING]: this.state.isReordering,
                [Classes.TABLE_NO_VERTICAL_SCROLL]: this.shouldDisableVerticalScroll(),
                [Classes.TABLE_NO_HORIZONTAL_SCROLL]: this.shouldDisableHorizontalScroll(),
                [Classes.TABLE_SELECTION_ENABLED]: Table.isSelectionModeEnabled(this.props, RegionCardinality.CELLS),
                [Classes.TABLE_NO_ROWS]: numRows === 0,
            },
            className,
        );

        return (
            <div className={classes} ref={this.refHandlers.rootTable} onScroll={this.handleRootScroll}>
                <TableQuadrantStack
                    bodyRef={this.refHandlers.cellContainer}
                    bodyRenderer={this.renderBody}
                    columnHeaderCellRenderer={this.renderColumnHeader}
                    columnHeaderRef={this.refHandlers.columnHeader}
                    enableColumnInteractionBar={enableColumnInteractionBar}
                    enableRowHeader={enableRowHeader}
                    grid={this.grid}
                    handleColumnResizeGuide={this.handleColumnResizeGuide}
                    handleColumnsReordering={this.handleColumnsReordering}
                    handleRowResizeGuide={this.handleRowResizeGuide}
                    handleRowsReordering={this.handleRowsReordering}
                    isHorizontalScrollDisabled={this.shouldDisableHorizontalScroll()}
                    isVerticalScrollDisabled={this.shouldDisableVerticalScroll()}
                    loadingOptions={loadingOptions}
                    numColumns={React.Children.count(children)}
                    numFrozenColumns={numFrozenColumnsClamped}
                    numFrozenRows={numFrozenRowsClamped}
                    numRows={numRows}
                    onScroll={this.handleBodyScroll}
                    ref={this.refHandlers.quadrantStack}
                    menuRenderer={this.renderMenu}
                    rowHeaderCellRenderer={this.renderRowHeader}
                    rowHeaderRef={this.refHandlers.rowHeader}
                    scrollContainerRef={this.refHandlers.scrollContainer}
                />
                <div className={classNames(Classes.TABLE_OVERLAY_LAYER, Classes.TABLE_OVERLAY_REORDERING_CURSOR)} />
                <GuideLayer
                    className={Classes.TABLE_RESIZE_GUIDES}
                    verticalGuides={verticalGuides}
                    horizontalGuides={horizontalGuides}
                />
            </div>
        );
    }

    public renderHotkeys() {
        const hotkeys = [
            this.maybeRenderCopyHotkey(),
            this.maybeRenderSelectAllHotkey(),
            this.maybeRenderFocusHotkeys(),
            this.maybeRenderSelectionResizeHotkeys(),
        ];
        return <Hotkeys>{hotkeys.filter(element => element !== undefined)}</Hotkeys>;
    }

    /**
     * When the component mounts, the HTML Element refs will be available, so
     * we constructor the Locator, which queries the elements' bounding
     * ClientRects.
     */
    public componentDidMount() {
        this.validateGrid();

        this.locator = new Locator(this.rootTableElement, this.scrollContainerElement, this.cellContainerElement);
        this.updateLocator();
        this.updateViewportRect(this.locator.getViewportRect());

        this.resizeSensorDetach = ResizeSensor.attach(this.rootTableElement, () => {
            if (!this.state.isLayoutLocked) {
                this.updateViewportRect(this.locator.getViewportRect());
            }
        });
    }

    public componentWillUnmount() {
        if (this.resizeSensorDetach != null) {
            this.resizeSensorDetach();
            delete this.resizeSensorDetach;
        }
        this.didCompletelyMount = false;
    }

    public getSnapshotBeforeUpdate() {
        const { viewportRect } = this.state;

        this.validateGrid();
        const tableBottom = this.grid.getCumulativeHeightAt(this.grid.numRows - 1);
        const tableRight = this.grid.getCumulativeWidthAt(this.grid.numCols - 1);

        const nextScrollTop =
            tableBottom < viewportRect.top + viewportRect.height
                ? // scroll the last row into view
                  Math.max(0, tableBottom - viewportRect.height)
                : undefined;

        const nextScrollLeft =
            tableRight < viewportRect.left + viewportRect.width
                ? // scroll the last column into view
                  Math.max(0, tableRight - viewportRect.width)
                : undefined;

        // these will only be defined if they differ from viewportRect
        return { nextScrollLeft, nextScrollTop };
    }

    public componentDidUpdate(prevProps: ITableProps, prevState: ITableState, snapshot: ITableSnapshot) {
        super.componentDidUpdate(prevProps, prevState, snapshot);

        const didChildrenChange =
            (React.Children.toArray(this.props.children) as Array<React.ReactElement<IColumnProps>>) !==
            this.state.childrenArray;

        const shouldInvalidateGrid =
            didChildrenChange ||
            this.props.columnWidths !== prevState.columnWidths ||
            this.props.rowHeights !== prevState.rowHeights ||
            this.props.numRows !== prevProps.numRows ||
            (this.props.forceRerenderOnSelectionChange && this.props.selectedRegions !== prevProps.selectedRegions);

        if (shouldInvalidateGrid) {
            this.invalidateGrid();
        }

        if (this.locator != null) {
            this.validateGrid();
            this.updateLocator();
        }

        // When true, we'll need to imperatively synchronize quadrant views after
        // the update. This check lets us avoid expensively diff'ing columnWidths
        // and rowHeights in <TableQuadrantStack> on each update.
        const didUpdateColumnOrRowSizes =
            !CoreUtils.arraysEqual(this.state.columnWidths, prevState.columnWidths) ||
            !CoreUtils.arraysEqual(this.state.rowHeights, prevState.rowHeights);

        if (didUpdateColumnOrRowSizes) {
            this.quadrantStackInstance.synchronizeQuadrantViews();
            this.syncViewportPosition(snapshot);
        }
    }

    protected validateProps(props: ITableProps) {
        const { children, columnWidths, numFrozenColumns, numFrozenRows, numRows, rowHeights } = props;
        const numColumns = React.Children.count(children);

        // do cheap error-checking first.
        if (numRows != null && numRows < 0) {
            throw new Error(Errors.TABLE_NUM_ROWS_NEGATIVE);
        }
        if (numFrozenRows != null && numFrozenRows < 0) {
            throw new Error(Errors.TABLE_NUM_FROZEN_ROWS_NEGATIVE);
        }
        if (numFrozenColumns != null && numFrozenColumns < 0) {
            throw new Error(Errors.TABLE_NUM_FROZEN_COLUMNS_NEGATIVE);
        }
        if (numRows != null && rowHeights != null && rowHeights.length !== numRows) {
            throw new Error(Errors.TABLE_NUM_ROWS_ROW_HEIGHTS_MISMATCH);
        }
        if (numColumns != null && columnWidths != null && columnWidths.length !== numColumns) {
            throw new Error(Errors.TABLE_NUM_COLUMNS_COLUMN_WIDTHS_MISMATCH);
        }
        React.Children.forEach(children, child => {
            if (!CoreUtils.isElementOfType(child, Column)) {
                throw new Error(Errors.TABLE_NON_COLUMN_CHILDREN_WARNING);
            }
        });

        // these are recoverable scenarios, so just print a warning.
        if (numFrozenRows != null && numRows != null && numFrozenRows > numRows) {
            console.warn(Errors.TABLE_NUM_FROZEN_ROWS_BOUND_WARNING);
        }

        if (numFrozenColumns != null && numFrozenColumns > numColumns) {
            console.warn(Errors.TABLE_NUM_FROZEN_COLUMNS_BOUND_WARNING);
        }
    }

    private gridDimensionsMatchProps() {
        const { children, numRows } = this.props;
        return (
            this.grid != null && this.grid.numCols === React.Children.count(children) && this.grid.numRows === numRows
        );
    }

    // Hotkeys
    // =======

    private maybeRenderCopyHotkey() {
        const { getCellClipboardData } = this.props;
        if (getCellClipboardData != null) {
            return (
                <Hotkey
                    key="copy-hotkey"
                    label="Copy selected table cells"
                    group="Table"
                    combo="mod+c"
                    onKeyDown={this.handleCopy}
                />
            );
        } else {
            return undefined;
        }
    }

    private maybeRenderSelectionResizeHotkeys() {
        const { enableMultipleSelection, selectionModes } = this.props;
        const isSomeSelectionModeEnabled = selectionModes.length > 0;

        if (enableMultipleSelection && isSomeSelectionModeEnabled) {
            return [
                <Hotkey
                    key="resize-selection-up"
                    label="Resize selection upward"
                    group="Table"
                    combo="shift+up"
                    onKeyDown={this.handleSelectionResizeUp}
                />,
                <Hotkey
                    key="resize-selection-down"
                    label="Resize selection downward"
                    group="Table"
                    combo="shift+down"
                    onKeyDown={this.handleSelectionResizeDown}
                />,
                <Hotkey
                    key="resize-selection-left"
                    label="Resize selection leftward"
                    group="Table"
                    combo="shift+left"
                    onKeyDown={this.handleSelectionResizeLeft}
                />,
                <Hotkey
                    key="resize-selection-right"
                    label="Resize selection rightward"
                    group="Table"
                    combo="shift+right"
                    onKeyDown={this.handleSelectionResizeRight}
                />,
            ];
        } else {
            return undefined;
        }
    }

    private maybeRenderFocusHotkeys() {
        const { enableFocusedCell } = this.props;
        if (enableFocusedCell != null) {
            return [
                <Hotkey
                    key="move left"
                    label="Move focus cell left"
                    group="Table"
                    combo="left"
                    onKeyDown={this.handleFocusMoveLeft}
                />,
                <Hotkey
                    key="move right"
                    label="Move focus cell right"
                    group="Table"
                    combo="right"
                    onKeyDown={this.handleFocusMoveRight}
                />,
                <Hotkey
                    key="move up"
                    label="Move focus cell up"
                    group="Table"
                    combo="up"
                    onKeyDown={this.handleFocusMoveUp}
                />,
                <Hotkey
                    key="move down"
                    label="Move focus cell down"
                    group="Table"
                    combo="down"
                    onKeyDown={this.handleFocusMoveDown}
                />,
                <Hotkey
                    key="move tab"
                    label="Move focus cell tab"
                    group="Table"
                    combo="tab"
                    onKeyDown={this.handleFocusMoveRightInternal}
                    allowInInput={true}
                />,
                <Hotkey
                    key="move shift-tab"
                    label="Move focus cell shift tab"
                    group="Table"
                    combo="shift+tab"
                    onKeyDown={this.handleFocusMoveLeftInternal}
                    allowInInput={true}
                />,
                <Hotkey
                    key="move enter"
                    label="Move focus cell enter"
                    group="Table"
                    combo="enter"
                    onKeyDown={this.handleFocusMoveDownInternal}
                    allowInInput={true}
                />,
                <Hotkey
                    key="move shift-enter"
                    label="Move focus cell shift enter"
                    group="Table"
                    combo="shift+enter"
                    onKeyDown={this.handleFocusMoveUpInternal}
                    allowInInput={true}
                />,
            ];
        } else {
            return [];
        }
    }

    private maybeRenderSelectAllHotkey() {
        if (Table.isSelectionModeEnabled(this.props, RegionCardinality.FULL_TABLE)) {
            return (
                <Hotkey
                    key="select-all-hotkey"
                    label="Select all"
                    group="Table"
                    combo="mod+a"
                    onKeyDown={this.handleSelectAllHotkey}
                />
            );
        } else {
            return undefined;
        }
    }

    // Selection resize
    // ----------------

    private handleSelectionResizeUp = (e: KeyboardEvent) => this.handleSelectionResize(e, Direction.UP);

    private handleSelectionResizeDown = (e: KeyboardEvent) => this.handleSelectionResize(e, Direction.DOWN);

    private handleSelectionResizeLeft = (e: KeyboardEvent) => this.handleSelectionResize(e, Direction.LEFT);

    private handleSelectionResizeRight = (e: KeyboardEvent) => this.handleSelectionResize(e, Direction.RIGHT);

    private handleSelectionResize = (e: KeyboardEvent, direction: Direction) => {
        e.preventDefault();
        e.stopPropagation();

        const { focusedCell, selectedRegions } = this.state;

        if (selectedRegions.length === 0) {
            return;
        }

        const index = FocusedCellUtils.getFocusedOrLastSelectedIndex(selectedRegions, focusedCell);
        const region = selectedRegions[index];
        const nextRegion = SelectionUtils.resizeRegion(region, direction, focusedCell);

        this.updateSelectedRegionAtIndex(nextRegion, index);
    };

    /**
     * Replaces the selected region at the specified array index, with the
     * region provided.
     */
    private updateSelectedRegionAtIndex(region: IRegion, index: number) {
        const { children, numRows } = this.props;
        const { selectedRegions } = this.state;
        const numColumns = React.Children.count(children);

        const maxRowIndex = Math.max(0, numRows - 1);
        const maxColumnIndex = Math.max(0, numColumns - 1);
        const clampedNextRegion = Regions.clampRegion(region, maxRowIndex, maxColumnIndex);

        const nextSelectedRegions = Regions.update(selectedRegions, clampedNextRegion, index);
        this.handleSelection(nextSelectedRegions);
    }

    // Quadrant refs
    // =============

    private moveFocusCell(
        primaryAxis: "row" | "col",
        secondaryAxis: "row" | "col",
        isUpOrLeft: boolean,
        newFocusedCell: IFocusedCellCoordinates,
        focusCellRegion: IRegion,
    ) {
        const { selectedRegions } = this.state;

        const primaryAxisPlural = primaryAxis === "row" ? "rows" : "cols";
        const secondaryAxisPlural = secondaryAxis === "row" ? "rows" : "cols";

        const movementDirection = isUpOrLeft ? -1 : +1;
        const regionIntervalIndex = isUpOrLeft ? 1 : 0;

        // try moving the cell in the direction along the primary axis
        newFocusedCell[primaryAxis] += movementDirection;

        const isPrimaryIndexOutOfBounds = isUpOrLeft
            ? newFocusedCell[primaryAxis] < focusCellRegion[primaryAxisPlural][0]
            : newFocusedCell[primaryAxis] > focusCellRegion[primaryAxisPlural][1];

        if (isPrimaryIndexOutOfBounds) {
            // if we moved outside the bounds of selection region,
            // move to the start (or end) of the primary axis, and move one along the secondary
            newFocusedCell[primaryAxis] = focusCellRegion[primaryAxisPlural][regionIntervalIndex];
            newFocusedCell[secondaryAxis] += movementDirection;

            const isSecondaryIndexOutOfBounds = isUpOrLeft
                ? newFocusedCell[secondaryAxis] < focusCellRegion[secondaryAxisPlural][0]
                : newFocusedCell[secondaryAxis] > focusCellRegion[secondaryAxisPlural][1];

            if (isSecondaryIndexOutOfBounds) {
                // if moving along the secondary also moves us outside
                // go to the start (or end) of the next (or previous region)
                // (note that if there's only one region you'll be moving to the opposite corner, which is fine)
                let newFocusCellSelectionIndex = newFocusedCell.focusSelectionIndex + movementDirection;

                // newFocusCellSelectionIndex should be one more (or less), unless we need to wrap around
                if (
                    isUpOrLeft ? newFocusCellSelectionIndex < 0 : newFocusCellSelectionIndex >= selectedRegions.length
                ) {
                    newFocusCellSelectionIndex = isUpOrLeft ? selectedRegions.length - 1 : 0;
                }

                const newFocusCellRegion = Regions.getCellRegionFromRegion(
                    selectedRegions[newFocusCellSelectionIndex],
                    this.grid.numRows,
                    this.grid.numCols,
                );

                newFocusedCell = {
                    col: newFocusCellRegion.cols[regionIntervalIndex],
                    focusSelectionIndex: newFocusCellSelectionIndex,
                    row: newFocusCellRegion.rows[regionIntervalIndex],
                };
            }
        }
        return newFocusedCell;
    }

    private handleCopy = (e: KeyboardEvent) => {
        const { getCellClipboardData, onCopy } = this.props;
        const { selectedRegions } = this.state;

        if (getCellClipboardData == null) {
            return;
        }

        // prevent "real" copy from being called
        e.preventDefault();
        e.stopPropagation();

        const cells = Regions.enumerateUniqueCells(selectedRegions, this.grid.numRows, this.grid.numCols);
        const sparse = Regions.sparseMapCells(cells, getCellClipboardData);
        if (sparse != null) {
            const success = Clipboard.copyCells(sparse);
            onCopy?.(success);
        }
    };

    private shouldDisableVerticalScroll() {
        const { enableGhostCells } = this.props;
        const { viewportRect } = this.state;

        const rowIndices = this.grid.getRowIndicesInRect(viewportRect, enableGhostCells);

        const isViewportUnscrolledVertically = viewportRect != null && viewportRect.top === 0;
        const areRowHeadersLoading = this.hasLoadingOption(this.props.loadingOptions, TableLoadingOption.ROW_HEADERS);
        const areGhostRowsVisible = enableGhostCells && this.grid.isGhostIndex(rowIndices.rowIndexEnd, 0);

        return areGhostRowsVisible && (isViewportUnscrolledVertically || areRowHeadersLoading);
    }

    private shouldDisableHorizontalScroll() {
        const { enableGhostCells } = this.props;
        const { viewportRect } = this.state;

        const columnIndices = this.grid.getColumnIndicesInRect(viewportRect, enableGhostCells);

        const isViewportUnscrolledHorizontally = viewportRect != null && viewportRect.left === 0;
        const areGhostColumnsVisible = enableGhostCells && this.grid.isGhostColumn(columnIndices.columnIndexEnd);
        const areColumnHeadersLoading = this.hasLoadingOption(
            this.props.loadingOptions,
            TableLoadingOption.COLUMN_HEADERS,
        );

        return areGhostColumnsVisible && (isViewportUnscrolledHorizontally || areColumnHeadersLoading);
    }

    private renderMenu = (refHandler: (ref: HTMLElement) => void) => {
        const classes = classNames(Classes.TABLE_MENU, {
            [Classes.TABLE_SELECTION_ENABLED]: Table.isSelectionModeEnabled(this.props, RegionCardinality.FULL_TABLE),
        });
        return (
            <div className={classes} ref={refHandler} onMouseDown={this.handleMenuMouseDown}>
                {this.maybeRenderRegions(this.styleMenuRegion)}
            </div>
        );
    };

    private handleMenuMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        // the shift+click interaction expands the region from the focused cell.
        // thus, if shift is pressed we shouldn't move the focused cell.
        this.selectAll(!e.shiftKey);
    };

    private selectAll = (shouldUpdateFocusedCell: boolean) => {
        const selectionHandler = this.getEnabledSelectionHandler(RegionCardinality.FULL_TABLE);
        // clicking on upper left hand corner sets selection to "all"
        // regardless of current selection state (clicking twice does not deselect table)
        selectionHandler([Regions.table()]);

        if (shouldUpdateFocusedCell) {
            const newFocusedCellCoordinates = Regions.getFocusCellCoordinatesFromRegion(Regions.table());
            this.handleFocus(FocusedCellUtils.toFullCoordinates(newFocusedCellCoordinates));
        }
    };

    private handleSelectAllHotkey = (e: KeyboardEvent) => {
        // prevent "real" select all from happening as well
        e.preventDefault();
        e.stopPropagation();

        // selecting-all via the keyboard should not move the focused cell.
        this.selectAll(false);
    };

    private getColumnProps(columnIndex: number) {
        const column = this.state.childrenArray[columnIndex] as React.ReactElement<IColumnProps>;
        return column === undefined ? undefined : column.props;
    }

    private columnHeaderCellRenderer = (columnIndex: number) => {
        const props = this.getColumnProps(columnIndex);
        if (props === undefined) {
            return null;
        }

        const { id, loadingOptions, cellRenderer, columnHeaderCellRenderer, ...spreadableProps } = props;

        const columnLoading = this.hasLoadingOption(loadingOptions, ColumnLoadingOption.HEADER);

        if (columnHeaderCellRenderer != null) {
            const columnHeaderCell = columnHeaderCellRenderer(columnIndex);
            const columnHeaderCellLoading = columnHeaderCell.props.loading;

            const columnHeaderCellProps: IColumnHeaderCellProps = {
                loading: columnHeaderCellLoading != null ? columnHeaderCellLoading : columnLoading,
            };
            return React.cloneElement(columnHeaderCell, columnHeaderCellProps);
        }

        const baseProps: IColumnHeaderCellProps = {
            index: columnIndex,
            loading: columnLoading,
            ...spreadableProps,
        };

        if (props.name != null) {
            return <ColumnHeaderCell {...baseProps} />;
        } else {
            return <ColumnHeaderCell {...baseProps} name={Utils.toBase26Alpha(columnIndex)} />;
        }
    };

    private renderColumnHeader = (
        refHandler: (ref: HTMLElement) => void,
        resizeHandler: (verticalGuides: number[]) => void,
        reorderingHandler: (oldIndex: number, newIndex: number, length: number) => void,
        showFrozenColumnsOnly: boolean = false,
    ) => {
        const { focusedCell, selectedRegions, viewportRect } = this.state;
        const {
            enableMultipleSelection,
            enableGhostCells,
            enableColumnReordering,
            enableColumnResizing,
            loadingOptions,
            maxColumnWidth,
            minColumnWidth,
            selectedRegionTransform,
        } = this.props;

        const classes = classNames(Classes.TABLE_COLUMN_HEADERS, {
            [Classes.TABLE_SELECTION_ENABLED]: Table.isSelectionModeEnabled(this.props, RegionCardinality.FULL_COLUMNS),
        });

        const columnIndices = this.grid.getColumnIndicesInRect(viewportRect, enableGhostCells);
        const columnIndexStart = showFrozenColumnsOnly ? 0 : columnIndices.columnIndexStart;
        const columnIndexEnd = showFrozenColumnsOnly ? this.getMaxFrozenColumnIndex() : columnIndices.columnIndexEnd;

        return (
            <div className={classes}>
                <ColumnHeader
                    enableMultipleSelection={enableMultipleSelection}
                    cellRenderer={this.columnHeaderCellRenderer}
                    focusedCell={focusedCell}
                    grid={this.grid}
                    isReorderable={enableColumnReordering}
                    isResizable={enableColumnResizing}
                    loading={this.hasLoadingOption(loadingOptions, TableLoadingOption.COLUMN_HEADERS)}
                    locator={this.locator}
                    maxColumnWidth={maxColumnWidth}
                    measurableElementRef={refHandler}
                    minColumnWidth={minColumnWidth}
                    onColumnWidthChanged={this.handleColumnWidthChanged}
                    onFocusedCell={this.handleFocus}
                    onLayoutLock={this.handleLayoutLock}
                    onReordered={this.handleColumnsReordered}
                    onReordering={reorderingHandler}
                    onResizeGuide={resizeHandler}
                    onSelection={this.getEnabledSelectionHandler(RegionCardinality.FULL_COLUMNS)}
                    selectedRegions={selectedRegions}
                    selectedRegionTransform={selectedRegionTransform}
                    columnIndexStart={columnIndexStart}
                    columnIndexEnd={columnIndexEnd}
                >
                    {this.props.children}
                </ColumnHeader>

                {this.maybeRenderRegions(this.styleColumnHeaderRegion)}
            </div>
        );
    };

    private renderRowHeader = (
        refHandler: (ref: HTMLElement) => void,
        resizeHandler: (verticalGuides: number[]) => void,
        reorderingHandler: (oldIndex: number, newIndex: number, length: number) => void,
        showFrozenRowsOnly: boolean = false,
    ) => {
        const { focusedCell, selectedRegions, viewportRect } = this.state;
        const {
            enableMultipleSelection,
            enableGhostCells,
            enableRowReordering,
            enableRowResizing,
            loadingOptions,
            maxRowHeight,
            minRowHeight,
            rowHeaderCellRenderer,
            selectedRegionTransform,
        } = this.props;

        const classes = classNames(Classes.TABLE_ROW_HEADERS, {
            [Classes.TABLE_SELECTION_ENABLED]: Table.isSelectionModeEnabled(this.props, RegionCardinality.FULL_ROWS),
        });

        const rowIndices = this.grid.getRowIndicesInRect(viewportRect, enableGhostCells);
        const rowIndexStart = showFrozenRowsOnly ? 0 : rowIndices.rowIndexStart;
        const rowIndexEnd = showFrozenRowsOnly ? this.getMaxFrozenRowIndex() : rowIndices.rowIndexEnd;

        return (
            <div className={classes} ref={refHandler}>
                <RowHeader
                    enableMultipleSelection={enableMultipleSelection}
                    focusedCell={focusedCell}
                    grid={this.grid}
                    locator={this.locator}
                    isReorderable={enableRowReordering}
                    isResizable={enableRowResizing}
                    loading={this.hasLoadingOption(loadingOptions, TableLoadingOption.ROW_HEADERS)}
                    maxRowHeight={maxRowHeight}
                    minRowHeight={minRowHeight}
                    onFocusedCell={this.handleFocus}
                    onLayoutLock={this.handleLayoutLock}
                    onResizeGuide={resizeHandler}
                    onReordered={this.handleRowsReordered}
                    onReordering={reorderingHandler}
                    onRowHeightChanged={this.handleRowHeightChanged}
                    onSelection={this.getEnabledSelectionHandler(RegionCardinality.FULL_ROWS)}
                    rowHeaderCellRenderer={rowHeaderCellRenderer}
                    selectedRegions={selectedRegions}
                    selectedRegionTransform={selectedRegionTransform}
                    rowIndexStart={rowIndexStart}
                    rowIndexEnd={rowIndexEnd}
                />

                {this.maybeRenderRegions(this.styleRowHeaderRegion)}
            </div>
        );
    };

    private bodyCellRenderer = (rowIndex: number, columnIndex: number) => {
        const columnProps = this.getColumnProps(columnIndex);
        if (columnProps === undefined) {
            return null;
        }

        const {
            id,
            loadingOptions,
            cellRenderer,
            columnHeaderCellRenderer,
            name,
            nameRenderer,
            ...restColumnProps
        } = columnProps;

        const cell = cellRenderer(rowIndex, columnIndex);
        const { loading = this.hasLoadingOption(loadingOptions, ColumnLoadingOption.CELLS) } = cell.props;

        const cellProps: ICellProps = {
            ...restColumnProps,
            loading,
        };

        return React.cloneElement(cell, cellProps);
    };

    private renderBody = (
        quadrantType: QuadrantType,
        showFrozenRowsOnly: boolean = false,
        showFrozenColumnsOnly: boolean = false,
    ) => {
        const {
            focusedCell,
            numFrozenColumnsClamped: numFrozenColumns,
            numFrozenRowsClamped: numFrozenRows,
            selectedRegions,
            viewportRect,
        } = this.state;
        const {
            enableMultipleSelection,
            enableGhostCells,
            loadingOptions,
            bodyContextMenuRenderer,
            selectedRegionTransform,
        } = this.props;

        const rowIndices = this.grid.getRowIndicesInRect(viewportRect, enableGhostCells);
        const columnIndices = this.grid.getColumnIndicesInRect(viewportRect, enableGhostCells);

        // start beyond the frozen area if rendering unrelated quadrants, so we
        // don't render duplicate cells underneath the frozen ones.
        const columnIndexStart = showFrozenColumnsOnly ? 0 : columnIndices.columnIndexStart + numFrozenColumns;
        const rowIndexStart = showFrozenRowsOnly ? 0 : rowIndices.rowIndexStart + numFrozenRows;

        // if rendering frozen rows/columns, subtract one to convert to
        // 0-indexing. if the 1-indexed value is 0, this sets the end index
        // to -1, which avoids rendering absent frozen rows/columns at all.
        const columnIndexEnd = showFrozenColumnsOnly ? numFrozenColumns - 1 : columnIndices.columnIndexEnd;
        const rowIndexEnd = showFrozenRowsOnly ? numFrozenRows - 1 : rowIndices.rowIndexEnd;

        // the main quadrant contains all cells in the table, so listen only to that quadrant
        const onCompleteRender = quadrantType === QuadrantType.MAIN ? this.handleCompleteRender : undefined;

        return (
            <div>
                <TableBody
                    enableMultipleSelection={enableMultipleSelection}
                    cellRenderer={this.bodyCellRenderer}
                    focusedCell={focusedCell}
                    grid={this.grid}
                    loading={this.hasLoadingOption(loadingOptions, TableLoadingOption.CELLS)}
                    locator={this.locator}
                    onCompleteRender={onCompleteRender}
                    onFocusedCell={this.handleFocus}
                    onSelection={this.getEnabledSelectionHandler(RegionCardinality.CELLS)}
                    bodyContextMenuRenderer={bodyContextMenuRenderer}
                    renderMode={this.getNormalizedRenderMode()}
                    selectedRegions={selectedRegions}
                    selectedRegionTransform={selectedRegionTransform}
                    viewportRect={viewportRect}
                    columnIndexStart={columnIndexStart}
                    columnIndexEnd={columnIndexEnd}
                    rowIndexStart={rowIndexStart}
                    rowIndexEnd={rowIndexEnd}
                    numFrozenColumns={showFrozenColumnsOnly ? numFrozenColumns : undefined}
                    numFrozenRows={showFrozenRowsOnly ? numFrozenRows : undefined}
                />
                {this.maybeRenderRegions(this.styleBodyRegion, quadrantType)}
            </div>
        );
    };

    private isGuidesShowing() {
        return this.state.verticalGuides != null || this.state.horizontalGuides != null;
    }

    private getEnabledSelectionHandler(selectionMode: RegionCardinality) {
        if (!Table.isSelectionModeEnabled(this.props, selectionMode)) {
            // If the selection mode isn't enabled, return a callback that
            // will clear the selection. For example, if row selection is
            // disabled, clicking on the row header will clear the table's
            // selection. If all selection modes are enabled, clicking on the
            // same region twice will clear the selection.
            return this.clearSelection;
        } else {
            return this.handleSelection;
        }
    }

    private invalidateGrid() {
        this.grid = null;
    }

    private validateGrid() {
        if (this.grid == null) {
            const { defaultRowHeight, defaultColumnWidth } = this.props;
            const { rowHeights, columnWidths } = this.state;
            this.grid = new Grid(rowHeights, columnWidths, Grid.DEFAULT_BLEED, defaultRowHeight, defaultColumnWidth);
            this.invokeOnVisibleCellsChangeCallback(this.state.viewportRect);
        }
    }

    /**
     * Renders a `RegionLayer`, applying styles to the regions using the
     * supplied `IRegionStyler`. `RegionLayer` is a `PureRender` component, so
     * the `IRegionStyler` should be a new instance on every render if we
     * intend to redraw the region layer.
     */
    private maybeRenderRegions(getRegionStyle: IRegionStyler, quadrantType?: QuadrantType) {
        if (this.isGuidesShowing() && !this.state.isReordering) {
            // we want to show guides *and* the selection styles when reordering rows or columns
            return undefined;
        }

        const regionGroups = Regions.joinStyledRegionGroups(
            this.state.selectedRegions,
            this.props.styledRegionGroups,
            this.state.focusedCell,
        );

        return regionGroups.map((regionGroup, index) => {
            const regionStyles = regionGroup.regions.map(region => getRegionStyle(region, quadrantType));
            return (
                <RegionLayer
                    className={classNames(regionGroup.className)}
                    key={index}
                    regions={regionGroup.regions}
                    regionStyles={regionStyles}
                />
            );
        });
    }

    private handleCompleteRender = () => {
        // the first onCompleteRender is triggered before the viewportRect is
        // defined and the second after the viewportRect has been set. the cells
        // will only actually render once the viewportRect is defined though, so
        // we defer invoking onCompleteRender until that check passes.
        if (this.state.viewportRect != null) {
            this.props.onCompleteRender?.();
            this.didCompletelyMount = true;
        }
    };

    private handleFocusMoveLeft = (e: KeyboardEvent) => this.handleFocusMove(e, "left");

    private handleFocusMoveLeftInternal = (e: KeyboardEvent) => this.handleFocusMoveInternal(e, "left");

    private handleFocusMoveRight = (e: KeyboardEvent) => this.handleFocusMove(e, "right");

    private handleFocusMoveRightInternal = (e: KeyboardEvent) => this.handleFocusMoveInternal(e, "right");

    private handleFocusMoveUp = (e: KeyboardEvent) => this.handleFocusMove(e, "up");

    private handleFocusMoveUpInternal = (e: KeyboardEvent) => this.handleFocusMoveInternal(e, "up");

    private handleFocusMoveDown = (e: KeyboardEvent) => this.handleFocusMove(e, "down");

    private handleFocusMoveDownInternal = (e: KeyboardEvent) => this.handleFocusMoveInternal(e, "down");

    private styleBodyRegion = (region: IRegion, quadrantType: QuadrantType): React.CSSProperties => {
        const { numFrozenColumns } = this.props;

        const cardinality = Regions.getRegionCardinality(region);
        const style = this.grid.getRegionStyle(region);

        // ensure we're not showing borders at the boundary of the frozen-columns area
        const canHideRightBorder =
            (quadrantType === QuadrantType.TOP_LEFT || quadrantType === QuadrantType.LEFT) &&
            numFrozenColumns != null &&
            numFrozenColumns > 0;

        const fixedHeight = this.grid.getHeight();
        const fixedWidth = this.grid.getWidth();

        // include a correction in some cases to hide borders along quadrant boundaries
        const alignmentCorrection = 1;
        const alignmentCorrectionString = `-${alignmentCorrection}px`;

        switch (cardinality) {
            case RegionCardinality.CELLS:
                return style;
            case RegionCardinality.FULL_COLUMNS:
                style.top = alignmentCorrectionString;
                style.height = fixedHeight + alignmentCorrection;
                return style;
            case RegionCardinality.FULL_ROWS:
                style.left = alignmentCorrectionString;
                style.width = fixedWidth + alignmentCorrection;
                if (canHideRightBorder) {
                    style.right = alignmentCorrectionString;
                }
                return style;
            case RegionCardinality.FULL_TABLE:
                style.left = alignmentCorrectionString;
                style.top = alignmentCorrectionString;
                style.width = fixedWidth + alignmentCorrection;
                style.height = fixedHeight + alignmentCorrection;
                if (canHideRightBorder) {
                    style.right = alignmentCorrectionString;
                }
                return style;
            default:
                return { display: "none" };
        }
    };

    private styleMenuRegion = (region: IRegion): React.CSSProperties => {
        const { viewportRect } = this.state;
        if (viewportRect == null) {
            return {};
        }
        const cardinality = Regions.getRegionCardinality(region);
        const style = this.grid.getRegionStyle(region);

        switch (cardinality) {
            case RegionCardinality.FULL_TABLE:
                style.right = "0px";
                style.bottom = "0px";
                style.top = "0px";
                style.left = "0px";
                style.borderBottom = "none";
                style.borderRight = "none";
                return style;

            default:
                return { display: "none" };
        }
    };

    private styleColumnHeaderRegion = (region: IRegion): React.CSSProperties => {
        const { viewportRect } = this.state;
        if (viewportRect == null) {
            return {};
        }
        const cardinality = Regions.getRegionCardinality(region);
        const style = this.grid.getRegionStyle(region);

        switch (cardinality) {
            case RegionCardinality.FULL_TABLE:
                style.left = "-1px";
                style.borderLeft = "none";
                style.bottom = "-1px";
                return style;
            case RegionCardinality.FULL_COLUMNS:
                style.bottom = "-1px";
                return style;

            default:
                return { display: "none" };
        }
    };

    private styleRowHeaderRegion = (region: IRegion): React.CSSProperties => {
        const { viewportRect } = this.state;
        if (viewportRect == null) {
            return {};
        }
        const cardinality = Regions.getRegionCardinality(region);
        const style = this.grid.getRegionStyle(region);
        switch (cardinality) {
            case RegionCardinality.FULL_TABLE:
                style.top = "-1px";
                style.borderTop = "none";
                style.right = "-1px";
                return style;
            case RegionCardinality.FULL_ROWS:
                style.right = "-1px";
                return style;

            default:
                return { display: "none" };
        }
    };

    private handleColumnWidthChanged = (columnIndex: number, width: number) => {
        const selectedRegions = this.state.selectedRegions;
        const columnWidths = this.state.columnWidths.slice();

        if (Regions.hasFullTable(selectedRegions)) {
            for (let col = 0; col < columnWidths.length; col++) {
                columnWidths[col] = width;
            }
        }
        if (Regions.hasFullColumn(selectedRegions, columnIndex)) {
            Regions.eachUniqueFullColumn(selectedRegions, (col: number) => {
                columnWidths[col] = width;
            });
        } else {
            columnWidths[columnIndex] = width;
        }

        this.invalidateGrid();
        this.setState({ columnWidths });

        const { onColumnWidthChanged } = this.props;
        if (onColumnWidthChanged != null) {
            onColumnWidthChanged(columnIndex, width);
        }
    };

    private handleRowHeightChanged = (rowIndex: number, height: number) => {
        const selectedRegions = this.state.selectedRegions;
        const rowHeights = this.state.rowHeights.slice();

        if (Regions.hasFullTable(selectedRegions)) {
            for (let row = 0; row < rowHeights.length; row++) {
                rowHeights[row] = height;
            }
        }
        if (Regions.hasFullRow(selectedRegions, rowIndex)) {
            Regions.eachUniqueFullRow(selectedRegions, (row: number) => {
                rowHeights[row] = height;
            });
        } else {
            rowHeights[rowIndex] = height;
        }

        this.invalidateGrid();
        this.setState({ rowHeights });

        const { onRowHeightChanged } = this.props;
        if (onRowHeightChanged != null) {
            onRowHeightChanged(rowIndex, height);
        }
    };

    private handleRootScroll = (_event: React.UIEvent<HTMLElement>) => {
        // Bug #211 - Native browser text selection events can cause the root
        // element to scroll even though it has a overflow:hidden style. The
        // only viable solution to this is to unscroll the element after the
        // browser scrolls it.
        if (this.rootTableElement != null) {
            this.rootTableElement.scrollLeft = 0;
            this.rootTableElement.scrollTop = 0;
        }
    };

    private handleBodyScroll = (event: React.SyntheticEvent<HTMLElement>) => {
        // Prevent the event from propagating to avoid a resize event on the
        // resize sensor.
        event.stopPropagation();

        if (this.locator != null && !this.state.isLayoutLocked) {
            const viewportRect = this.locator.getViewportRect();
            this.updateViewportRect(viewportRect);
        }
    };

    private clearSelection = (_selectedRegions: IRegion[]) => {
        this.handleSelection([]);
    };

    // no good way to call arrow-key keyboard events from tests
    /* istanbul ignore next */
    private handleFocusMove = (e: KeyboardEvent, direction: "up" | "down" | "left" | "right") => {
        e.preventDefault();
        e.stopPropagation();

        const { focusedCell } = this.state;
        if (focusedCell == null) {
            // halt early if we have a selectedRegionTransform or something else in play that nixes
            // the focused cell.
            return;
        }

        const newFocusedCell = {
            col: focusedCell.col,
            focusSelectionIndex: 0,
            row: focusedCell.row,
        };

        switch (direction) {
            case "up":
                newFocusedCell.row -= 1;
                break;
            case "down":
                newFocusedCell.row += 1;
                break;
            case "left":
                newFocusedCell.col -= 1;
                break;
            case "right":
                newFocusedCell.col += 1;
                break;
            default:
                break;
        }

        if (
            newFocusedCell.row < 0 ||
            newFocusedCell.row >= this.grid.numRows ||
            newFocusedCell.col < 0 ||
            newFocusedCell.col >= this.grid.numCols
        ) {
            return;
        }

        // change selection to match new focus cell location
        const newSelectionRegions = [Regions.cell(newFocusedCell.row, newFocusedCell.col)];
        const { selectedRegionTransform } = this.props;
        const transformedSelectionRegions =
            selectedRegionTransform != null
                ? newSelectionRegions.map(region => selectedRegionTransform(region, e))
                : newSelectionRegions;
        this.handleSelection(transformedSelectionRegions);
        this.handleFocus(newFocusedCell);

        // keep the focused cell in view
        this.scrollBodyToFocusedCell(newFocusedCell);
    };

    // no good way to call arrow-key keyboard events from tests
    /* istanbul ignore next */
    private handleFocusMoveInternal = (e: KeyboardEvent, direction: "up" | "down" | "left" | "right") => {
        e.preventDefault();
        e.stopPropagation();

        const { focusedCell, selectedRegions } = this.state;

        if (focusedCell == null) {
            // halt early if we have a selectedRegionTransform or something else in play that nixes
            // the focused cell.
            return;
        }

        let newFocusedCell = {
            col: focusedCell.col,
            focusSelectionIndex: focusedCell.focusSelectionIndex,
            row: focusedCell.row,
        };

        // if we're not in any particular focus cell region, and one exists, go to the first cell of the first one
        if (focusedCell.focusSelectionIndex == null && selectedRegions.length > 0) {
            const focusCellRegion = Regions.getCellRegionFromRegion(
                selectedRegions[0],
                this.grid.numRows,
                this.grid.numCols,
            );

            newFocusedCell = {
                col: focusCellRegion.cols[0],
                focusSelectionIndex: 0,
                row: focusCellRegion.rows[0],
            };
        } else {
            if (selectedRegions.length === 0) {
                this.handleFocusMove(e, direction);
                return;
            }

            const focusCellRegion = Regions.getCellRegionFromRegion(
                selectedRegions[focusedCell.focusSelectionIndex],
                this.grid.numRows,
                this.grid.numCols,
            );

            if (
                focusCellRegion.cols[0] === focusCellRegion.cols[1] &&
                focusCellRegion.rows[0] === focusCellRegion.rows[1] &&
                selectedRegions.length === 1
            ) {
                this.handleFocusMove(e, direction);
                return;
            }

            switch (direction) {
                case "up":
                    newFocusedCell = this.moveFocusCell("row", "col", true, newFocusedCell, focusCellRegion);
                    break;
                case "left":
                    newFocusedCell = this.moveFocusCell("col", "row", true, newFocusedCell, focusCellRegion);
                    break;
                case "down":
                    newFocusedCell = this.moveFocusCell("row", "col", false, newFocusedCell, focusCellRegion);
                    break;
                case "right":
                    newFocusedCell = this.moveFocusCell("col", "row", false, newFocusedCell, focusCellRegion);
                    break;
                default:
                    break;
            }
        }

        if (
            newFocusedCell.row < 0 ||
            newFocusedCell.row >= this.grid.numRows ||
            newFocusedCell.col < 0 ||
            newFocusedCell.col >= this.grid.numCols
        ) {
            return;
        }

        this.handleFocus(newFocusedCell);

        // keep the focused cell in view
        this.scrollBodyToFocusedCell(newFocusedCell);
    };

    private scrollBodyToFocusedCell = (focusedCell: IFocusedCellCoordinates) => {
        const { row, col } = focusedCell;
        const { viewportRect } = this.state;

        // sort keys in normal CSS position order (per the trusty TRBL/"trouble" acronym)
        // tslint:disable:object-literal-sort-keys
        const viewportBounds = {
            top: viewportRect.top,
            right: viewportRect.left + viewportRect.width,
            bottom: viewportRect.top + viewportRect.height,
            left: viewportRect.left,
        };
        const focusedCellBounds = {
            top: this.grid.getCumulativeHeightBefore(row),
            right: this.grid.getCumulativeWidthAt(col),
            bottom: this.grid.getCumulativeHeightAt(row),
            left: this.grid.getCumulativeWidthBefore(col),
        };
        // tslint:enable:object-literal-sort-keys

        const focusedCellWidth = focusedCellBounds.right - focusedCellBounds.left;
        const focusedCellHeight = focusedCellBounds.bottom - focusedCellBounds.top;

        const isFocusedCellWiderThanViewport = focusedCellWidth > viewportRect.width;
        const isFocusedCellTallerThanViewport = focusedCellHeight > viewportRect.height;

        const ss: ITableSnapshot = {};

        // keep the top end of an overly tall focused cell in view when moving left and right
        // (without this OR check, the body seesaws to fit the top end, then the bottom end, etc.)
        if (focusedCellBounds.top < viewportBounds.top || isFocusedCellTallerThanViewport) {
            // scroll up (minus one pixel to avoid clipping the focused-cell border)
            ss.nextScrollTop = Math.max(0, focusedCellBounds.top - 1);
        } else if (focusedCellBounds.bottom > viewportBounds.bottom) {
            // scroll down
            const scrollDelta = focusedCellBounds.bottom - viewportBounds.bottom;
            ss.nextScrollTop = viewportBounds.top + scrollDelta;
        }

        // keep the left end of an overly wide focused cell in view when moving up and down
        if (focusedCellBounds.left < viewportBounds.left || isFocusedCellWiderThanViewport) {
            // scroll left (again minus one additional pixel)
            ss.nextScrollLeft = Math.max(0, focusedCellBounds.left - 1);
        } else if (focusedCellBounds.right > viewportBounds.right) {
            // scroll right
            const scrollDelta = focusedCellBounds.right - viewportBounds.right;
            ss.nextScrollLeft = viewportBounds.left + scrollDelta;
        }

        this.syncViewportPosition(ss);
    };

    private syncViewportPosition({ nextScrollLeft, nextScrollTop }: ITableSnapshot) {
        const { viewportRect } = this.state;

        if (nextScrollLeft !== undefined || nextScrollTop !== undefined) {
            // we need to modify the scroll container explicitly for the viewport to shift. in so
            // doing, we add the size of the header elements, which are not technically part of the
            // "grid" concept (the grid only consists of body cells at present).
            if (nextScrollTop !== undefined) {
                const topCorrection = this.shouldDisableVerticalScroll() ? 0 : this.columnHeaderElement.clientHeight;
                this.scrollContainerElement.scrollTop = nextScrollTop + topCorrection;
            }
            if (nextScrollLeft !== undefined) {
                const leftCorrection =
                    this.shouldDisableHorizontalScroll() || this.rowHeaderElement == null
                        ? 0
                        : this.rowHeaderElement.clientWidth;

                this.scrollContainerElement.scrollLeft = nextScrollLeft + leftCorrection;
            }

            const nextViewportRect = new Rect(nextScrollLeft, nextScrollTop, viewportRect.width, viewportRect.height);
            this.updateViewportRect(nextViewportRect);
        }
    }

    private handleFocus = (focusedCell: IFocusedCellCoordinates) => {
        if (!this.props.enableFocusedCell) {
            // don't set focus state if focus is not allowed
            return;
        }

        // only set focused cell state if not specified in props
        if (this.props.focusedCell == null) {
            this.setState({ focusedCell });
        }

        this.props.onFocusedCell?.(focusedCell);
    };

    private handleSelection = (selectedRegions: IRegion[]) => {
        // only set selectedRegions state if not specified in props
        if (this.props.selectedRegions == null) {
            this.setState({ selectedRegions });
        }

        const { onSelection } = this.props;
        if (onSelection != null) {
            onSelection(selectedRegions);
        }
    };

    private handleColumnsReordering = (verticalGuides: number[]) => {
        this.setState({ isReordering: true, verticalGuides });
    };

    private handleColumnsReordered = (oldIndex: number, newIndex: number, length: number) => {
        this.setState({ isReordering: false, verticalGuides: undefined });
        this.props.onColumnsReordered?.(oldIndex, newIndex, length);
    };

    private handleRowsReordering = (horizontalGuides: number[]) => {
        this.setState({ isReordering: true, horizontalGuides });
    };

    private handleRowsReordered = (oldIndex: number, newIndex: number, length: number) => {
        this.setState({ isReordering: false, horizontalGuides: undefined });
        this.props.onRowsReordered?.(oldIndex, newIndex, length);
    };

    private handleLayoutLock = (isLayoutLocked = false) => {
        this.setState({ isLayoutLocked });
    };

    private hasLoadingOption = (loadingOptions: string[], loadingOption: string) => {
        if (loadingOptions == null) {
            return undefined;
        }
        return loadingOptions.indexOf(loadingOption) >= 0;
    };

    private updateLocator() {
        this.locator
            .setGrid(this.grid)
            .setNumFrozenRows(this.state.numFrozenRowsClamped)
            .setNumFrozenColumns(this.state.numFrozenColumnsClamped);
    }

    private updateViewportRect = (nextViewportRect: Rect) => {
        const { viewportRect } = this.state;
        this.setState({ viewportRect: nextViewportRect });

        const didViewportChange =
            (viewportRect != null && !viewportRect.equals(nextViewportRect)) ||
            (viewportRect == null && nextViewportRect != null);

        if (didViewportChange) {
            this.invokeOnVisibleCellsChangeCallback(nextViewportRect);
        }
    };

    private invokeOnVisibleCellsChangeCallback(viewportRect: Rect) {
        const columnIndices = this.grid.getColumnIndicesInRect(viewportRect);
        const rowIndices = this.grid.getRowIndicesInRect(viewportRect);
        this.props.onVisibleCellsChange?.(rowIndices, columnIndices);
    }

    private getMaxFrozenColumnIndex = () => {
        const { numFrozenColumnsClamped: numFrozenColumns } = this.state;
        return numFrozenColumns != null ? numFrozenColumns - 1 : undefined;
    };

    private getMaxFrozenRowIndex = () => {
        const { numFrozenRowsClamped: numFrozenRows } = this.state;
        return numFrozenRows != null ? numFrozenRows - 1 : undefined;
    };

    /**
     * Normalizes RenderMode.BATCH_ON_UPDATE into RenderMode.{BATCH,NONE}. We do
     * this because there are actually multiple updates required before the
     * <Table> is considered fully "mounted," and adding that knowledge to child
     * components would lead to tight coupling. Thus, keep it simple for them.
     */
    private getNormalizedRenderMode(): RenderMode.BATCH | RenderMode.NONE {
        const { renderMode } = this.props;

        const shouldBatchRender =
            renderMode === RenderMode.BATCH || (renderMode === RenderMode.BATCH_ON_UPDATE && this.didCompletelyMount);

        return shouldBatchRender ? RenderMode.BATCH : RenderMode.NONE;
    }

    private handleColumnResizeGuide = (verticalGuides: number[]) => {
        this.setState({ verticalGuides });
    };

    private handleRowResizeGuide = (horizontalGuides: number[]) => {
        this.setState({ horizontalGuides });
    };

    /**
     * Returns an object with option keys mapped to their resolved values
     * (falling back to default values as necessary).
     */
    private resolveResizeRowsByApproximateHeightOptions(
        options: IResizeRowsByApproximateHeightOptions | null | undefined,
        rowIndex: number,
        columnIndex: number,
    ) {
        const optionKeys = Object.keys(Table.resizeRowsByApproximateHeightDefaults) as Array<
            keyof IResizeRowsByApproximateHeightOptions
        >;
        const optionReducer = (
            agg: IResizeRowsByApproximateHeightResolvedOptions,
            key: keyof IResizeRowsByApproximateHeightOptions,
        ) => {
            const valueOrMapper = options?.[key];
            if (typeof valueOrMapper === "function") {
                agg[key] = valueOrMapper(rowIndex, columnIndex);
            } else if (valueOrMapper != null) {
                agg[key] = valueOrMapper;
            } else {
                agg[key] = Table.resizeRowsByApproximateHeightDefaults[key];
            }

            return agg;
        };
        const resolvedOptions: IResizeRowsByApproximateHeightResolvedOptions = optionKeys.reduce(optionReducer, {});
        return resolvedOptions;
    }
}

function clampNumFrozenColumns(props: ITableProps) {
    const { numFrozenColumns } = props;
    const numColumns = React.Children.count(props.children);
    return clampPotentiallyNullValue(numFrozenColumns, numColumns);
}

function clampNumFrozenRows(props: ITableProps) {
    const { numFrozenRows, numRows } = props;
    return clampPotentiallyNullValue(numFrozenRows, numRows);
}

// add explicit `| null | undefined`, because the params make more sense in this
// order, and you can't have an optional param precede a required param.
function clampPotentiallyNullValue(value: number | null | undefined, max: number) {
    return value == null ? 0 : Utils.clamp(value, 0, max);
}
