/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/**
 * Allows arbitrary formatting of dates in the @blueprintjs/datetime inputs.
 */
export interface IDateFormatter {
    /**
     * Placeholder text to display in empty input fields.
     * Recommended practice is to indicate the date format that `stringToDate`
     * expects.
     */
    placeholder?: string;

    /**
     * Function to serialize a date to a string.
     */
    dateToString(date: Date): string;

    /**
     * Function to deserialize a string to a date.
     * Can return `undefined` to signal that the string is invalid.
     */
    stringToDate(str: string): Date | undefined;
}

export type DateFormat = string | IDateFormatter;
