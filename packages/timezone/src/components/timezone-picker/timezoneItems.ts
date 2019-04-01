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

import { IconName } from "@blueprintjs/core";
import * as moment from "moment-timezone";
import { getTimezoneMetadata, ITimezoneMetadata } from "./timezoneMetadata";

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
    return moment.tz
        .names()
        .map(timezone => getTimezoneMetadata(timezone, date))
        .sort((a, b) => a.offset - b.offset)
        .map(toTimezoneItem);
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
    const timezone = moment.tz.guess();
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

    const timezoneToMetadata = timezones.reduce<{ [timezone: string]: ITimezoneMetadata }>((store, zone) => {
        store[zone] = getTimezoneMetadata(zone, date);
        return store;
    }, {});

    // reduce timezones array to maximum population per offset, for each unique offset.
    const maxPopPerOffset = timezones.reduce<{ [offset: string]: string }>((maxPop, zone) => {
        const data = timezoneToMetadata[zone];
        const currentMax = maxPop[data.offsetAsString];
        if (currentMax == null || data.population > timezoneToMetadata[currentMax].population) {
            maxPop[data.offsetAsString] = zone;
        }
        return maxPop;
    }, {});
    return (
        Object.keys(maxPopPerOffset)
            // get metadata object
            .map(k => timezoneToMetadata[maxPopPerOffset[k]])
            // sort by offset
            .sort((tz1, tz2) => tz1.offset - tz2.offset)
            // convert to renderable item
            .map(toTimezoneItem)
    );
}

function toTimezoneItem({ abbreviation, offsetAsString, timezone }: ITimezoneMetadata): ITimezoneItem {
    return {
        key: timezone,
        label: offsetAsString,
        text: timezone + (abbreviation ? ` (${abbreviation})` : ""),
        timezone,
    };
}
