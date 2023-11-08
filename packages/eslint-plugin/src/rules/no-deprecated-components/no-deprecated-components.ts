/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";
import { coreComponentsMigrationMapping } from "./no-deprecated-core-components";
import { datetimeComponentsMigrationMapping } from "./no-deprecated-datetime-components";
import { datetime2ComponentsMigrationMapping } from "./no-deprecated-datetime2-components";
import { popover2ComponentsMigrationMapping } from "./no-deprecated-popover2-components";
import { selectComponentsMigrationMapping } from "./no-deprecated-select-components";
import { tableComponentsMigrationMapping } from "./no-deprecated-table-components";

/**
 * This rule checks target source code against a static list of deprecated React components.
 * If deprecated versions are detected, it will recommend using the replacement component instead
 * (for example, "v1" API -> "v2" API).
 *
 * Note that this implementation does not rely on the \@deprecated JSDoc annotation, and is thus distinct
 * from the 'deprecated/deprecated' ESLint rule.
 */
export const noDeprecatedComponentsRule: TSESLint.RuleModule<string, unknown[]> = createNoDeprecatedComponentsRule(
    "no-deprecated-components",
    [
        "@blueprintjs/core",
        "@blueprintjs/datetime",
        "@blueprintjs/datetime2",
        "@blueprintjs/popover2",
        "@blueprintjs/select",
        "@blueprintjs/table",
    ],
    {
        ...coreComponentsMigrationMapping,
        ...datetimeComponentsMigrationMapping,
        ...datetime2ComponentsMigrationMapping,
        ...popover2ComponentsMigrationMapping,
        ...selectComponentsMigrationMapping,
        ...tableComponentsMigrationMapping,
    },
);
