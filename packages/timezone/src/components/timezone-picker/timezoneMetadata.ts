/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { IANAZone, Zone } from "luxon";
import { BP_TIMEZONE_STATIC_METADATA } from "../../data/timezoneStaticMetadata";
// tslint:disable-next-line:no-var-requires
const memoize = require("lodash.memoize");

export interface ITimezoneMetadata {
    timezone: string;
    abbreviation: string | undefined;
    offset: number;
    offsetAsString: string;
    population: number | undefined;
}

export const TIMEZONE_STATIC_METADATA_FIELD_SEPARATOR = ";";
export const TIMEZONE_STATIC_METADATA_ENTRY_SEPARATOR = "|";

/**
 * Loads a statically compiled map of all timezone names and population data,
 * as this is not available from the Intl API.
 */
const BP_TIMEZONE_STATIC_METADATA_MAP = unpackTimezoneStaticMetadata(BP_TIMEZONE_STATIC_METADATA);

// Some possible timezone names might not be available in the current environment
const BP_TIMEZONE_NAMES = Object.keys(BP_TIMEZONE_STATIC_METADATA_MAP).filter(IANAZone.isValidZone);

export interface ITimezoneStaticMap {
    [timezone: string]: ITimezoneStaticMetadata | undefined;
}

export interface ITimezoneStaticMetadata {
    population: number | undefined;
}

export const getTimezoneMetadata = memoize(getTimezoneMetadataInternal);

function getTimezoneMetadataInternal(timezone: string, date: Date = new Date()): ITimezoneMetadata {
    const timestamp = date.getTime();
    const zone = IANAZone.create(timezone);
    const offset = zone.offset(timestamp);
    const offsetAsString = getOffsetAsString(zone, timestamp);
    const abbreviation = getAbbreviation(timestamp, zone);
    const staticMetadata = BP_TIMEZONE_STATIC_METADATA_MAP[timezone];
    const population = staticMetadata === undefined ? undefined : staticMetadata.population;

    return {
        abbreviation,
        offset,
        offsetAsString,
        population,
        timezone,
    };
}

export function getOffsetAsString(zone: Zone, timestamp: number) {
    return zone.formatOffset(timestamp, "short");
}

export function getAllTimezoneNames(): string[] {
    return BP_TIMEZONE_NAMES;
}

/**
 * First consider the abbreviation in the default locale.
 * If it's an offset abbreviation (GMT+3), use en-us and en-gb as a fall back.
 * Note that in Chrome the en-us and en-gb locales return different abbreviations.
 * See https://github.com/moment/luxon/issues/499#issuecomment-496880701
 */
function getAbbreviation(timestamp: number, zone: Zone) {
    const abbrDefaultLocale = zone.offsetName(timestamp, { format: "short" });
    if (!isOffsetAbbreviation(abbrDefaultLocale)) {
        return abbrDefaultLocale;
    }
    const abbrUsLocale = zone.offsetName(timestamp, { format: "short", locale: "en-us" });
    if (!isOffsetAbbreviation(abbrUsLocale)) {
        return abbrUsLocale;
    }
    const abbrGbLocale = zone.offsetName(timestamp, { format: "short", locale: "en-gb" });
    if (!isOffsetAbbreviation(abbrGbLocale)) {
        return abbrGbLocale;
    }
    return undefined;
}

function isOffsetAbbreviation(abbr: string) {
    return /^GMT\+/.test(abbr) || /^GMT\-/.test(abbr);
}

function unpackTimezoneStaticMetadata(mapString: string): ITimezoneStaticMap {
    return mapString
        .split(TIMEZONE_STATIC_METADATA_ENTRY_SEPARATOR)
        .reduce<ITimezoneStaticMap>((mapInProgress, packedMetadata) => {
            const metadataArray = packedMetadata.split(TIMEZONE_STATIC_METADATA_FIELD_SEPARATOR);
            const [timezone, populationString] = metadataArray;
            const populationInt = parseInt(populationString, 10);
            mapInProgress[timezone] = { population: isNaN(populationInt) ? undefined : populationInt };
            return mapInProgress;
        }, {});
}
