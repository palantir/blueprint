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

function getValidAbbreviation(abbreviation: string) {
    return isValidAbbreviation(abbreviation) ? abbreviation : undefined;
}

function isValidAbbreviation(abbreviation: string) {
    return abbreviation != null && abbreviation.length > 0 && abbreviation[0] !== "-" && abbreviation[0] !== "+";
}

function getMetadataFromMoment(timezone: string, zone: moment.MomentZone, timestamp: number) {
    const zonedDate = moment.tz(timestamp, timezone);
    const offset = zonedDate.utcOffset();
    const offsetAsString = zonedDate.format("Z");
    const abbreviation = getValidAbbreviation(zonedDate.zoneAbbr());
    return {
        abbreviation,
        offset,
        offsetAsString,
        population: zone.population,
        timezone,
    };
}

function getMetadataFromMomentManual(timezone: string, zone: moment.MomentZone, timestamp: number) {
    const { abbrs, offsets, population, untils } = zone;
    const index = findOffsetIndex(timestamp, untils);
    const abbreviation = getValidAbbreviation(abbrs[index]);
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
