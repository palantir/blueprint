/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";

export const tableComponentsMigrationMapping = {
    // TODO(@adidahiya): Blueprint v6
    // EditableCell: "EditableCell2",
    // Table: "Table2",
};

/**
 * This rule is similar to "@blueprintjs/no-deprecated-components", but it only checks for usage
 * of deprecated components from @blueprintjs/table. This is useful for incremental migration to
 * newer Blueprint APIs.
 */
export const noDeprecatedTableComponentsRule: TSESLint.RuleModule<string, unknown[]> = createNoDeprecatedComponentsRule(
    "no-deprecated-table-components",
    ["@blueprintjs/table"],
    tableComponentsMigrationMapping,
);
