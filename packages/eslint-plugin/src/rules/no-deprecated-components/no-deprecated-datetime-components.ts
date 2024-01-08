/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";

export const datetimeComponentsMigrationMapping = {
    DateInput: "DateInput3",
    DatePicker: "DatePicker3",
    DateRangeInput: "DateRangeInput3",
    DateRangePicker: "DateRangePicker3",
};

/**
 * This rule is similar to "@blueprintjs/no-deprecated-components", but it only checks for usage
 * of deprecated components from @blueprintjs/datetime. This is useful for incremental migration to
 * newer Blueprint APIs.
 */
export const noDeprecatedDatetimeComponentsRule: TSESLint.RuleModule<string, unknown[]> =
    createNoDeprecatedComponentsRule(
        "no-deprecated-datetime-components",
        ["@blueprintjs/datetime"],
        datetimeComponentsMigrationMapping,
    );
