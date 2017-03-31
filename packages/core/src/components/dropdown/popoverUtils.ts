/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { Position } from "../../common/position";
import { IPopoverProps } from "../popover/popover";

/* istanbul ignore next */
/**
 * @returns the corresponding caret icon class which will _point_ towards a
 * popover opening in a given position realtive to the target element.
 */
export function getCaretIconClass({ position }: IPopoverProps): string {
    switch (position) {
        case Position.TOP:
        case Position.TOP_LEFT:
        case Position.TOP_RIGHT:
            return "pt-icon-caret-up";
        case Position.LEFT:
        case Position.LEFT_BOTTOM:
        case Position.LEFT_TOP:
            return "pt-icon-caret-left";
        case Position.RIGHT:
        case Position.RIGHT_BOTTOM:
        case Position.RIGHT_TOP:
            return "pt-icon-caret-right";
        case Position.BOTTOM:
        case Position.BOTTOM_LEFT:
        case Position.BOTTOM_RIGHT:
        default:
            return "pt-icon-caret-down";
    }
}
