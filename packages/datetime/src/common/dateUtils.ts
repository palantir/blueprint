/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as format from "date-fns/format";
import * as isSameDay from "date-fns/is_same_day";
import * as parse from "date-fns/parse";

// Import a subset of locales to reduce the bundle size of consuming apps
// Following locales have been selected according to their popularity
const LOCALE: { [index: string]: any } = {
    de: require("date-fns/locale/de"),
    en: require("date-fns/locale/en"),
    es: require("date-fns/locale/es"),
    fr: require("date-fns/locale/fr"),
    it: require("date-fns/locale/it"),
    ko: require("date-fns/locale/ko"),
    ru: require("date-fns/locale/ru"),
    uk: require("date-fns/locale/en"),
    zh_cn: require("date-fns/locale/zh_cn"),
};
import { DateFormat } from "../dateFormatter";
import { DateRange, SupportedLocaleString } from "./types";
import { padWithZeroes } from "./utils";

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

export function areSameTime(date1: Date, date2: Date) {
    return (
        date1 != null &&
        date2 != null &&
        date1.getHours() === date2.getHours() &&
        date1.getMinutes() === date2.getMinutes() &&
        date1.getSeconds() === date2.getSeconds() &&
        date1.getMilliseconds() === date2.getMilliseconds()
    );
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
    if (areSameTime(minTime, maxTime)) {
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

export function getDateTime(date: Date, time: Date) {
    if (date === null) {
        return null;
    } else if (time === null) {
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

export function getLocale(localeString: SupportedLocaleString): any {
    if (!localeString) {
        return undefined;
    } else if (LOCALE.hasOwnProperty(localeString)) {
        return LOCALE[localeString];
    } else {
        return LOCALE.en;
    }
}

export function dateToString(date: Date, dateFormat: DateFormat, locale: SupportedLocaleString = "en") {
    if (date == null) {
        return "";
    } else if (typeof dateFormat === "string") {
        return format(date, dateFormat, { locale: getLocale(locale) });
    } else {
        return dateFormat.dateToString(date);
    }
}

/**
 * A wrapper around date-fns parse() that adds feature to be able parse date strings of following formats :
 * - Year can be "YY" or "YYYY".
 * - Month can be "M" or "MM", must be "MM" when without hyphens.
 * - Date can be "D" or "DD", must be "DD" when without hyphens.
 * Examples: "YYYY-MM-DD", "YYYY-M-DD", "YY-MM-D", "YY-M-D", "YYYYMMDD", "YYMMDD"
 */
export function parseDate(date: string | number | Date) {
    if (typeof date !== "string") {
        return parse(date);
    }

    const parseTokenWithHyphens = /^(\d{4}|\d{2})-(\d{1,2})-(\d{1,2})$/;
    let token = parseTokenWithHyphens.exec(date.toString());
    if (token == null) {
        const parseTokenWithoutHyphens = /^(\d{4}|\d{2})(\d{2})(\d{2})$/;
        token = parseTokenWithoutHyphens.exec(date.toString());
    }

    if (token == null) {
        return parse(date);
    }

    const [year, month, day] = token.slice(1);
    const paddedMonth = padWithZeroes(month, 2);
    const paddedDay = padWithZeroes(day, 2);

    return parse(`${year}-${paddedMonth}-${paddedDay}`);
}
