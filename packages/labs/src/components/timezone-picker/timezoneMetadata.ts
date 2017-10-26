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
    const timestamp = date.getTime();
    const zone = moment.tz.zone(timezone);
    const zonedDate = moment.tz(timestamp, timezone);
    const offset = zonedDate.utcOffset();
    const offsetAsString = zonedDate.format("Z");
    const abbreviation = getAbbreviation(timezone, timestamp);

    return {
        abbreviation,
        offset,
        offsetAsString,
        population: zone.population,
        timezone,
    };
}

/**
 * Get the abbreviation for a timezone.
 * We need this utility because moment-timezone's `abbr` will not always give the abbreviated time zone name,
 * since it falls back to the time offsets for each region.
 * https://momentjs.com/timezone/docs/#/using-timezones/formatting/
 */
function getAbbreviation(timezone: string, timestamp: number): string | undefined {
    const zone = moment.tz.zone(timezone);
    if (zone) {
        const abbreviation = zone.abbr(timestamp);

        // Only include abbreviations that are not just a repeat of the offset
        if (abbreviation.length > 0 && abbreviation[0] !== "-" && abbreviation[0] !== "+") {
            return abbreviation;
        }
    }

    return undefined;
}
