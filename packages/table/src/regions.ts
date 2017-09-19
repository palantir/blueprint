/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IFocusedCellCoordinates } from "./common/cell";
import * as Classes from "./common/classes";
import { Utils } from "./common/utils";

/**
 * `Region`s contain sets of cells. Additionally, a distinction is drawn, for
 * example, between all cells within a column and the whole column itself.
 * The `RegionCardinality` enum represents these distinct types of `Region`s.
 */
export enum RegionCardinality {
    /**
     * A region that contains a finite rectangular group of table cells
     */
    CELLS,

    /**
     * A region that represents all cells within 1 or more rows.
     */
    FULL_ROWS,

    /**
     * A region that represents all cells within 1 or more columns.
     */
    FULL_COLUMNS,

    /**
     * A region that represents all cells in the table.
     */
    FULL_TABLE,
}

/**
 * A convenience object for subsets of `RegionCardinality` that are commonly
 * used as the `selectionMode` prop of the `<Table>`.
 */
export const SelectionModes = {
    ALL: [
        RegionCardinality.FULL_TABLE,
        RegionCardinality.FULL_COLUMNS,
        RegionCardinality.FULL_ROWS,
        RegionCardinality.CELLS,
    ],
    COLUMNS_AND_CELLS: [RegionCardinality.FULL_COLUMNS, RegionCardinality.CELLS],
    COLUMNS_ONLY: [RegionCardinality.FULL_COLUMNS],
    NONE: [] as RegionCardinality[],
    ROWS_AND_CELLS: [RegionCardinality.FULL_ROWS, RegionCardinality.CELLS],
    ROWS_ONLY: [RegionCardinality.FULL_ROWS],
};

export type ColumnLoadingOption = "cells" | "column-header";
export const ColumnLoadingOption = {
    CELLS: "cells" as ColumnLoadingOption,
    HEADER: "column-header" as ColumnLoadingOption,
};

export type RowLoadingOption = "cells" | "row-header";
export const RowLoadingOption = {
    CELLS: "cells" as RowLoadingOption,
    HEADER: "row-header" as RowLoadingOption,
};

export type TableLoadingOption = ColumnLoadingOption | RowLoadingOption;
export const TableLoadingOption = {
    CELLS: "cells" as TableLoadingOption,
    COLUMN_HEADERS: ColumnLoadingOption.HEADER as TableLoadingOption,
    ROW_HEADERS: RowLoadingOption.HEADER as TableLoadingOption,
};

export interface IStyledRegionGroup {
    className?: string;
    regions: IRegion[];
}

/**
 * An _inclusive_ interval of ZERO-indexed cell indices.
 */
export type ICellInterval = [number, number];

/**
 * Small datastructure for storing cell coordinates [row, column]
 */
export type ICellCoordinate = [number, number];

/**
 * A ZERO-indexed region of cells.
 *
 * @see `Regions.getRegionCardinality` for more about the format of this object.
 */
export interface IRegion {
    rows?: ICellInterval;
    cols?: ICellInterval;
}

export class Regions {
    /**
     * Determines the cardinality of a region. We use null values to indicate
     * an unbounded interval. Therefore, an example of a region containing the
     * second and third columns would be:
     *
     *     {
     *         rows: null,
     *         cols: [1, 2]
     *     }
     *
     * In this case, this method would return `RegionCardinality.FULL_COLUMNS`.
     *
     * If both rows and columns are unbounded, then the region covers the
     * entire table. Therefore, a region like this:
     *
     *     {
     *         rows: null,
     *         cols: null
     *     }
     *
     * will return `RegionCardinality.FULL_TABLE`.
     *
     * An example of a region containing a single cell in the table would be:
     *
     *     {
     *         rows: [5, 5],
     *         cols: [2, 2]
     *     }
     *
     * In this case, this method would return `RegionCardinality.CELLS`.
     */
    public static getRegionCardinality(region: IRegion) {
        if (region.cols != null && region.rows != null) {
            return RegionCardinality.CELLS;
        } else if (region.cols != null) {
            return RegionCardinality.FULL_COLUMNS;
        } else if (region.rows != null) {
            return RegionCardinality.FULL_ROWS;
        } else {
            return RegionCardinality.FULL_TABLE;
        }
    }

