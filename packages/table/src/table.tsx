/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { AbstractComponent, IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { ICellProps } from "./cell/cell";
import { Column, IColumnProps } from "./column";
import { Grid } from "./common/grid";
import { Rect } from "./common/rect";
import { Utils } from "./common/utils";
import { ColumnHeader, IColumnWidths } from "./headers/columnHeader";
import { ColumnHeaderCell } from "./headers/columnHeaderCell";
import { IRowHeaderRenderer, IRowHeights, renderDefaultRowHeader, RowHeader } from "./headers/rowHeader";
import { IContextMenuRenderer } from "./interactions/menus";
import { IIndexedResizeCallback } from "./interactions/resizable";
import { ResizeSensor } from "./interactions/resizeSensor";
import { ISelectedRegionTransform } from "./interactions/selectable";
import { GuideLayer } from "./layers/guides";
import { IRegionStyler, RegionLayer } from "./layers/regions";
import { Locator } from "./locator";
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

export interface ITableProps extends IProps, IRowHeights, IColumnWidths {
    /**
     * If `false`, only a single region of a single column/row/cell may be
     * selected at one time. Using <kbd class="pt-key">ctrl</kbd> or
     * <kbd class="pt-key">meta</kbd> key will have no effect,
     * and a mouse drag will select the current column/row/cell only.
     * @default true
     */
    allowMultipleSelection?: boolean;

    /**
     * The children of a `Table` component, which must be React elements
     * that use `IColumnProps`.
     */
    children?: React.ReactElement<IColumnProps>;

    /**
     * If true, empty space in the table container will be filled with empty
     * cells instead of a blank background.
     * @default false
     */
    fillBodyWithGhostCells?: boolean;

    /**
     * If false, disables resizing of columns.
     * @default true
     */
    isColumnResizable?: boolean;

    /**
     * A list of `TableLoadingOption`. Set this prop to specify whether to
     * render the loading state for the column header, row header, and body
     * sections of the table.
     */
    loadingOptions?: TableLoadingOption[];

    /**
     * If resizing is enabled, this callback will be invoked when the user
     * finishes drag-resizing a column.
     */
    onColumnWidthChanged?: IIndexedResizeCallback;

    /**
     * A sparse number array with a length equal to the number of columns. Any
     * non-null value will be used to set the width of the column at the same
     * index. Note that if you want to update these values when the user
     * drag-resizes a column, you may define a callback for `onColumnWidthChanged`.
     */
    columnWidths?: number[];

    /**
     * If false, disables resizing of rows.
     * @default false
     */
    isRowResizable?: boolean;

    /**
     * If resizing is enabled, this callback will be invoked when the user
     * finishes drag-resizing a row.
     */
    onRowHeightChanged?: IIndexedResizeCallback;

    /**
     * A sparse number array with a length equal to the number of rows. Any
     * non-null value will be used to set the height of the row at the same
     * index. Note that if you want to update these values when the user
     * drag-resizes a row, you may define a callback for `onRowHeightChanged`.
     */
    rowHeights?: number[];

    /**
     * If false, hides the row headers and settings menu.
     * @default true
     */
    isRowHeaderShown?: boolean;

    /**
     * A callback called when the selection is changed in the table.
     */
    onSelection?: (selectedRegions: IRegion[]) => void;

    /**
     * Render each row's header cell
     */
    renderRowHeader?: IRowHeaderRenderer;

    /**
     * An optional callback for displaying a context menu when right-clicking
     * on the table body. The callback is supplied with an array of
     * `IRegion`s. If the mouse click was on a selection, the array will
     * contain all selected regions. Otherwise it will have one `IRegion` that
     * represents the clicked cell.
     */
    renderBodyContextMenu?: IContextMenuRenderer;

    /**
     * The number of rows in the table.
     */
    numRows?: number;

    /**
     * If defined, will set the selected regions in the cells. If defined, this
     * changes table selection to "controlled" mode, meaning you in charge of
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
     * ```
     * SelectionModes enum values:
     * ALL
     * NONE
     * COLUMNS_AND_CELLS
     * COLUMNS_ONLY
     * ROWS_AND_CELLS
     * ROWS_ONLY
     * ```
     *
     * ```
     * RegionCardinality enum values:
     * FULL_COLUMNS
     * FULL_ROWS
     * FULL_TABLE
     * CELLS
     * ```
     *
     * @default SelectionModes.ALL
     */
    selectionModes?: RegionCardinality[];

    /**
     * Styled region groups are rendered as overlays above the table and are
     * marked with their own className for custom styling.
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
     * An ILocator object used for locating cells, rows, or columns given
     * client coordinates as well as determining cell bounds given their
     * indices.
     */
    locator?: Locator;

    /**
     * If `true`, will disable updates that will cause re-renders of children
     * components. This is used, for example, to disable layout updates while
     * the user is dragging a resize handle.
     */
    isLayoutLocked?: boolean;

    /**
     * The `Rect` bounds of the viewport used to perform virtual viewport
     * performance enhancements.
     */
    viewportRect?: Rect;

    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a column is being resized.
     */
    verticalGuides?: number[];

    /**
     * An array of pixel offsets for resize guides, which are drawn over the
     * table body when a row is being resized.
     */
    horizontalGuides?: number[];

    /**
     * An array of row heights. These are initialized updated when the user
     * drags row header resize handles.
     */
    rowHeights?: number[];

    /**
     * An array of Regions representing the selections of the table.
     */
    selectedRegions?: IRegion[];
}

@PureRender
export class Table extends AbstractComponent<ITableProps, ITableState> {
    public static defaultProps: ITableProps = {
        allowMultipleSelection: true,
        defaultColumnWidth: 150,
        defaultRowHeight: 20,
        fillBodyWithGhostCells: false,
        isRowHeaderShown: true,
        loadingOptions: [],
        minColumnWidth: 50,
        minRowHeight: 20,
        numRows: 0,
        renderRowHeader: renderDefaultRowHeader,
        selectionModes: SelectionModes.ALL,
    };

    private static createColumnIdIndex(children: Array<React.ReactElement<any>>) {
        const columnIdToIndex: {[key: string]: number} = {};
        for (let i = 0; i < children.length; i++) {
            const key = children[i].props.id;
            if (key != null) {
                columnIdToIndex[String(key)] = i;
            }
        }
        return columnIdToIndex;
    }

    private bodyElement: HTMLElement;
    private childrenArray: Array<React.ReactElement<IColumnProps>>;
    private columnIdToIndex: {[key: string]: number};
    private grid: Grid;
    private menuElement: HTMLElement;
    private resizeSensorDetach: () => void;
    private rootTableElement: HTMLElement;
    private rowHeaderElement: HTMLElement;

    public constructor(props: ITableProps, context?: any) {
        super(props, context);

        const { defaultRowHeight, defaultColumnWidth, numRows, columnWidths, rowHeights, children } = this.props;
        this.childrenArray = React.Children.toArray(children) as Array<React.ReactElement<IColumnProps>>;
        this.columnIdToIndex = Table.createColumnIdIndex(this.childrenArray);

        // Create height/width arrays using the lengths from props and
        // children, the default values from props, and finally any sparse
        // arrays passed into props.
        let newColumnWidths = this.childrenArray.map(() => defaultColumnWidth);
        newColumnWidths = Utils.assignSparseValues(newColumnWidths, columnWidths);
        let newRowHeights = Utils.times(numRows, () => defaultRowHeight);
        newRowHeights = Utils.assignSparseValues(newRowHeights, rowHeights);

        const selectedRegions = (props.selectedRegions == null) ? [] as IRegion[] : props.selectedRegions;

        this.state = {
            columnWidths: newColumnWidths,
            isLayoutLocked: false,
            rowHeights: newRowHeights,
            selectedRegions,
        };
    }

    public componentWillReceiveProps(nextProps: ITableProps) {
        const {
            defaultRowHeight,
            defaultColumnWidth,
            columnWidths,
            rowHeights,
            children,
            numRows,
            selectedRegions,
        } = nextProps;
        const newChildArray = React.Children.toArray(children) as Array<React.ReactElement<IColumnProps>>;

        // Try to maintain widths of columns by looking up the width of the
        // column that had the same `ID` prop. If none is found, use the
        // previous width at the same index.
        let previousColumnWidths = newChildArray.map((child: React.ReactElement<IColumnProps>, index: number) => {
            const mappedIndex = this.columnIdToIndex[child.props.id];
            return this.state.columnWidths[mappedIndex != null ? mappedIndex : index];
        });

        // Make sure the width/height arrays have the correct length, but keep
        // as many existing widths/heights when possible. Also, apply the
        // sparse width/heights from props.
        let newColumnWidths = this.state.columnWidths;
        newColumnWidths = Utils.arrayOfLength(newColumnWidths, newChildArray.length, defaultColumnWidth);
        newColumnWidths = Utils.assignSparseValues(newColumnWidths, previousColumnWidths);
        newColumnWidths = Utils.assignSparseValues(newColumnWidths, columnWidths);

        let newRowHeights = this.state.rowHeights;
        newRowHeights = Utils.arrayOfLength(newRowHeights, numRows, defaultRowHeight);
        newRowHeights = Utils.assignSparseValues(newRowHeights, rowHeights);

        const newSelectedRegions = (selectedRegions == null) ? this.state.selectedRegions : selectedRegions;

        this.childrenArray = newChildArray;
        this.columnIdToIndex = Table.createColumnIdIndex(this.childrenArray);
        this.invalidateGrid();
        this.setState({
            columnWidths: newColumnWidths,
            rowHeights: newRowHeights,
            selectedRegions: newSelectedRegions,
        });
    }

    public render() {
        const { isRowHeaderShown } = this.props;
        this.validateGrid();
        return (
            <div className="bp-table-container" ref={this.setRootTableRef} onScroll={this.handleRootScroll}>
                 <div className="bp-table-top-container">
                    {isRowHeaderShown ? this.renderMenu() : undefined}
                    {this.renderColumnHeader()}
                </div>
                <div className="bp-table-bottom-container">
                    {isRowHeaderShown ? this.renderRowHeader() : undefined}
                    {this.renderBody()}
                </div>
            </div>
        );
    }

    /**
     * When the component mounts, the HTML Element refs will be available, so
     * we constructor the Locator, which queries the elements' bounding
     * ClientRects.
     */
    public componentDidMount() {
        this.validateGrid();
        const locator = new Locator(
            this.rootTableElement,
            this.bodyElement,
            this.grid,
        );

        const viewportRect = locator.getViewportRect();
        this.setState({ locator, viewportRect });

        this.resizeSensorDetach = ResizeSensor.attach(this.rootTableElement, () => {
            if (!this.state.isLayoutLocked) {
                this.setState({ viewportRect: locator.getViewportRect() });
            }
        });

        this.syncMenuWidth();
    }

    public componentWillUnmount() {
        if (this.resizeSensorDetach != null) {
            this.resizeSensorDetach();
            delete this.resizeSensorDetach;
        }
    }

    public componentDidUpdate() {
        const { locator } = this.state;
        if (locator != null) {
            this.validateGrid();
            locator.setGrid(this.grid);
        }

        this.syncMenuWidth();
    }

    protected validateProps(props: ITableProps & { children: React.ReactNode }) {
        const ERROR_MESSAGE = "Children of Table must be Columns";
        React.Children.forEach(props.children, (child: React.ReactElement<any>) => {
            // save as a variable so that union type narrowing works
            const cType = child.type;

            if (typeof cType === "string") {
                throw new Error(ERROR_MESSAGE);
            } else {
                const isColumn = cType.prototype === Column.prototype || Column.prototype.isPrototypeOf(cType);
                if (!isColumn) {
                    throw new Error(ERROR_MESSAGE);
                }
            }
        });
    }

    private renderMenu() {
        return (
            <div
                className="bp-table-menu"
                ref={this.setMenuRef}
            />
        );
    }

    private syncMenuWidth() {
        const { menuElement, rowHeaderElement } = this;
        if (menuElement != null && rowHeaderElement != null) {
            const width = rowHeaderElement.getBoundingClientRect().width;
            menuElement.style.width = `${width}px`;
        }
    }

    private getColumnProps(columnIndex: number) {
        const column = this.childrenArray[columnIndex] as React.ReactElement<IColumnProps>;
        return column.props;
    }

    private columnHeaderCellRenderer = (columnIndex: number) => {
        const props = this.getColumnProps(columnIndex);
        const loading = this.hasLoadingOption(props.loadingOptions, ColumnLoadingOption.HEADER);
        const { renderColumnHeader } = props;
        if (renderColumnHeader != null) {
            return renderColumnHeader(columnIndex);
        } else if (props.name != null) {
            return <ColumnHeaderCell {...props} loading={loading} />;
        } else {
            return <ColumnHeaderCell {...props} loading={loading} name={Utils.toBase26Alpha(columnIndex)} />;
        }
    }

    private renderColumnHeader() {
        const { grid } = this;
        const { locator, selectedRegions, viewportRect } = this.state;
        const {
            allowMultipleSelection,
            fillBodyWithGhostCells,
            isColumnResizable,
            loadingOptions,
            maxColumnWidth,
            minColumnWidth,
            selectedRegionTransform,
        } = this.props;
        const classes = classNames("bp-table-column-headers", {
            "bp-table-selection-enabled": this.isSelectionModeEnabled(RegionCardinality.FULL_COLUMNS),
        });
        const columnIndices = grid.getColumnIndicesInRect(viewportRect, fillBodyWithGhostCells);

        return (
            <div className={classes}>
                <ColumnHeader
                    allowMultipleSelection={allowMultipleSelection}
                    cellRenderer={this.columnHeaderCellRenderer}
                    grid={grid}
                    isResizable={isColumnResizable}
                    loading={this.hasLoadingOption(loadingOptions, TableLoadingOption.COLUMN_HEADERS)}
                    locator={locator}
                    maxColumnWidth={maxColumnWidth}
                    minColumnWidth={minColumnWidth}
                    onColumnWidthChanged={this.handleColumnWidthChanged}
                    onLayoutLock={this.handleLayoutLock}
                    onResizeGuide={this.handleColumnResizeGuide}
                    onSelection={this.getEnabledSelectionHandler(RegionCardinality.FULL_COLUMNS)}
                    selectedRegions={selectedRegions}
                    selectedRegionTransform={selectedRegionTransform}
                    viewportRect={viewportRect}
                    {...columnIndices}
                >
                    {this.props.children}
                </ColumnHeader>

                {this.maybeRenderColumnHeaderRegions()}
            </div>
        );
    }

    private renderRowHeader() {
        const { grid } = this;
        const { locator, selectedRegions, viewportRect } = this.state;
        const {
            allowMultipleSelection,
            fillBodyWithGhostCells,
            isRowResizable,
            loadingOptions,
            maxRowHeight,
            minRowHeight,
            renderRowHeader,
            selectedRegionTransform,
        } = this.props;
        const classes = classNames("bp-table-row-headers", {
            "bp-table-selection-enabled": this.isSelectionModeEnabled(RegionCardinality.FULL_ROWS),
        });
        const rowIndices = grid.getRowIndicesInRect(viewportRect, fillBodyWithGhostCells);
        return (
            <div
                className={classes}
                ref={this.setRowHeaderRef}
            >
                <RowHeader
                    allowMultipleSelection={allowMultipleSelection}
                    grid={grid}
                    locator={locator}
                    isResizable={isRowResizable}
                    loading={this.hasLoadingOption(loadingOptions, TableLoadingOption.ROW_HEADERS)}
                    maxRowHeight={maxRowHeight}
                    minRowHeight={minRowHeight}
                    onLayoutLock={this.handleLayoutLock}
                    onResizeGuide={this.handleRowResizeGuide}
                    onRowHeightChanged={this.handleRowHeightChanged}
                    onSelection={this.getEnabledSelectionHandler(RegionCardinality.FULL_ROWS)}
                    renderRowHeader={renderRowHeader}
                    selectedRegions={selectedRegions}
                    selectedRegionTransform={selectedRegionTransform}
                    viewportRect={viewportRect}
                    {...rowIndices}
                />

                {this.maybeRenderRowHeaderRegions()}
            </div>
        );
    }

    private bodyCellRenderer = (rowIndex: number, columnIndex: number) => {
        const columnProps = this.getColumnProps(columnIndex);
        const cell = columnProps.renderCell(rowIndex, columnIndex);
        const cellLoading = cell.props.loading;

        let loading: boolean;
        if (cellLoading != null) {
            loading = cellLoading;
        } else {
            loading = this.hasLoadingOption(columnProps.loadingOptions, ColumnLoadingOption.CELLS);
        }

        return React.cloneElement(cell, { loading } as ICellProps);
    }

    private renderBody() {
        const { grid } = this;
        const {
            allowMultipleSelection,
            fillBodyWithGhostCells,
            loadingOptions,
            renderBodyContextMenu,
            selectedRegionTransform,
        } = this.props;
        const { locator, selectedRegions, viewportRect, verticalGuides, horizontalGuides } = this.state;

        const style = grid.getRect().sizeStyle();
        const rowIndices = grid.getRowIndicesInRect(viewportRect, fillBodyWithGhostCells);
        const columnIndices = grid.getColumnIndicesInRect(viewportRect, fillBodyWithGhostCells);
        const noVerticalScroll = fillBodyWithGhostCells &&
            grid.isGhostIndex(rowIndices.rowIndexEnd, 0) &&
            viewportRect != null && viewportRect.top === 0 ||
            this.hasLoadingOption(loadingOptions, TableLoadingOption.ROW_HEADERS);
        const noHorizontalScroll = fillBodyWithGhostCells &&
            grid.isGhostIndex(0, columnIndices.columnIndexEnd) &&
            viewportRect != null && viewportRect.left === 0 ||
            this.hasLoadingOption(loadingOptions, TableLoadingOption.COLUMN_HEADERS);

        // disable scroll for ghost cells
        const classes = classNames("bp-table-body", {
            "bp-table-no-horizontal-scroll": noHorizontalScroll,
            "bp-table-no-vertical-scroll": noVerticalScroll,
            "bp-table-selection-enabled": this.isSelectionModeEnabled(RegionCardinality.CELLS),
        });
        return (
            <div
                className={classes}
                onScroll={this.handleBodyScroll}
                ref={this.setBodyRef}
            >
                <div className="bp-table-body-scroll-client" style={style}>
                    <TableBody
                        allowMultipleSelection={allowMultipleSelection}
                        cellRenderer={this.bodyCellRenderer}
                        grid={grid}
                        loading={this.hasLoadingOption(loadingOptions, TableLoadingOption.CELLS)}
                        locator={locator}
                        onSelection={this.getEnabledSelectionHandler(RegionCardinality.CELLS)}
                        renderBodyContextMenu={renderBodyContextMenu}
                        selectedRegions={selectedRegions}
                        selectedRegionTransform={selectedRegionTransform}
                        viewportRect={viewportRect}
                        {...rowIndices}
                        {...columnIndices}
                    />

                    {this.maybeRenderBodyRegions()}

                    <GuideLayer
                        className="bp-table-resize-guides"
                        verticalGuides={verticalGuides}
                        horizontalGuides={horizontalGuides}
                    />
                </div>

            </div>
        );
    }

    private isGuidesShowing() {
        return this.state.verticalGuides != null || this.state.horizontalGuides != null;
    }

    private isSelectionModeEnabled(selectionMode: RegionCardinality) {
        return this.props.selectionModes.indexOf(selectionMode) >= 0;
    }

    private getEnabledSelectionHandler(selectionMode: RegionCardinality) {
        if (!this.isSelectionModeEnabled(selectionMode)) {
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
            this.grid = new Grid(
                rowHeights,
                columnWidths,
                Grid.DEFAULT_BLEED,
                defaultRowHeight,
                defaultColumnWidth,
            );
        }
    }

    /**
     * Renders a `RegionLayer`, applying styles to the regions using the
     * supplied `IRegionStyler`. `RegionLayer` is a `PureRender` component, so
     * the `IRegionStyler` should be a new instance on every render if we
     * intend to redraw the region layer.
     */
    private maybeRenderRegions(getRegionStyle: IRegionStyler) {
        if (this.isGuidesShowing()) {
            return undefined;
        }

        const regionGroups = Regions.joinStyledRegionGroups(
            this.state.selectedRegions,
            this.props.styledRegionGroups,
        );

        return regionGroups.map((regionGroup, index) => {
            return (
                <RegionLayer
                    className={classNames(regionGroup.className)}
                    key={index}
                    regions={regionGroup.regions}
                    getRegionStyle={getRegionStyle}
                />
            );
        });
    }

    private maybeRenderBodyRegions() {
        const styler = (region: IRegion): React.CSSProperties => {
            const cardinality = Regions.getRegionCardinality(region);
            const style = this.grid.getRegionStyle(region);
            switch (cardinality) {
                case RegionCardinality.CELLS:
                    return style;

                case RegionCardinality.FULL_COLUMNS:
                    style.top = "-1px";
                    return style;

                case RegionCardinality.FULL_ROWS:
                    style.left = "-1px";
                    return style;

                default:
                    return { display: "none" };
            }
        };
        return this.maybeRenderRegions(styler);
    }

    private maybeRenderColumnHeaderRegions() {
        const styler = (region: IRegion): React.CSSProperties => {
            const { grid } = this;
            const { viewportRect } = this.state;
            if (viewportRect == null) {
                return {};
            }
            const cardinality = Regions.getRegionCardinality(region);
            const style = grid.getRegionStyle(region);

            switch (cardinality) {
                case RegionCardinality.FULL_COLUMNS:
                    style.bottom = "-1px";
                    style.transform = `translate3d(${-viewportRect.left}px, 0, 0)`;
                    return style;

                default:
                    return { display: "none" };
            }
        };
        return this.maybeRenderRegions(styler);
    }

    private maybeRenderRowHeaderRegions() {
        const styler = (region: IRegion): React.CSSProperties => {
            const { grid } = this;
            const { viewportRect } = this.state;
            if (viewportRect == null) {
                return {};
            }
            const cardinality = Regions.getRegionCardinality(region);
            const style = grid.getRegionStyle(region);
            switch (cardinality) {
                case RegionCardinality.FULL_ROWS:
                    style.right = "-1px";
                    style.transform = `translate3d(0, ${-viewportRect.top}px, 0)`;
                    return style;

                default:
                    return { display: "none" };
            }
        };
        return this.maybeRenderRegions(styler);
    }

    private handleColumnWidthChanged = (columnIndex: number, width: number) => {
        const columnWidths = this.state.columnWidths.slice();
        columnWidths[columnIndex] = width;
        this.invalidateGrid();
        this.setState({ columnWidths });

        const { onColumnWidthChanged } = this.props;
        if (onColumnWidthChanged != null) {
            onColumnWidthChanged(columnIndex, width);
        }
    }

    private handleRowHeightChanged = (rowIndex: number, height: number) => {
        const rowHeights = this.state.rowHeights.slice();
        rowHeights[rowIndex] = height;
        this.invalidateGrid();
        this.setState({ rowHeights });

        const { onRowHeightChanged } = this.props;
        if (onRowHeightChanged != null) {
            onRowHeightChanged(rowIndex, height);
        }
    }

    private handleRootScroll = (_event: React.UIEvent<HTMLElement>) => {
        // Bug #211 - Native browser text selection events can cause the root
        // element to scroll even though it has a overflow:hidden style. The
        // only viable solution to this is to unscroll the element after the
        // browser scrolls it.
        if (this.rootTableElement != null) {
            this.rootTableElement.scrollLeft = 0;
            this.rootTableElement.scrollTop = 0;
        }
    }

    private handleBodyScroll = (event: React.UIEvent<HTMLElement>) => {
        // Prevent the event from propagating to avoid a resize event on the
        // resize sensor.
        event.stopPropagation();

        const { locator, isLayoutLocked } = this.state;
        if (locator != null && !isLayoutLocked) {
            const viewportRect = locator.getViewportRect();
            this.setState({ viewportRect });
        }
    }

    private handleColumnResizeGuide = (verticalGuides: number[]) => {
        this.setState({ verticalGuides } as ITableState);
    }

    private handleRowResizeGuide = (horizontalGuides: number[]) => {
        this.setState({ horizontalGuides } as ITableState);
    }

    private clearSelection = (_selectedRegions: IRegion[]) => {
        this.handleSelection([]);
    }

    private handleSelection = (selectedRegions: IRegion[]) => {
        // only set selectedRegions state if not specified in props
        if (this.props.selectedRegions == null) {
            this.setState({ selectedRegions } as ITableState);
        }

        const { onSelection } = this.props;
        if (onSelection != null) {
            onSelection(selectedRegions);
        }
    }

    private handleLayoutLock = (isLayoutLocked = false) => {
        this.setState({ isLayoutLocked });
    }

    private hasLoadingOption = (loadingOptions: string[], loadingOption: string) => {
        if (loadingOptions == null) {
            return undefined;
        }
        return loadingOptions.indexOf(loadingOption) >= 0;
    }

    private setBodyRef = (ref: HTMLElement) => this.bodyElement = ref;
    private setMenuRef = (ref: HTMLElement) => this.menuElement = ref;
    private setRootTableRef = (ref: HTMLElement) => this.rootTableElement = ref;
    private setRowHeaderRef = (ref: HTMLElement) => this.rowHeaderElement = ref;

}
