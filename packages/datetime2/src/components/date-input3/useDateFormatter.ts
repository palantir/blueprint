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

import type { Locale } from "date-fns";
import * as React from "react";

import { DateUtils } from "@blueprintjs/datetime";

import { getDateFnsFormatter, getDefaultDateFnsFormat } from "../../common/dateFnsFormatUtils";
import { getLocaleCodeFromProps } from "../../common/dateFnsLocaleProps";
import type { DateInput3Props, DateInput3PropsWithDefaults } from "./dateInput3Props";

/**
 * Create a date string parser function based on a given locale.
 *
 * Prefer using user-provided `props.formatDate` and `props.dateFnsFormat` if available, otherwise fall back to
 * default formats inferred from time picker props.
 */
export function useDateFormatter(props: DateInput3Props, locale: Locale | undefined) {
    const {
        dateFnsFormat,
        locale: localeFromProps,
        formatDate,
        invalidDateMessage,
        maxDate,
        minDate,
        outOfRangeMessage,
        timePickerProps,
        timePrecision,
    } = props as DateInput3PropsWithDefaults;

    return React.useCallback(
        (date: Date | undefined) => {
            if (date === undefined) {
                return "";
            }
            if (!DateUtils.isDateValid(date)) {
                return invalidDateMessage;
            } else if (DateUtils.isDayInRange(date, [minDate, maxDate])) {
                if (formatDate !== undefined) {
                    // user-provided date formatter
                    return formatDate(date, locale?.code ?? getLocaleCodeFromProps(localeFromProps));
                } else {
                    // use user-provided date-fns format or one of the default formats inferred from time picker props
                    const format = dateFnsFormat ?? getDefaultDateFnsFormat({ timePickerProps, timePrecision });
                    return getDateFnsFormatter(format, locale)(date);
                }
            } else {
                return outOfRangeMessage;
            }
        },
        [
            dateFnsFormat,
            formatDate,
            invalidDateMessage,
            locale,
            localeFromProps,
            maxDate,
            minDate,
            outOfRangeMessage,
            timePickerProps,
            timePrecision,
        ],
    );
}
