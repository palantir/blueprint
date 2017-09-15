/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { getTimezoneMetadata } from "./timezoneMetadata";

export interface ITimezoneQueryCandidates {
    [timezone: string]: string[];
}

/**
 * Create a map from timezone to a list of queryable strings.
 * @param timezones timezone identifiers
 * @param date date to use when determining timezone offsets
 */
export function getTimezoneQueryCandidates(timezones: string[], date: Date): ITimezoneQueryCandidates {
    const timezoneToQueryCandidates: ITimezoneQueryCandidates = {};

    for (const timezone of timezones) {
        const { abbreviation, offsetAsString } = getTimezoneMetadata(timezone, date);
        const candidates = [
            timezone,
            abbreviation,
            offsetAsString,

            // Split timezone string.
            // For example, "America/Los_Angeles" -> "America Los Angeles"
            timezone.split(/[/_]/).join(" "),

            // Don't require leading offset 0.
            // For example, "-07:00" -> "-7:00"
            offsetAsString.replace(/^([+-])0(\d:\d{2})$/, "$1$2"),
        ].filter((candidate) => candidate !== undefined);

        timezoneToQueryCandidates[timezone] = timezoneToQueryCandidates[timezone] || [];
        timezoneToQueryCandidates[timezone].push(...candidates);
    }

    return timezoneToQueryCandidates;
}

/**
 * Checks whether the candiate is a match for the given query.
 * @param query
 * @param candidate
 */
export function isQueryMatch(query: string, candidate: string) {
    return normalizeText(candidate).indexOf(normalizeText(query)) >= 0;
}

function normalizeText(text: string): string {
    return text.toLowerCase();
}
