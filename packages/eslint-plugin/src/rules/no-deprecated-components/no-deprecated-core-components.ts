/*
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";

export const coreComponentsMigrationMapping = {
    AbstractComponent: "AbstractComponent2",
    AbstractPureComponent: "AbstractPureComponent2",
    Breadcrumbs: "Breadcrumbs2",
    CollapsibleList: "OverflowList",
    "MenuItem.popoverProps": "MenuItem2",
    // TODO(@adidahiya): Blueprint v6
    // PanelStack: "PanelStack2",
    Popover: "Popover2",
    Tooltip: "Tooltip2",
};

/**
 * This rule is similar to "@blueprintjs/no-deprecated-components", but it only checks for usage
 * of deprecated components from @blueprintjs/core. This is useful for incremental migration to
 * newer Blueprint APIs.
 */
export const noDeprecatedCoreComponentsRule = createNoDeprecatedComponentsRule(
    "no-deprecated-core-components",
    ["@blueprintjs/core"],
    coreComponentsMigrationMapping,
);
