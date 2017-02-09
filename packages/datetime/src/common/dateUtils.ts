/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

export type DateRange = [Date | undefined, Date | undefined];

export function areEqual(date1: Date, date2: Date) {
    if (date1 == null && date2 == null) {
        return true;
    } else if (date1 == null || date2 == null) {
        return false;
    } else {
        return date1.getTime() === date2.getTime();
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

export function getDatePreviousMonth(date: Date): Date {
    const newDate = clone(date);
    date.setMonth(date.getMonth() - 1);
    return newDate;
}

export function getDateNextMonth(date: Date): Date {
    const newDate = clone(date);
    date.setMonth(date.getMonth() + 1);
    return newDate;
}
