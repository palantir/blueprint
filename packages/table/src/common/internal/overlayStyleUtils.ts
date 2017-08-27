/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { QuadrantType } from "../../quadrants/tableQuadrant";
import { IRegion, RegionCardinality, Regions } from "../../regions";

/**
 * Returns the CSS styles for an overlay region in the table-body area.
 * @param region - the region defining the overlay bounds
 * @param quadrantType - the quadrant in which the overlay will be shown
 * @param gridWidth - the width of the body region (excluding headers)
 * @param gridHeight - the height of the body region (excluding headers)
 * @param getRegionStyle - a callback returning the basic style for a region
 * @param numFrozenColumns - the number of frozen columns
 */
export function styleBodyOverlay(
    region: IRegion,
    quadrantType: QuadrantType,
    gridWidth: number,
    gridHeight: number,
    getRegionStyle: (region: IRegion) => React.CSSProperties,
    numFrozenColumns?: number,
): React.CSSProperties {
    const cardinality = Regions.getRegionCardinality(region);
    const style = getRegionStyle(region);

    // ensure we're not showing borders at the boundary of the frozen-columns area
    const canHideRightBorder =
        (quadrantType === QuadrantType.TOP_LEFT || quadrantType === QuadrantType.LEFT)
        && numFrozenColumns != null
        && numFrozenColumns > 0;

    // include a correction in some cases to hide borders along quadrant boundaries
    const alignmentCorrection = 1;
    const alignmentCorrectionString = `-${alignmentCorrection}px`;

    switch (cardinality) {
        case RegionCardinality.CELLS:
            return style;
        case RegionCardinality.FULL_COLUMNS:
            style.top = alignmentCorrectionString;
            style.height = gridHeight + alignmentCorrection;
            return style;
        case RegionCardinality.FULL_ROWS:
            style.left = alignmentCorrectionString;
            style.width = gridWidth + alignmentCorrection;
            if (canHideRightBorder) {
                style.right = alignmentCorrectionString;
            }
            return style;
        case RegionCardinality.FULL_TABLE:
            style.left = alignmentCorrectionString;
            style.top = alignmentCorrectionString;
            style.width = gridWidth + alignmentCorrection;
            style.height = gridHeight + alignmentCorrection;
            if (canHideRightBorder) {
                style.right = alignmentCorrectionString;
            }
            return style;
        default:
            return { display: "none" };
    }
};
