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

import { getCurrentTimezone } from "./getTimezone";
import { MINIMAL_TIMEZONE_ITEMS, Timezone, TIMEZONE_ITEMS } from "./timezoneItems";

export interface TimezoneWithNames extends Timezone {
    longName: string;
    shortName: string;
}

const CURRENT_DATE = Date.now();

export const getTimezoneName = (date: Date | undefined, ianaCode: string, getLongName: boolean = true) =>
    formatInTimeZone(date ?? CURRENT_DATE, ianaCode, getLongName ? "zzzz" : "zzz");

export const mapTimezonesWithNames = (
    date: Date | undefined,
    timezones: Timezone[] | TimezoneWithNames[],
): TimezoneWithNames[] =>
    timezones.map(tz => ({
        ...tz,
        longName: getTimezoneName(date, tz.ianaCode),
        shortName: getTimezoneName(date, tz.ianaCode, false),
    }));

export function getInitialTimezoneItems(date: Date | undefined, showLocalTimezone: boolean) {
    const systemTimezone = getCurrentTimezone();
    const localTimezone = showLocalTimezone
        ? TIMEZONE_ITEMS.find(timezone => timezone.ianaCode === systemTimezone)
        : undefined;
    const localTimezoneItem =
        localTimezone !== undefined
            ? {
                  ...localTimezone,
                  longName: "Current timezone",
                  shortName: getTimezoneName(date, localTimezone.ianaCode, false),
              }
            : undefined;
    const minimalTimezoneItemsWithNames = mapTimezonesWithNames(date, MINIMAL_TIMEZONE_ITEMS).filter(
        tz => tz.ianaCode !== localTimezoneItem?.ianaCode,
    );
    return localTimezoneItem === undefined
        ? minimalTimezoneItemsWithNames
        : [localTimezoneItem, ...minimalTimezoneItemsWithNames];
}
