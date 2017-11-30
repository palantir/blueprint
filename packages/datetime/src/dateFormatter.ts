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
     * Optional placeholder to show in inputs whose content will be passed to this formatter.
     */
    placeholder?: string;

    /**
     * Function to serialize a date to a string.
     */
    dateToString(date: Date): string;

    /**
     * Function to deserialize a date from a string. Return undefined if the string is invalid.
     */
    stringToDate(str: string): Date | undefined;
}

export type DateFormat = string | IDateFormatter;
