/*
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";

export const datetime2ComponentsMigrationMapping = {
    DateInput2: "DateInput",
    DateInput3: "DateInput",
    DatePicker2: "DatePicker",
    DatePicker3: "DatePicker",
    DateRangeInput2: "DateRangeInput",
    DateRangeInput3: "DateRangeInput",
    DateRangePicker2: "DateRangePicker",
    DateRangePicker3: "DateRangePicker",
};

/**
 * This rule is similar to "@blueprintjs/no-deprecated-components", but it only checks for usage
 * of deprecated components from @blueprintjs/datetime2. This is useful for incremental migration to
 * newer Blueprint APIs.
 */
export const noDeprecatedDatetime2ComponentsRule: TSESLint.RuleModule<string, unknown[]> =
    createNoDeprecatedComponentsRule(
        "no-deprecated-datetime2-components",
        ["@blueprintjs/datetime2"],
        datetime2ComponentsMigrationMapping,
    );
