/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IRegion, RegionCardinality, Regions } from "../../regions";

// Public
// ======

export function getScrollPositionForRegion(
    region: IRegion,
    currScrollLeft: number,
    currScrollTop: number,
    getLeftOffset: (columnIndex: number) => number,
    getTopOffset: (rowIndex: number) => number,
    numFrozenRows: number = 0,
    numFrozenColumns: number = 0,
) {
    const cardinality = Regions.getRegionCardinality(region);

    let nextTop = currScrollTop;
    let nextLeft = currScrollLeft;

    // if these were max-frozen-index values, we would have added 1 before passing to the get*Offset
    // functions, but the counts are already 1-indexed, so we can just pass those.
    const frozenColumnsCumulativeWidth = getLeftOffset(numFrozenColumns);
    const frozenRowsCumulativeHeight = getTopOffset(numFrozenRows);

    if (cardinality === RegionCardinality.CELLS) {
        // scroll to the top-left corner of the block of cells
        const topOffset = getTopOffset(region.rows[0]);
        const leftOffset = getLeftOffset(region.cols[0]);
        nextTop = getAdjustedScrollPosition(topOffset, frozenRowsCumulativeHeight);
        nextLeft = getAdjustedScrollPosition(leftOffset, frozenColumnsCumulativeWidth);
    } else if (cardinality === RegionCardinality.FULL_ROWS) {
        // scroll to the top of the row block
        const topOffset = getTopOffset(region.rows[0]);
        nextTop = getAdjustedScrollPosition(topOffset, frozenRowsCumulativeHeight);
    } else if (cardinality === RegionCardinality.FULL_COLUMNS) {
        // scroll to the left side of the column block
        const leftOffset = getLeftOffset(region.cols[0]);
        nextLeft = getAdjustedScrollPosition(leftOffset, frozenColumnsCumulativeWidth);
    } else {
        // if it's a FULL_TABLE region, scroll back to the top-left cell of the table
        nextTop = 0;
        nextLeft = 0;
    }

    return {
        scrollLeft: nextLeft,
        scrollTop: nextTop,
    };
}

// Private
// =======

/**
 * Adjust the scroll position to align content just beyond the frozen region, if necessary.
 */
function getAdjustedScrollPosition(scrollOffset: number, frozenRegionCumulativeSize: number) {
    return scrollOffset < frozenRegionCumulativeSize
        ? 0
        : scrollOffset - frozenRegionCumulativeSize;
}
