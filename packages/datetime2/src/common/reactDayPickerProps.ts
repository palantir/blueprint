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

import type { DayPickerRangeProps, DayPickerSingleProps } from "react-day-picker";

type ReactDayPickerOmittedProps =
    | "fromDate"
    | "fromMonth"
    | "fromYear"
    | "locale"
    | "mode"
    | "month"
    | "required"
    | "selected"
    | "toDate"
    | "toMonth"
    | "toYear";

export interface ReactDayPickerRangeProps {
    /**
     * Props to pass to react-day-picker's day range picker. See API documentation
     * [here](https://react-day-picker.js.org/api/interfaces/DayPickerRangeProps).
     *
     * Some properties are unavailable or have alternative names as top-level props:
     *  - "fromDate", "fromMonth", "fromYear", "toDate", "toMonth", "toYear": use "minDate" and "maxDate" instead (legacy names from @blueprintjs/datetime v4)
     *  - "locale"
     *  - "mode": fixed to "range"
     *  - "month": navigation is controlled by the component; use "defaultMonth" to set the initially displayed month
     *  - "required": use "canClearSelection" instead (legacy name from @blueprintjs/datetime v4)
     *  - "selected": use "value" instead
     */
    dayPickerProps?: Omit<DayPickerRangeProps, ReactDayPickerOmittedProps>;
}

export interface ReactDayPickerSingleProps {
    /**
     * Props to pass to react-day-picker's single day picker. See API documentation
     * [here](https://react-day-picker.js.org/api/interfaces/DayPickerSingleProps).
     *
     * Some properties are unavailable or have alternative names as top-level props:
     *  - "fromDate", "fromMonth", "fromYear", "toDate", "toMonth", "toYear": use "minDate" and "maxDate" instead (legacy names from @blueprintjs/datetime v4)
     *  - "locale"
     *  - "mode": fixed to "single"
     *  - "month": navigation is controlled by the component; use "defaultMonth" to set the initially displayed month
     *  - "required": use "canClearSelection" instead (legacy name from @blueprintjs/datetime v4)
     *  - "selected": use "value" instead
     */
    dayPickerProps?: Omit<DayPickerSingleProps, ReactDayPickerOmittedProps>;
}
