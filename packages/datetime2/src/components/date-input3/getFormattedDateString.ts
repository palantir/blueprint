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

import { DateUtils } from "@blueprintjs/datetime";

import { DateInput3Props, DateInput3PropsWithDefaults } from "./dateInput3Props";
import { getDefaultDateFnsFormat, getDateFnsFormatter } from "../../common/dateFnsFormatUtils";

export function getFormattedDateString(
    date: Date | undefined,
    props: DateInput3Props,
    locale: Locale | undefined,
): string {
    const { formatDate, invalidDateMessage, minDate, maxDate, outOfRangeMessage } =
        props as DateInput3PropsWithDefaults;

    if (date === undefined) {
        return "";
    }
    if (!DateUtils.isDateValid(date)) {
        return invalidDateMessage;
    } else if (DateUtils.isDayInRange(date, [minDate, maxDate])) {
        if (formatDate !== undefined) {
            // user-provided date formatter
            return formatDate(date, locale?.code ?? props.locale);
        } else {
            // use one of the default formatters
            const format = getDefaultDateFnsFormat(props);
            return getDateFnsFormatter(format, locale)(date);
        }
    } else {
        return outOfRangeMessage;
    }
}
