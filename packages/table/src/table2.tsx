/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import {
    AbstractComponent2,
    DISPLAYNAME_PREFIX,
    HotkeyConfig,
    HotkeysTarget2,
    IRef,
    UseHotkeysReturnValue,
    Utils as CoreUtils,
} from "@blueprintjs/core";

import { Column, ColumnProps } from "./column";
import type { FocusedCellCoordinates } from "./common/cellTypes";
import * as Classes from "./common/classes";
import { columnInteractionBarContextTypes, IColumnInteractionBarContextTypes } from "./common/context";
import * as Errors from "./common/errors";
import { Grid, ICellMapper } from "./common/grid";
import * as FocusedCellUtils from "./common/internal/focusedCellUtils";
import * as ScrollUtils from "./common/internal/scrollUtils";
import { Rect } from "./common/rect";
import { RenderMode } from "./common/renderMode";
import { Utils } from "./common/utils";
import { ColumnHeader } from "./headers/columnHeader";
import { ColumnHeaderCell, IColumnHeaderCellProps } from "./headers/columnHeaderCell";
import { renderDefaultRowHeader, RowHeader } from "./headers/rowHeader";
import { ResizeSensor } from "./interactions/resizeSensor";
import { GuideLayer } from "./layers/guides";
import { RegionStyler, RegionLayer } from "./layers/regions";
import { Locator } from "./locator";
import { QuadrantType } from "./quadrants/tableQuadrant";
import { TableQuadrantStack } from "./quadrants/tableQuadrantStack";
import { ColumnLoadingOption, Region, RegionCardinality, Regions, SelectionModes, TableLoadingOption } from "./regions";
import {
    IResizeRowsByApproximateHeightOptions,
    resizeRowsByApproximateHeight,
    resizeRowsByTallestCell,
} from "./resizeRows";
import { compareChildren, getHotkeysFromProps, isSelectionModeEnabled } from "./table2Utils";
import { TableBody } from "./tableBody";
import { TableHotkeys } from "./tableHotkeys";
import type { TableProps, TablePropsDefaults, TablePropsWithDefaults } from "./tableProps";
import type { TableState, TableSnapshot } from "./tableState";
import { clampNumFrozenColumns, clampNumFrozenRows, hasLoadingOption } from "./tableUtils";

export interface Table2Props extends TableProps {
    /**
     * Warning: experimental feature!
     *
     * This dependency list may be used to trigger a re-render of all cells when one of its elements changes
     * (compared using shallow equality checks). This is done by invalidating the grid, which forces
     * TableQuadrantStack to re-render.
     */
    cellRendererDependencies?: React.DependencyList;
}

