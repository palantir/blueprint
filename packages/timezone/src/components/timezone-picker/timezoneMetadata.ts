/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as moment from "moment-timezone";

// non-empty abbreviations that do not begin with -/+
const ABBR_REGEX = /^[^-+]/;

export interface ITimezoneMetadata {
    timezone: string;
    abbreviation: string | undefined;
    offset: number;
    offsetAsString: string;
    population: number | undefined;
}

export function getTimezoneMetadata(timezone: string, date: Date): ITimezoneMetadata {
    const timestamp = date.getTime();
    const zone = moment.tz.zone(timezone);
    const zonedDate = moment.tz(timestamp, timezone);
    const offset = zonedDate.utcOffset();
    const offsetAsString = zonedDate.format("Z");

    // Only include abbreviations that are not just a repeat of the offset:
    // moment-timezone's `abbr` falls back to the time offset if a zone doesn't have an abbr.
    const abbr = zone.abbr(timestamp);
    const abbreviation = ABBR_REGEX.test(abbr) ? abbr : undefined;

    return {
        abbreviation,
        offset,
        offsetAsString,
        population: zone.population,
        timezone,
    };
}
