/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

export type SupportedLocaleString = "de" | "en" | "es" | "fr" | "it" | "ko" | "ru" | "uk" | "zh_cn";
export type DateRange = [Date | undefined, Date | undefined];

export enum DateRangeBoundary {
    START = "start",
    END = "end",
}

/**
 * Enumeration of calendar months.
 *
 * Note that the enum values are numbers (with January as `0`) so they can be
 * easily compared to `date.getMonth()`.
 */
export const enum Months {
    JANUARY = 0,
    FEBRUARY = 1,
    MARCH = 2,
    APRIL = 3,
    MAY = 4,
    JUNE = 5,
    JULY = 6,
    AUGUST = 7,
    SEPTEMBER = 8,
    OCTOBER = 9,
    NOVEMBER = 10,
    DECEMBER = 11,
}
