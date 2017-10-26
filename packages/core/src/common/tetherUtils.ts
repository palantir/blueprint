/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// TODO: shim for new option added in Tether 1.4.0
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/13142
declare module "tether" {
    interface ITetherOptions {
        bodyElement?: HTMLElement;
    }
}

import * as Tether from "tether";

import { Position } from "./position";

// per https://github.com/HubSpot/tether/pull/204, Tether now exposes a `bodyElement` option that,
// when present, gets the tethered element injected into *it* instead of into the document body.
// but both approaches still cause React to freak out, because it loses its handle on the DOM
// element. thus, we pass a fake HTML bodyElement to Tether, with a no-op `appendChild` function
// (the only function the library uses from bodyElement).
const fakeHtmlElement = ({
    appendChild: () => {
        /* No-op */
    },
} as any) as HTMLElement;

export interface ITetherConstraint {
    attachment?: string;
    outOfBoundsClass?: string;
    pin?: boolean | string[];
    pinnedClass?: string;
    to?: string | HTMLElement | number[];
}

/** @internal */
export function createTetherOptions(
    element: Element,
    target: Node,
    position: Position,
    tetherOptions: Partial<Tether.ITetherOptions> = {},
): Tether.ITetherOptions {
    return {
        ...tetherOptions,
        attachment: getPopoverAttachment(position),
        bodyElement: fakeHtmlElement,
        classPrefix: "pt-tether",
        element,
        target,
        targetAttachment: getTargetAttachment(position),
    };
}

/** @internal */
export function getTargetAttachment(position: Position) {
    const attachments: { [p: number]: string } = {
        [Position.TOP_LEFT]: "top left",
        [Position.TOP]: "top center",
        [Position.TOP_RIGHT]: "top right",
        [Position.RIGHT_TOP]: "top right",
        [Position.RIGHT]: "middle right",
        [Position.RIGHT_BOTTOM]: "bottom right",
        [Position.BOTTOM_RIGHT]: "bottom right",
        [Position.BOTTOM]: "bottom center",
        [Position.BOTTOM_LEFT]: "bottom left",
        [Position.LEFT_BOTTOM]: "bottom left",
        [Position.LEFT]: "middle left",
        [Position.LEFT_TOP]: "top left",
    };
    return attachments[position];
}

/** @internal */
export function getPopoverAttachment(position: Position) {
    const attachments: { [p: number]: string } = {
        [Position.TOP_LEFT]: "bottom left",
        [Position.TOP]: "bottom center",
        [Position.TOP_RIGHT]: "bottom right",
        [Position.RIGHT_TOP]: "top left",
        [Position.RIGHT]: "middle left",
        [Position.RIGHT_BOTTOM]: "bottom left",
        [Position.BOTTOM_RIGHT]: "top right",
        [Position.BOTTOM]: "top center",
        [Position.BOTTOM_LEFT]: "top left",
        [Position.LEFT_BOTTOM]: "bottom right",
        [Position.LEFT]: "middle right",
        [Position.LEFT_TOP]: "top right",
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
