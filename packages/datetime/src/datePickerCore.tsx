/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

export interface IDatePickerLocaleUtils {
    formatDay: (day: Date, locale: string) => string;
    formatMonthTitle: (month: Date, locale: string) => string;
    formatWeekdayShort: (weekday: number, locale: string) => string;
    formatWeekdayLong: (weekday: number, locale: string) => string;
    getFirstDayOfWeek: (locale: string) => number;
    getMonths: (locale: string) => string[];
}

export interface IDatePickerDayModifiers {
    selected?: boolean;
    disabled?: boolean;
    [name: string]: boolean | undefined;
}

export interface IDatePickerModifiers {
    [name: string]: (date: Date) => boolean;
}

export interface IDatePickerBaseProps {
   /**
    * The initial month the calendar displays.
    */
    initialMonth?: Date;

   /**
    * The locale that gets passed to the functions in `localeUtils`.
    */
    locale?: string;

   /**
    * Collection of functions that provide internationalization support.
    */
    localeUtils?: IDatePickerLocaleUtils;

   /**
    * The latest date the user can select.
    * @default Dec. 31st of this year.
    */
    maxDate?: Date;

   /**
    * The earliest date the user can select.
    * @default Jan. 1st, 20 years in the past.
    */
    minDate?: Date;

   /**
    * Collection of functions that determine which modifier classes get applied to which days.
    * Each function should accept a `Date` and return a boolean.
    * See the [**react-day-picker** documentation](http://react-day-picker.js.org/Modifiers.html) to learn more.
    */
    modifiers?: IDatePickerModifiers;
}

export const DISABLED_MODIFIER = "disabled";
export const OUTSIDE_MODIFIER = "outside";
export const SELECTED_MODIFIER = "selected";
export const SELECTED_RANGE_MODIFIER = "selected-range";
// modifiers the user can't set because they are used by Blueprint or react-day-picker
export const DISALLOWED_MODIFIERS = [DISABLED_MODIFIER, OUTSIDE_MODIFIER, SELECTED_MODIFIER, SELECTED_RANGE_MODIFIER];

export function getDefaultMaxDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear());
    date.setMonth(11, 31);
    return date;
}

export function getDefaultMinDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 20);
    date.setMonth(0, 1);
    return date;
}

export function combineModifiers(baseModifiers: IDatePickerModifiers, userModifiers: IDatePickerModifiers) {
    let modifiers = baseModifiers;
    if (userModifiers != null) {
        modifiers = {};
        for (const key of Object.keys(userModifiers)) {
            if (DISALLOWED_MODIFIERS.indexOf(key) === -1) {
                modifiers[key] = userModifiers[key];
            }
        }
        for (const key of Object.keys(baseModifiers)) {
            modifiers[key] = baseModifiers[key];
        }
    }
    return modifiers;
}
