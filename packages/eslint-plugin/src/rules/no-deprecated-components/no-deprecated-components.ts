/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";

/**
 * This rule checks a hardcoded list of components that Blueprint is actively migrating to a newer version (e.g. v1 -> v2)
 * If deprecated versions (v1) are detected, it will recommend using the replacement component (e.g. the v2) instead.
 * Note that this does not rely on the @deprecated JSDoc annotation, and is thus distinct/very different from the
 * deprecated/deprecated ESLint rule
 */
export const noDeprecatedComponentsRule = createNoDeprecatedComponentsRule(
    "no-deprecated-components",
    ["@blueprintjs/core", "@blueprintjs/datetime", "@blueprintjs/select", "@blueprintjs/timezone"],
    {
        AbstractComponent: "AbstractComponent2",
        AbstractPureComponent: "AbstractPureComponent2",
        Breadcrumbs: "Breadcrumbs2",
        CollapsibleList: "OverflowList",
        DateInput: "DateInput2",
        DateRangeInput: "DateRangeInput2",
        DateTimePicker: "DatePicker",
        MenuItem: "MenuItem2",
        MultiSelect: "MultiSelect2",
        PanelStack: "PanelStack2",
        Popover: "Popover2",
        Select: "Select2",
        Suggest: "Suggest2",
        TimezonePicker: "TimezoneSelect",
        Tooltip: "Tooltip2",
    },
);
