/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as moment from "moment-timezone";

export interface ITimezoneMetadata {
    timezone: string;
    abbreviation: string | undefined;
    offset: number;
    offsetAsString: string;
    population: number | undefined;
}

export function getTimezoneMetadata(timezone: string, date: Date): ITimezoneMetadata {
    const { abbrs, offsets, population, untils } = moment.tz.zone(timezone);
    const index = findOffsetIndex(date.getTime(), untils);
    const offset = offsets[index] * -1;
    return {
        abbreviation: getNonOffsetAbbreviation(abbrs[index]),
        offset,
        offsetAsString: getOffsetAsString(offset),
        population,
        timezone,
    };
}

/**
 * Ignore abbreviations that are simply offsets, i.e. "+14" instead of "PST"
 * @param abbreviation
 */
function getNonOffsetAbbreviation(abbreviation: string) {
    return isNonOffsetAbbreviation(abbreviation) ? abbreviation : undefined;
}

function isNonOffsetAbbreviation(abbreviation: string) {
    return abbreviation != null && abbreviation.length > 0 && abbreviation[0] !== "-" && abbreviation[0] !== "+";
}

function findOffsetIndex(timestamp: number, untils: number[]) {
    for (let i = 0; i < untils.length; i++) {
        if (i === untils.length - 1 || timestamp < untils[i]) {
            return i;
        }
    }
    return 0;
}

function getOffsetAsString(offset: number) {
    const offsetVal = Math.abs(offset);
    const minutes = offsetVal % 60;
    const hours = (offsetVal - minutes) / 60;
    const sign = offset >= 0 ? "+" : "-";
    return `${sign}${lpad(hours)}:${lpad(minutes)}`;
}

function lpad(num: number) {
    return num < 10 ? "0" + num : num;
}
