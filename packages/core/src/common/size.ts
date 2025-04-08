/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable sort-keys */

/** The rendering size of a component. */
export const Size = {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
} as const;
export type Size = (typeof Size)[keyof typeof Size];

/** A subset of `Size` which excludes `"small"` */
export type NonSmallSize = Exclude<Size, "small">;
