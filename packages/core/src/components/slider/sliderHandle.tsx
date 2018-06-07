/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Intent } from "../../common/intent";

export const SliderHandleType = {
    /** A full handle appears as a small square. */
    FULL: "full" as "full",

    /** A start handle appears as the left or top half of a square. */
    START: "start" as "start",

    /** An end handle appears as the right or bottom half of a square. */
    END: "end" as "end",
};
export type SliderHandleType = typeof SliderHandleType[keyof typeof SliderHandleType];

export const SliderHandleInteractionKind = {
    /** Locked handles prevent other handles from being dragged past then. */
    LOCK: "lock" as "lock",

    /** Push handles move overlapping handles with them as they are dragged. */
    PUSH: "push" as "push",

    /**
     * Handles marked "none" are not interactive and do not appear in the UI.
     * They serve only to break the track into subsections that can be colored separately.
     */
    NONE: "none" as "none",
};
export type SliderHandleInteractionKind = typeof SliderHandleInteractionKind[keyof typeof SliderHandleInteractionKind];

export interface ISliderHandleProps {
    /** Value of this handle. */
    value: number;

    /** Intent for the track segment immediately after this handle, taking priority over `intentBefore`. */
    intentAfter?: Intent;

    /** Intent for the track segment immediately before this handle. */
    intentBefore?: Intent;

    /** How this handle interacts with other handles. */
    interactionKind?: SliderHandleInteractionKind;

    /** Handle appearance type. */
    type?: SliderHandleType;
}

export class SliderHandle extends React.PureComponent<ISliderHandleProps> {
    public static displayName = "Blueprint2.SliderHandle";
}
