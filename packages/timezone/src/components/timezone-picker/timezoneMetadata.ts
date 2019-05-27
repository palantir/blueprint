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

import { IANAZone } from "luxon";
import { BP_TIMEZONE_STATIC_METADATA } from "../../data/timezoneStaticMetadata";

// non-empty abbreviations that do not begin with -/+
const ABBR_REGEX = /^[^-+]/;

export interface ITimezoneMetadata {
    timezone: string;
    abbreviation: string | undefined;
    offset: number;
    offsetAsString: string;
    population: number | undefined;
}

export interface ITimezoneStaticMap {
    [timezone: string]: ITimezoneStaticMetadata | undefined;
}

export interface ITimezoneStaticMetadata {
    population: number | undefined;
}

export function getTimezoneMetadata(timezone: string, date: Date = new Date()): ITimezoneMetadata {
    // Using just time zones
    const timestamp = date.getTime();
    const zone = IANAZone.create(timezone);
    const offset = zone.offset(timestamp);
    const offsetAsString = zone.formatOffset(timestamp, "narrow");
    const abbr = zone.offsetName(timestamp, { format: "short" });
    const staticMetadata = getTimezoneStaticMetadata()[timezone];
    const population = staticMetadata === undefined ? undefined : staticMetadata.population;

    // Only include abbreviations that are not just a repeat of the offset:
    const abbreviation = ABBR_REGEX.test(abbr) ? abbr : undefined;

    return {
        abbreviation,
        offset,
        offsetAsString,
        population,
        timezone,
    };
}

export function getAllTimeZoneNames(): string[] {
    return Object.keys(getTimezoneStaticMetadata()).filter(IANAZone.isValidZone);
}

function getTimezoneStaticMetadata(): ITimezoneStaticMap {
    return BP_TIMEZONE_STATIC_METADATA;
}
