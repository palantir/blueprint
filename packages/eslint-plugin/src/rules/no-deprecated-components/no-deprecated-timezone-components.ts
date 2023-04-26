/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";

export const timezoneComponentsMigrationMapping = {
    // nothing yet
};

/**
 * This rule is similar to "@blueprintjs/no-deprecated-components", but it only checks for usage
 * of deprecated components from @blueprintjs/timezone. This is useful for incremental migration to
 * newer Blueprint APIs.
 */
export const noDeprecatedTimezoneComponentsRule = createNoDeprecatedComponentsRule(
    "no-deprecated-timezone-components",
    ["@blueprintjs/timezone"],
    timezoneComponentsMigrationMapping,
);
