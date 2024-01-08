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

import { format, type Locale, parse } from "date-fns";

import { type DatePickerBaseProps, TimePrecision } from "@blueprintjs/datetime";

export const DefaultDateFnsFormats = {
    DATE_ONLY: "yyyy-MM-dd",
    DATE_TIME_MILLISECONDS: "yyyy-MM-dd HH:mm:ss.SSS",
    DATE_TIME_MINUTES: "yyyy-MM-dd HH:mm",
    DATE_TIME_SECONDS: "yyyy-MM-dd HH:mm:ss",
};

export function getDefaultDateFnsFormat(props: Pick<DatePickerBaseProps, "timePickerProps" | "timePrecision">): string {
    const hasTimePickerProps = props.timePickerProps !== undefined && Object.keys(props.timePickerProps).length > 0;
    const precision =
        props.timePrecision ??
        props.timePickerProps?.precision ??
        // if timePickerProps is non-empty but has no precision defined, use the default value of "minute"
        (hasTimePickerProps ? TimePrecision.MINUTE : undefined);

    switch (precision) {
        case TimePrecision.MILLISECOND:
            return DefaultDateFnsFormats.DATE_TIME_MILLISECONDS;
        case TimePrecision.MINUTE:
            return DefaultDateFnsFormats.DATE_TIME_MINUTES;
        case TimePrecision.SECOND:
            return DefaultDateFnsFormats.DATE_TIME_SECONDS;
        default:
            return DefaultDateFnsFormats.DATE_ONLY;
    }
}

export function getDateFnsFormatter(formatStr: string, locale: Locale | undefined) {
    return (date: Date) => format(date, formatStr, { locale });
}

export function getDateFnsParser(formatStr: string, locale: Locale | undefined) {
    return (str: string) => parse(str, formatStr, new Date(), { locale });
}
