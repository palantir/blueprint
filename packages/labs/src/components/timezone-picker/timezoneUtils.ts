/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { filter } from "fuzzaldrin-plus";
import * as moment from "moment-timezone";

import { getTimezoneMetadata } from "./timezoneMetadata";

/**
 * Get the user's local timezone.
 * Note that we are not guaranteed to get the correct timezone in all browsers,
 * so this is a best guess.
 * https://momentjs.com/timezone/docs/#/using-timezones/guessing-user-timezone/
 * https://github.com/moment/moment-timezone/blob/develop/moment-timezone.js#L328-L361
 */
export function getLocalTimezone(): string | undefined {
    return moment.tz.guess();
}

/**
 * Get a list of strings that represent the given timezone for querying purposes.
 * @param timezone the timezone to get the query candidates for
 * @param date the date to use when determining timezone offsets
 * @returns a list of queryable strings
 */
export function getTimezoneQueryCandidates(timezone: string, date: Date): string[] {
    const { abbreviation, offsetAsString } = getTimezoneMetadata(timezone, date);
    return [timezone, abbreviation, offsetAsString].filter(candidate => candidate !== undefined);
}

/**
 * Sort and filter the given items by matching them against the given query.
 * Each item is converted into a list of strings, using the `getItemQueryCandidates` parameter.
 * These query candidates are concatenated to form a composite string to query against.
 * Uses fuzzaldrin-plus for sorting and filtering. https://github.com/jeancroy/fuzz-aldrin-plus
 * @param items the array of items to query
 * @param query the string query to match each item against
 * @param getItemQueryCandidates a function that converts an item into a list of query candidate strings
 */
export function filterWithQueryCandidates<T>(
    items: T[],
    query: string,
    getItemQueryCandidates: (item: T) => string[],
): T[] {
    return filter(
        items.map((item, itemIndex) => ({
            key: itemIndex,
            value: getItemQueryCandidates(item).join("/"),
        })),
        query,
        { key: "value" },
    ).map(({ key }) => items[key]);
}