    public static getFocusCellCoordinatesFromRegion(region: IRegion) {
        const regionCardinality = Regions.getRegionCardinality(region);

        switch (regionCardinality) {
            case RegionCardinality.FULL_TABLE:
                return { col: 0, row: 0 };
            case RegionCardinality.FULL_COLUMNS:
                return { col: region.cols[0], row: 0 };
            case RegionCardinality.FULL_ROWS:
                return { col: 0, row: region.rows[0] };
            case RegionCardinality.CELLS:
                return { col: region.cols[0], row: region.rows[0] };
            default:
                return null;
        }
    }

    /**
     * Returns a region containing one or more cells.
     */
    public static cell(row: number, col: number, row2?: number, col2?: number): IRegion {
        return {
            cols: this.normalizeInterval(col, col2),
            rows: this.normalizeInterval(row, row2),
        };
    }

    /**
     * Returns a region containing one or more full rows.
     */
    public static row(row: number, row2?: number): IRegion {
        return { rows: this.normalizeInterval(row, row2) };
    }

    /**
     * Returns a region containing one or more full columns.
     */
    public static column(col: number, col2?: number): IRegion {
        return { cols: this.normalizeInterval(col, col2) };
    }

    /**
     * Returns a region containing the entire table.
     */
    public static table(): IRegion {
        return {};
    }

    /**
     * Adds the region to the end of a cloned copy of the supplied region
     * array.
     */
    public static add(regions: IRegion[], region: IRegion) {
        const copy = regions.slice();
        copy.push(region);
        return copy;
    }

    /**
     * Replaces the region at the end of a cloned copy of the supplied region
     * array.
     */
    public static update(regions: IRegion[], region: IRegion) {
        const copy = regions.slice();
        copy.pop();
        copy.push(region);
        return copy;
    }

    /**
     * Returns true iff the specified region is equal to the last region in
     * the region list. This allows us to avoid immediate additive re-selection.
     */
    public static lastRegionIsEqual(regions: IRegion[], region: IRegion) {
        if (regions == null || regions.length === 0) {
            return false;
        }
        const lastRegion = regions[regions.length - 1];
        return Regions.regionsEqual(lastRegion, region);
    }

