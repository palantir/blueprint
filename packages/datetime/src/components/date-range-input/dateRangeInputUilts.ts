/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

export function getTodayAtMidnight() {
    return new Date(new Date().setHours(0, 0, 0, 0));
}

export function shiftDateByDays(date: Date, days: number): Date {
    const shiftedDate = new Date(date.valueOf());
    shiftedDate.setDate(shiftedDate.getDate() + days);
    return shiftedDate;
}

export function shiftDateByWeeks(date: Date, weeks: number): Date {
    return shiftDateByDays(date, weeks * 7);
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
