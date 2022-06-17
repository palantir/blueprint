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

import { isSameDay, isSameHour, isSameMinute, isSameSecond, isWithinInterval } from "date-fns";

import { DateRange, isNonNullRange } from "./dateRange";

export function clone(d: Date) {
    return new Date(d.getTime());
}

export function isSameTime(d1: Date, d2: Date) {
    return (
        d1 != null &&
        d2 != null &&
        isSameHour(d1, d2) &&
        isSameMinute(d1, d2) &&
        isSameSecond(d1, d2) &&
        d1.getMilliseconds() === d2.getMilliseconds()
    );
}

export function isDayInRange(date: Date, dateRange: DateRange, exclusive = false) {
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
