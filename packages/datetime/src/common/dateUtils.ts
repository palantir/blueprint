/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { isSameDay } from "date-fns";

import { type DateRange, isNonNullRange } from "./dateRange";
import { Months } from "./months";

export { isSameDay };

export function clone(d: Date) {
    return new Date(d.getTime());
}

export function isDateValid(date: Date | false | null): date is Date {
    return date instanceof Date && !isNaN(date.valueOf());
}

export function isEqual(date1: Date, date2: Date) {
    if (date1 == null && date2 == null) {
        return true;
    } else if (date1 == null || date2 == null) {
        return false;
    } else {
        return date1.getTime() === date2.getTime();
    }
}

export function areRangesEqual(dateRange1: DateRange, dateRange2: DateRange) {
    if (dateRange1 == null && dateRange2 == null) {
        return true;
    } else if (dateRange1 == null || dateRange2 == null) {
        return false;
    } else {
        const [start1, end1] = dateRange1;
        const [start2, end2] = dateRange2;
        const areStartsEqual = (start1 == null && start2 == null) || isSameDay(start1, start2);
        const areEndsEqual = (end1 == null && end2 == null) || isSameDay(end1, end2);
        return areStartsEqual && areEndsEqual;
    }
}

export function isSameMonth(date1: Date, date2: Date) {
    return (
        date1 != null &&
        date2 != null &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
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

    return start <= day && day <= end && (!exclusive || (!isSameDay(start, day) && !isSameDay(day, end)));
}

export function isDayRangeInRange(innerRange: DateRange, outerRange: DateRange) {
    return (
        (innerRange[0] == null || isDayInRange(innerRange[0], outerRange)) &&
        (innerRange[1] == null || isDayInRange(innerRange[1], outerRange))
    );
}

export function isMonthInRange(date: Date, dateRange: DateRange) {
    if (date == null) {
        return false;
    }

    const day = clone(date);
    const start = clone(dateRange[0]);
    const end = clone(dateRange[1]);

    day.setDate(1);
    start.setDate(1);
    end.setDate(1);
    day.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return start <= day && day <= end;
}

export const isTimeEqualOrGreaterThan = (time: Date, timeToCompare: Date) => time.getTime() >= timeToCompare.getTime();
export const isTimeEqualOrSmallerThan = (time: Date, timeToCompare: Date) => time.getTime() <= timeToCompare.getTime();

export function isTimeInRange(date: Date, minDate: Date, maxDate: Date): boolean {
    const time = getDateOnlyWithTime(date);
    const minTime = getDateOnlyWithTime(minDate);
    const maxTime = getDateOnlyWithTime(maxDate);

    const isTimeGreaterThanMinTime = isTimeEqualOrGreaterThan(time, minTime);
    const isTimeSmallerThanMaxTime = isTimeEqualOrSmallerThan(time, maxTime);

    if (isTimeEqualOrSmallerThan(maxTime, minTime)) {
        return isTimeGreaterThanMinTime || isTimeSmallerThanMaxTime;
    }

    return isTimeGreaterThanMinTime && isTimeSmallerThanMaxTime;
}

export function getTimeInRange(time: Date, minTime: Date, maxTime: Date) {
    if (isSameTime(minTime, maxTime)) {
        return maxTime;
    } else if (isTimeInRange(time, minTime, maxTime)) {
        return time;
    } else if (isTimeSameOrAfter(time, maxTime)) {
        return maxTime;
    }

    return minTime;
}

/**
 * Returns true if the time part of `date` is later than or equal to the time
 * part of `dateToCompare`. The day, month, and year parts will not be compared.
 */
export function isTimeSameOrAfter(date: Date, dateToCompare: Date): boolean {
    const time = getDateOnlyWithTime(date);
    const timeToCompare = getDateOnlyWithTime(dateToCompare);

    return isTimeEqualOrGreaterThan(time, timeToCompare);
}

/**
 * @returns a Date at the exact time-wise midpoint between startDate and endDate
 */
export function getDateBetween(dateRange: DateRange) {
    const start = dateRange[0].getTime();
    const end = dateRange[1].getTime();
    const middle = start + (end - start) * 0.5;
    return new Date(middle);
}

export function getDateTime(date: Date | null, time?: Date | null) {
    if (date == null) {
        return null;
    } else if (time == null) {
        // cannot use default argument because `null` is a common value in this package.
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    } else {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes(),
            time.getSeconds(),
            time.getMilliseconds(),
        );
    }
}

export function getDateOnlyWithTime(date: Date): Date {
    return new Date(0, 0, 0, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

export function getDatePreviousMonth(date: Date): Date {
    if (date.getMonth() === Months.JANUARY) {
        return new Date(date.getFullYear() - 1, Months.DECEMBER);
    } else {
        return new Date(date.getFullYear(), date.getMonth() - 1);
    }
}

export function getDateNextMonth(date: Date): Date {
    if (date.getMonth() === Months.DECEMBER) {
        return new Date(date.getFullYear() + 1, Months.JANUARY);
    } else {
        return new Date(date.getFullYear(), date.getMonth() + 1);
    }
}

export function convert24HourMeridiem(hour: number, toPm: boolean): number {
    if (hour < 0 || hour > 23) {
        throw new Error(`hour must be between [0,23] inclusive: got ${hour}`);
    }
    return toPm ? (hour % 12) + 12 : hour % 12;
}

export function getIsPmFrom24Hour(hour: number): boolean {
    if (hour < 0 || hour > 23) {
        throw new Error(`hour must be between [0,23] inclusive: got ${hour}`);
    }
    return hour >= 12;
}

export function get12HourFrom24Hour(hour: number): number {
    if (hour < 0 || hour > 23) {
        throw new Error(`hour must be between [0,23] inclusive: got ${hour}`);
    }
    const newHour = hour % 12;
    return newHour === 0 ? 12 : newHour;
}

export function get24HourFrom12Hour(hour: number, isPm: boolean): number {
    if (hour < 1 || hour > 12) {
        throw new Error(`hour must be between [1,12] inclusive: got ${hour}`);
    }
    const newHour = hour === 12 ? 0 : hour;
    return isPm ? newHour + 12 : newHour;
}

export function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
}

export function hasMonthChanged(prevDate: Date | null, nextDate: Date | null) {
    return (prevDate == null) !== (nextDate == null) || nextDate?.getMonth() !== prevDate?.getMonth();
}

export function hasTimeChanged(prevDate: Date | null, nextDate: Date | null) {
    return (
        (prevDate == null) !== (nextDate == null) ||
        nextDate?.getHours() !== prevDate?.getHours() ||
        nextDate?.getMinutes() !== prevDate?.getMinutes() ||
        nextDate?.getSeconds() !== prevDate?.getSeconds() ||
        nextDate?.getMilliseconds() !== prevDate?.getMilliseconds()
    );
}
