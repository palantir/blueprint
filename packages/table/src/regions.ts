/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

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
        RegionCardinality.FULL_COLUMNS,
        RegionCardinality.FULL_ROWS,
        RegionCardinality.CELLS,
    ],
    COLUMNS_AND_CELLS: [
        RegionCardinality.FULL_COLUMNS,
        RegionCardinality.CELLS,
    ],
    COLUMNS_ONLY: [
        RegionCardinality.FULL_COLUMNS,
    ],
    NONE: [] as RegionCardinality[],
    ROWS_AND_CELLS: [
        RegionCardinality.FULL_ROWS,
        RegionCardinality.CELLS,
    ],
    ROWS_ONLY: [
        RegionCardinality.FULL_ROWS,
    ],
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
     * In this case, this method would return RegionCardinality.FULL_COLUMNS.
     * An example of a region containing a single cell in the table would be:
     *
     *     {
     *         rows: [5, 5],
     *         cols: [2, 2]
     *     }
     *
     * In this case, this method would return RegionCardinality.CELLS.
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
    public static row(row: number, row2?: number): IRegion  {
        return { rows: this.normalizeInterval(row, row2) };
    }

    /**
     * Returns a region containing one or more full columns.
     */
    public static column(col: number, col2?: number): IRegion  {
        return { cols: this.normalizeInterval(col, col2) };
    }

    /**
     * Adds the region to the end of a cloned copy of the supplied region
     * array.
     */
    public static add(regions: IRegion[], region: IRegion) {
        let copy = regions.slice();
        copy.push(region);
        return copy;
    }

    /**
     * Replaces the region at the end of a cloned copy of the supplied region
     * array.
     */
    public static update(regions: IRegion[], region: IRegion) {
        let copy = regions.slice();
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
     * Returns true if the regions contain the query region. The query region
     * may be a subset of the `regions` parameter.
     */
    public static containsRegion(regions: IRegion[], query: IRegion) {
        if (regions == null || query == null) {
            return false;
        }

        for (const region of regions) {
            const cardinality = Regions.getRegionCardinality(region);
            switch (cardinality) {
                case RegionCardinality.FULL_TABLE:
                    return true;
                case RegionCardinality.FULL_COLUMNS:
                    if (Regions.intervalOverlaps(region.cols, query.cols)) {
                        return true;
                    }
                    continue;
                case RegionCardinality.FULL_ROWS:
                    if (Regions.intervalOverlaps(region.rows, query.rows)) {
                        return true;
                    }
                    continue;
                case RegionCardinality.CELLS:
                    if (Regions.intervalOverlaps(region.cols, query.cols)
                        && Regions.intervalOverlaps(region.rows, query.rows)) {
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

        const seen: {[col: number]: boolean} = {};
        regions.forEach((region: IRegion) => {
            if (Regions.getRegionCardinality(region) === RegionCardinality.FULL_COLUMNS) {
                const [ start, end ] = region.cols;
                for (let col = start; col <= end; col++) {
                    if (!seen[col]) {
                        seen[col] = true;
                        iteratee(col);
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
    public static enumerateUniqueCells(
        regions: IRegion[],
        numRows: number,
        numCols: number,
    ): ICellCoordinate[] {

        if (regions == null || regions.length === 0) {
            return [];
        }

        const seen: {[key: string]: boolean} = {};
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
     * Maps a dense array of cell coordinates to a sparse 2-dimensional array
     * of cell values.
     *
     * We create a new 2-dimensional array representing the smallest single
     * contiguous `IRegion` that contains all cells in the supplied array. We
     * invoke the mapper callback only on the cells in the supplied coordinate
     * array and store the result. Returns the resulting 2-dimensional array.
     */
    public static sparseMapCells<T>(
        cells: ICellCoordinate[],
        mapper: (row: number, col: number) => T,
    ): T[][] {
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
            minRow = (minRow == null || row < minRow) ? row : minRow;
            maxRow = (maxRow == null || row > maxRow) ? row : maxRow;
            minCol = (minCol == null || col < minCol) ? col : minCol;
            maxCol = (maxCol == null || col > maxCol) ? col : maxCol;
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
        if ((region.rows != null) && (region.rows[0] < 0 || region.rows[1] < 0)) {
            return false;
        }
        if ((region.cols != null) && (region.cols[0] < 0 || region.cols[1] < 0)) {
            return false;
        }
        return true;
    }

    public static joinStyledRegionGroups(selectedRegions: IRegion[], otherRegions: IStyledRegionGroup[]) {
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
        return regionGroups;
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

    private static regionsEqual(regionA: IRegion, regionB: IRegion) {
        return Regions.intervalsEqual(regionA.rows, regionB.rows)
            && Regions.intervalsEqual(regionA.cols, regionB.cols);
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
