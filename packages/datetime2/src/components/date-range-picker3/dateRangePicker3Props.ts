/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { DayPickerRangeProps } from "react-day-picker";

import type { DateRangePickerProps } from "@blueprintjs/datetime";

import { DateFnsLocaleProps } from "../../common/dateFnsLocaleProps";

/** Props shared between DateRangePicker v1 and v3 */
type DateRangePickerSharedProps = Omit<DateRangePickerProps, "dayPickerProps" | "locale" | "localeUtils" | "modifiers">;

export interface DateRangePicker3Props extends DateRangePickerSharedProps, DateFnsLocaleProps {
    /**
     * Props to pass to react-day-picker's day range picker. See API documentation
     * [here](https://react-day-picker.js.org/api/interfaces/DayPickerRangeProps).
     *
     * Some properties are unavailable or have alternative names as top-level props:
     *  - "mode": fixed to "range"
     *  - "fromDate", "fromMonth", "fromYear", "toDate", "toMonth", "toYear": use "minDate" and "maxDate" instead (legacy names from @blueprintjs/datetime v4)
     *  - "month": navigation is controlled by the component; use "defaultMonth" to set the initially displayed month
     *  - "selected": use "value" instead
     *  - "required": use "canClearSelection" instead (legacy name from @blueprintjs/datetime v4)
     */
    dayPickerProps?: Omit<
        DayPickerRangeProps,
        | "fromDate"
        | "fromMonth"
        | "fromYear"
        | "mode"
        | "month"
        | "required"
        | "selected"
        | "toDate"
        | "toMonth"
        | "toYear"
    >;
}