    /**
     * Returns the index of the region that is equal to the supplied
     * parameter. Returns -1 if no such region is found.
     */
    public static findMatchingRegion(regions: IRegion[], region: IRegion) {
        if (regions == null) {
            return -1;
        }

        for (let i = 0; i < regions.length; i++) {
            if (Regions.regionsEqual(regions[i], region)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Returns the index of the region that wholly contains the supplied
     * parameter. Returns -1 if no such region is found.
     */
    public static findContainingRegion(regions: IRegion[], region: IRegion) {
        if (regions == null) {
            return -1;
        }

        for (let i = 0; i < regions.length; i++) {
            if (Regions.regionContains(regions[i], region)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Returns true if the regions contain a region that has FULL_COLUMNS
     * cardinality and contains the specified column index.
     */
    public static hasFullColumn(regions: IRegion[], col: number) {
        if (regions == null) {
            return false;
        }

        for (const region of regions) {
            const cardinality = Regions.getRegionCardinality(region);
            if (cardinality === RegionCardinality.FULL_TABLE) {
                return true;
            }
            if (cardinality === RegionCardinality.FULL_COLUMNS && Regions.intervalContainsIndex(region.cols, col)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns true if the regions contain a region that has FULL_ROWS
     * cardinality and contains the specified row index.
     */
    public static hasFullRow(regions: IRegion[], row: number) {
        if (regions == null) {
            return false;
        }

        for (const region of regions) {
            const cardinality = Regions.getRegionCardinality(region);
            if (cardinality === RegionCardinality.FULL_TABLE) {
                return true;
            }
            if (cardinality === RegionCardinality.FULL_ROWS && Regions.intervalContainsIndex(region.rows, row)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns true if the regions contain a region that has FULL_TABLE cardinality
     */
    public static hasFullTable(regions: IRegion[]) {
        if (regions == null) {
            return false;
        }

        for (const region of regions) {
            const cardinality = Regions.getRegionCardinality(region);
            if (cardinality === RegionCardinality.FULL_TABLE) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns true if the regions fully contain the query region.
     */
    public static containsRegion(regions: IRegion[], query: IRegion) {
        return Regions.overlapsRegion(regions, query, false);
    }

    /**
     * Returns true if the regions at least partially overlap the query region.
     */
    public static overlapsRegion(regions: IRegion[], query: IRegion, allowPartialOverlap = false) {
        const intervalCompareFn = allowPartialOverlap ? Regions.intervalOverlaps : Regions.intervalContains;

        if (regions == null || query == null) {
            return false;
        }

        for (const region of regions) {
            const cardinality = Regions.getRegionCardinality(region);
            switch (cardinality) {
                case RegionCardinality.FULL_TABLE:
                    return true;
                case RegionCardinality.FULL_COLUMNS:
                    if (intervalCompareFn(region.cols, query.cols)) {
                        return true;
                    }
                    continue;
                case RegionCardinality.FULL_ROWS:
                    if (intervalCompareFn(region.rows, query.rows)) {
                        return true;
                    }
                    continue;
                case RegionCardinality.CELLS:
                    if (intervalCompareFn(region.cols, query.cols) && intervalCompareFn(region.rows, query.rows)) {
                        return true;
                    }
                    continue;
                default:
                    break;
            }
        }

        return false;
    }

    public static eachUniqueFullColumn(regions: IRegion[], iteratee: (col: number) => void) {
        if (regions == null || regions.length === 0 || iteratee == null) {
            return;
        }

        const seen: { [col: number]: boolean } = {};
        regions.forEach((region: IRegion) => {
            if (Regions.getRegionCardinality(region) === RegionCardinality.FULL_COLUMNS) {
                const [start, end] = region.cols;
                for (let col = start; col <= end; col++) {
                    if (!seen[col]) {
                        seen[col] = true;
                        iteratee(col);
                    }
                }
            }
        });
    }

    public static eachUniqueFullRow(regions: IRegion[], iteratee: (row: number) => void) {
        if (regions == null || regions.length === 0 || iteratee == null) {
            return;
        }

        const seen: { [row: number]: boolean } = {};
        regions.forEach((region: IRegion) => {
            if (Regions.getRegionCardinality(region) === RegionCardinality.FULL_ROWS) {
                const [start, end] = region.rows;
                for (let row = start; row <= end; row++) {
                    if (!seen[row]) {
                        seen[row] = true;
                        iteratee(row);
                    }
                }
            }
        });
    }

    /**
     * Using the supplied array of non-contiguous `IRegion`s, this method
     * returns an ordered array of every unique cell that exists in those
     * regions.
     */
    public static enumerateUniqueCells(regions: IRegion[], numRows: number, numCols: number): ICellCoordinate[] {
        if (regions == null || regions.length === 0) {
            return [];
        }

        const seen: { [key: string]: boolean } = {};
        const list: ICellCoordinate[] = [];
        for (const region of regions) {
            Regions.eachCellInRegion(region, numRows, numCols, (row: number, col: number) => {
                // add to list if not seen
                const key = `${row}-${col}`;
                if (seen[key] !== true) {
                    seen[key] = true;
                    list.push([row, col]);
                }
            });
        }

        // sort list by rows then columns
        list.sort(Regions.rowFirstComparator);
        return list;
    }

    /**
     * Using the supplied region, returns an "equivalent" region of
     * type CELLS that define the bounds of the given region
     */
    public static getCellRegionFromRegion(region: IRegion, numRows: number, numCols: number) {
        const regionCardinality = Regions.getRegionCardinality(region);

        switch (regionCardinality) {
            case RegionCardinality.FULL_TABLE:
                return Regions.cell(0, 0, numRows - 1, numCols - 1);
            case RegionCardinality.FULL_COLUMNS:
                return Regions.cell(0, region.cols[0], numRows - 1, region.cols[1]);
            case RegionCardinality.FULL_ROWS:
                return Regions.cell(region.rows[0], 0, region.rows[1], numCols - 1);
            case RegionCardinality.CELLS:
                return Regions.cell(region.rows[0], region.cols[0], region.rows[1], region.cols[1]);
            default:
                return null;
        }
    }

    /**
     * Maps a dense array of cell coordinates to a sparse 2-dimensional array
     * of cell values.
     *
     * We create a new 2-dimensional array representing the smallest single
     * contiguous `IRegion` that contains all cells in the supplied array. We
     * invoke the mapper callback only on the cells in the supplied coordinate
     * array and store the result. Returns the resulting 2-dimensional array.
     */
    public static sparseMapCells<T>(cells: ICellCoordinate[], mapper: (row: number, col: number) => T): T[][] {
        const bounds = Regions.getBoundingRegion(cells);
        if (bounds == null) {
            return null;
        }

        const numRows = bounds.rows[1] + 1 - bounds.rows[0];
        const numCols = bounds.cols[1] + 1 - bounds.cols[0];
        const result = Utils.times(numRows, () => new Array<T>(numCols));
        cells.forEach(([row, col]) => {
            result[row - bounds.rows[0]][col - bounds.cols[0]] = mapper(row, col);
        });
        return result;
    }

    /**
     * Returns the smallest single contiguous `IRegion` that contains all cells in the
     * supplied array.
     */
    public static getBoundingRegion(cells: ICellCoordinate[]): IRegion {
        let minRow: number;
        let maxRow: number;
        let minCol: number;
        let maxCol: number;
        for (const [row, col] of cells) {
            minRow = minRow == null || row < minRow ? row : minRow;
            maxRow = maxRow == null || row > maxRow ? row : maxRow;
            minCol = minCol == null || col < minCol ? col : minCol;
            maxCol = maxCol == null || col > maxCol ? col : maxCol;
        }
        if (minRow == null) {
            return null;
        }
        return {
            cols: [minCol, maxCol],
            rows: [minRow, maxRow],
        };
    }

    public static isValid(region: IRegion) {
        if (region == null) {
            return false;
        }
        if (region.rows != null && (region.rows[0] < 0 || region.rows[1] < 0)) {
            return false;
        }
        if (region.cols != null && (region.cols[0] < 0 || region.cols[1] < 0)) {
            return false;
        }
        return true;
    }

    public static isRegionValidForTable(region: IRegion, numRows: number, numCols: number) {
        if (region.rows != null && (region.rows[0] >= numRows || region.rows[1] >= numRows)) {
            return false;
        }
        if (region.cols != null && (region.cols[0] >= numCols || region.cols[1] >= numCols)) {
            return false;
        }
        return true;
    }

    public static joinStyledRegionGroups(
        selectedRegions: IRegion[],
        otherRegions: IStyledRegionGroup[],
        focusedCell: IFocusedCellCoordinates,
    ) {
        let regionGroups: IStyledRegionGroup[] = [];
        if (otherRegions != null) {
            regionGroups = regionGroups.concat(otherRegions);
        }
        if (selectedRegions != null && selectedRegions.length > 0) {
            regionGroups.push({
                className: Classes.TABLE_SELECTION_REGION,
                regions: selectedRegions,
            });
        }

        if (focusedCell != null) {
            regionGroups.push({
                className: Classes.TABLE_FOCUS_REGION,
                regions: [Regions.cell(focusedCell.row, focusedCell.col)],
            });
        }
        return regionGroups;
    }

    public static regionsEqual(regionA: IRegion, regionB: IRegion) {
        return Regions.intervalsEqual(regionA.rows, regionB.rows) && Regions.intervalsEqual(regionA.cols, regionB.cols);
    }

    /**
     * Expands an old region to the minimal bounding region that also contains
     * the new region. If the regions have different cardinalities, then the new
     * region is returned. Useful for expanding a selected region on
     * shift+click, for instance.
     */
    public static expandRegion(oldRegion: IRegion, newRegion: IRegion): IRegion {
        const oldRegionCardinality = Regions.getRegionCardinality(oldRegion);
        const newRegionCardinality = Regions.getRegionCardinality(newRegion);

        if (newRegionCardinality !== oldRegionCardinality) {
            return newRegion;
        }

        switch (newRegionCardinality) {
            case RegionCardinality.FULL_ROWS: {
                const rowStart = Math.min(oldRegion.rows[0], newRegion.rows[0]);
                const rowEnd = Math.max(oldRegion.rows[1], newRegion.rows[1]);
                return Regions.row(rowStart, rowEnd);
            }
            case RegionCardinality.FULL_COLUMNS: {
                const colStart = Math.min(oldRegion.cols[0], newRegion.cols[0]);
                const colEnd = Math.max(oldRegion.cols[1], newRegion.cols[1]);
                return Regions.column(colStart, colEnd);
            }
            case RegionCardinality.CELLS: {
                const rowStart = Math.min(oldRegion.rows[0], newRegion.rows[0]);
                const colStart = Math.min(oldRegion.cols[0], newRegion.cols[0]);
                const rowEnd = Math.max(oldRegion.rows[1], newRegion.rows[1]);
                const colEnd = Math.max(oldRegion.cols[1], newRegion.cols[1]);
                return Regions.cell(rowStart, colStart, rowEnd, colEnd);
            }
            default:
                return Regions.table();
        }
    }

    /**
     * Iterates over the cells within an `IRegion`, invoking the callback with
     * each cell's coordinates.
     */
    private static eachCellInRegion(
        region: IRegion,
        numRows: number,
        numCols: number,
        iteratee: (row: number, col: number) => void,
    ) {
        const cardinality = Regions.getRegionCardinality(region);
        switch (cardinality) {
            case RegionCardinality.FULL_TABLE:
                for (let row = 0; row < numRows; row++) {
                    for (let col = 0; col < numCols; col++) {
                        iteratee(row, col);
                    }
                }
                break;
            case RegionCardinality.FULL_COLUMNS:
                for (let row = 0; row < numRows; row++) {
                    for (let col = region.cols[0]; col <= region.cols[1]; col++) {
                        iteratee(row, col);
                    }
                }
                break;
            case RegionCardinality.FULL_ROWS:
                for (let row = region.rows[0]; row <= region.rows[1]; row++) {
                    for (let col = 0; col < numCols; col++) {
                        iteratee(row, col);
                    }
                }
                break;
            case RegionCardinality.CELLS:
                for (let row = region.rows[0]; row <= region.rows[1]; row++) {
                    for (let col = region.cols[0]; col <= region.cols[1]; col++) {
                        iteratee(row, col);
                    }
                }
                break;
            default:
                break;
        }
    }

    private static regionContains(regionA: IRegion, regionB: IRegion) {
        // containsRegion expects an array of regions as the first param
        return Regions.overlapsRegion([regionA], regionB, false);
    }

    private static intervalsEqual(ivalA: ICellInterval, ivalB: ICellInterval) {
        if (ivalA == null) {
            return ivalB == null;
        } else if (ivalB == null) {
            return false;
        } else {
            return ivalA[0] === ivalB[0] && ivalA[1] === ivalB[1];
        }
    }

    private static intervalContainsIndex(interval: ICellInterval, index: number) {
        if (interval == null) {
            return false;
        }
        return interval[0] <= index && interval[1] >= index;
    }

    private static intervalContains(ivalA: ICellInterval, ivalB: ICellInterval) {
        if (ivalA == null || ivalB == null) {
            return false;
        }
        return ivalA[0] <= ivalB[0] && ivalB[1] <= ivalA[1];
    }

    private static intervalOverlaps(ivalA: ICellInterval, ivalB: ICellInterval) {
        if (ivalA == null || ivalB == null) {
            return false;
        }
        if (ivalA[1] < ivalB[0] || ivalA[0] > ivalB[1]) {
            return false;
        }
        return true;
    }

    private static rowFirstComparator(a: ICellCoordinate, b: ICellCoordinate) {
        const rowDiff = a[0] - b[0];
        return rowDiff === 0 ? a[1] - b[1] : rowDiff;
    }

    private static numericalComparator(a: number, b: number) {
        return a - b;
    }

    private static normalizeInterval(coord: number, coord2?: number) {
        if (coord2 == null) {
            coord2 = coord;
        }

        const interval = [coord, coord2];
        interval.sort(Regions.numericalComparator);
        return interval as ICellInterval;
    }
}
