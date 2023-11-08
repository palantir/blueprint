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

import type { DateFormatProps, DateInputProps } from "@blueprintjs/datetime";

import type { DateFnsLocaleProps } from "../../common/dateFnsLocaleProps";
import type { ReactDayPickerSingleProps } from "../../common/reactDayPickerProps";

/**
 * Props shared between DateInput v1 and v3.
 *
 * Note that we exclude formatDate and parseDate so that we can make those optional in DateInput3 and provide a default
 * implementation for those functions using date-fns.
 */
type DateInputSharedProps = Omit<
    DateInputProps,
    "dayPickerProps" | "formatDate" | "locale" | "localeUtils" | "modifiers" | "parseDate"
>;

export interface DateInput3Props
    extends DateInputSharedProps,
        ReactDayPickerSingleProps,
        DateFnsLocaleProps,
        Partial<Omit<DateFormatProps, "locale">> {
    /**
     * [date-fns format](https://date-fns.org/docs/format) string used to format & parse date strings.
     *
     * Mutually exclusive with the `formatDate` and `parseDate` props.
     *
     * @see https://date-fns.org/docs/format
     */
    dateFnsFormat?: string;
}

export type DateInput3DefaultProps = Required<
    Pick<
        DateInput3Props,
        | "closeOnSelection"
        | "disabled"
        | "invalidDateMessage"
        | "locale"
        | "maxDate"
        | "minDate"
        | "outOfRangeMessage"
        | "reverseMonthAndYearMenus"
    >
>;

export type DateInput3PropsWithDefaults = Omit<DateInput3Props, keyof DateInput3DefaultProps> & DateInput3DefaultProps;
