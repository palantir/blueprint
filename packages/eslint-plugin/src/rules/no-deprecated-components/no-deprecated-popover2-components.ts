/*
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

import type { TSESLint } from "@typescript-eslint/utils";

import { createNoDeprecatedComponentsRule, type DeprecatedComponentsConfig } from "./createNoDeprecatedComponentsRule";

export const popover2ComponentsMigrationMapping: DeprecatedComponentsConfig = {
    Breadcrumbs2: ["Breadcrumbs", "@blueprintjs/core"],
    ContextMenu2: ["ContextMenu", "@blueprintjs/core"],
    MenuItem2: ["MenuItem", "@blueprintjs/core"],
    Popover2: ["Popover", "@blueprintjs/core"],
    ResizeSensor2: ["ResizeSensor", "@blueprintjs/core"],
    Tooltip2: ["Tooltip", "@blueprintjs/core"],
};

/**
 * This rule is similar to "@blueprintjs/no-deprecated-components", but it only checks for usage
 * of deprecated components from @blueprintjs/popover2. This is useful for incremental migration to
 * newer Blueprint APIs.
 */
export const noDeprecatedPopover2ComponentsRule: TSESLint.RuleModule<string, unknown[]> =
    createNoDeprecatedComponentsRule(
        "no-deprecated-popover2-components",
        ["@blueprintjs/popover2"],
        popover2ComponentsMigrationMapping,
    );
