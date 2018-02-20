/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { isDateValid, isDayInRange } from "./common/dateUtils";
import { IDatePickerBaseProps } from "./datePickerCore";

export interface IDateFormatProps {
    /**
     * The error message to display when the date selected is invalid.
     * @default "Invalid date"
     */
    invalidDateMessage?: string;

    /**
     * The locale name, which is passed to `formatDate`, `parseDate` and the functions in `localeUtils`.
     */
    locale?: string;

    /**
     * The error message to display when the date selected is out of range.
     * @default "Out of range"
     */
    outOfRangeMessage?: string;

    /**
     * Placeholder text to display in empty input fields.
     * Recommended practice is to indicate the expected date format.
     */
    placeholder?: string;

    /**
     * Function to render a JavaScript `Date` to a string.
     * The special value `null` indicates the absence of a date.
     * Optional `locale` argument comes directly from the prop on this component:
     * if the prop is defined, then the argument will be too.
     */
    formatDate(date: Date | null, locale?: string): string;

    /**
     * Function to deserialize user input text to a JavaScript `Date` object.
     * Return `false` if the string is an invalid date.
     * Return `null` to represent the absence of a date.
     * Optional `locale` argument comes directly from the prop on this component.
     */
    parseDate(str: string, locale?: string): Date | false | null;
}

export function getFormattedDateString(
    date: Date | false | null,
    props: IDateFormatProps & IDatePickerBaseProps,
    ignoreRange = false,
) {
    if (date == null) {
        return "";
    } else if (!isDateValid(date)) {
        return props.invalidDateMessage;
    } else if (ignoreRange || isDayInRange(date, [props.minDate, props.maxDate])) {
        return props.formatDate(date, props.locale);
    } else {
        return props.outOfRangeMessage;
    }
}
