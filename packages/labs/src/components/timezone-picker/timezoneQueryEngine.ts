/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { ITimezoneItem } from "./timezoneItems";
import { getTimezoneMetadata } from "./timezoneMetadata";

export interface IItemQueryEngine<T> {
    /**
     * Takes a query and a set of items and returns a filtered set of items that match the query,
     * in order of match rank.
     */
    filterAndRankItems(query: string, items: T[]): T[];
}

/**
 * Creates a timezone-specific item query engine.
 * Uses the timezone and timezone metadata to construct a set of strings that represent a timezone
 * for querying purposes.
 * @param date the date to use when determining timezone offsets
 */
export function createTimezoneQueryEngine(date: Date): IItemQueryEngine<ITimezoneItem> {
    return new ItemQueryEngine({
        itemToKey: (item) => item.timezone,
        itemToQueryCandidates: ({ timezone }) => {
            const { abbreviation, offsetAsString } = getTimezoneMetadata(timezone, date);
            return [
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
        },
    });
}

interface IItemQueryMatcher {
    /** Checks whether the candidate matches the query. */
    isMatch: (candidate: string, query: string) => boolean;
    /** The score for this match type. */
    score: number;
}

/**
 * Simple query ranking engine that prioritizes query matches.
 * Order of priority:
 *   - Exact matches
 *   - Prefix matches
 *   - Substring matches
 */
class ItemQueryEngine<T> implements IItemQueryEngine<T> {
    /** Converts an item into a unique key. */
    private itemToKey: (item: T) => string;
    /** Converts an item into a list of queryable strings. */
    private itemToQueryCandidates: (item: T) => string[];
    /** Map from item key to a list of queryable strings. */
    private memoizedQueryCandidates: { [key: string]: string[] };

    private queryMatchers: IItemQueryMatcher[] = [
        /** Exact match */
        {
            isMatch: (candidate, query) => {
                const normalizedValue = normalizeText(candidate);
                const normalizedQuery = normalizeText(query);
                return normalizedValue === normalizedQuery;
            },
            score: 3,
        },
        /** Prefix match */
        {
            isMatch: (candidate, query) => {
                const normalizedValue = normalizeText(candidate);
                const normalizedQuery = normalizeText(query);
                return normalizedValue.indexOf(normalizedQuery) === 0;
            },
            score: 2,
        },
        /** Substring match */
        {
            isMatch: (candidate, query) => {
                const normalizedValue = normalizeText(candidate);
                const normalizedQuery = normalizeText(query);
                return normalizedValue.indexOf(normalizedQuery) >= 0;
            },
            score: 1,
        },
    ];

    constructor(params: {
        itemToKey: (item: T) => string;
        itemToQueryCandidates: (item: T) => string[];
    }) {
        this.itemToKey = params.itemToKey;
        this.itemToQueryCandidates = params.itemToQueryCandidates;
        this.memoizedQueryCandidates = {};
    }

    public filterAndRankItems(query: string, items: T[]): T[] {
        return items
            .map((item) => ({ item, score: this.getMatchScore(item, query) }))
            .filter(({ score }) => score !== -1)
            .sort((result1, result2) => result2.score - result1.score)
            .map(({ item }) => item);
    }

    private getMatchScore(item: T, query: string): number {
        let maxMatchScore = -1;
        const candidates = this.getQueryCandidates(item);
        for (const candidate of candidates) {
            for (const queryMatcher of this.queryMatchers) {
                if (queryMatcher.isMatch(candidate, query)) {
                    maxMatchScore = Math.max(queryMatcher.score, maxMatchScore);
                }
            }
        }
        return maxMatchScore;
    }

    private getQueryCandidates(item: T): string[] {
        const key = this.itemToKey(item);
        if (this.memoizedQueryCandidates[key] === undefined) {
            this.memoizedQueryCandidates[key] = this.itemToQueryCandidates(item);
        }
        return this.memoizedQueryCandidates[key];
    }
}

function normalizeText(text: string): string {
    return text.toLowerCase().trim();
}
