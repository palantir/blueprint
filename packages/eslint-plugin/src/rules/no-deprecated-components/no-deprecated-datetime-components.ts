/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */

import { createNoDeprecatedComponentsRule } from "./createNoDeprecatedComponentsRule";

/**
 * This rule is similar to "@blueprintjs/no-deprecated-components", but it only checks for usage
 * of deprecated components from @blueprintjs/datetime. This is useful for incremental migration to
 * newer Blueprint APIs.
 */
export const noDeprecatedDatetimeComponentsRule = createNoDeprecatedComponentsRule(
    "no-deprecated-datetime-components",
    ["@blueprintjs/datetime"],
    {
        DateInput: "DateInput2",
        DateRangeInput: "DateRangeInput2",
        DateTimePicker: "DatePicker",
    },
);
