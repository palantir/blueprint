/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { getTimezoneMetadata } from "./timezoneMetadata";

export interface ITimezoneQueryEngine {
    filterAndRankItems<T extends { timezone: string }>(query: string, items: T[]): T[];
}

export function createTimezoneQueryEngine(date: Date): ITimezoneQueryEngine {
    return new TimezoneQueryEngine(date);
}

interface ITimezoneQueryCandidate {
    value: string;
    score: number;
}

class TimezoneQueryEngine implements ITimezoneQueryEngine {
    /** Date to use when determining timezone offsets. */
    private date: Date;
    /** Map from timezone to a list of queryable strings. */
    private timezoneToQueryCandidates: { [timezone: string]: ITimezoneQueryCandidate[] };

    constructor(date: Date) {
        this.date = date;
        this.timezoneToQueryCandidates = {};
    }

    public filterAndRankItems<T extends { timezone: string }>(query: string, items: T[]): T[] {
        return items
            .map((item) => ({ item, score: this.getMatchScore(item.timezone, query) }))
            .filter(({ score }) => score !== -1)
            .sort((result1, result2) => result2.score - result1.score)
            .map(({ item }) => item);
    }

    private getMatchScore(timezone: string, query: string): number {
        if (this.timezoneToQueryCandidates[timezone] === undefined) {
            this.timezoneToQueryCandidates[timezone] = this.getQueryCandidates(timezone);
        }

        let maxMatchScore = -1;
        const candidates = this.timezoneToQueryCandidates[timezone];
        for (const candidate of candidates) {
            if (this.isExactQueryMatch(candidate, query)) {
                maxMatchScore = Math.max(candidate.score * 2, maxMatchScore);
            } else if (this.isQueryMatch(candidate, query)) {
                maxMatchScore = Math.max(candidate.score, maxMatchScore);
            }
        }
        return maxMatchScore;
    }

    private getQueryCandidates(timezone: string): ITimezoneQueryCandidate[] {
        const { abbreviation, offsetAsString } = getTimezoneMetadata(timezone, this.date);
        const candidates: Array<ITimezoneQueryCandidate | undefined> = [
            { value: timezone, score: 1 },
            abbreviation !== undefined ? { value: abbreviation, score: 1 } : undefined,
            { value: offsetAsString, score: 1 },

            // Split timezone string.
            // For example, "America/Los_Angeles" -> "America Los Angeles"
            { value: timezone.split(/[/_]/).join(" "), score: 1 },

            // Don't require leading offset 0.
            // For example, "-07:00" -> "-7:00"
            { value: offsetAsString.replace(/^([+-])0(\d:\d{2})$/, "$1$2"), score: 1 },
        ];
        return candidates
            .filter((candidate) => candidate !== undefined)
            .map((candidate) => ({ ...candidate, value: this.normalizeText(candidate.value) }));
    }

    private isQueryMatch(candidate: ITimezoneQueryCandidate, query: string): boolean {
        const normalizedQuery = this.normalizeText(query);
        return candidate.value.indexOf(normalizedQuery) >= 0;
    }

    private isExactQueryMatch(candidate: ITimezoneQueryCandidate, query: string): boolean {
        const normalizedQuery = this.normalizeText(query);
        return candidate.value === normalizedQuery;
    }

    private normalizeText(text: string): string {
        return text.toLowerCase().trim();
    }
}
