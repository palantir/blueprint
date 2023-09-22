/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { TSESLint } from "@typescript-eslint/utils";

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";
import { coreComponentsMigrationMapping } from "./no-deprecated-core-components";
import { datetimeComponentsMigrationMapping } from "./no-deprecated-datetime-components";
import { datetime2ComponentsMigrationMapping } from "./no-deprecated-datetime2-components";
import { selectComponentsMigrationMapping } from "./no-deprecated-select-components";
import { tableComponentsMigrationMapping } from "./no-deprecated-table-components";

/**
 * This rule checks a hardcoded list of components that Blueprint is actively migrating to a newer version (e.g. v1 -> v2)
 * If deprecated versions (v1) are detected, it will recommend using the replacement component (e.g. the v2) instead.
 * Note that this does not rely on the \@deprecated JSDoc annotation, and is thus distinct/very different from the
 * deprecated/deprecated ESLint rule
 */
export const noDeprecatedComponentsRule: TSESLint.RuleModule<string, unknown[]> = createNoDeprecatedComponentsRule(
    "no-deprecated-components",
    [
        "@blueprintjs/core",
        "@blueprintjs/datetime",
        "@blueprintjs/datetime2",
        "@blueprintjs/select",
        "@blueprintjs/table",
    ],
    {
        ...coreComponentsMigrationMapping,
        ...datetimeComponentsMigrationMapping,
        ...datetime2ComponentsMigrationMapping,
        ...selectComponentsMigrationMapping,
        ...tableComponentsMigrationMapping,
    },
);
