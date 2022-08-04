/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";
import { coreComponentsMigrationMapping } from "./no-deprecated-core-components";
import { datetimeComponentsMigrationMapping } from "./no-deprecated-datetime-components";
import { selectComponentsMigrationMapping } from "./no-deprecated-select-components";
import { tableComponentsMigrationMapping } from "./no-deprecated-table-components";
import { timezoneComponentsMigrationMapping } from "./no-deprecated-timezone-components";

/**
 * This rule checks a hardcoded list of components that Blueprint is actively migrating to a newer version (e.g. v1 -> v2)
 * If deprecated versions (v1) are detected, it will recommend using the replacement component (e.g. the v2) instead.
 * Note that this does not rely on the @deprecated JSDoc annotation, and is thus distinct/very different from the
 * deprecated/deprecated ESLint rule
 */
export const noDeprecatedComponentsRule = createNoDeprecatedComponentsRule(
    "no-deprecated-components",
    [
        "@blueprintjs/core",
        "@blueprintjs/datetime",
        "@blueprintjs/select",
        "@blueprintjs/table",
        "@blueprintjs/timezone",
    ],
    {
        ...coreComponentsMigrationMapping,
        ...datetimeComponentsMigrationMapping,
        ...selectComponentsMigrationMapping,
        ...tableComponentsMigrationMapping,
        ...timezoneComponentsMigrationMapping,
    },
);
