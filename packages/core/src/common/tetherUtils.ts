/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as Tether from "tether";

import { Position } from "./position";

const DEFAULT_CONSTRAINTS = {
    attachment: "together",
    to: "scrollParent",
};

export interface ITetherConstraint {
    attachment?: string;
    outOfBoundsClass?: string;
    pin?: boolean | string[];
    pinnedClass?: string;
    to?: string | HTMLElement | number[];
}

/** @internal */
export function createTetherOptions(popover: Element,
                                    target: Node,
                                    position: Position,
                                    useSmartPositioning: boolean,
                                    constraints: ITetherConstraint[]) {
    if (constraints == null && useSmartPositioning) {
        constraints = [DEFAULT_CONSTRAINTS];
    }

    const options: Tether.ITetherOptions = {
        attachment: getPopoverAttachment(position),
        classPrefix: "pt-tether",
        constraints: constraints,
        element: popover,
        target: target,
        targetAttachment: getTargetAttachment(position),
    };
    return options;
}

/** @internal */
export function getTargetAttachment(position: Position) {
    const attachments: {[p: number]: string} = {
        [Position.TOP_LEFT]:     "top left",
        [Position.TOP]:          "top center",
        [Position.TOP_RIGHT]:    "top right",
        [Position.RIGHT_TOP]:    "top right",
        [Position.RIGHT]:        "middle right",
        [Position.RIGHT_BOTTOM]: "bottom right",
        [Position.BOTTOM_RIGHT]: "bottom right",
        [Position.BOTTOM]:       "bottom center",
        [Position.BOTTOM_LEFT]:  "bottom left",
        [Position.LEFT_BOTTOM]:  "bottom left",
        [Position.LEFT]:         "middle left",
        [Position.LEFT_TOP]:     "top left",
    };
    return attachments[position];
}

/** @internal */
export function getPopoverAttachment(position: Position) {
    const attachments: {[p: number]: string} = {
        [Position.TOP_LEFT]:     "bottom left",
        [Position.TOP]:          "bottom center",
        [Position.TOP_RIGHT]:    "bottom right",
        [Position.RIGHT_TOP]:    "top left",
        [Position.RIGHT]:        "middle left",
        [Position.RIGHT_BOTTOM]: "bottom left",
        [Position.BOTTOM_RIGHT]: "top right",
        [Position.BOTTOM]:       "top center",
        [Position.BOTTOM_LEFT]:  "top left",
        [Position.LEFT_BOTTOM]:  "bottom right",
        [Position.LEFT]:         "middle right",
        [Position.LEFT_TOP]:     "top right",
    };
    return attachments[position];
}

/** @internal */
export function getAttachmentClasses(position: Position) {
    // this essentially reimplements the Tether logic for attachment classes so the same styles
    // can be reused outside of Tether-based popovers.
    return [
        ...expandAttachmentClasses(getPopoverAttachment(position), "pt-tether-element-attached"),
        ...expandAttachmentClasses(getTargetAttachment(position), "pt-tether-target-attached"),
    ];
}

function expandAttachmentClasses(attachments: string, prefix: string) {
    const [verticalAlign, horizontalAlign] = attachments.split(" ");
    return [`${prefix}-${verticalAlign}`, `${prefix}-${horizontalAlign}`];
}
