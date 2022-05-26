/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

import { formatInTimeZone } from "date-fns-tz";

import { getTimeZone } from "../../common/getTimeZone";
import { ITimeZone, MINIMAL_TIMEZONE_ITEMS, TIMEZONE_ITEMS } from "./timezoneItems";

export interface ITimeZoneWithNames extends ITimeZone {
    longName: string;
    shortName: string;
}

const CURRENT_DATE = Date.now();

const getTimeZoneName = (date: Date | undefined, ianaCode: string, getLongName: boolean = true) =>
    formatInTimeZone(date ?? CURRENT_DATE, ianaCode, getLongName ? "zzzz" : "zzz");

export const mapTimezonesWithNames = (
    date: Date | undefined,
    timezones: ITimeZone[] | ITimeZoneWithNames[],
): ITimeZoneWithNames[] =>
    timezones.map(tz => ({
        ...tz,
        longName: getTimeZoneName(date, tz.ianaCode),
        shortName: getTimeZoneName(date, tz.ianaCode, false),
    }));

export function getInitialTimezoneItems(date: Date | undefined, showLocalTimezone: boolean) {
    const systemTimeZone = getTimeZone();
    const localTimeZone = showLocalTimezone
        ? TIMEZONE_ITEMS.find(timezone => timezone.ianaCode === systemTimeZone)
        : undefined;
    const localTimeZoneItem =
        localTimeZone !== undefined
            ? {
                  ...localTimeZone,
                  longName: "Current timezone",
                  shortName: getTimeZoneName(date, localTimeZone.ianaCode, false),
              }
            : undefined;
    const minimalTimeZoneItemsWithNames = mapTimezonesWithNames(date, MINIMAL_TIMEZONE_ITEMS);
    return localTimeZoneItem === undefined
        ? minimalTimeZoneItemsWithNames
        : [localTimeZoneItem, ...minimalTimeZoneItemsWithNames];
}
