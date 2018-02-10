/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ITimezoneItem } from "@blueprintjs/datetime";
import * as moment from "moment-timezone";
import { getTimezoneMetadata, ITimezoneMetadata } from "./timezoneMetadata";

/**
 * Get the user's local timezone.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/resolvedOptions
 */
export function getLocalTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get a list of all timezone items.
 * @param date the date to use when determining timezone offsets
 */
export function getTimezoneItems(date: Date): ITimezoneItem[] {
    return moment.tz.names().map(timezone => toTimezoneItem(timezone, date.getTime()));
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
function getLocalTimezoneItem(date: Date): ITimezoneItem {
    const timezone = getLocalTimezone();
    const timestamp = date.getTime();
    const zonedDate = moment.tz(timestamp, timezone);
    const offsetAsString = zonedDate.format("Z");
    return {
        displayName: "Current timezone",
        iconName: "locate",
        label: offsetAsString,
        timezone,
    };
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

    timezones.sort((timezone1, timezone2) => {
        const { offset: offset1, population: population1 } = timezoneToMetadata[timezone1];
        const { offset: offset2, population: population2 } = timezoneToMetadata[timezone2];
        // Order by offset ascending, population descending, timezone name ascending.
        return offset1 === offset2
            ? population1 === population2 ? (timezone1 < timezone2 ? -1 : 1) : population2 - population1
            : offset1 - offset2;
    });

    // Choose the most populous locations for each offset
    const initialTimezones: ITimezoneItem[] = [];
    let prevOffset: number;
    const timestamp = date.getTime();
    for (const timezone of timezones) {
        const curOffset = timezoneToMetadata[timezone].offset;
        if (prevOffset === undefined || prevOffset !== curOffset) {
            initialTimezones.push(toTimezoneItem(timezone, timestamp));
            prevOffset = curOffset;
        }
    }
    return initialTimezones;
}

function toTimezoneItem(timezone: string, timestamp: number): ITimezoneItem {
    const time = moment.tz(timestamp, timezone);
    const abbr = maybeAbbr(time.zoneAbbr());
    const offset = time.format("Z");

    return {
        label: `${abbr} ${offset}`,
        timezone,
    };
}

function maybeAbbr(abbr: string) {
    if (abbr.length > 0 && abbr[0] !== "-" && abbr[0] !== "+") {
        return abbr;
    }
    return "";
}
