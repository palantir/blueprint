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

import type { DayPickerBase, DayPickerRangeProps, DayPickerSingleProps } from "react-day-picker";

type ReactDayPickerOmittedProps =
    | "captionLayout"
    | "disableNavigation"
    | "fromDate"
    | "fromMonth"
    | "fromYear"
    | "locale"
    | "mode"
    | "month"
    | "numberOfMonths"
    | "required"
    | "selected"
    | "toDate"
    | "toMonth"
    | "toYear";

/**
 * react-day-picker v8.x options which may be customized / overriden on
 * `DatePicker3`, `DateInput3`, `DateRangePicker3`, and `DateRangeInput3` via the `dayPickerProps` prop.
 */
export type DayPickerProps = Omit<DayPickerBase, ReactDayPickerOmittedProps>;

export interface ReactDayPickerRangeProps {
    /**
     * Props to pass to react-day-picker's day range picker. See API documentation
     * [here](https://react-day-picker.js.org/api/interfaces/DayPickerRangeProps).
     *
     * Some properties are unavailable since they are set by the component design and cannot be changed:
     *  - "captionLayout"
     *  - "disableNavigation"
     *  - "mode"
     *
     * Other properties have alternative names as top-level props:
     *  - "fromDate", "fromMonth", "fromYear", "toDate", "toMonth", "toYear": use "minDate" and "maxDate" instead (legacy names from @blueprintjs/datetime v4)
     *  - "locale"
     *  - "month": navigation is controlled by the component; use "defaultMonth" to set the initially displayed month
     *  - "numberOfMonths": use "singleMonthOnly" prop instead
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
     * Some properties are unavailable since they are set by the component design and cannot be changed:
     *  - "captionLayout"
     *  - "disableNavigation"
     *  - "mode"
     *  - "numberOfMonths": fixed to 1 month
     *
     * Other properties have alternative names as top-level props:
     *  - "fromDate", "fromMonth", "fromYear", "toDate", "toMonth", "toYear": use "minDate" and "maxDate" instead (legacy names from @blueprintjs/datetime v4)
     *  - "locale"
     *  - "month": navigation is controlled by the component; use "defaultMonth" to set the initially displayed month
     *  - "required": use "canClearSelection" instead (legacy name from @blueprintjs/datetime v4)
     *  - "selected": use "value" instead
     */
    dayPickerProps?: Omit<DayPickerSingleProps, ReactDayPickerOmittedProps>;
}
