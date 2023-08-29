/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { TSESLint } from "@typescript-eslint/utils";
import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";

export const selectComponentsMigrationMapping = {
    // nothing, for now
};

/**
 * This rule is similar to "@blueprintjs/no-deprecated-components", but it only checks for usage
 * of deprecated components from @blueprintjs/select. This is useful for incremental migration to
 * newer Blueprint APIs.
 */
export const noDeprecatedSelectComponentsRule: TSESLint.RuleModule<string, unknown[]> =
    createNoDeprecatedComponentsRule(
        "no-deprecated-select-components",
        ["@blueprintjs/select"],
        selectComponentsMigrationMapping,
    );
