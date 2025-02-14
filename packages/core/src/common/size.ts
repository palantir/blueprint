/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

export type Size = "small" | "medium" | "large";

export type NonSmallSize = Exclude<Size, "small">;
