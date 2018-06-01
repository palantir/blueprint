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

export function getTimezoneMetadata(timezone: string, date: Date, useManualCalc: boolean): ITimezoneMetadata {
    const zone = moment.tz.zone(timezone);
    const timestamp = date.getTime();
    const calculateMetadata = useManualCalc ? getMetadataFromMomentManual : getMetadataFromMoment;
    return calculateMetadata(timezone, zone, timestamp);
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

/**
 * Use moment-timezone to parse the timestamp and provide timezone metadata
 */
function getMetadataFromMoment(timezone: string, zone: moment.MomentZone, timestamp: number) {
    const zonedDate = moment.tz(timestamp, timezone);
    const offset = zonedDate.utcOffset();
    const offsetAsString = zonedDate.format("Z");
    const abbreviation = getNonOffsetAbbreviation(zonedDate.zoneAbbr());
    return {
        abbreviation,
        offset,
        offsetAsString,
        population: zone.population,
        timezone,
    };
}

/**
 * Manually determine timezone metadata by skipping the timestamp parsing and following
 * http://momentjs.com/timezone/docs/#/data-formats/unpacked-format/
 */
function getMetadataFromMomentManual(timezone: string, zone: moment.MomentZone, timestamp: number) {
    const { abbrs, offsets, population, untils } = zone;
    const index = findOffsetIndex(timestamp, untils);
    const abbreviation = getNonOffsetAbbreviation(abbrs[index]);
    const offset = offsets[index] * -1;
    const offsetAsString = getOffsetAsString(offset);
    return {
        abbreviation,
        offset,
        offsetAsString,
        population,
        timezone,
    };
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
    return sign + lpad(hours) + ":" + lpad(minutes);
}

function lpad(num: number) {
    return num < 10 ? "0" + num : num;
}
