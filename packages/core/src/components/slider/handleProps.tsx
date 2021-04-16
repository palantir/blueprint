/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import { Intent, Props } from "../../common";

export const HandleType = {
    /** A full handle appears as a small square. */
    FULL: "full" as "full",

    /** A start handle appears as the left or top half of a square. */
    START: "start" as "start",

    /** An end handle appears as the right or bottom half of a square. */
    END: "end" as "end",
};
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HandleType = typeof HandleType[keyof typeof HandleType];

export const HandleInteractionKind = {
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
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HandleInteractionKind = typeof HandleInteractionKind[keyof typeof HandleInteractionKind];

// eslint-disable-next-line deprecation/deprecation
export type HandleProps = IHandleProps;
/** @deprecated use HandleProps */
export interface IHandleProps extends Props {
    /** Numeric value of this handle. */
    value: number;

    /** Intent for the track segment immediately after this handle, taking priority over `intentBefore`. */
    intentAfter?: Intent;

    /** Intent for the track segment immediately before this handle. */
    intentBefore?: Intent;

    /** Style to use for the track segment immediately after this handle, taking priority over `trackStyleBefore`. */
    trackStyleAfter?: React.CSSProperties;

    /** Style to use for the track segment immediately before this handle */
    trackStyleBefore?: React.CSSProperties;

    /**
     * How this handle interacts with other handles.
     *
     * @default "lock"
     */
    interactionKind?: HandleInteractionKind;

    /**
     * Callback invoked when this handle's value is changed due to a drag
     * interaction. Note that "push" interactions can cause multiple handles to
     * update at the same time.
     */
    onChange?: (newValue: number) => void;

    /** Callback invoked when this handle is released (the end of a drag interaction). */
    onRelease?: (newValue: number) => void;

    /**
     * Handle appearance type.
     *
     * @default "full"
     */
    type?: HandleType;
}
