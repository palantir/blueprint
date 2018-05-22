/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/** Alignment along the horizontal axis. */
export const Alignment = {
    CENTER: "center" as "center",
    LEFT: "left" as "left",
    RIGHT: "right" as "right",
};
export type Alignment = typeof Alignment[keyof typeof Alignment];
