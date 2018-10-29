/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable:object-literal-sort-keys

/**
 * The four basic intents.
 */
export const Intent = {
    NONE: "none" as "none",
    PRIMARY: "primary" as "primary",
    SUCCESS: "success" as "success",
    WARNING: "warning" as "warning",
    DANGER: "danger" as "danger",
};
export type Intent = typeof Intent[keyof typeof Intent];