export class Table2 extends AbstractComponent2<Table2Props, TableState, TableSnapshot> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Table2`;

    public static defaultProps: TablePropsDefaults = {
        defaultColumnWidth: 150,
        defaultRowHeight: 20,
        enableColumnInteractionBar: false,
        enableFocusedCell: false,
        enableGhostCells: false,
        enableMultipleSelection: true,
        enableRowHeader: true,
        forceRerenderOnSelectionChange: false,
        loadingOptions: [],
        maxColumnWidth: 9999,
        maxRowHeight: 9999,
        minColumnWidth: 50,
        minRowHeight: 20,
        numFrozenColumns: 0,
        numFrozenRows: 0,
        numRows: 0,
        renderMode: RenderMode.BATCH_ON_UPDATE,
        rowHeaderCellRenderer: renderDefaultRowHeader,
        selectionModes: SelectionModes.ALL,
    };

    public static childContextTypes: React.ValidationMap<IColumnInteractionBarContextTypes> = columnInteractionBarContextTypes;

    public static getDerivedStateFromProps(props: TablePropsWithDefaults, state: TableState) {
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

        const newChildrenArray = React.Children.toArray(children) as Array<React.ReactElement<ColumnProps>>;
        const didChildrenChange = !compareChildren(newChildrenArray, state.childrenArray);
        const numCols = newChildrenArray.length;

        let newColumnWidths = columnWidths;
        if (columnWidths !== state.columnWidths || didChildrenChange) {
            // Try to maintain widths of columns by looking up the width of the
            // column that had the same `ID` prop. If none is found, use the
            // previous width at the same index.
            const previousColumnWidths = newChildrenArray.map(
                (child: React.ReactElement<ColumnProps>, index: number) => {
                    const mappedIndex =
                        child.props.id === undefined ? undefined : state.columnIdToIndex[child.props.id];
                    return state.columnWidths[mappedIndex ?? index];
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

        const newSelectedRegions =
            selectedRegions ??
            state.selectedRegions.filter(region => {
                // if we're in uncontrolled mode, filter out all selected regions that don't
                // fit in the current new table dimensions
                const regionCardinality = Regions.getRegionCardinality(region);
                return (
                    isSelectionModeEnabled(props, regionCardinality, selectionModes) &&
                    Regions.isRegionValidForTable(region, numRows, numCols)
                );
            });

        const newFocusedCell = FocusedCellUtils.getInitialFocusedCell(
            enableFocusedCell,
            focusedCell,
            state.focusedCell,
            newSelectedRegions,
        );

        const nextState = {
            childrenArray: newChildrenArray,
            columnIdToIndex: didChildrenChange ? Table2.createColumnIdIndex(newChildrenArray) : state.columnIdToIndex,
            columnWidths: newColumnWidths,
            focusedCell: newFocusedCell,
            numFrozenColumnsClamped: clampNumFrozenColumns(props),
            numFrozenRowsClamped: clampNumFrozenRows(props),
            rowHeights: newRowHeights,
            selectedRegions: newSelectedRegions,
        };

        if (!CoreUtils.deepCompareKeys(state, nextState, Table2.SHALLOW_COMPARE_STATE_KEYS_DENYLIST)) {
            return nextState;
        }

        return null;
    }

    private static SHALLOW_COMPARE_PROP_KEYS_DENYLIST = [
        "selectedRegions", // (intentionally omitted; can be deeply compared to save on re-renders in controlled mode)
    ] as Array<keyof TableProps>;

    private static SHALLOW_COMPARE_STATE_KEYS_DENYLIST = [
        "selectedRegions", // (intentionally omitted; can be deeply compared to save on re-renders in uncontrolled mode)
        "viewportRect",
    ] as Array<keyof TableState>;

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

    private hotkeys: HotkeyConfig[] = [];

    private hotkeysImpl: TableHotkeys;

    public grid: Grid | null = null;

    public locator?: Locator;

    private resizeSensorDetach?: () => void;

    private refHandlers = {
        cellContainer: (ref: HTMLElement | null) => (this.cellContainerElement = ref),
        columnHeader: (ref: HTMLElement | null) => {
            this.columnHeaderElement = ref;
            if (ref != null) {
                this.columnHeaderHeight = ref.clientHeight;
            }
        },
        quadrantStack: (ref: TableQuadrantStack) => (this.quadrantStackInstance = ref),
        rootTable: (ref: HTMLElement | null) => (this.rootTableElement = ref),
        rowHeader: (ref: HTMLElement | null) => {
            this.rowHeaderElement = ref;
            if (ref != null) {
                this.rowHeaderWidth = ref.clientWidth;
            }
        },
        scrollContainer: (ref: HTMLElement | null) => (this.scrollContainerElement = ref),
    };

    private cellContainerElement?: HTMLElement | null;

    private columnHeaderElement?: HTMLElement | null;

    private columnHeaderHeight = Grid.MIN_COLUMN_HEADER_HEIGHT;

    private quadrantStackInstance?: TableQuadrantStack;

    private rootTableElement?: HTMLElement | null;

    private rowHeaderElement?: HTMLElement | null;

    private rowHeaderWidth = Grid.MIN_ROW_HEADER_WIDTH;

    private scrollContainerElement?: HTMLElement | null;

    private didColumnHeaderMount = false;

    private didRowHeaderMount = false;

    /*
     * This value is set to `true` when all cells finish mounting for the first
     * time. It serves as a signal that we can switch to batch rendering.
     */
    private didCompletelyMount = false;

    public constructor(props: TablePropsWithDefaults, context?: any) {
        super(props, context);

        const {
            children,
            columnWidths,
            defaultRowHeight,
            defaultColumnWidth,
            enableRowHeader,
            numRows,
            rowHeights,
            selectedRegions = [] as Region[],
        } = props;

        const childrenArray = React.Children.toArray(children) as Array<React.ReactElement<ColumnProps>>;
        const columnIdToIndex = Table2.createColumnIdIndex(childrenArray);

        // Create height/width arrays using the lengths from props and
        // children, the default values from props, and finally any sparse
        // arrays passed into props.
        let newColumnWidths = childrenArray.map(() => defaultColumnWidth);
        if (columnWidths !== undefined) {
            newColumnWidths = Utils.assignSparseValues(newColumnWidths, columnWidths);
        }
        let newRowHeights = Utils.times(numRows, () => defaultRowHeight);
        if (rowHeights !== undefined) {
            newRowHeights = Utils.assignSparseValues(newRowHeights, rowHeights);
        }

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
            didHeadersMount: false,
            focusedCell,
            horizontalGuides: [],
            isLayoutLocked: false,
            isReordering: false,
            numFrozenColumnsClamped: clampNumFrozenColumns(props),
            numFrozenRowsClamped: clampNumFrozenRows(props),
            rowHeights: newRowHeights,
            selectedRegions,
            verticalGuides: [],
        };

        this.hotkeysImpl = new TableHotkeys(props, this.state, {
            getEnabledSelectionHandler: this.getEnabledSelectionHandler,
            handleFocus: this.handleFocus,
            handleSelection: this.handleSelection,
            syncViewportPosition: this.syncViewportPosition,
        });
        this.hotkeys = getHotkeysFromProps(props, this.hotkeysImpl);

        if (enableRowHeader === false) {
            this.didRowHeaderMount = true;
        }
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
        const rowHeights = resizeRowsByApproximateHeight(
            this.props.numRows!,
            this.state.columnWidths,
            getCellText,
            options,
        );
        this.invalidateGrid();
        this.setState({ rowHeights });
    }

    /**
     * Resize all rows in the table to the height of the tallest visible cell in the specified columns.
     * If no indices are provided, default to using the tallest visible cell from all columns in view.
     */
    public resizeRowsByTallestCell(columnIndices?: number | number[]) {
        if (this.grid == null || this.state.viewportRect === undefined || this.locator === undefined) {
            console.warn(Errors.TABLE_UNMOUNTED_RESIZE_WARNING);
            return;
        }

        const rowHeights = resizeRowsByTallestCell(
            this.grid,
            this.state.viewportRect,
            this.locator,
            this.state.rowHeights.length,
            columnIndices,
        );
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
    public scrollToRegion(region: Region) {
        const {
            numFrozenColumnsClamped: numFrozenColumns,
            numFrozenRowsClamped: numFrozenRows,
            viewportRect,
        } = this.state;

        if (viewportRect === undefined || this.grid === null || this.quadrantStackInstance === undefined) {
            return;
        }

        const { left: currScrollLeft, top: currScrollTop } = viewportRect;
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
            enableColumnInteractionBar: this.props.enableColumnInteractionBar!,
        };
    }

    public shouldComponentUpdate(nextProps: Table2Props, nextState: TableState) {
        const propKeysDenylist = { exclude: Table2.SHALLOW_COMPARE_PROP_KEYS_DENYLIST };
        const stateKeysDenylist = { exclude: Table2.SHALLOW_COMPARE_STATE_KEYS_DENYLIST };

        return (
            !CoreUtils.shallowCompareKeys(this.props, nextProps, propKeysDenylist) ||
            !CoreUtils.shallowCompareKeys(this.state, nextState, stateKeysDenylist) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, Table2.SHALLOW_COMPARE_PROP_KEYS_DENYLIST) ||
            !CoreUtils.deepCompareKeys(this.state, nextState, Table2.SHALLOW_COMPARE_STATE_KEYS_DENYLIST)
        );
    }

    public render() {
        return <HotkeysTarget2 hotkeys={this.hotkeys}>{this.renderTableContents}</HotkeysTarget2>;
    }

    private renderTableContents = ({ handleKeyDown, handleKeyUp }: UseHotkeysReturnValue) => {
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

        const grid = this.validateGrid();

        const classes = classNames(
            Classes.TABLE_CONTAINER,
            {
                [Classes.TABLE_REORDERING]: this.state.isReordering,
                [Classes.TABLE_NO_VERTICAL_SCROLL]: this.shouldDisableVerticalScroll(),
                [Classes.TABLE_NO_HORIZONTAL_SCROLL]: this.shouldDisableHorizontalScroll(),
                [Classes.TABLE_SELECTION_ENABLED]: isSelectionModeEnabled(
                    this.props as TablePropsWithDefaults,
                    RegionCardinality.CELLS,
                ),
                [Classes.TABLE_NO_ROWS]: numRows === 0,
            },
            className,
        );

        return (
            <div
                className={classes}
                ref={this.refHandlers.rootTable}
                onScroll={this.handleRootScroll}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                tabIndex={0}
            >
                <TableQuadrantStack
                    bodyRef={this.refHandlers.cellContainer}
                    bodyRenderer={this.renderBody}
                    columnHeaderRenderer={this.renderColumnHeader}
                    columnHeaderRef={this.refHandlers.columnHeader}
                    didHeadersMount={this.state.didHeadersMount}
                    enableColumnInteractionBar={enableColumnInteractionBar}
                    enableRowHeader={enableRowHeader}
                    grid={grid}
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
                    rowHeaderRenderer={this.renderRowHeader}
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
    };

    /**
     * When the component mounts, the HTML Element refs will be available, so
     * we constructor the Locator, which queries the elements' bounding
     * ClientRects.
     */
    public componentDidMount() {
        this.validateGrid();

        if (this.rootTableElement != null && this.scrollContainerElement != null && this.cellContainerElement != null) {
            this.locator = new Locator(this.rootTableElement, this.scrollContainerElement, this.cellContainerElement);
            this.updateLocator();
            this.updateViewportRect(this.locator.getViewportRect());
            this.resizeSensorDetach = ResizeSensor.attach(this.rootTableElement, () => {
                if (!this.state.isLayoutLocked) {
                    this.updateViewportRect(this.locator?.getViewportRect());
                }
            });
            this.forceUpdate();
        }
    }

    public componentWillUnmount() {
        if (this.resizeSensorDetach != null) {
            this.resizeSensorDetach();
            delete this.resizeSensorDetach;
        }
        this.didCompletelyMount = false;
    }

    public componentDidUpdate(prevProps: Table2Props, prevState: TableState) {
        super.componentDidUpdate(prevProps, prevState);
        this.hotkeysImpl.setState(this.state);
        this.hotkeysImpl.setProps(this.props);

        const didChildrenChange = !compareChildren(
            React.Children.toArray(this.props.children) as Array<React.ReactElement<ColumnProps>>,
            this.state.childrenArray,
        );

        if (this.props.cellRendererDependencies !== undefined && prevProps.cellRendererDependencies === undefined) {
            console.error(Errors.TABLE_INVALID_CELL_RENDERER_DEPS);
        }

        const didCellRendererDependenciesChange =
            this.props.cellRendererDependencies !== undefined &&
            this.props.cellRendererDependencies.some(
                (dep, index) => dep !== (prevProps.cellRendererDependencies ?? [])[index],
            );

        const didColumnWidthsChange = !Utils.compareSparseArrays(
            this.props.columnWidths ?? this.state.columnWidths,
            prevState.columnWidths,
        );
        const didRowHeightsChange = !Utils.compareSparseArrays(
            this.props.rowHeights ?? this.state.rowHeights,
            prevState.rowHeights,
        );

        const shouldInvalidateGrid =
            didChildrenChange ||
            didCellRendererDependenciesChange ||
            didColumnWidthsChange ||
            didRowHeightsChange ||
            this.props.numRows !== prevProps.numRows ||
            (this.props.forceRerenderOnSelectionChange && this.props.selectedRegions !== prevProps.selectedRegions);

        if (shouldInvalidateGrid) {
            this.invalidateGrid();
        }

        if (this.locator != null) {
            this.validateGrid();
            this.updateLocator();
        }

        const shouldInvalidateHotkeys =
            this.props.getCellClipboardData !== prevProps.getCellClipboardData ||
            this.props.enableFocusedCell !== prevProps.enableFocusedCell ||
            this.props.enableMultipleSelection !== prevProps.enableMultipleSelection ||
            this.props.selectionModes !== prevProps.selectionModes;

        if (shouldInvalidateHotkeys) {
            this.hotkeys = getHotkeysFromProps(this.props as TablePropsWithDefaults, this.hotkeysImpl);
        }

        if (didCellRendererDependenciesChange) {
            // force an update with the new grid
            this.forceUpdate();
        }
    }

    protected validateProps(props: TableProps) {
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

    // Quadrant refs
    // =============

    private shouldDisableVerticalScroll() {
        const { enableGhostCells } = this.props;
        const { viewportRect } = this.state;

        if (this.grid === null || viewportRect === undefined) {
            return false;
        }

        const rowIndices = this.grid.getRowIndicesInRect(viewportRect, enableGhostCells!);

        const isViewportUnscrolledVertically = viewportRect != null && viewportRect.top === 0;
        const areRowHeadersLoading = hasLoadingOption(this.props.loadingOptions, TableLoadingOption.ROW_HEADERS);
        const areGhostRowsVisible = enableGhostCells! && this.grid.isGhostIndex(rowIndices.rowIndexEnd - 1, 0);

        return areGhostRowsVisible && (isViewportUnscrolledVertically || areRowHeadersLoading);
    }

    private shouldDisableHorizontalScroll() {
        const { enableGhostCells } = this.props;
        const { viewportRect } = this.state;

        if (this.grid === null || viewportRect === undefined) {
            return false;
        }

        const columnIndices = this.grid.getColumnIndicesInRect(viewportRect, enableGhostCells!);

        const isViewportUnscrolledHorizontally = viewportRect != null && viewportRect.left === 0;
        const areColumnHeadersLoading = hasLoadingOption(this.props.loadingOptions, TableLoadingOption.COLUMN_HEADERS);
        const areGhostColumnsVisible = enableGhostCells! && this.grid.isGhostColumn(columnIndices.columnIndexEnd);

        return areGhostColumnsVisible && (isViewportUnscrolledHorizontally || areColumnHeadersLoading);
    }

    private renderMenu = (refHandler: IRef<HTMLDivElement> | undefined) => {
        const classes = classNames(Classes.TABLE_MENU, {
            [Classes.TABLE_SELECTION_ENABLED]: isSelectionModeEnabled(
                this.props as TablePropsWithDefaults,
                RegionCardinality.FULL_TABLE,
            ),
        });
        return (
            <div className={classes} ref={refHandler} onMouseDown={this.handleMenuMouseDown}>
                {this.maybeRenderRegions(this.styleMenuRegion)}
            </div>
        );
    };

    private handleMenuMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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

    private getColumnProps(columnIndex: number) {
        const column = this.state.childrenArray[columnIndex] as React.ReactElement<ColumnProps>;
        return column === undefined ? undefined : column.props;
    }

    private columnHeaderCellRenderer = (columnIndex: number) => {
        const columnProps = this.getColumnProps(columnIndex);
        if (columnProps === undefined) {
            return null;
        }

        const { id, cellRenderer, columnHeaderCellRenderer, ...spreadableProps } = columnProps;

        const columnLoading =
            hasLoadingOption(columnProps.loadingOptions, ColumnLoadingOption.HEADER) ||
            hasLoadingOption(this.props.loadingOptions, TableLoadingOption.COLUMN_HEADERS);

        if (columnHeaderCellRenderer != null) {
            const columnHeaderCell = columnHeaderCellRenderer(columnIndex);
            if (columnHeaderCell != null) {
                return React.cloneElement(columnHeaderCell, {
                    loading: columnHeaderCell.props.loading ?? columnLoading,
                });
            }
        }

        const baseProps: IColumnHeaderCellProps = {
            index: columnIndex,
            loading: columnLoading,
            ...spreadableProps,
        };

        if (columnProps.name != null) {
            return <ColumnHeaderCell {...baseProps} />;
        } else {
            return <ColumnHeaderCell {...baseProps} name={Utils.toBase26Alpha(columnIndex)} />;
        }
    };

    private renderColumnHeader = (
        refHandler: IRef<HTMLDivElement>,
        resizeHandler: (verticalGuides: number[] | null) => void,
        reorderingHandler: (oldIndex: number, newIndex: number, length: number) => void,
        showFrozenColumnsOnly: boolean = false,
    ) => {
        const { focusedCell, selectedRegions, viewportRect } = this.state;
        const {
            defaultColumnWidth,
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
            [Classes.TABLE_SELECTION_ENABLED]: isSelectionModeEnabled(
                this.props as TablePropsWithDefaults,
                RegionCardinality.FULL_COLUMNS,
            ),
        });

        if (this.grid === null || this.locator === undefined || viewportRect === undefined) {
            // if we haven't mounted yet (which we need in order for grid/viewport calculations),
            // we still want to hand a DOM ref over to TableQuadrantStack for later
            return <div className={classes} ref={refHandler} />;
        }

        // if we have horizontal overflow, no need to render ghost columns
        // (this avoids problems like https://github.com/palantir/blueprint/issues/5027)
        const hasHorizontalOverflow = this.locator.hasHorizontalOverflow(this.rowHeaderWidth, viewportRect);
        const columnIndices = this.grid.getColumnIndicesInRect(
            viewportRect,
            hasHorizontalOverflow ? false : enableGhostCells,
        );

        const columnIndexStart = showFrozenColumnsOnly ? 0 : columnIndices.columnIndexStart;
        const columnIndexEnd = showFrozenColumnsOnly ? this.getMaxFrozenColumnIndex() : columnIndices.columnIndexEnd;

        return (
            <div className={classes} ref={refHandler}>
                <ColumnHeader
                    defaultColumnWidth={defaultColumnWidth!}
                    enableMultipleSelection={enableMultipleSelection}
                    cellRenderer={this.columnHeaderCellRenderer}
                    focusedCell={focusedCell}
                    grid={this.grid}
                    isReorderable={enableColumnReordering}
                    isResizable={enableColumnResizing}
                    loading={hasLoadingOption(loadingOptions, TableLoadingOption.COLUMN_HEADERS)}
                    locator={this.locator}
                    maxColumnWidth={maxColumnWidth!}
                    minColumnWidth={minColumnWidth!}
                    onColumnWidthChanged={this.handleColumnWidthChanged}
                    onFocusedCell={this.handleFocus}
                    onMount={this.handleHeaderMounted}
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
        refHandler: IRef<HTMLDivElement>,
        resizeHandler: (verticalGuides: number[] | null) => void,
        reorderingHandler: (oldIndex: number, newIndex: number, length: number) => void,
        showFrozenRowsOnly: boolean = false,
    ) => {
        const { focusedCell, selectedRegions, viewportRect } = this.state;
        const {
            defaultRowHeight,
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
            [Classes.TABLE_SELECTION_ENABLED]: isSelectionModeEnabled(
                this.props as TablePropsWithDefaults,
                RegionCardinality.FULL_ROWS,
            ),
        });

        if (this.grid === null || this.locator === undefined || viewportRect === undefined) {
            // if we haven't mounted yet (which we need in order for grid/viewport calculations),
            // we still want to hand a DOM ref over to TableQuadrantStack for later
            return <div className={classes} ref={refHandler} />;
        }

        // if we have vertical overflow, no need to render ghost rows
        // (this avoids problems like https://github.com/palantir/blueprint/issues/5027)
        const hasVerticalOverflow = this.locator.hasVerticalOverflow(this.columnHeaderHeight, viewportRect);
        const rowIndices = this.grid.getRowIndicesInRect(viewportRect, hasVerticalOverflow ? false : enableGhostCells);

        const rowIndexStart = showFrozenRowsOnly ? 0 : rowIndices.rowIndexStart;
        const rowIndexEnd = showFrozenRowsOnly ? this.getMaxFrozenRowIndex() : rowIndices.rowIndexEnd;

        return (
            <div className={classes} ref={refHandler}>
                <RowHeader
                    defaultRowHeight={defaultRowHeight!}
                    enableMultipleSelection={enableMultipleSelection}
                    focusedCell={focusedCell}
                    grid={this.grid}
                    locator={this.locator}
                    isReorderable={enableRowReordering}
                    isResizable={enableRowResizing}
                    loading={hasLoadingOption(loadingOptions, TableLoadingOption.ROW_HEADERS)}
                    maxRowHeight={maxRowHeight!}
                    minRowHeight={minRowHeight!}
                    onFocusedCell={this.handleFocus}
                    onLayoutLock={this.handleLayoutLock}
                    onMount={this.handleHeaderMounted}
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
            return undefined;
        }

        const { id, cellRenderer, columnHeaderCellRenderer, name, nameRenderer, ...restColumnProps } = columnProps;

        // HACKHACK: cellRenderer prop has a default value, so we can assert non-null
        const cell = cellRenderer!(rowIndex, columnIndex);
        if (cell === undefined) {
            return undefined;
        }

        const inheritedIsLoading =
            hasLoadingOption(columnProps.loadingOptions, ColumnLoadingOption.CELLS) ||
            hasLoadingOption(this.props.loadingOptions, TableLoadingOption.CELLS);

        return React.cloneElement(cell, {
            ...restColumnProps,
            loading: cell.props.loading ?? inheritedIsLoading,
        });
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

        if (this.grid === null || this.locator === undefined || viewportRect === undefined) {
            return undefined;
        }

        // if we have vertical/horizontal overflow, no need to render ghost rows/columns (respectively)
        // (this avoids problems like https://github.com/palantir/blueprint/issues/5027)
        const hasVerticalOverflow = this.locator.hasVerticalOverflow(this.columnHeaderHeight, viewportRect);
        const hasHorizontalOverflow = this.locator.hasHorizontalOverflow(this.rowHeaderWidth, viewportRect);
        const rowIndices = this.grid.getRowIndicesInRect(viewportRect, hasVerticalOverflow ? false : enableGhostCells);
        const columnIndices = this.grid.getColumnIndicesInRect(
            viewportRect,
            hasHorizontalOverflow ? false : enableGhostCells,
        );

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
                    loading={hasLoadingOption(loadingOptions, TableLoadingOption.CELLS)}
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

    private isGuideLayerShowing() {
        return this.state.verticalGuides.length > 0 || this.state.horizontalGuides.length > 0;
    }

    private getEnabledSelectionHandler = (selectionMode: RegionCardinality) => {
        if (!isSelectionModeEnabled(this.props as TablePropsWithDefaults, selectionMode)) {
            // If the selection mode isn't enabled, return a callback that
            // will clear the selection. For example, if row selection is
            // disabled, clicking on the row header will clear the table's
            // selection. If all selection modes are enabled, clicking on the
            // same region twice will clear the selection.
            return this.clearSelection;
        } else {
            return this.handleSelection;
        }
    };

    private invalidateGrid() {
        this.grid = null;
    }

    /**
     * This method's arguments allow us to support the following use case:
     * In some cases, we want to update the grid _before_ this.setState() is called with updated
     * `columnWidths` or `rowHeights` so that when that setState update _does_ flush through the React render
     * tree, our TableQuadrantStack has the correct updated grid measurements.
     */
    private validateGrid({ columnWidths, rowHeights }: Partial<Pick<TableState, "columnWidths" | "rowHeights">> = {}) {
        if (this.grid == null || columnWidths !== undefined || rowHeights !== undefined) {
            const { defaultRowHeight, defaultColumnWidth, numFrozenColumns } = this.props;

            // gridBleed should always be >= numFrozenColumns since columnIndexStart adds numFrozenColumns
            const gridBleed = Math.max(Grid.DEFAULT_BLEED, numFrozenColumns!);
            this.grid = new Grid(
                rowHeights ?? this.state.rowHeights,
                columnWidths ?? this.state.columnWidths,
                gridBleed,
                defaultRowHeight,
                defaultColumnWidth,
            );
            this.invokeOnVisibleCellsChangeCallback(this.state.viewportRect!);
            this.hotkeysImpl.setGrid(this.grid);
        }
        return this.grid;
    }

    /**
     * Renders a `RegionLayer`, applying styles to the regions using the
     * supplied `RegionStyler`. `RegionLayer` is a pure component, so
     * the `RegionStyler` should be a new instance on every render if we
     * intend to redraw the region layer.
     */
    private maybeRenderRegions(getRegionStyle: RegionStyler, quadrantType?: QuadrantType) {
        if (this.isGuideLayerShowing() && !this.state.isReordering) {
            // we want to show guides *and* the selection styles when reordering rows or columns
            return undefined;
        }

        const regionGroups = Regions.joinStyledRegionGroups(
            this.state.selectedRegions,
            this.props.styledRegionGroups ?? [],
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

    private handleHeaderMounted = (whichHeader: "column" | "row") => {
        const { didHeadersMount } = this.state;
        if (didHeadersMount) {
            return;
        }

        if (whichHeader === "column") {
            this.didColumnHeaderMount = true;
        } else {
            this.didRowHeaderMount = true;
        }

        if (this.didColumnHeaderMount && this.didRowHeaderMount) {
            this.setState({ didHeadersMount: true });
        }
    };

    private handleCompleteRender = () => {
        // The first onCompleteRender is triggered before the viewportRect is
        // defined and the second after the viewportRect has been set. The cells
        // will only actually render once the viewportRect is defined though, so
        // we defer invoking onCompleteRender until that check passes.

        // Additional note: we run into an unfortunate race condition between the order of execution
        // of this callback and this.handleHeaderMounted(...). The setState() call in the latter
        // does not update this.state quickly enough for us to query for the new state here, so instead
        // we read the private member variables which are the dependent parts of that "didHeadersMount"
        // state.
        const didHeadersMount = this.didColumnHeaderMount && this.didRowHeaderMount;
        if (this.state.viewportRect != null && didHeadersMount) {
            this.props.onCompleteRender?.();
            this.didCompletelyMount = true;
        }
    };

    private styleBodyRegion = (region: Region, quadrantType?: QuadrantType): React.CSSProperties => {
        const { numFrozenColumns } = this.props;

        if (this.grid == null) {
            return {};
        }

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

    private styleMenuRegion = (region: Region): React.CSSProperties => {
        const { viewportRect } = this.state;
        if (this.grid == null || viewportRect == null) {
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

    private styleColumnHeaderRegion = (region: Region): React.CSSProperties => {
        const { viewportRect } = this.state;
        if (this.grid == null || viewportRect == null) {
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

    private styleRowHeaderRegion = (region: Region): React.CSSProperties => {
        const { viewportRect } = this.state;
        if (this.grid == null || viewportRect == null) {
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

        this.validateGrid({ columnWidths });
        this.setState({ columnWidths });
        this.props.onColumnWidthChanged?.(columnIndex, width);
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

        this.validateGrid({ rowHeights });
        this.setState({ rowHeights });
        this.props.onRowHeightChanged?.(rowIndex, height);
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
        // Prevent the event from propagating to avoid a resize event on the resize sensor.
        event.stopPropagation();

        if (this.locator != null && !this.state.isLayoutLocked) {
            const newViewportRect = this.locator.getViewportRect();
            this.updateViewportRect(newViewportRect);
        }
    };

    private clearSelection = (_selectedRegions: Region[]) => {
        this.handleSelection([]);
    };

    private syncViewportPosition = ({ nextScrollLeft, nextScrollTop }: TableSnapshot) => {
        const { viewportRect } = this.state;

        if (this.scrollContainerElement == null || this.columnHeaderElement == null || viewportRect === undefined) {
            return;
        }

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

            const nextViewportRect = new Rect(
                nextScrollLeft ?? 0,
                nextScrollTop ?? 0,
                viewportRect.width,
                viewportRect.height,
            );
            this.updateViewportRect(nextViewportRect);
        }
    };

    private handleFocus = (focusedCell: FocusedCellCoordinates) => {
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

    private handleSelection = (selectedRegions: Region[]) => {
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
        this.setState({ isReordering: false, verticalGuides: [] });
        this.props.onColumnsReordered?.(oldIndex, newIndex, length);
    };

    private handleRowsReordering = (horizontalGuides: number[]) => {
        this.setState({ isReordering: true, horizontalGuides });
    };

    private handleRowsReordered = (oldIndex: number, newIndex: number, length: number) => {
        this.setState({ isReordering: false, horizontalGuides: [] });
        this.props.onRowsReordered?.(oldIndex, newIndex, length);
    };

    private handleLayoutLock = (isLayoutLocked = false) => {
        this.setState({ isLayoutLocked });
    };

    private updateLocator() {
        if (this.locator === undefined || this.grid == null) {
            return;
        }

        this.locator
            .setGrid(this.grid)
            .setNumFrozenRows(this.state.numFrozenRowsClamped)
            .setNumFrozenColumns(this.state.numFrozenColumnsClamped);
    }

    private updateViewportRect = (nextViewportRect: Rect | undefined) => {
        if (nextViewportRect === undefined) {
            return;
        }

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
        if (this.grid == null) {
            return;
        }
        const columnIndices = this.grid.getColumnIndicesInRect(viewportRect);
        const rowIndices = this.grid.getRowIndicesInRect(viewportRect);
        this.props.onVisibleCellsChange?.(rowIndices, columnIndices);
    }

    private getMaxFrozenColumnIndex = () => {
        return this.state.numFrozenColumnsClamped - 1;
    };

    private getMaxFrozenRowIndex = () => {
        return this.state.numFrozenRowsClamped - 1;
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
}
