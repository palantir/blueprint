/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
 * Each item is converted into a list of strings to query against, using the `getItemQueryCandidates` parameter.
 * Each item's highest score across all query candidates will be used when determining its overall ranking.
 * Uses fuzzaldrin-plus for sorting and filtering.
 * https://github.com/jeancroy/fuzz-aldrin-plus
 * @param items the array of items to query
 * @param query the string query to match each item against
 * @param getItemKey a function that converts a given item into a unique key
 * @param getItemQueryCandidates a function that converts an item into a list of query candidate strings
 */
export function filterWithQueryCandidates<T>(
    items: T[],
    query: string,
    getItemKey: (item: T) => string,
    getItemQueryCandidates: (item: T) => string[],
): T[] {
    const filterKey = "value";

    const queryCandidates = [];
    for (const item of items) {
        const key = getItemKey(item);
        queryCandidates.push(...getItemQueryCandidates(item).map(value => ({ key, [filterKey]: value })));
    }

    const results = filter(queryCandidates, query, { key: filterKey });

    const keyToItem: { [key: string]: T } = {};
    for (const item of items) {
        keyToItem[getItemKey(item)] = item;
    }

    const filteredItems: T[] = [];
    const seenItem: { [key: string]: boolean } = {};
    for (const { key } of results) {
        if (!seenItem[key]) {
            const item = keyToItem[key];
            filteredItems.push(item);
            seenItem[key] = true;
        }
    }

    return filteredItems;
}
