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

import type { DatePickerProps } from "@blueprintjs/datetime";

import type { DateFnsLocaleProps } from "../../common/dateFnsLocaleProps";
import type { ReactDayPickerSingleProps } from "../../common/reactDayPickerProps";

/** Props shared between DatePicker v1 and v3 */
type DatePickerSharedProps = Omit<
    DatePickerProps,
    "dayPickerProps" | "defaultValue" | "locale" | "localeUtils" | "modifiers" | "onChange" | "value"
>;

export interface DatePicker3Props extends DatePickerSharedProps, DateFnsLocaleProps, ReactDayPickerSingleProps {
    /**
     * Initial day the calendar will display as selected.
     * This should not be set if `value` is set.
     */
    defaultValue?: Date;

    /**
     * Called when the user selects a day.
     * If being used in an uncontrolled manner, `selectedDate` will be `null` if the user clicks the currently selected
     * day. If being used in a controlled manner, `selectedDate` will contain the day clicked no matter what.
     * `isUserChange` is true if the user selected a day, and false if the date was automatically changed
     * by the user navigating to a new month or year rather than explicitly clicking on a date in the calendar.
     */
    onChange?: (selectedDate: Date | null, isUserChange: boolean) => void;

    /**
     * The currently selected day. If this prop is provided, the component acts in a controlled manner.
     */
    value?: Date | null;
}
