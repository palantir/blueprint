/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IconName } from "@blueprintjs/core";
import * as moment from "moment-timezone";
import { getTimezoneMetadata, ITimezoneMetadata } from "./timezoneMetadata";
import { getLocalTimezone } from "./timezoneUtils";

/** Timezone-specific QueryList item */
export interface ITimezoneItem {
    /** Key to be used as the rendered react key. */
    key: string;
    /** Text for the timezone. */
    text: string;
    /** Label for the timezone. */
    label: string;
    /** Optional icon for the timezone. */
    iconName?: IconName;
    /** The actual timezone. */
    timezone: string;
}

/**
 * Get a list of all timezone items.
 * @param date the date to use when determining timezone offsets
 */
export function getTimezoneItems(date: Date): ITimezoneItem[] {
    return moment.tz.names().map(timezone => toTimezoneItem(timezone, date));
}

/**
 * Get a list of timezone items where there is one timezone per offset
 * and optionally the local timezone as the first item.
 * The most populous timezone for each offset is chosen.
 * @param date the date to use when determining timezone offsets
 * @param includeLocalTimezone whether to include the local timezone
 */
export function getInitialTimezoneItems(date: Date, includeLocalTimezone: boolean): ITimezoneItem[] {
    const populous = getPopulousTimezoneItems(date);
    const local = getLocalTimezoneItem(date);
    return includeLocalTimezone && local !== undefined ? [local, ...populous] : populous;
}

/**
 * Get the timezone item for the user's local timezone.
 * @param date the date to use when determining timezone offsets
 */
export function getLocalTimezoneItem(date: Date): ITimezoneItem | undefined {
    const timezone = getLocalTimezone();
    if (timezone !== undefined) {
        const timestamp = date.getTime();
        const zonedDate = moment.tz(timestamp, timezone);
        const offsetAsString = zonedDate.format("Z");
        return {
            iconName: "locate",
            key: `${timezone}-local`,
            label: offsetAsString,
            text: "Current timezone",
            timezone,
        };
    } else {
        return undefined;
    }
}

/**
 * Get one timezone item per offset, using the most populous region when there is more
 * than one region for the offset.
 * @param date the date to use when determining timezone offsets
 */
function getPopulousTimezoneItems(date: Date): ITimezoneItem[] {
    // Filter out noisy timezones. See https://github.com/moment/moment-timezone/issues/227
    const timezones = moment.tz.names().filter(timezone => /\//.test(timezone) && !/Etc\//.test(timezone));

    const timezoneToMetadata: { [timezone: string]: ITimezoneMetadata } = {};
    for (const timezone of timezones) {
        timezoneToMetadata[timezone] = getTimezoneMetadata(timezone, date);
    }

    // Order by offset ascending, population descending, timezone name ascending
    timezones.sort((timezone1, timezone2) => {
        const { offset: offset1, population: population1 } = timezoneToMetadata[timezone1];
        const { offset: offset2, population: population2 } = timezoneToMetadata[timezone2];
        if (offset1 === offset2) {
            if (population1 === population2) {
                // Fall back to sorting alphabetically
                return timezone1 < timezone2 ? -1 : 1;
            }
            // Descending order of population
            return population2 - population1;
        }
        // Ascending order of offset
        return offset1 - offset2;
    });

    // Choose the most populous locations for each offset
    const initialTimezones: ITimezoneItem[] = [];
    let prevOffset: number;
    for (const timezone of timezones) {
        const curOffset = timezoneToMetadata[timezone].offset;
        if (prevOffset === undefined || prevOffset !== curOffset) {
            initialTimezones.push(toTimezoneItem(timezone, date));
            prevOffset = curOffset;
        }
    }
    return initialTimezones;
}

function toTimezoneItem(timezone: string, date: Date): ITimezoneItem {
    const { abbreviation, offsetAsString } = getTimezoneMetadata(timezone, date);
    return {
        key: timezone,
        label: offsetAsString,
        text: timezone + (abbreviation ? ` (${abbreviation})` : ""),
        timezone,
    };
}
