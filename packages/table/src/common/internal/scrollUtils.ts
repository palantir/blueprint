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

import { IRegion, RegionCardinality, Regions } from "../../regions";

/**
 * Returns the scroll{Left,Top} offsets of the provided region based on its
 * cardinality.
 */
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

    let scrollTop = currScrollTop;
    let scrollLeft = currScrollLeft;

    // if these were max-frozen-index values, we would have added 1 before passing to the get*Offset
    // functions, but the counts are already 1-indexed, so we can just pass those.
    const frozenColumnsCumulativeWidth = getLeftOffset(numFrozenColumns);
    const frozenRowsCumulativeHeight = getTopOffset(numFrozenRows);

    switch (cardinality) {
        case RegionCardinality.CELLS: {
            // scroll to the top-left corner of the block of cells
            const topOffset = getTopOffset(region.rows[0]);
            const leftOffset = getLeftOffset(region.cols[0]);
            scrollTop = getClampedScrollPosition(topOffset, frozenRowsCumulativeHeight);
            scrollLeft = getClampedScrollPosition(leftOffset, frozenColumnsCumulativeWidth);
            break;
        }
        case RegionCardinality.FULL_ROWS: {
            // scroll to the top of the row block
            const topOffset = getTopOffset(region.rows[0]);
            scrollTop = getClampedScrollPosition(topOffset, frozenRowsCumulativeHeight);
            break;
        }
        case RegionCardinality.FULL_COLUMNS: {
            // scroll to the left side of the column block
            const leftOffset = getLeftOffset(region.cols[0]);
            scrollLeft = getClampedScrollPosition(leftOffset, frozenColumnsCumulativeWidth);
            break;
        }
        default: {
            // if it's a FULL_TABLE region, scroll back to the top-left cell of the table
            scrollTop = 0;
            scrollLeft = 0;
            break;
        }
    }

    return { scrollLeft, scrollTop };
}

/**
 * Returns the thickness of the target scroll bar in pixels.
 * If the target scroll bar is not present, 0 is returned.
 */
export function measureScrollBarThickness(element: HTMLElement, direction: "horizontal" | "vertical") {
    // offset size includes the scroll bar. client size does not.
    // the difference gives the thickness of the scroll bar.
    return direction === "horizontal"
        ? element.offsetHeight - element.clientHeight
        : element.offsetWidth - element.clientWidth;
}

/**
 * Adjust the scroll position to align content just beyond the frozen region, if necessary.
 */
function getClampedScrollPosition(scrollOffset: number, frozenRegionCumulativeSize: number) {
    // if the new scroll offset falls within the frozen region, clamp it to 0
    return Math.max(scrollOffset - frozenRegionCumulativeSize, 0);
}
