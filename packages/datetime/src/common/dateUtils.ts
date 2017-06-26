/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as moment from "moment";
import { Months } from "./months";

export type DateRange = [Date | undefined, Date | undefined];
export type MomentDateRange = [moment.Moment, moment.Moment];

export enum DateRangeBoundary {
    START,
    END,
};

export function areEqual(date1: Date, date2: Date) {
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
        const areStartsEqual = (start1 == null && start2 == null) || areSameDay(start1, start2);
        const areEndsEqual = (end1 == null && end2 == null) || areSameDay(end1, end2);
        return areStartsEqual && areEndsEqual;
    }
}

export function areSameDay(date1: Date, date2: Date) {
    return date1 != null
        && date2 != null
        && date1.getDate() === date2.getDate()
        && date1.getMonth() === date2.getMonth()
        && date1.getFullYear() === date2.getFullYear();
}

export function areSameMonth(date1: Date, date2: Date) {
    return date1 != null
        && date2 != null
        && date1.getMonth() === date2.getMonth()
        && date1.getFullYear() === date2.getFullYear();
}

export function areSameTime(date1: Date, date2: Date) {
    return date1 != null
        && date2 != null
        && date1.getHours() === date2.getHours()
        && date1.getMinutes() === date2.getMinutes()
        && date1.getSeconds() === date2.getSeconds()
        && date1.getMilliseconds() === date2.getMilliseconds();
}

export function clone(d: Date) {
    return new Date(d.getTime());
}

export function isDayInRange(date: Date, dateRange: DateRange, exclusive = false) {
    if (date == null) {
        return false;
    }

    const day = clone(date);
    const start = clone(dateRange[0]);
    const end = clone(dateRange[1]);

    day.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return start <= day && day <= end
        && (!exclusive
            || !areSameDay(start, day) && !areSameDay(day, end));
}

export function isDayRangeInRange(innerRange: DateRange, outerRange: DateRange) {
    return (innerRange[0] == null || isDayInRange(innerRange[0], outerRange))
        && (innerRange[1] == null || isDayInRange(innerRange[1], outerRange));
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

export function isTimeInRange(date: Date, minDate: Date, maxDate: Date): boolean {
    const time = getDateOnlyWithTime(date).getTime();
    const minTime = getDateOnlyWithTime(minDate).getTime();
    const maxTime = getDateOnlyWithTime(maxDate).getTime();

    const isTimeGreaterThanMinTime = time >= minTime;
    const isTimeSmallerThanMaxTime = time <= maxTime;

    if (maxTime <= minTime) {
        return isTimeGreaterThanMinTime || isTimeSmallerThanMaxTime;
    }

    return isTimeGreaterThanMinTime && isTimeSmallerThanMaxTime;
}

export function isTimeGreaterThan(date1: Date, date2: Date): boolean {
    const time1 = getDateOnlyWithTime(date1).getTime();
    const time2 = getDateOnlyWithTime(date2).getTime();

    return time1 >= time2;
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

export function getDateTime(date: Date, time: Date) {
    if (date === null) {
        return null;
    } else if (time === null) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    } else {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
            time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
    }
}

export function getDateOnlyWithTime(date: Date): Date {
  return new Date(0, 0, 0, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

export function isMomentNull(momentDate: moment.Moment) {
    return momentDate.parsingFlags().nullInput;
}

export function isMomentValidAndInRange(momentDate: moment.Moment, minDate: Date, maxDate: Date) {
    return momentDate.isValid() && isMomentInRange(momentDate, minDate, maxDate);
}

export function isMomentInRange(momentDate: moment.Moment, minDate: Date, maxDate: Date) {
    return momentDate.isBetween(minDate, maxDate, "day", "[]");
}

/**
 * Translate a Date object into a moment, adjusting the local timezone into the moment one.
 * This is a no-op unless moment-timezone's setDefault has been called.
 */
export function fromDateToMoment(date: Date) {
    if (date == null || typeof date === "string") {
        return moment(date);
    } else {
        return moment([
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds(),
        ]);
    }
}

/**
 * Translate a moment into a Date object, adjusting the moment timezone into the local one.
 * This is a no-op unless moment-timezone's setDefault has been called.
 */
export function fromMomentToDate(momentDate: moment.Moment) {
    if (momentDate == null) {
        return undefined;
    } else {
        return new Date(
            momentDate.year(),
            momentDate.month(),
            momentDate.date(),
            momentDate.hours(),
            momentDate.minutes(),
            momentDate.seconds(),
            momentDate.milliseconds(),
        );
    }
}

/**
 * Translate a DateRange into a MomentDateRange, adjusting the local timezone
 * into the moment one (a no-op unless moment-timezone's setDefault has been
 * called).
 */
export function fromDateRangeToMomentDateRange(dateRange: DateRange) {
    if (dateRange == null) {
        return undefined;
    }
    return [
        fromDateToMoment(dateRange[0]),
        fromDateToMoment(dateRange[1]),
    ] as MomentDateRange;
}

/**
 * Translate a MomentDateRange into a DateRange, adjusting the moment timezone
 * into the local one. This is a no-op unless moment-timezone's setDefault has
 * been called.
 */
export function fromMomentDateRangeToDateRange(momentDateRange: MomentDateRange) {
    if (momentDateRange == null) {
        return undefined;
    }
    return [
        fromMomentToDate(momentDateRange[0]),
        fromMomentToDate(momentDateRange[1]),
    ] as DateRange;
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
