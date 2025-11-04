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
import { useCallback } from "react";

import { getDateFnsParser, getDefaultDateFnsFormat } from "../../common/dateFnsFormatUtils";
import { getLocaleCodeFromProps } from "../../common/dateFnsLocaleProps";
import { INVALID_DATE, INVALID_DATE_MESSAGE, OUT_OF_RANGE_MESSAGE } from "../dateConstants";

import type { DateInputProps } from "./dateInputProps";

/**
 * Create a date string parser function based on a given locale.
 *
 * Prefer using user-provided `props.parseDate` and `props.dateFnsFormat` if available, otherwise fall back to
 * default formats inferred from time picker props.
 */
export function useDateParser(props: DateInputProps, locale: Locale | undefined) {
    const {
        dateFnsFormat,
        invalidDateMessage = INVALID_DATE_MESSAGE,
        locale: localeFromProps,
        outOfRangeMessage = OUT_OF_RANGE_MESSAGE,
        parseDate,
        timePickerProps,
        timePrecision,
    } = props;

    return useCallback(
        (dateString: string): Date | null => {
            if (dateString === outOfRangeMessage || dateString === invalidDateMessage) {
                return null;
            }
            let newDate: false | Date | null = null;

            if (parseDate !== undefined) {
                // user-provided date parser
                newDate = parseDate(dateString, locale?.code ?? getLocaleCodeFromProps(localeFromProps));
            } else {
                // use user-provided date-fns format or one of the default formats inferred from time picker props
                const format = dateFnsFormat ?? getDefaultDateFnsFormat({ timePickerProps, timePrecision });
                newDate = getDateFnsParser(format, locale)(dateString);
            }

            return newDate === false ? INVALID_DATE : newDate;
        },
        [
            dateFnsFormat,
            invalidDateMessage,
            locale,
            localeFromProps,
            outOfRangeMessage,
            parseDate,
            timePickerProps,
            timePrecision,
        ],
    );
}
