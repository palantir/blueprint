/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;
const WEEK_IN_MILLIS = 7 * DAY_IN_MILLIS;

export function getTodayAtMidnight() {
    return new Date(new Date().setHours(0, 0, 0, 0));
}

export function shiftDateByDays(date: Date, days: number): Date {
    return new Date(date.valueOf() + days * DAY_IN_MILLIS);
}

export function shiftDateByWeeks(date: Date, weeks: number): Date {
    return new Date(date.valueOf() + weeks * WEEK_IN_MILLIS);
}

export function shiftDateByArrowKey(date: Date, key: string): Date {
    switch (key) {
        case "ArrowUp":
            return shiftDateByWeeks(date, -1);
        case "ArrowDown":
            return shiftDateByWeeks(date, 1);
        case "ArrowLeft":
            return shiftDateByDays(date, -1);
        case "ArrowRight":
            return shiftDateByDays(date, 1);
        default:
            return date;
    }
}

export function clampDate(date: Date, minDate: Date | null | undefined, maxDate: Date | null | undefined) {
    let result = date;
    if (minDate != null && date < minDate) {
        result = minDate;
    }
    if (maxDate != null && date > maxDate) {
        result = maxDate;
    }
    return result;
}

export function isEntireInputSelected(element: HTMLInputElement | null) {
    if (element == null) {
        return false;
    }

    return element.selectionStart === 0 && element.selectionEnd === element.value.length;
}
