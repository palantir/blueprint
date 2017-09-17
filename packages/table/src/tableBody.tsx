/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { ICellCoordinates } from "./common/cell";
import * as Classes from "./common/classes";
import { ContextMenuTargetWrapper } from "./common/contextMenuTargetWrapper";
import { Rect } from "./common/rect";
import { RenderMode } from "./common/renderMode";
import { Utils } from "./common/utils";
import { ICoordinateData } from "./interactions/draggable";
import { IContextMenuRenderer, MenuContext } from "./interactions/menus";
import { DragSelectable, ISelectableProps } from "./interactions/selectable";
import { ILocator } from "./locator";
import { IRegion, Regions } from "./regions";
import { ITableBodyCellsProps, TableBodyCells } from "./tableBodyCells";

export interface ITableBodyProps extends ISelectableProps, ITableBodyCellsProps {
    /**
     * Locates the row/column/cell given a mouse event.
     */
    locator: ILocator;

    /**
     * The number of columns to freeze to the left side of the table, counting from the leftmost column.
     */
    numFrozenColumns?: number;

    /**
     * The number of rows to freeze to the top of the table, counting from the topmost row.
     */
    numFrozenRows?: number;

    /**
     * The `Rect` bounds of the visible viewport with respect to its parent
     * scrollable pane.
     */
    viewportRect: Rect;

    /**
     * An optional callback for displaying a context menu when right-clicking
     * on the table body. The callback is supplied with an `IMenuContext`
     * containing the `IRegion`s of interest.
     */
    renderBodyContextMenu?: IContextMenuRenderer;
}

const SHALLOW_COMPARE_BLACKLIST: Array<keyof ITableBodyProps> = ["selectedRegions", "viewportRect"];

const DEEP_COMPARE_WHITELIST: Array<keyof ITableBodyProps> = [
    "selectedRegions",
    // viewportRect is not a plain object, so we need more nuanced logic to compare it.
];

export class TableBody extends React.Component<ITableBodyProps, {}> {
    public static defaultProps = {
        loading: false,
        renderMode: RenderMode.BATCH,
    };

    private activationCell: ICellCoordinates;

    public shouldComponentUpdate(nextProps: ITableBodyProps) {
        return (
            !Utils.shallowCompareKeys(this.props, nextProps, { exclude: SHALLOW_COMPARE_BLACKLIST }) ||
            !Utils.deepCompareKeys(this.props, nextProps, DEEP_COMPARE_WHITELIST) ||
            !nextProps.viewportRect.equals(this.props.viewportRect)
        );
    }

    public render() {
        const {
            allowMultipleSelection,
            cellRenderer,
            columnIndexEnd,
            columnIndexStart,
            focusedCell,
            grid,
            loading,
            numFrozenColumns,
            numFrozenRows,
            onCompleteRender,
            onFocus,
            onSelection,
            renderMode,
            rowIndexEnd,
            rowIndexStart,
            selectedRegions,
            selectedRegionTransform,
        } = this.props;

        const defaultStyle = grid.getRect().sizeStyle();

        const style = {
            height: numFrozenRows != null ? grid.getCumulativeHeightAt(numFrozenRows - 1) : defaultStyle.height,
            width: numFrozenColumns != null ? grid.getCumulativeWidthAt(numFrozenColumns - 1) : defaultStyle.width,
        };

        return (
            <DragSelectable
                allowMultipleSelection={allowMultipleSelection}
                focusedCell={focusedCell}
                locateClick={this.locateClick}
                locateDrag={this.locateDrag}
                onFocus={onFocus}
                onSelection={onSelection}
                onSelectionEnd={this.handleSelectionEnd}
                selectedRegions={selectedRegions}
                selectedRegionTransform={selectedRegionTransform}
            >
                <ContextMenuTargetWrapper
                    className={classNames(Classes.TABLE_BODY_VIRTUAL_CLIENT, Classes.TABLE_CELL_CLIENT)}
                    renderContextMenu={this.renderContextMenu}
                    style={style}
                >
                    <TableBodyCells
                        cellRenderer={cellRenderer}
                        grid={grid}
                        loading={loading}
                        onCompleteRender={onCompleteRender}
                        renderMode={renderMode}
                        columnIndexStart={columnIndexStart}
                        columnIndexEnd={columnIndexEnd}
                        rowIndexStart={rowIndexStart}
                        rowIndexEnd={rowIndexEnd}
                    />
                </ContextMenuTargetWrapper>
            </DragSelectable>
        );
    }

    public renderContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        const { grid, onFocus, onSelection, renderBodyContextMenu, selectedRegions } = this.props;
        const { numRows, numCols } = grid;

        if (renderBodyContextMenu == null) {
            return undefined;
        }

        const targetRegion = this.locateClick(e.nativeEvent as MouseEvent);

        let nextSelectedRegions: IRegion[] = selectedRegions;

        // if the event did not happen within a selected region, clear all
        // selections and select the right-clicked cell.
        const foundIndex = Regions.findContainingRegion(selectedRegions, targetRegion);
        if (foundIndex < 0) {
            nextSelectedRegions = [targetRegion];
            onSelection(nextSelectedRegions);

            // move the focused cell to the new region.
            const nextFocusedCell = {
                ...Regions.getFocusCellCoordinatesFromRegion(targetRegion),
                focusSelectionIndex: 0,
            };
            onFocus(nextFocusedCell);
        }

        const menuContext = new MenuContext(targetRegion, nextSelectedRegions, numRows, numCols);
        const contextMenu = renderBodyContextMenu(menuContext);

        return contextMenu == null ? undefined : contextMenu;
    };

    // Callbacks
    // =========

    private handleSelectionEnd = () => {
        this.activationCell = null; // not strictly required, but good practice
    };

    private locateClick = (event: MouseEvent) => {
        this.activationCell = this.props.locator.convertPointToCell(event.clientX, event.clientY);
        return Regions.cell(this.activationCell.row, this.activationCell.col);
    };

    private locateDrag = (_event: MouseEvent, coords: ICoordinateData, returnEndOnly = false) => {
        const start = this.activationCell;
        const end = this.props.locator.convertPointToCell(coords.current[0], coords.current[1]);
        return returnEndOnly ? Regions.cell(end.row, end.col) : Regions.cell(start.row, start.col, end.row, end.col);
    };
}
