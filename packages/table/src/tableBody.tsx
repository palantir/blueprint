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
import React from "react";

import { AbstractComponent, ContextMenu, ContextMenuContentProps, Utils as CoreUtils } from "@blueprintjs/core";

import { CellCoordinates } from "./common/cell";
import * as Classes from "./common/classes";
import { RenderMode } from "./common/renderMode";
import { CoordinateData } from "./interactions/dragTypes";
import { ContextMenuRenderer, MenuContextImpl } from "./interactions/menus";
import { DragSelectable, SelectableProps } from "./interactions/selectable";
import { Locator } from "./locator";
import { Region, Regions } from "./regions";
import { cellClassNames, TableBodyCellsProps, TableBodyCells } from "./tableBodyCells";

export interface TableBodyProps extends SelectableProps, TableBodyCellsProps {
    /**
     * Whether the body context menu is enabled.
     *
     * @default false
     */
    enableBodyContextMenu?: boolean;

    /**
     * An optional callback for displaying a context menu when right-clicking
     * on the table body. The callback is supplied with an `IMenuContext`
     * containing the `Region`s of interest.
     */
    bodyContextMenuRenderer?: ContextMenuRenderer;

    /**
     * Locates the row/column/cell given a mouse event.
     */
    locator: Locator;

    /**
     * The number of columns to freeze to the left side of the table, counting from the leftmost column.
     */
    numFrozenColumns?: number;

    /**
     * The number of rows to freeze to the top of the table, counting from the topmost row.
     */
    numFrozenRows?: number;
}

const DEEP_COMPARE_KEYS: Array<keyof TableBodyProps> = ["selectedRegions"];

export class TableBody extends AbstractComponent<TableBodyProps> {
    public static defaultProps = {
        enableBodyContextMenu: false,
        loading: false,
        renderMode: RenderMode.BATCH,
    };

    // TODO: Does this method need to be public?
    // (see: https://github.com/palantir/blueprint/issues/1617)
    public static cellClassNames(rowIndex: number, columnIndex: number) {
        return cellClassNames(rowIndex, columnIndex);
    }

    private activationCell: CellCoordinates;

    public shouldComponentUpdate(nextProps: TableBodyProps) {
        return (
            !CoreUtils.shallowCompareKeys(this.props, nextProps, { exclude: DEEP_COMPARE_KEYS }) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, DEEP_COMPARE_KEYS)
        );
    }

    public render() {
        const { enableBodyContextMenu, grid, numFrozenColumns, numFrozenRows } = this.props;

        const defaultStyle = grid.getRect().sizeStyle();
        const style = {
            height: numFrozenRows != null ? grid.getCumulativeHeightAt(numFrozenRows - 1) : defaultStyle.height,
            width: numFrozenColumns != null ? grid.getCumulativeWidthAt(numFrozenColumns - 1) : defaultStyle.width,
        };

        return (
            <DragSelectable
                enableMultipleSelection={this.props.enableMultipleSelection}
                focusedCell={this.props.focusedCell}
                locateClick={this.locateClick}
                locateDrag={this.locateDrag}
                onFocusedCell={this.props.onFocusedCell}
                onSelection={this.props.onSelection}
                onSelectionEnd={this.handleSelectionEnd}
                selectedRegions={this.props.selectedRegions}
                selectedRegionTransform={this.props.selectedRegionTransform}
            >
                <ContextMenu
                    disabled={!enableBodyContextMenu}
                    content={this.renderContextMenu}
                    onContextMenu={this.handleContextMenu}
                >
                    <div
                        className={classNames(Classes.TABLE_BODY_VIRTUAL_CLIENT, Classes.TABLE_CELL_CLIENT)}
                        style={style}
                    >
                        <TableBodyCells
                            cellRenderer={this.props.cellRenderer}
                            focusedCell={this.props.focusedCell}
                            grid={grid}
                            loading={this.props.loading}
                            onCompleteRender={this.props.onCompleteRender}
                            renderMode={this.props.renderMode}
                            columnIndexStart={this.props.columnIndexStart}
                            columnIndexEnd={this.props.columnIndexEnd}
                            rowIndexStart={this.props.rowIndexStart}
                            rowIndexEnd={this.props.rowIndexEnd}
                            viewportRect={this.props.viewportRect}
                        />
                    </div>
                </ContextMenu>
            </DragSelectable>
        );
    }

    private renderContextMenu = ({ mouseEvent }: ContextMenuContentProps) => {
        const { grid, bodyContextMenuRenderer, selectedRegions } = this.props;
        const { numRows, numCols } = grid;

        if (bodyContextMenuRenderer == null || mouseEvent == null) {
            // either context menu is disabled, or it was just closed by the ContextMenu component
            return undefined;
        }

        const targetRegion = this.locateClick(mouseEvent.nativeEvent as MouseEvent);
        let nextSelectedRegions: Region[] = selectedRegions;

        // if the event did not happen within a selected region, update selection info for menu renderer
        const foundIndex = Regions.findContainingRegion(selectedRegions, targetRegion);
        if (foundIndex < 0) {
            nextSelectedRegions = [targetRegion];
        }

        const menuContext = new MenuContextImpl(targetRegion, nextSelectedRegions, numRows, numCols);
        return bodyContextMenuRenderer(menuContext);
    };

    // Callbacks
    // =========

    private handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        const { onFocusedCell, onSelection, selectedRegions } = this.props;
        const targetRegion = this.locateClick(e.nativeEvent as MouseEvent);

        // if the event did not happen within a selected region, clear all
        // selections and select the right-clicked cell.
        const foundIndex = Regions.findContainingRegion(selectedRegions, targetRegion);
        if (foundIndex < 0) {
            // move the focused cell to the new region.
            const nextFocusedCell = {
                ...Regions.getFocusCellCoordinatesFromRegion(targetRegion),
                focusSelectionIndex: 0,
            };
            onSelection([targetRegion]);
            onFocusedCell(nextFocusedCell);
        }
    };

    private handleSelectionEnd = () => {
        this.activationCell = null; // not strictly required, but good practice
    };

    private locateClick = (event: MouseEvent) => {
        this.activationCell = this.props.locator.convertPointToCell(event.clientX, event.clientY);
        return Regions.cell(this.activationCell.row, this.activationCell.col);
    };

    private locateDrag = (_event: MouseEvent, coords: CoordinateData, returnEndOnly = false) => {
        const start = this.activationCell;
        const end = this.props.locator.convertPointToCell(coords.current[0], coords.current[1]);
        return returnEndOnly ? Regions.cell(end.row, end.col) : Regions.cell(start.row, start.col, end.row, end.col);
    };
}
