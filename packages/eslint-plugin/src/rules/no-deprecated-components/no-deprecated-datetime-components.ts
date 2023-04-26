/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";

export const datetimeComponentsMigrationMapping = {
    // TODO(@adidahiya): Blueprint v6
    // DateTimePicker: "DatePicker",
};

/**
 * This rule is similar to "@blueprintjs/no-deprecated-components", but it only checks for usage
 * of deprecated components from @blueprintjs/datetime. This is useful for incremental migration to
 * newer Blueprint APIs.
 */
export const noDeprecatedDatetimeComponentsRule = createNoDeprecatedComponentsRule(
    "no-deprecated-datetime-components",
    ["@blueprintjs/datetime"],
    datetimeComponentsMigrationMapping,
);
