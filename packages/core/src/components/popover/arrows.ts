/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { CSSProperties } from "react";

import { Position } from "../../common/position";

// this value causes popover and target edges to line up on 50px targets
export const MIN_ARROW_SPACING = 18;

export interface IDimensions {
    height: number;
    width: number;
}

export interface IArrowPositionStyles {
    arrow?: CSSProperties;
    container?: CSSProperties;
}

export function computeArrowOffset(sideLength: number, arrowSize: number, minimum = MIN_ARROW_SPACING) {
    return Math.max(Math.round((sideLength - arrowSize) / 2), minimum);
}

export function getPopoverTransformOrigin(
    position: Position,
    arrowSize: number,
    targetDimensions: IDimensions,
): string {
    const offsetX = computeArrowOffset(targetDimensions.width, arrowSize);
    const offsetY = computeArrowOffset(targetDimensions.height, arrowSize);
    switch (position) {
        case Position.TOP_LEFT:
            return `${offsetX}px bottom`;
        case Position.TOP_RIGHT:
            return `calc(100% - ${offsetX}px) bottom`;
        case Position.BOTTOM_LEFT:
            return `${offsetX}px top`;
        case Position.BOTTOM_RIGHT:
            return `calc(100% - ${offsetX}px) top`;
        case Position.LEFT_TOP:
            return `right ${offsetY}px`;
        case Position.LEFT_BOTTOM:
            return `right calc(100% - ${offsetY}px)`;
        case Position.RIGHT_TOP:
            return `left ${offsetY}px`;
        case Position.RIGHT_BOTTOM:
            return `left calc(100% - ${offsetY}px)`;
        default:
            return undefined;
    }
}

export function getArrowPositionStyles(
    position: Position,
    arrowSize: number,
    ignoreTargetDimensions: boolean,
    targetDimensions: IDimensions,
    inline: boolean,
): IArrowPositionStyles {
    // compute the offset to center an arrow with given hypotenuse in a side of the given length
    const popoverOffset = (sideLength: number) => {
        const offset = computeArrowOffset(sideLength, arrowSize, 0);
        return offset < MIN_ARROW_SPACING ? MIN_ARROW_SPACING - offset : 0;
    };
    const popoverOffsetX = popoverOffset(targetDimensions.width);
    const popoverOffsetY = popoverOffset(targetDimensions.height);
    // TOP, RIGHT, BOTTOM, LEFT are handled purely in CSS because of centering transforms
    switch (position) {
        case Position.TOP_LEFT:
        case Position.BOTTOM_LEFT:
            return {
                arrow: ignoreTargetDimensions ? {} : { left: computeArrowOffset(targetDimensions.width, arrowSize) },
                container: { marginLeft: -popoverOffsetX },
            };
        case Position.TOP_RIGHT:
        case Position.BOTTOM_RIGHT:
            return {
                arrow: ignoreTargetDimensions ? {} : { right: computeArrowOffset(targetDimensions.width, arrowSize) },
                container: { marginLeft: popoverOffsetX },
            };
        case Position.RIGHT_TOP:
        case Position.LEFT_TOP:
            return {
                arrow: ignoreTargetDimensions ? {} : { top: computeArrowOffset(targetDimensions.height, arrowSize) },
                container: inline ? { top: -popoverOffsetY } : { marginTop: -popoverOffsetY },
            };
        case Position.RIGHT_BOTTOM:
        case Position.LEFT_BOTTOM:
            return {
                arrow: ignoreTargetDimensions ? {} : { bottom: computeArrowOffset(targetDimensions.height, arrowSize) },
                container: inline ? { bottom: -popoverOffsetY } : { marginTop: popoverOffsetY },
            };
        default:
            return {};
    }
}
