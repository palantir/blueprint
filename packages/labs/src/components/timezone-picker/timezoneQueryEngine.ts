/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { getTimezoneMetadata } from "./timezoneMetadata";

export interface ITimezoneQueryEngine {
    isMatch(timezone: string, query: string): boolean;
}

export function createTimezoneQueryEngine(date: Date): ITimezoneQueryEngine {
    return new TimezoneQueryEngine(date);
}

class TimezoneQueryEngine implements ITimezoneQueryEngine {
    /** Date to use when determining timezone offsets. */
    private date: Date;
    /** Map from timezone to a list of queryable strings. */
    private timezoneToQueryCandidates: { [timezone: string]: string[] };

    constructor(date: Date) {
        this.date = date;
        this.timezoneToQueryCandidates = {};
    }

    public isMatch(timezone: string, query: string): boolean {
        if (this.timezoneToQueryCandidates[timezone] === undefined) {
            this.timezoneToQueryCandidates[timezone] = this.getQueryCandidates(timezone);
        }

        const candidates = this.timezoneToQueryCandidates[timezone];
        const normalizedQuery = this.normalizeText(query);
        return candidates.some((candidate) => {
            return candidate.indexOf(normalizedQuery) >= 0;
        });
    }

    private getQueryCandidates(timezone: string): string[] {
        const { abbreviation, offsetAsString } = getTimezoneMetadata(timezone, this.date);
        const rawCandidates = [
            timezone,
            abbreviation,
            offsetAsString,

            // Split timezone string.
            // For example, "America/Los_Angeles" -> "America Los Angeles"
            timezone.split(/[/_]/).join(" "),

            // Don't require leading offset 0.
            // For example, "-07:00" -> "-7:00"
            offsetAsString.replace(/^([+-])0(\d:\d{2})$/, "$1$2"),
        ];
        return rawCandidates
            .filter((candidate) => candidate !== undefined)
            .map((candidate) => this.normalizeText(candidate));
    }

    private normalizeText(text: string): string {
        return text.toLowerCase();
    }
}
