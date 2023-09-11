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

import React from "react";

import { DateUtils } from "@blueprintjs/datetime";

import type { DateInput3Props } from "./dateInput3Props";

export function useFormattedDateString(
    date: Date | null,
    { invalidDateMessage, minDate, maxDate, locale, outOfRangeMessage, formatDate }: DateInput3Props,
    ignoreRange = false,
) {
    return React.useMemo(() => {
        if (date == null) {
            return undefined;
        } else if (!DateUtils.isDateValid(date)) {
            return invalidDateMessage;
        } else if (ignoreRange || DateUtils.isDayInRange(date, [minDate ?? null, maxDate ?? null])) {
            return formatDate(date, locale);
        } else {
            return outOfRangeMessage;
        }
    }, [date, minDate, maxDate, formatDate, locale, invalidDateMessage, outOfRangeMessage]);
}
