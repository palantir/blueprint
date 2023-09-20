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

import { Locale } from "date-fns";
import * as React from "react";

import { DateInput3Props, DateInput3PropsWithDefaults } from "./dateInput3Props";
import { getDefaultDateFnsFormat, getDateFnsParser } from "../../common/dateFnsFormatUtils";

const INVALID_DATE = new Date(undefined!);

export function getDateStringParser(props: DateInput3Props, locale: Locale | undefined) {
    const { invalidDateMessage, outOfRangeMessage, parseDate, timePickerProps, timePrecision } =
        props as DateInput3PropsWithDefaults;

    return React.useCallback(
        (dateString: string): Date | null => {
            if (dateString === outOfRangeMessage || dateString === invalidDateMessage) {
                return null;
            }
            let newDate: false | Date | null = null;

            if (parseDate !== undefined) {
                // user-provided date parser
                newDate = parseDate(dateString, locale?.code ?? props.locale);
            } else {
                // use one of the default parsers
                const format = getDefaultDateFnsFormat(props);
                newDate = getDateFnsParser(format, locale)(dateString);
            }

            return newDate === false ? INVALID_DATE : newDate;
        },
        [outOfRangeMessage, invalidDateMessage, parseDate, locale, timePickerProps, timePrecision],
    );
}
