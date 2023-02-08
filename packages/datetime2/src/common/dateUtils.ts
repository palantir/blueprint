/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { isSameDay, isWithinInterval } from "date-fns";

import { DateRange, isNonNullRange } from "./dateRange";

export function clone(d: Date) {
    return new Date(d.getTime());
}

export function isDateValid(date: Date | false | null): date is Date {
    return date instanceof Date && !isNaN(date.valueOf());
}

export function isSameTime(d1: Date | null, d2: Date | null) {
    // N.B. do not use date-fns helper fns here, since we don't want to return false when the month/day/year is different
    return (
        d1 != null &&
        d2 != null &&
        d1.getHours() === d2.getHours() &&
        d1.getMinutes() === d2.getMinutes() &&
        d1.getSeconds() === d2.getSeconds() &&
        d1.getMilliseconds() === d2.getMilliseconds()
    );
}

export function isDayInRange(date: Date | null, dateRange: DateRange, exclusive = false) {
    if (date == null || !isNonNullRange(dateRange)) {
        return false;
    }

    const day = clone(date);
    const start = clone(dateRange[0]);
    const end = clone(dateRange[1]);

    day.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return isWithinInterval(date, { start, end }) && (!exclusive || (!isSameDay(start, day) && !isSameDay(day, end)));
}
